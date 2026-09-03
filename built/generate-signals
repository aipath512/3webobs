#!/usr/bin/env node
/**
 * generate-signals.js
 *
 * The signal count existed as text in 24 files and as a registry in one. Two
 * numbers were in circulation — 167 from the engine that runs, 156 from a
 * design document — and neither updated itself. That is the same failure mode
 * as the four price lists: a fact maintained by hand in many places.
 *
 * This script makes the registry the only place the number lives.
 *
 *   node build/generate-signals.js          write signals.json
 *   node build/generate-signals.js --check  verify, exit 1 on any divergence
 *
 * The --check mode is the point. Run it in CI and a page that claims a number
 * the engine does not produce fails the build, instead of being found later by
 * someone auditing the site.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_ONLY = process.argv.includes('--check');

/* ------------------------------------------------------------------ *
 * 1. Read the registry from the engine itself
 * ------------------------------------------------------------------ */

function readRegistry() {
  const src = readFileSync(join(ROOT, '_worker.js'), 'utf8');
  const m = src.match(/const SIG = (\{[\s\S]*?\});\n/);
  if (!m) throw new Error('SIG registry not found in _worker.js — did the declaration change shape?');
  return JSON.parse(m[1]);
}

/* Family presentation. Counts are never written here — they are counted. */
const FAMILIES = [
  { id: 'AI_SIGNALS', name: 'AI Signals', tagline: 'crawler & trust layer', web: 'MACHINE_WEB',
    covers: 'Bot allow directives, AI declaration files, policy and governance endpoints, entity graph completeness, training consent signals.',
    read_by: 'GPTBot · ClaudeBot · PerplexityBot · Google-Extended' },
  { id: 'AEO', name: 'AEO', tagline: 'answer engine optimization', web: 'AI_WEB',
    covers: 'Schema completeness, FAQ and HowTo markup, entity disambiguation, answer-first structure, semantic HTML, concise lead paragraphs.',
    read_by: 'answer engines' },
  { id: 'GEO', name: 'GEO', tagline: 'generative engine optimization', web: 'AI_WEB',
    covers: 'Entity resolution against public registries, sameAs references, declaration files, brand consistency, canonical signals, authorship.',
    read_by: 'knowledge graphs' },
  { id: 'AIO', name: 'AIO', tagline: 'ai optimization', web: 'AI_WEB',
    covers: 'Chunkable structure, extractable tables and lists, fact density, contradiction avoidance, freshness signals, RAG-ready formatting.',
    read_by: 'RAG pipelines' },
  { id: 'SEO', name: 'SEO', tagline: 'search engine optimization', web: 'HUMAN_WEB',
    covers: 'Titles, canonicals, sitemaps, header hierarchy, Core Web Vitals, redirects, broken links, structured data errors.',
    read_by: 'Googlebot · Bingbot' },
  { id: 'A2A', name: 'A2A', tagline: 'agent-to-agent', web: 'MACHINE_WEB',
    covers: 'Agent card, declared capabilities, safe invocation contract, protocol version, task lifecycle, machine-readable terms.',
    read_by: 'autonomous agents' }
];

const WEB_LABELS = {
  HUMAN_WEB:   'Human web — what a person sees',
  AI_WEB:      'AI web — what an answer engine sees',
  MACHINE_WEB: 'Machine web — what an agent sees'
};

/* ------------------------------------------------------------------ *
 * 2. Build the document
 * ------------------------------------------------------------------ */

function build(SIG) {
  const missing = FAMILIES.filter(f => !SIG[f.id]);
  if (missing.length) throw new Error('registry has no such family: ' + missing.map(f => f.id).join(', '));
  const extra = Object.keys(SIG).filter(k => !FAMILIES.some(f => f.id === k));
  if (extra.length) throw new Error('registry has families this script does not describe: ' + extra.join(', '));

  const signals = [];
  const webs = {}, categories = {};

  for (const f of FAMILIES) {
    for (const s of SIG[f.id]) {
      signals.push({ id: s.id, name: s.n, family: f.id, category: s.c, weight: s.w, web: f.web });
      webs[f.web] = (webs[f.web] || 0) + 1;
      categories[s.c] = (categories[s.c] || 0) + 1;
    }
  }

  return {
    schema_version: '1.0',
    generated_from: '_worker.js SIG registry — the same catalogue obs_catalogue returns over A2A',
    canonical_url: 'https://3webobs.com/signals.json',
    role: 'Single source of truth for the signal count and its breakdown. Any page, on this domain or another, that states how many signals the engine tests must derive the number from this file. A number written by hand is how two registries drift apart.',
    verify: 'POST https://3webobs.com/a2a with skill obs_catalogue returns the same catalogue. If the two disagree, this file is stale and that is a bug.',
    total: signals.length,
    families: FAMILIES.map(f => ({
      id: f.id, name: f.name, tagline: f.tagline, count: SIG[f.id].length,
      covers: f.covers, read_by: f.read_by, web: f.web
    })),
    webs: Object.fromEntries(Object.entries(WEB_LABELS)
      .map(([k, label]) => [k, { label, count: webs[k] || 0 }])),
    categories,
    note_on_adi: 'Agent readiness on the ADI scale (L0–L5) is tracked separately and is never added to this total. A2A here counts audit signals that can be observed; ADI levels are cumulative gates over a different registry.',
    signals
  };
}

