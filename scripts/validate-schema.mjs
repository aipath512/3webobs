#!/usr/bin/env node
/**
 * validate-schema.mjs — verifica fiecare obiect schema.org de pe site
 *
 * Onestitate despre ce e asta. schema.org nu publica un API pentru
 * validator.schema.org, deci nu il pot apela si nu pretind ca o fac. Ce face
 * acest script e sa aplice ACELEASI reguli pe care le aplica validatorul:
 * proprietatea exista in vocabular, apartine tipului pe care e pusa, tinta
 * unei referinte are tipul pe care il cere proprietatea. Vocabularul de mai
 * jos e un subset — exact tipurile si proprietatile folosite pe site. Un tip
 * necunoscut nu e raportat ca eroare, ci ca "neverificat", pentru ca absenta
 * din subsetul meu nu inseamna absenta din schema.org.
 *
 * Trei culori:
 *   verde       obiectul e valid: toate proprietatile apartin tipului, toate
 *               referintele se rezolva la tipul cerut
 *   portocaliu  avertisment: proprietate corecta ca nume dar pusa pe un tip
 *               care nu o defineste, sau lipseste ceva recomandat
 *   rosu        eroare: referinta nu se rezolva, tinta are alt tip decat
 *               cere proprietatea, sau JSON-ul nu parseaza
 *
 * Rulare:  node scripts/validate-schema.mjs
 * Iesire:  schema-report.json in radacina
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------------ *
 * Vocabular — subsetul folosit pe acest site
 *
 * `extends` reproduce ierarhia schema.org: o proprietate definita pe
 * Thing e valida pe orice tip, pentru ca totul descinde din Thing.
 * ------------------------------------------------------------------ */

const THING = ['name','url','description','image','identifier','sameAs','alternateName','additionalType','disambiguatingDescription','mainEntityOfPage','potentialAction','subjectOf'];

const CREATIVE_WORK = [...THING,'about','author','creator','publisher','inLanguage','dateModified','datePublished','license','keywords','copyrightHolder','copyrightYear','isAccessibleForFree','encodingFormat','headline','isPartOf','hasPart','citation','version','abstract','text','audience','provider','isBasedOn','learningResourceType','educationalLevel','material','workExample'];

const WEB_PAGE = [...CREATIVE_WORK,'breadcrumb','primaryImageOfPage','significantLink','relatedLink','speakable','lastReviewed','mainEntity','specialty'];

const ORGANIZATION = [...THING,'address','email','telephone','legalName','logo','brand','founder','foundingDate','foundingLocation','areaServed','contactPoint','employee','knowsAbout','knowsLanguage','taxID','vatID','duns','naics','location','parentOrganization','subOrganization','member','memberOf','numberOfEmployees','slogan','owns','makesOffer','hasOfferCatalog','seeks','award','iso6523Code'];

const ITEM_LIST = [...THING,'itemListElement','itemListOrder','numberOfItems'];

