#!/usr/bin/env node
/**
 * check-drift.mjs — compara site-ul LIVE cu ultima stare cunoscuta
 *
 * De ce exista. proof.json demonstreaza ca fisierele din repo nu s-au
 * schimbat. Nu demonstreaza nimic despre ce serveste Cloudflare, si nu
 * observa nimic despre semnificatia continutului. Doua feluri de drift au
 * trecut deja neobservate zile intregi:
 *
 *   - un lot de fisiere pe care il credeai urcat nu era, si live-ul a
 *     continuat sa afiseze o afirmatie falsa;
 *   - un folder pages/ ramas in repo servea o copie veche a site-ului, cu
 *     o gaura XSS deja reparata in radacina.
 *
 * Nici proof.json, nici testele din build nu puteau vedea vreuna. Amandoua
 * se vad de afara, din ce serveste domeniul.
 *
 * Ce face: ia o amprenta a site-ului live — numere din registru, preturi,
 * declaratii, structura JSON-LD, prezenta paginilor — o compara cu amprenta
 * salvata in repo, si raporteaza fiecare diferenta. Nu spune "s-a schimbat
 * un hash": spune CE afirmatie s-a schimbat si din ce in ce.
 *
 * Rulare:
 *   node scripts/check-drift.mjs              compara si raporteaza
 *   node scripts/check-drift.mjs --update     accepta starea curenta ca noua referinta
 *   node scripts/check-drift.mjs --json       iesire pentru masini
 *
 * Cod de iesire: 0 fara delta, 1 cu delta, 2 daca site-ul nu raspunde.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE = join(ROOT, '.drift', 'baseline.json');
const SITE = process.env.DRIFT_SITE || 'https://3webobs.com';
const UPDATE = process.argv.includes('--update');
const AS_JSON = process.argv.includes('--json');

const PAGES = [
  '/', '/pricing', '/167-signals', '/glossary', '/agents', '/self-audit',
  '/ai-act', '/gdpr', '/cookies', '/terms', '/policy', '/contact',
  '/data-dictionary', '/a2a-secrets', '/for-ai-teams',
  '/for-seo-agencies', '/for-compliance-consultants'
];

const JSON_FILES = [
  '/signals.json', '/pricing.json', '/capabilities.json', '/ai.json',
  '/.well-known/agent-card.json', '/proof.json'
];

/* ------------------------------------------------------------------ *
 * Fetch cu retry — o retea capricioasa nu trebuie sa raporteze drift
 * ------------------------------------------------------------------ */

async function get(path, { asJson = false } = {}) {
  const url = SITE + path;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, {
        headers: { 'user-agent': '3webs-drift-check/1.0 (+https://3webobs.com)' },
        redirect: 'follow'
      });
      const text = await r.text();
      if (!r.ok) {
        if (attempt === 3) return { ok: false, status: r.status, text: '' };
        continue;
      }
      return asJson
        ? { ok: true, status: r.status, data: JSON.parse(text) }
        : { ok: true, status: r.status, text };
    } catch (e) {
      if (attempt === 3) return { ok: false, status: 0, error: e.message, text: '' };
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

/* ------------------------------------------------------------------ *
 * Amprenta — afirmatii, nu hashuri
 *
 * Un hash iti spune ca s-a schimbat ceva. O afirmatie iti spune CE, si
 * numai asa poti decide daca schimbarea era intentionata.
 * ------------------------------------------------------------------ */

function extractJsonLd(html) {
  const out = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try { out.push(JSON.parse(m[1])); } catch { out.push({ __invalid: true }); }
  }
  return out;
}

function graphSummary(blocks) {
  const types = [];
  let invalid = 0;
  const hasPartTargets = [];
  for (const b of blocks) {
    if (b.__invalid) { invalid++; continue; }
    const g = b['@graph'] || [b];
    const byId = Object.fromEntries(g.filter(o => o['@id']).map(o => [o['@id'], o]));
    for (const o of g) {
      const t = o['@type'];
      types.push(Array.isArray(t) ? t.join('+') : String(t));
      if (o['@type'] === 'WebSite' && Array.isArray(o.hasPart)) {
        for (const p of o.hasPart) {
          const target = byId[p['@id']];
          const tt = target ? target['@type'] : 'unresolved';
          hasPartTargets.push(`${p['@id']} -> ${Array.isArray(tt) ? tt.join('+') : tt}`);
        }
      }
    }
  }
  return { objectCount: types.length, invalidBlocks: invalid,
           types: [...new Set(types)].sort(), hasPart: hasPartTargets.sort() };
}

