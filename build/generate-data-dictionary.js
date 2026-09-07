#!/usr/bin/env node
/**
 * generate-data-dictionary.js
 *
 * Reconstruieste data-dictionary.json din grafurile JSON-LD reale ale
 * tuturor paginilor.
 *
 * De ce exista. Dictionarul a fost generat o data, extern, si a ramas la 18
 * pagini in timp ce site-ul a ajuns la 27. Un dictionar de date care descrie
 * alt site decat cel publicat e mai rau decat niciunul: cine il citeste ca sa
 * inteleaga modelul primeste o harta veche.
 *
 * Ce produce, pentru fiecare entitate:
 *   - tipul si eticheta, asa cum sunt declarate
 *   - relatiile de iesire: ce indica, prin ce proprietate, cu ce cardinalitate
 *   - relatiile de intrare: cine o indica, prin ce proprietate
 *   - daca inversa e declarata explicit sau doar dedusa
 *   - pe ce pagini apare
 *
 * Cardinalitatea se calculeaza, nu se declara: daca proprietatea poarta o
 * singura tinta peste tot unde apare, e 1..1; daca undeva poarta mai multe,
 * e 1..N. Asta e diferenta dintre un model documentat si unul observat.
 *
 *   node build/generate-data-dictionary.js
 *   node build/generate-data-dictionary.js --check
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const SITE = 'https://3webobs.com';

/* Proprietatile care leaga doua entitati. Restul sunt valori literale si nu
   descriu structura. Lista e deliberat explicita: o euristica de tipul
   "orice obiect cu @id" ar produce relatii pentru fiecare referinta interna
   si ar ineca modelul in zgomot. */
const RELATIONAL = new Set([
  'about','author','brand','breadcrumb','citation','contactPoint','creator',
  'founder','hasOfferCatalog','hasPart','isBasedOn','isPartOf','itemListElement',
  'itemOffered','mainEntity','mainEntityOfPage','memberOf','offers','parentOrganization',
  'provider','publisher','reviewedBy','seller','subOrganization','subjectOf','item',
  'acceptedAnswer','suggestedAnswer','step','distribution','hasDefinedTerm',
  'includedInDataCatalog','address','geo','logo','image','workExample','hasPurpose'
]);

/* Perechile inverse din schema.org. Cand A --hasPart--> B exista si
   B --isPartOf--> A, relatia e declarata in ambele sensuri; altfel e doar
   dedusa, si asta se noteaza. */
const INVERSE = {
  hasPart: 'isPartOf', isPartOf: 'hasPart',
  about: 'subjectOf', subjectOf: 'about',
  parentOrganization: 'subOrganization', subOrganization: 'parentOrganization',
  mainEntity: 'mainEntityOfPage', mainEntityOfPage: 'mainEntity',
  itemOffered: 'offers', offers: 'itemOffered'
};

function collectNodes(doc, out) {
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (n['@graph']) walk(n['@graph']);
    if (n['@type'] && n['@id']) out.push(n);
    for (const k of Object.keys(n)) if (typeof n[k] === 'object') walk(n[k]);
  };
  walk(doc);
}

const pages = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const nodes = [];           // toate nodurile, cu pagina de origine
const pageOf = {};          // @id -> set de pagini
let blocks = 0, unparsed = 0;

for (const f of pages) {
  const html = readFileSync(join(ROOT, f), 'utf8');
  const path = f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, '');
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    blocks++;
    let doc;
    try { doc = JSON.parse(m[1]); } catch { unparsed++; continue; }
    const found = [];
    collectNodes(doc, found);
    for (const n of found) {
      nodes.push({ node: n, page: path });
      (pageOf[n['@id']] = pageOf[n['@id']] || new Set()).add(path);
    }
  }
}

/* Un @id poate aparea pe mai multe pagini, cu proprietati partial diferite.
   Le unim: entitatea e una singura, indiferent pe cate pagini e declarata. */
const merged = {};
for (const { node } of nodes) {
  const id = node['@id'];
  if (!merged[id]) merged[id] = { '@id': id, '@type': node['@type'], props: {} };
  const t = node['@type'];
  const prev = merged[id]['@type'];
  const asArr = (x) => Array.isArray(x) ? x : [x];
  merged[id]['@type'] = [...new Set([...asArr(prev), ...asArr(t)])].filter(Boolean);
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('@')) continue;
    (merged[id].props[k] = merged[id].props[k] || []).push(v);
  }
}

/* Relatiile. Pentru fiecare proprietate relationala, extragem tintele si
   retinem cate au fost intr-o singura declaratie — de acolo iese
   cardinalitatea observata. */
const outbound = {};   // id -> [{property, target, maxPerDeclaration}]
for (const [id, e] of Object.entries(merged)) {
  outbound[id] = [];
  for (const [prop, occurrences] of Object.entries(e.props)) {
    if (!RELATIONAL.has(prop)) continue;
    const targets = new Set();
    let maxPer = 0;
    for (const occ of occurrences) {
      const list = Array.isArray(occ) ? occ : [occ];
      let inThis = 0;
      for (const v of list) {
        if (v && typeof v === 'object' && v['@id']) { targets.add(v['@id']); inThis++; }
      }
      if (inThis > maxPer) maxPer = inThis;
    }
    for (const t of targets) {
      outbound[id].push({ property: prop, target: t, maxPerDeclaration: maxPer });
    }
  }
}