const VOCAB = {
  Thing:                 { props: THING },
  CreativeWork:          { props: CREATIVE_WORK },
  WebPage:               { props: WEB_PAGE },
  CollectionPage:        { props: WEB_PAGE },
  ContactPage:           { props: WEB_PAGE },
  AboutPage:             { props: WEB_PAGE },
  ProfilePage:           { props: WEB_PAGE },
  FAQPage:               { props: WEB_PAGE },
  WebSite:               { props: [...CREATIVE_WORK,'issn'] },
  Article:               { props: [...CREATIVE_WORK,'articleBody','articleSection','wordCount','backstory','speakable'] },
  TechArticle:           { props: [...CREATIVE_WORK,'proficiencyLevel','dependencies','articleBody','articleSection'] },
  APIReference:          { props: [...CREATIVE_WORK,'proficiencyLevel','assemblyVersion','programmingModel','targetPlatform','executableLibraryName'] },
  SoftwareSourceCode:    { props: [...CREATIVE_WORK,'codeRepository','codeSampleType','programmingLanguage','runtimePlatform','targetProduct','sampleType'] },
  SoftwareApplication:   { props: [...CREATIVE_WORK,'applicationCategory','applicationSubCategory','operatingSystem','browserRequirements','featureList','softwareVersion','offers','downloadUrl','installUrl','memoryRequirements','permissions','releaseNotes','screenshot','softwareRequirements','applicationSuite'] },
  WebApplication:        { props: [...CREATIVE_WORK,'applicationCategory','applicationSubCategory','operatingSystem','browserRequirements','featureList','softwareVersion','offers'] },
  Dataset:               { props: [...CREATIVE_WORK,'distribution','variableMeasured','measurementTechnique','includedInDataCatalog','issn','catalog'] },
  DataCatalog:           { props: [...CREATIVE_WORK,'dataset','measurementTechnique'] },
  DigitalDocument:       { props: [...CREATIVE_WORK,'hasDigitalDocumentPermission'] },
  DefinedTermSet:        { props: [...CREATIVE_WORK,'hasDefinedTerm'] },
  DefinedTerm:           { props: [...THING,'termCode','inDefinedTermSet'] },
  HowTo:                 { props: [...CREATIVE_WORK,'step','supply','tool','totalTime','estimatedCost','prepTime','performTime','yield'] },
  ItemList:              { props: ITEM_LIST },
  BreadcrumbList:        { props: ITEM_LIST },
  OfferCatalog:          { props: ITEM_LIST },
  ListItem:              { props: [...THING,'item','position','nextItem','previousItem'] },
  SiteNavigationElement: { props: [...CREATIVE_WORK,'cssSelector','xpath'] },
  Organization:          { props: ORGANIZATION },
  Corporation:           { props: [...ORGANIZATION,'tickerSymbol'] },
  OnlineBusiness:        { props: ORGANIZATION },
  LocalBusiness:         { props: [...ORGANIZATION,'openingHoursSpecification','currenciesAccepted','paymentAccepted','priceRange','branchOf'] },
  Brand:                 { props: [...THING,'logo','slogan','aggregateRating','review'] },
  Person:                { props: [...THING,'affiliation','email','jobTitle','worksFor','knowsAbout','knowsLanguage','nationality','hasOccupation','address','telephone','birthDate','alumniOf','award','memberOf','honorificPrefix','honorificSuffix'] },
  Occupation:            { props: [...THING,'occupationLocation','skills','responsibilities','qualifications','estimatedSalary','occupationalCategory'] },
  Service:               { props: [...THING,'areaServed','audience','availableChannel','brand','provider','serviceType','termsOfService','hasOfferCatalog','offers','category','serviceOutput','providerMobility','hoursAvailable'] },
  WebAPI:                { props: [...THING,'documentation','provider','termsOfService','areaServed','availableChannel','serviceType','assemblyVersion','programmingModel'] },
  Offer:                 { props: [...THING,'price','priceCurrency','availability','itemOffered','priceSpecification','eligibleQuantity','validFrom','validThrough','seller','category','acceptedPaymentMethod','areaServed'] },
  Question:              { props: [...CREATIVE_WORK,'acceptedAnswer','suggestedAnswer','answerCount','upvoteCount'] },
  Answer:                { props: [...CREATIVE_WORK,'upvoteCount'] },
};

/* Proprietati care cer o tinta de un anumit tip. Astea produc erorile pe
   care le raporteaza validatorul oficial — cele mai usor de scapat, pentru
   ca JSON-ul e perfect valid, doar semantica e gresita. */
const RANGE = {
  hasPart:        { expect: ['CreativeWork'], note: 'hasPart asteapta un CreativeWork' },
  isPartOf:       { expect: ['CreativeWork'], note: 'isPartOf asteapta un CreativeWork' },
  itemOffered:    { expect: ['Service','Product','CreativeWork','Thing'], note: 'itemOffered asteapta ceva oferibil' },
  hasDefinedTerm: { expect: ['DefinedTerm'], note: 'hasDefinedTerm asteapta DefinedTerm' },
  publisher:      { expect: ['Organization','Person'], note: 'publisher asteapta Organization sau Person' },
  author:         { expect: ['Organization','Person'], note: 'author asteapta Organization sau Person' },
  creator:        { expect: ['Organization','Person'], note: 'creator asteapta Organization sau Person' },
  provider:       { expect: ['Organization','Person'], note: 'provider asteapta Organization sau Person' },
  founder:        { expect: ['Person','Organization'], note: 'founder asteapta Person' },
  brand:          { expect: ['Brand','Organization'], note: 'brand asteapta Brand sau Organization' },
  mainEntity:     { expect: null, note: '' },
  hasOfferCatalog:{ expect: ['OfferCatalog'], note: 'hasOfferCatalog asteapta OfferCatalog' },
};