/* Afirmatii verificabile din HTML. Fiecare a fost, la un moment dat, gresita. */
function claims(html) {
  const c = {};
  const grab = (name, re, all = false) => {
    if (all) {
      const hits = [...html.matchAll(re)].map(m => m[1]);
      c[name] = [...new Set(hits)].sort();
    } else {
      const m = html.match(re);
      c[name] = m ? m[1] : null;
    }
  };
  grab('version', /V\s*(\d+\.\d+(?:\.\d+)?)/);
  grab('signalTotal', /(\d{2,4})\s*atomic signals/);
  grab('dimensionWord', /across (five|six|seven) dimensions/);
  grab('familyCounts', /pill-acc-count">(\d{1,3}) signals</g, true);
  grab('aiDeclaration', /name="ai-content-declaration" content="([^"]*)"/);
  c.saysLlmWritesSummary = /written by a language model|A language model writes/i.test(html);
  c.hasPreOrder = (html.match(/schema\.org\/PreOrder/g) || []).length;
  c.hasInStock = (html.match(/schema\.org\/InStock/g) || []).length;
  return c;
}

async function fingerprint() {
  const fp = { site: SITE, takenAt: new Date().toISOString(), pages: {}, files: {}, unreachable: [] };

  for (const p of PAGES) {
    const r = await get(p);
    if (!r.ok) { fp.unreachable.push({ path: p, status: r.status }); continue; }
    fp.pages[p] = {
      status: r.status,
      bytes: r.text.length,
      jsonLd: graphSummary(extractJsonLd(r.text)),
      claims: claims(r.text)
    };
  }

  for (const f of JSON_FILES) {
    const r = await get(f, { asJson: true });
    if (!r.ok) { fp.unreachable.push({ path: f, status: r.status }); continue; }
    const d = r.data;
    if (f === '/signals.json') {
      fp.files[f] = { total: d.total, families: Object.fromEntries((d.families || []).map(x => [x.id, x.count])) };
    } else if (f === '/pricing.json') {
      fp.files[f] = { plans: Object.fromEntries((d.plans || []).map(x => [x.id, `${x.price} ${x.availability}`])) };
    } else if (f === '/proof.json') {
      fp.files[f] = { fileCount: (d.files || []).length, aggregate: d.aggregate_sha256 || d.aggregate || null };
    } else if (f === '/capabilities.json') {
      const api = d.capabilities?.[0]?.pricing?.api_access;
      fp.files[f] = { skills: (d.capabilities || []).map(x => x.id).sort(),
                      apiPrice: api ? api.pay_as_you_go_eur : null,
                      apiAvailability: api ? api.availability : null };
    } else if (f === '/ai.json') {
      fp.files[f] = { usesLlmForSummary: d.ai_usage?.narrative_summary?.uses_language_model ?? null };
    } else {
      fp.files[f] = { version: d.protocolVersion || d.version || null,
                      skills: (d.skills || []).map(x => x.id || x.name).sort() };
    }
  }

  /* Copii ale site-ului la alte cai. pages/ a existat zile intregi fara sa
     stie nimeni; un 200 aici inseamna ca ruleaza o a doua versiune. */
  fp.strayCopies = [];
  for (const stray of ['/pages/index.html', '/pages/', '/index.html.bak', '/old/index.html']) {
    const r = await get(stray);
    if (r.ok && r.text.length > 2000) fp.strayCopies.push(stray);
  }

  return fp;
}

/* ------------------------------------------------------------------ *
 * Diff — recursiv, cu cale citibila
 * ------------------------------------------------------------------ */