const inbound = {};
for (const [id, rels] of Object.entries(outbound)) {
  for (const r of rels) {
    (inbound[r.target] = inbound[r.target] || []).push({ property: r.property, source: id });
  }
}

function inverseDeclared(sourceId, prop, targetId) {
  const inv = INVERSE[prop];
  if (!inv) return { inverseProperty: null, inverseDeclared: false };
  const back = (outbound[targetId] || []).some(r => r.property === inv && r.target === sourceId);
  return { inverseProperty: inv, inverseDeclared: back };
}

const entities = Object.keys(merged).sort().map(id => {
  const e = merged[id];
  const label = (() => {
    const n = e.props.name || e.props.legalName || e.props.headline;
    if (!n) return null;
    const first = Array.isArray(n[0]) ? n[0][0] : n[0];
    return typeof first === 'string' ? first : null;
  })();

  return {
    id,
    type: e['@type'].join(' + '),
    label,
    pages: [...(pageOf[id] || [])].sort(),
    outbound: (outbound[id] || []).sort((a, b) =>
      a.property.localeCompare(b.property) || a.target.localeCompare(b.target)
    ).map(r => ({
      property: r.property,
      target: r.target,
      targetType: merged[r.target] ? merged[r.target]['@type'].join(' + ') : 'unresolved',
      cardinality: r.maxPerDeclaration > 1 ? '1..N' : '1..1',
      ...inverseDeclared(id, r.property, r.target)
    })),
    inbound: (inbound[id] || []).sort((a, b) =>
      a.property.localeCompare(b.property) || a.source.localeCompare(b.source)
    ).map(r => ({
      property: r.property,
      source: r.source,
      sourceType: merged[r.source] ? merged[r.source]['@type'].join(' + ') : 'unresolved',
      ...inverseDeclared(r.source, r.property, id)
    }))
  };
});

/* Referinte care nu se rezolva: cineva indica un @id care nu e declarat
   nicaieri. Un consumator care urmeaza legatura ajunge intr-un gol. */
const dangling = [];
for (const e of entities) {
  for (const r of e.outbound) {
    if (r.targetType === 'unresolved') dangling.push({ from: e.id, property: r.property, to: r.target });
  }
}

/* Entitati izolate: declarate, dar pe care nu le indica nimeni si care nu
   indica nimic. Nu sunt greseli, dar nu contribuie la graf. */
const isolated = entities.filter(e => !e.outbound.length && !e.inbound.length).map(e => e.id);

const relations = entities.reduce((n, e) => n + e.outbound.length, 0);

const doc = {
  '@context': { schema: 'https://schema.org/' },
  name: '3webs data dictionary',
  description: 'Every entity published on this site, the relations between them, their cardinalities and where each is declared. Generated from the JSON-LD actually served, not maintained by hand.',
  url: SITE + '/data-dictionary',
  generated: new Date().toISOString(),
  generator: 'build/generate-data-dictionary.js',
  method: 'Entities are merged by @id across pages: the same @id declared on several pages is one entity, not several. Cardinality is observed, not declared — a property carrying one target everywhere it appears is 1..1; a property carrying more than one in any single declaration is 1..N. An inverse is reported as declared only when the reverse relation exists in the graph; otherwise it is inferred from the schema.org pair.',
  counts: {
    entities: entities.length,
    relations,
    pages: pages.length,
    jsonLdBlocks: blocks,
    unparsedBlocks: unparsed,
    danglingReferences: dangling.length,
    isolatedEntities: isolated.length
  },
  cardinalityNotation: {
    '1..1': 'exactly one target in every declaration observed',
    '1..N': 'more than one target in at least one declaration'
  },
  integrity: { dangling, isolated },
  entities
};

const serialised = JSON.stringify(doc, null, 2) + '\n';
const file = join(ROOT, 'data-dictionary.json');

if (CHECK) {
  /* `generated` se schimba la fiecare rulare, deci comparam restul. */
  const strip = (t) => t.replace(/"generated": "[^"]*",/, '');
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (strip(current) !== strip(serialised)) {
    console.error('data-dictionary.json is out of date with the published graphs.');
    console.error('  run: node build/generate-data-dictionary.js');
    process.exit(1);
  }
  console.log(`data dictionary is in sync — ${entities.length} entities, ${relations} relations, ${pages.length} pages`);
  process.exit(0);
}

writeFileSync(file, serialised);
console.log(`wrote data-dictionary.json`);
console.log(`  ${entities.length} entities · ${relations} relations · ${pages.length} pages · ${blocks} JSON-LD blocks`);
if (unparsed) console.log(`  ${unparsed} block(s) did not parse`);
if (dangling.length) {
  console.log(`\n  ${dangling.length} reference(s) point at an @id nobody declares:`);
  dangling.slice(0, 10).forEach(d => console.log(`    ${d.from} --${d.property}--> ${d.to}`));
}
if (isolated.length) {
  console.log(`\n  ${isolated.length} entity/entities neither reference nor are referenced:`);
  isolated.slice(0, 10).forEach(i => console.log(`    ${i}`));
}