/* Ierarhia, pentru verificarea de tip. Doar ce e nevoie. */
const PARENTS = {
  Corporation:'Organization', OnlineBusiness:'Organization', LocalBusiness:'Organization',
  WebPage:'CreativeWork', CollectionPage:'WebPage', ContactPage:'WebPage', AboutPage:'WebPage',
  ProfilePage:'WebPage', FAQPage:'WebPage', WebSite:'CreativeWork', Article:'CreativeWork',
  TechArticle:'Article', APIReference:'TechArticle', SoftwareSourceCode:'CreativeWork',
  SoftwareApplication:'CreativeWork', WebApplication:'SoftwareApplication', Dataset:'CreativeWork',
  DataCatalog:'CreativeWork', DigitalDocument:'CreativeWork', DefinedTermSet:'CreativeWork',
  HowTo:'CreativeWork', ItemList:'Intangible', BreadcrumbList:'ItemList', OfferCatalog:'ItemList',
  SiteNavigationElement:'CreativeWork', Service:'Intangible', WebAPI:'Service', Brand:'Intangible',
  Offer:'Intangible', Occupation:'Intangible', DefinedTerm:'Intangible', Question:'CreativeWork',
  Answer:'CreativeWork', ListItem:'Intangible',
};

function isA(type, ancestor) {
  let t = type;
  const seen = new Set();
  while (t && !seen.has(t)) {
    if (t === ancestor) return true;
    seen.add(t);
    t = PARENTS[t];
  }
  return ancestor === 'Thing';
}

function typesOf(o) {
  const t = o['@type'];
  return Array.isArray(t) ? t : t ? [t] : [];
}

function allowedProps(types) {
  const set = new Set();
  let known = false;
  for (const t of types) {
    const v = VOCAB[t];
    if (v) { known = true; v.props.forEach(p => set.add(p)); }
  }
  return { set, known };
}

/* ------------------------------------------------------------------ *
 * Verificarea unui graf
 * ------------------------------------------------------------------ */

function checkGraph(graph, pagePath) {
  const byId = Object.fromEntries(graph.filter(o => o['@id']).map(o => [o['@id'], o]));
  const results = [];

  for (const o of graph) {
    const types = typesOf(o);
    const { set: allowed, known } = allowedProps(types);
    const issues = [];

    for (const key of Object.keys(o)) {
      if (key.startsWith('@')) continue;

      if (known && !allowed.has(key)) {
        issues.push({ level: 'warning', property: key,
          message: `"${key}" nu e definita pe ${types.join(' + ')}` });
      }

      const rule = RANGE[key];
      if (rule && rule.expect) {
        const targets = Array.isArray(o[key]) ? o[key] : [o[key]];
        for (const t of targets) {
          if (!t || typeof t !== 'object') continue;
          let targetTypes = typesOf(t);
          if (t['@id'] && !targetTypes.length) {
            const resolved = byId[t['@id']];
            if (!resolved) {
              issues.push({ level: 'error', property: key,
                message: `referinta ${t['@id']} nu se rezolva in graf` });
              continue;
            }
            targetTypes = typesOf(resolved);
          }
          if (!targetTypes.length) continue;
          const ok = targetTypes.some(tt => rule.expect.some(exp => isA(tt, exp)));
          if (!ok) {
            issues.push({ level: 'error', property: key,
              message: `${rule.note}; tinta e ${targetTypes.join(' + ')}` });
          }
        }
      }
    }

    if (types.some(t => t === 'BreadcrumbList') && (o.itemListElement || []).length < 2) {
      issues.push({ level: 'warning', property: 'itemListElement',
        message: 'un breadcrumb cu sub doua elemente nu descrie nicio ierarhie' });
    }

    const status = issues.some(i => i.level === 'error') ? 'error'
                 : issues.length ? 'warning'
                 : known ? 'valid' : 'unverified';

    results.push({
      type: types.join(' + ') || '(fara @type)',
      id: o['@id'] || null,
      page: pagePath,
      propertyCount: Object.keys(o).filter(k => !k.startsWith('@')).length,
      status,
      issues
    });
  }
  return results;
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

const files = readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const objects = [];
const pages = {};

for (const f of files) {
  const html = readFileSync(join(ROOT, f), 'utf8');
  const path = f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, '');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let pageObjects = [];

  for (const b of blocks) {
    let parsed;
    try { parsed = JSON.parse(b[1]); }
    catch (e) {
      pageObjects.push({ type: '(bloc care nu parseaza)', id: null, page: path,
        propertyCount: 0, status: 'error',
        issues: [{ level: 'error', property: '@context', message: 'JSON invalid: ' + e.message }] });
      continue;
    }
    pageObjects = pageObjects.concat(checkGraph(parsed['@graph'] || [parsed], path));
  }

  objects.push(...pageObjects);
  pages[path] = {
    objects: pageObjects.length,
    valid:      pageObjects.filter(o => o.status === 'valid').length,
    warning:    pageObjects.filter(o => o.status === 'warning').length,
    error:      pageObjects.filter(o => o.status === 'error').length,
    unverified: pageObjects.filter(o => o.status === 'unverified').length,
  };
}

