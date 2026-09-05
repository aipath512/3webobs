#!/usr/bin/env node
/**
 * generate-detail-pages.js
 *
 * Sase pagini, una per dimensiune, generate dintr-un singur sablon.
 *
 * De ce sase fisiere si nu unul cu ?dim=. Un URL distinct per dimensiune
 * inseamna sase pagini indexabile, fiecare cu titlu, descriere si graf
 * propriu. Pentru un produs care vinde vizibilitate in AI, un parametru de
 * query nu e o pagina — e o stare a aceleiasi pagini, si asa o trateaza si
 * un crawler.
 *
 * De ce generate si nu scrise de mana. Sase copii ale aceleiasi logici
 * inseamna ca o reparatie trebuie aplicata de sase ori, si a sasea oara se
 * uita. Logica sta o singura data, in assets/signal-detail.js; fisierele
 * astea doar declara ce dimensiune arata.
 *
 * Numarul si numele dimensiunilor vin din signals.json, nu de aici — daca
 * registrul se schimba, paginile se schimba cu el.
 *
 *   node build/generate-detail-pages.js
 *   node build/generate-detail-pages.js --check
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const SITE = 'https://3webobs.com';

const signals = JSON.parse(readFileSync(join(ROOT, 'signals.json'), 'utf8'));

/* Textul care descrie fiecare dimensiune pentru un om. Numarul de semnale nu
   e scris aici — vine din registru, ca sa nu existe doua adevaruri. */
const COPY = {
  AEO: { slug: 'aeo', title: 'AEO — Answer Engine Optimization',
    lede: 'Whether an answer engine can lift a direct answer out of this page without sending anyone to it. Schema completeness, question and answer pairs, entity disambiguation, answer-first structure.' },
  GEO: { slug: 'geo', title: 'GEO — Generative Engine Optimization',
    lede: 'Whether a generative model can resolve your brand to the right entity and cite it correctly. External anchors, sameAs references, declaration files, canonical signals.' },
  AIO: { slug: 'aio', title: 'AIO — AI Optimization',
    lede: 'Whether your content survives being chunked, retrieved and recombined. Extractable tables and lists, fact density, contradiction avoidance, freshness.' },
  SEO: { slug: 'seo', title: 'SEO — Search Engine Optimization',
    lede: 'The foundation both webs still stand on. Titles, canonicals, sitemaps, header hierarchy, Core Web Vitals, redirects, structured data errors.' },
  AI_SIGNALS: { slug: 'ai-signals', title: 'AI Signals — the crawler and trust layer',
    lede: 'Whether AI crawlers are allowed in, and what you have declared to them. Bot directives, declaration files, policy and governance endpoints, training consent.' },
  A2A: { slug: 'a2a', title: 'A2A — Agent-to-Agent',
    lede: 'Whether an autonomous agent can discover what you do, read the contract, and call it. Agent card, declared capabilities, safe invocation, task lifecycle.' }
};

function head(dim, fam, copy) {
  const url = `${SITE}/detail-${copy.slug}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#webpage', name: copy.title, url,
        description: copy.lede, inLanguage: 'en',
        isPartOf: { '@id': SITE + '/#website' },
        publisher: { '@id': SITE + '/#organization' },
        breadcrumb: { '@id': url + '#breadcrumb' } },
      { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
        { '@type': 'ListItem', position: 1, name: '3webs', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Signal detail', item: SITE + '/signal-detail' },
        { '@type': 'ListItem', position: 3, name: fam.name, item: url } ] },
      { '@type': ['Organization', 'Corporation'], '@id': SITE + '/#organization',
        name: 'AIVENTURE S.R.L.', url: SITE + '/', identifier: 'CUI 51415878' },
      { '@type': 'WebSite', '@id': SITE + '/#website', name: '3webs', url: SITE + '/',
        inLanguage: 'en', publisher: { '@id': SITE + '/#organization' } }
    ]
  };
  return { url, graph };
}

const template = readFileSync(join(ROOT, 'signal-detail.html'), 'utf8');

/* Scheletul comun: tot ce e inainte de <body>, minus JSON-LD-ul si titlul,
   care se rescriu per pagina. */
const styleEnd = template.indexOf('</style>') + '</style>'.length;
const shell = template.slice(0, styleEnd);
const footStart = template.lastIndexOf('<footer');
const foot = footStart > 0 ? template.slice(footStart) : '</body></html>';

const written = [];
let drift = 0;

for (const fam of signals.families) {
  const copy = COPY[fam.id];
  if (!copy) { console.error(`no copy for family ${fam.id}`); process.exit(1); }
  const { url, graph } = head(fam.id, fam, copy);

  let h = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${copy.title} | 3webs</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${copy.lede.replace(/"/g, '&quot;').slice(0, 300)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  h = h.replace('</head>', `<script type="application/ld+json">${JSON.stringify(graph)}</script>\n</head>`);

  const body = `
<body data-dim="${fam.id}">
<div class="wrap">
  <nav class="crumb" aria-label="Breadcrumb"><span class="crumb-sess" data-session-badge title="Operating session">0001C</span><a href="/">3webs</a><span class="sep">&rsaquo;</span><a href="/signal-detail">Signal detail</a><span class="sep">&rsaquo;</span><span class="here" aria-current="page">${fam.name}</span></nav>

  <h1 class="page-title" id="sd-title">${fam.name} <em>detail</em></h1>
  <p class="sec-s">${copy.lede}</p>
  <p class="sec-s" style="opacity:.6">${fam.count} of the 167 signals sit in this dimension. Read by ${fam.read_by}.</p>

  <div class="sd-nav-top" style="margin:18px 0 6px;">
${signals.families.map(f => f.id === fam.id
  ? `    <span class="sd-nav-cur">${f.name}</span>`
  : `    <a class="sd-nav-lnk" href="/detail-${COPY[f.id].slug}">${f.name}</a>`).join('\n')}
    <a class="sd-nav-lnk" href="/schema">Schema.org</a>
  </div>

  <div id="sd-body"><p class="sec-s">Run an audit from the <a href="/">home page</a>, then open this dimension from its result card.</p></div>
</div>

<script src="/assets/signal-detail.js" defer></script>
<script>
(function(){
  var els = document.querySelectorAll('[data-session-badge]');
  if(!els.length) return;
  fetch('/session').then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
    if(!j || !j.current) return;
    var k = j.current.slice(-1);
    for (var i=0;i<els.length;i++){ els[i].textContent=j.current; els[i].setAttribute('data-kind',k); }
  }).catch(function(){});
})();
</script>
`;

  const out = h + body + foot;
  const file = join(ROOT, `detail-${copy.slug}.html`);

  if (CHECK) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== out) {
      console.error(`out of date: detail-${copy.slug}.html`);
      drift++;
    }
  } else {
    writeFileSync(file, out);
    written.push(`detail-${copy.slug}.html`);
  }
}

if (CHECK) {
  if (drift) { console.error('\nrun: node build/generate-detail-pages.js'); process.exit(1); }
  console.log(`detail pages are in sync — ${signals.families.length} dimensions`);
  process.exit(0);
}

console.log(`wrote ${written.length} detail pages`);
written.forEach(f => console.log('  ' + f));
console.log('\nLogic lives once in assets/signal-detail.js; these files only declare which dimension they show.');