/* ------------------------------------------------------------------ *
 * 3. Divergence check across every published surface
 * ------------------------------------------------------------------ */

function checkPages(doc) {
  const problems = [];
  const total = String(doc.total);
  const familyCounts = Object.fromEntries(doc.families.map(f => [f.id, f.count]));
  const webCounts = Object.fromEntries(Object.entries(doc.webs).map(([k, v]) => [k, v.count]));

  /* Any three-digit number sitting next to the word "signals" is a claim about
     the registry. If it is not the registry total, it is a stale claim. */
  const claim = /(\d{2,4})\s*(?:atomic\s+)?signals/gi;

  const files = readdirSync(ROOT).filter(f => /\.(html|json|txt)$/.test(f) && f !== 'signals.json');

  /* Verificare tintita pe familii. Cea generica de mai jos accepta orice numar
     care exista undeva in registru, si asta a lasat sa treaca o greseala reala:
     acordeonul "AI Signals" declara 32, legitim ca numar al machine web-ului,
     gresit ca numar al familiei. Aici numele familiei e legat de numarul care
     il urmeaza, deci coincidentele nu mai trec. */
  for (const f of files) {
    const text = readFileSync(join(ROOT, f), 'utf8');
    for (const fam of doc.families) {
      const near = new RegExp(fam.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        + '[^0-9<]{0,60}?(\\d{1,3})\\s*signals', 'gi');
      let mm;
      while ((mm = near.exec(text)) !== null) {
        if (Number(mm[1]) !== fam.count) {
          problems.push(`${f}: "${fam.name}" is followed by "${mm[1]} signals" — the registry has ${fam.count}`);
        }
      }
    }
    const counter = /(?:^|[>\s])(\d{1,3})\s+\/\s+(\d{1,3})(?:[<\s]|$)/g;
    let cm;
    while ((cm = counter.exec(text)) !== null) {
      const denom = cm[2];
      const known = denom === total
        || Object.values(familyCounts).map(String).includes(denom)
        || Object.values(webCounts).map(String).includes(denom)
        || Object.values(doc.categories).map(String).includes(denom);
      if (!known && Number(denom) > 10) {
        problems.push(`${f}: progress counter "${cm[0]}" — ${denom} is not any count in the registry`);
      }
    }
  }

  for (const f of files) {
    const text = readFileSync(join(ROOT, f), 'utf8');
    let m;
    while ((m = claim.exec(text)) !== null) {
      const n = m[1];
      const known = n === total
        || Object.values(familyCounts).map(String).includes(n)
        || Object.values(webCounts).map(String).includes(n)
        || Object.values(doc.categories).map(String).includes(n);
      if (!known) problems.push(`${f}: claims "${m[0].trim()}" — not the total (${total}), and not any family, web or category count in the registry`);
    }
  }
  return [...new Set(problems)];
}

/* ------------------------------------------------------------------ *
 * 4. Run
 * ------------------------------------------------------------------ */

const doc = build(readRegistry());
const serialised = JSON.stringify(doc, null, 2) + '\n';
const problems = checkPages(doc);

if (CHECK_ONLY) {
  let failed = false;
  let onDisk = null;
  try { onDisk = readFileSync(join(ROOT, 'signals.json'), 'utf8'); } catch {}
  if (onDisk !== serialised) {
    console.error('signals.json is out of date with the engine registry.');
    console.error('  run: node build/generate-signals.js');
    failed = true;
  }
  if (problems.length) {
    console.error('\npages claim signal counts the registry does not produce:');
    problems.forEach(p => console.error('  - ' + p));
    failed = true;
  }
  if (failed) process.exit(1);
  console.log(`signals.json is in sync — ${doc.total} signals, ${doc.families.length} families, no divergent claims`);
  process.exit(0);
}

writeFileSync(join(ROOT, 'signals.json'), serialised);
console.log(`wrote signals.json — ${doc.total} signals`);
console.log('  ' + doc.families.map(f => `${f.name} ${f.count}`).join(' · '));
console.log('  ' + Object.entries(doc.webs).map(([k, v]) => `${k} ${v.count}`).join(' · '));
if (problems.length) {
  console.log('\ndivergent claims found on published pages:');
  problems.forEach(p => console.log('  - ' + p));
  console.log('\nfix those, then run --check to confirm');
} else {
  console.log('\nno divergent claims on any published page');
}