/* Obiectele se repeta pe pagini. Pentru afisare grupam pe tip + @id, si
   pastram paginile pe care apar — altfel raportul are 500 de randuri
   dintre care 480 identice. */
const grouped = {};
for (const o of objects) {
  const key = `${o.type}|${o.id || o.page}`;
  if (!grouped[key]) grouped[key] = { ...o, pages: [], occurrences: 0 };
  grouped[key].pages.push(o.page);
  grouped[key].occurrences++;
  if (o.status === 'error') grouped[key].status = 'error';
  else if (o.status === 'warning' && grouped[key].status === 'valid') grouped[key].status = 'warning';
}

const list = Object.values(grouped).map(g => { delete g.page; return g; })
  .sort((a, b) => {
    const order = { error: 0, warning: 1, unverified: 2, valid: 3 };
    return order[a.status] - order[b.status] || a.type.localeCompare(b.type);
  });

const report = {
  generated: new Date().toISOString(),
  method: 'Structural validation against the schema.org vocabulary, performed by this repository. schema.org publishes no API for validator.schema.org, so these are our own checks applying the same rules: does the property exist on the type, does a reference resolve, does the target have the type the property expects. The vocabulary below is a subset covering the types this site uses; a type outside it is reported as unverified rather than valid or invalid.',
  validator: 'https://validator.schema.org/#url=https%3A%2F%2F3webobs.com%2F',
  totals: {
    distinctObjects: list.length,
    totalOccurrences: objects.length,
    valid:      list.filter(o => o.status === 'valid').length,
    warning:    list.filter(o => o.status === 'warning').length,
    error:      list.filter(o => o.status === 'error').length,
    unverified: list.filter(o => o.status === 'unverified').length,
  },
  pages,
  objects: list
};

writeFileSync(join(ROOT, 'schema-report.json'), JSON.stringify(report, null, 2) + '\n');

const t = report.totals;
console.log(`schema-report.json scris`);
console.log(`  ${t.distinctObjects} obiecte distincte, ${t.totalOccurrences} aparitii pe ${Object.keys(pages).length} pagini`);
console.log(`  verde ${t.valid} · portocaliu ${t.warning} · rosu ${t.error} · neverificat ${t.unverified}`);

if (t.error) {
  console.log('\nErori:');
  for (const o of list.filter(x => x.status === 'error')) {
    console.log(`  ${o.type} ${o.id || ''}`);
    o.issues.filter(i => i.level === 'error').forEach(i => console.log(`    - ${i.property}: ${i.message}`));
  }
}
process.exit(t.error ? 1 : 0);