function diff(before, after, path = '', out = []) {
  const skip = new Set(['takenAt', 'bytes']);   // se schimba mereu, nu inseamna nimic
  const keys = [...new Set([...Object.keys(before || {}), ...Object.keys(after || {})])];
  for (const k of keys) {
    if (skip.has(k)) continue;
    const p = path ? `${path}.${k}` : k;
    const a = before?.[k], b = after?.[k];
    if (a === undefined) { out.push({ path: p, kind: 'added', to: b }); continue; }
    if (b === undefined) { out.push({ path: p, kind: 'removed', from: a }); continue; }
    if (Array.isArray(a) || Array.isArray(b)) {
      if (JSON.stringify(a) !== JSON.stringify(b)) out.push({ path: p, kind: 'changed', from: a, to: b });
    } else if (a && b && typeof a === 'object' && typeof b === 'object') {
      diff(a, b, p, out);
    } else if (a !== b) {
      out.push({ path: p, kind: 'changed', from: a, to: b });
    }
  }
  return out;
}

/* Nu toate deltele conteaza la fel. */
function severity(d) {
  const p = d.path;
  if (p.startsWith('strayCopies')) return 'critical';
  if (p.includes('saysLlmWritesSummary') || p.includes('usesLlmForSummary')) return 'critical';
  if (p.includes('invalidBlocks') && d.to > 0) return 'critical';
  if (p.startsWith('unreachable')) return 'critical';
  if (p.includes('apiPrice') || p.includes('plans.') || p.includes('availability')) return 'high';
  if (p.includes('signalTotal') || p.includes('familyCounts') || p.includes('total') || p.includes('families.')) return 'high';
  if (p.includes('hasPart') || p.includes('aiDeclaration') || p.includes('dimensionWord')) return 'high';
  if (p.includes('version') || p.includes('skills')) return 'medium';
  return 'low';
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

const current = await fingerprint();

if (current.unreachable.length > PAGES.length / 2) {
  console.error(`Site-ul nu raspunde: ${current.unreachable.length} cai inaccesibile din ${PAGES.length + JSON_FILES.length}.`);
  console.error('Nu raportez drift — nu am ce compara. Verifica daca domeniul e sus.');
  process.exit(2);
}

if (!existsSync(BASELINE) || UPDATE) {
  mkdirSync(dirname(BASELINE), { recursive: true });
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
  console.log(existsSync(BASELINE) && !UPDATE
    ? 'Prima rulare: am salvat starea curenta ca referinta.'
    : 'Referinta actualizata la starea curenta.');
  console.log(`  ${Object.keys(current.pages).length} pagini, ${Object.keys(current.files).length} fisiere`);
  process.exit(0);
}

const previous = JSON.parse(readFileSync(BASELINE, 'utf8'));
const deltas = diff(previous, current).map(d => ({ ...d, severity: severity(d) }));

if (AS_JSON) {
  console.log(JSON.stringify({ since: previous.takenAt, now: current.takenAt, deltas }, null, 2));
  process.exit(deltas.length ? 1 : 0);
}

if (!deltas.length) {
  console.log(`Niciun delta fata de ${previous.takenAt}.`);
  process.exit(0);
}

const order = { critical: 0, high: 1, medium: 2, low: 3 };
deltas.sort((a, b) => order[a.severity] - order[b.severity]);

console.log(`\n${deltas.length} diferente fata de ${previous.takenAt}:\n`);
let lastSev = null;
for (const d of deltas) {
  if (d.severity !== lastSev) { console.log(`  [${d.severity.toUpperCase()}]`); lastSev = d.severity; }
  const f = JSON.stringify(d.from), t = JSON.stringify(d.to);
  if (d.kind === 'added')        console.log(`    + ${d.path} = ${t}`);
  else if (d.kind === 'removed') console.log(`    - ${d.path} (era ${f})`);
  else                            console.log(`    ~ ${d.path}: ${f} -> ${t}`);
}

console.log('\nDaca schimbarile sunt intentionate, accepta-le ca noua referinta:');
console.log('  node scripts/check-drift.mjs --update\n');
process.exit(1);
