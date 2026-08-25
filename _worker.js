/* ===================================================================
   AUDIT-AI — REAL ENGINE — 3webobs.com
   Motor real: fetch site + fisiere de semnal, evaluare pe dovezi reale.
   ZERO PROFILES hardcodat. ZERO regex pe numele domeniului.
   Semnale nemasurabile fara API extern platit = NA (nu FAIL, nu inventat).
   =================================================================== */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

/* ---------- catalogul celor 167 de semnale (id, nume, categorie, greutate) ---------- */
const SIG = {"AEO": [{"id": "aeo1", "n": "FAQ Schema Markup", "c": "ON-PAGE", "w": 9}, {"id": "aeo2", "n": "HowTo Schema Markup", "c": "ON-PAGE", "w": 8}, {"id": "aeo3", "n": "Q&A Format Content Blocks", "c": "ON-PAGE", "w": 9}, {"id": "aeo4", "n": "Structured Answer Snippets", "c": "ON-PAGE", "w": 10}, {"id": "aeo5", "n": "Speakable Schema (Voice)", "c": "ON-PAGE", "w": 7}, {"id": "aeo6", "n": "Article Schema Presence", "c": "ON-PAGE", "w": 8}, {"id": "aeo7", "n": "Breadcrumb Schema", "c": "ON-PAGE", "w": 7}, {"id": "aeo8", "n": "Table of Contents Anchors", "c": "ON-PAGE", "w": 6}, {"id": "aeo9", "n": "Entity Disambiguation (Wikidata)", "c": "OFF-PAGE", "w": 9}, {"id": "aeo10", "n": "Knowledge Panel Presence", "c": "OFF-PAGE", "w": 10}, {"id": "aeo11", "n": "Direct Answer Formatting", "c": "ON-PAGE", "w": 9}, {"id": "aeo12", "n": "Question-Intent URL Structure", "c": "ON-SITE", "w": 7}, {"id": "aeo13", "n": "PAA Coverage", "c": "OFF-PAGE", "w": 8}, {"id": "aeo14", "n": "Featured Snippet Optimization", "c": "ON-PAGE", "w": 10}, {"id": "aeo15", "n": "Definition Blocks", "c": "ON-PAGE", "w": 7}, {"id": "aeo16", "n": "Step-by-Step Schema", "c": "ON-PAGE", "w": 7}, {"id": "aeo17", "n": "Concise Lead Paragraphs <60w", "c": "ON-PAGE", "w": 8}, {"id": "aeo18", "n": "Voice Search Query Match", "c": "ON-PAGE", "w": 7}, {"id": "aeo19", "n": "Answer-First Content Structure", "c": "ON-PAGE", "w": 9}, {"id": "aeo20", "n": "NLP-Friendly Headings", "c": "ON-PAGE", "w": 8}, {"id": "aeo21", "n": "Conversational Query Coverage", "c": "ON-PAGE", "w": 8}, {"id": "aeo22", "n": "Schema Nesting Depth", "c": "ON-PAGE", "w": 6}, {"id": "aeo23", "n": "Rich Snippet Eligibility", "c": "ON-PAGE", "w": 9}, {"id": "aeo24", "n": "Google SGE Optimization", "c": "ON-PAGE", "w": 10}, {"id": "aeo25", "n": "Context Carryover Signals", "c": "ON-PAGE", "w": 7}, {"id": "aeo26", "n": "Entity Salience Score", "c": "ON-PAGE", "w": 8}, {"id": "aeo27", "n": "Semantic HTML5 Structure", "c": "ON-SITE", "w": 7}, {"id": "aeo28", "n": "ClaimReview Schema", "c": "ON-PAGE", "w": 6}, {"id": "aeo29", "n": "Event Schema Accuracy", "c": "ON-PAGE", "w": 5}, {"id": "aeo30", "n": "Product Schema Completeness", "c": "ON-PAGE", "w": 7}, {"id": "aeo31", "n": "Local Business Schema", "c": "ON-PAGE", "w": 7}, {"id": "aeo32", "n": "Review / Rating Schema", "c": "ON-PAGE", "w": 6}, {"id": "aeo33", "n": "Video Schema Markup", "c": "ON-PAGE", "w": 5}, {"id": "aeo34", "n": "Person / Author Schema", "c": "ON-PAGE", "w": 7}], "GEO": [{"id": "geo1", "n": "llms.txt Presence & Quality", "c": "ON-SITE", "w": 10}, {"id": "geo2", "n": "ai.txt / AI Directives File", "c": "ON-SITE", "w": 9}, {"id": "geo3", "n": "robots.txt AI Crawler Rules", "c": "ON-SITE", "w": 9}, {"id": "geo4", "n": "Entity Graph JSON-LD", "c": "ON-SITE", "w": 10}, {"id": "geo5", "n": "Organization Schema Completeness", "c": "ON-PAGE", "w": 9}, {"id": "geo6", "n": "sameAs References External", "c": "OFF-PAGE", "w": 8}, {"id": "geo7", "n": "Wikipedia / Wikidata Entry", "c": "OFF-PAGE", "w": 10}, {"id": "geo8", "n": "ai.json Signal File", "c": "ON-SITE", "w": 9}, {"id": "geo9", "n": "intents.json Declaration", "c": "ON-SITE", "w": 8}, {"id": "geo10", "n": "governance.json Presence", "c": "ON-SITE", "w": 7}, {"id": "geo11", "n": "entities.json Registry", "c": "ON-SITE", "w": 9}, {"id": "geo12", "n": "Crunchbase Profile", "c": "OFF-PAGE", "w": 7}, {"id": "geo13", "n": "LinkedIn Entity Verification", "c": "OFF-PAGE", "w": 8}, {"id": "geo14", "n": "Press Mentions AI-indexed", "c": "OFF-PAGE", "w": 8}, {"id": "geo15", "n": "Author EEAT Signals", "c": "OFF-PAGE", "w": 9}, {"id": "geo16", "n": "Brand Entity Consistency", "c": "ON-PAGE", "w": 9}, {"id": "geo17", "n": "Canonical URL Signals", "c": "ON-SITE", "w": 7}, {"id": "geo18", "n": "Hreflang Geo-Targeting", "c": "ON-SITE", "w": 6}, {"id": "geo19", "n": "Local Citations NAP", "c": "OFF-PAGE", "w": 7}, {"id": "geo20", "n": "Google Business Profile", "c": "OFF-PAGE", "w": 8}, {"id": "geo21", "n": "Named Entity Density", "c": "ON-PAGE", "w": 8}, {"id": "geo22", "n": "Geo-Tagged Content", "c": "ON-PAGE", "w": 6}, {"id": "geo23", "n": "OpenGraph Completeness", "c": "ON-PAGE", "w": 7}, {"id": "geo24", "n": "Twitter Card Meta", "c": "ON-PAGE", "w": 6}, {"id": "geo25", "n": "proof.json IP Anchoring", "c": "ON-SITE", "w": 8}, {"id": "geo26", "n": "changelog.json Versioning", "c": "ON-SITE", "w": 6}, {"id": "geo27", "n": "Dataset Schema Corpus", "c": "ON-PAGE", "w": 7}, {"id": "geo28", "n": "External Entity Links Quality", "c": "OFF-PAGE", "w": 8}], "AIO": [{"id": "aio1", "n": "Topical Authority Depth", "c": "ON-PAGE", "w": 10}, {"id": "aio2", "n": "Semantic Keyword Clusters", "c": "ON-PAGE", "w": 9}, {"id": "aio3", "n": "Content Freshness Signal", "c": "ON-PAGE", "w": 8}, {"id": "aio4", "n": "E-E-A-T Score AI Perception", "c": "OFF-PAGE", "w": 10}, {"id": "aio5", "n": "Expertise Signals in Content", "c": "ON-PAGE", "w": 9}, {"id": "aio6", "n": "Fact Density vs Fluff Ratio", "c": "ON-PAGE", "w": 8}, {"id": "aio7", "n": "Source Citation Quality", "c": "ON-PAGE", "w": 8}, {"id": "aio8", "n": "AI Crawl Permission Explicit", "c": "ON-SITE", "w": 9}, {"id": "aio9", "n": "Content Indexability by LLMs", "c": "ON-SITE", "w": 9}, {"id": "aio10", "n": "Perplexity Source Citation", "c": "OFF-PAGE", "w": 8}, {"id": "aio11", "n": "ChatGPT Browse Visibility", "c": "OFF-PAGE", "w": 10}, {"id": "aio12", "n": "Gemini Grounding Eligibility", "c": "OFF-PAGE", "w": 9}, {"id": "aio13", "n": "Claude Source Indexing", "c": "OFF-PAGE", "w": 9}, {"id": "aio14", "n": "Corpus Inclusion Signal", "c": "ON-SITE", "w": 8}, {"id": "aio15", "n": "Unique Data / Proprietary Stats", "c": "ON-PAGE", "w": 10}, {"id": "aio16", "n": "Definition Ownership", "c": "ON-PAGE", "w": 9}, {"id": "aio17", "n": "Thought Leadership Signal", "c": "ON-PAGE", "w": 8}, {"id": "aio18", "n": "Long-Form Completeness", "c": "ON-PAGE", "w": 7}, {"id": "aio19", "n": "Internal Link Semantic Map", "c": "ON-SITE", "w": 7}, {"id": "aio20", "n": "Concept Cluster Coverage", "c": "ON-PAGE", "w": 8}, {"id": "aio21", "n": "Contrastive Analysis Presence", "c": "ON-PAGE", "w": 7}, {"id": "aio22", "n": "RAG-Ready Content Format", "c": "ON-PAGE", "w": 9}, {"id": "aio23", "n": "Dense Paragraph Summaries", "c": "ON-PAGE", "w": 8}, {"id": "aio24", "n": "Table / List Extractability", "c": "ON-PAGE", "w": 7}, {"id": "aio25", "n": "Chronological Versioning", "c": "ON-SITE", "w": 6}, {"id": "aio26", "n": "AI Summary Block", "c": "ON-PAGE", "w": 8}, {"id": "aio27", "n": "Token-Efficient Headings", "c": "ON-PAGE", "w": 7}, {"id": "aio28", "n": "Inference Trigger Keywords", "c": "ON-PAGE", "w": 8}, {"id": "aio29", "n": "Contradiction Avoidance", "c": "ON-PAGE", "w": 7}, {"id": "aio30", "n": "LLM-Readable Metadata", "c": "ON-SITE", "w": 8}, {"id": "aio31", "n": "Allow-Lane Matrix", "c": "ON-SITE", "w": 7}], "SEO": [{"id": "seo1", "n": "Title Tag Optimization", "c": "ON-PAGE", "w": 10}, {"id": "seo2", "n": "Meta Description Quality", "c": "ON-PAGE", "w": 8}, {"id": "seo3", "n": "H1–H6 Hierarchy", "c": "ON-PAGE", "w": 9}, {"id": "seo4", "n": "Keyword Density Primary", "c": "ON-PAGE", "w": 8}, {"id": "seo5", "n": "LSI Keyword Coverage", "c": "ON-PAGE", "w": 7}, {"id": "seo6", "n": "URL Slug Structure", "c": "ON-SITE", "w": 7}, {"id": "seo7", "n": "Image Alt Tags", "c": "ON-PAGE", "w": 7}, {"id": "seo8", "n": "Internal Link Architecture", "c": "ON-SITE", "w": 9}, {"id": "seo9", "n": "XML Sitemap Quality", "c": "ON-SITE", "w": 8}, {"id": "seo10", "n": "Core Web Vitals Composite", "c": "ON-SITE", "w": 10}, {"id": "seo11", "n": "Mobile Responsiveness", "c": "ON-SITE", "w": 10}, {"id": "seo12", "n": "HTTPS / SSL", "c": "ON-SITE", "w": 9}, {"id": "seo13", "n": "Backlink Authority DA", "c": "OFF-PAGE", "w": 10}, {"id": "seo14", "n": "Backlink Diversity", "c": "OFF-PAGE", "w": 8}, {"id": "seo15", "n": "Referring Domains Count", "c": "OFF-PAGE", "w": 8}, {"id": "seo16", "n": "Anchor Text Distribution", "c": "OFF-PAGE", "w": 7}, {"id": "seo17", "n": "Brand Mention Velocity", "c": "OFF-PAGE", "w": 8}, {"id": "seo18", "n": "Duplicate Content Check", "c": "ON-PAGE", "w": 9}, {"id": "seo19", "n": "Canonical Tags", "c": "ON-SITE", "w": 8}, {"id": "seo20", "n": "Structured Data Errors", "c": "ON-PAGE", "w": 9}, {"id": "seo21", "n": "Crawl Budget Efficiency", "c": "ON-SITE", "w": 7}, {"id": "seo22", "n": "404 / Broken Links", "c": "ON-SITE", "w": 8}, {"id": "seo23", "n": "Redirect Chain Length", "c": "ON-SITE", "w": 7}, {"id": "seo24", "n": "Content Word Count", "c": "ON-PAGE", "w": 7}, {"id": "seo25", "n": "Outbound Link Quality", "c": "ON-PAGE", "w": 6}, {"id": "seo26", "n": "Social Signals", "c": "OFF-PAGE", "w": 6}, {"id": "seo27", "n": "Bounce Rate Engagement", "c": "ON-SITE", "w": 7}, {"id": "seo28", "n": "Dwell Time Estimation", "c": "ON-SITE", "w": 7}, {"id": "seo29", "n": "Click-Through Rate Organic", "c": "OFF-PAGE", "w": 8}, {"id": "seo30", "n": "Search Console Coverage", "c": "OFF-PAGE", "w": 8}, {"id": "seo31", "n": "Index Coverage Report", "c": "OFF-PAGE", "w": 8}, {"id": "seo32", "n": "Core Web Vitals LCP", "c": "ON-SITE", "w": 9}, {"id": "seo33", "n": "Core Web Vitals CLS", "c": "ON-SITE", "w": 8}, {"id": "seo34", "n": "Core Web Vitals INP", "c": "ON-SITE", "w": 8}, {"id": "seo35", "n": "HTTPS Redirect Chain", "c": "ON-SITE", "w": 7}, {"id": "seo36", "n": "Hreflang Implementation", "c": "ON-SITE", "w": 6}, {"id": "seo37", "n": "Pagination Tags", "c": "ON-SITE", "w": 5}, {"id": "seo38", "n": "Schema Error Count", "c": "ON-PAGE", "w": 9}, {"id": "seo39", "n": "Toxic Backlink Ratio", "c": "OFF-PAGE", "w": 8}, {"id": "seo40", "n": "Domain Age & Authority", "c": "OFF-PAGE", "w": 7}, {"id": "seo41", "n": "Content Freshness Recency", "c": "ON-PAGE", "w": 7}, {"id": "seo42", "n": "Structured Header Flow", "c": "ON-PAGE", "w": 7}], "AI_SIGNALS": [{"id": "ai1", "n": "ClaudeBot Allow Directive", "c": "ON-SITE", "w": 10}, {"id": "ai2", "n": "GPTBot Allow Directive", "c": "ON-SITE", "w": 10}, {"id": "ai3", "n": "Google-Extended Allow", "c": "ON-SITE", "w": 9}, {"id": "ai4", "n": "PerplexityBot Allow", "c": "ON-SITE", "w": 9}, {"id": "ai5", "n": "Meta-AI Allow CCBot", "c": "ON-SITE", "w": 8}, {"id": "ai6", "n": "proof.json SHA-256 Anchoring", "c": "ON-SITE", "w": 10}, {"id": "ai7", "n": "Cryptographic IP Proof", "c": "ON-SITE", "w": 9}, {"id": "ai8", "n": "IPFS / Blockchain Registration", "c": "OFF-SITE", "w": 8}, {"id": "ai9", "n": "session.json State Declaration", "c": "ON-SITE", "w": 7}, {"id": "ai10", "n": "aliases.json Brand Variants", "c": "ON-SITE", "w": 7}, {"id": "ai11", "n": "policy.json AI Policy", "c": "ON-SITE", "w": 8}, {"id": "ai12", "n": "actions.json AI Use Cases", "c": "ON-SITE", "w": 7}, {"id": "ai13", "n": "Hallucination Prevention Layer", "c": "ON-SITE", "w": 9}, {"id": "ai14", "n": "Entity-Graph Completeness", "c": "ON-SITE", "w": 9}, {"id": "ai15", "n": "AI-Readable Content Density", "c": "ON-PAGE", "w": 8}, {"id": "ai16", "n": "Confidentiality Boundary Tags", "c": "ON-SITE", "w": 7}, {"id": "ai17", "n": "Training Data Consent Signal", "c": "ON-SITE", "w": 8}, {"id": "ai18", "n": "EU AI Act Compliance Tag", "c": "ON-SITE", "w": 9}, {"id": "ai19", "n": "AI Governance Statement", "c": "ON-SITE", "w": 8}, {"id": "ai20", "n": "allow-lane-matrix.json", "c": "ON-SITE", "w": 8}, {"id": "ai21", "n": "Gemini Grounding Verified", "c": "OFF-SITE", "w": 9}, {"id": "ai22", "n": "Perplexity Citation Score", "c": "OFF-SITE", "w": 8}, {"id": "ai23", "n": "AI Knowledge Graph Entry", "c": "OFF-SITE", "w": 9}, {"id": "ai24", "n": "LLM Embedding Proximity", "c": "OFF-SITE", "w": 8}, {"id": "ai25", "n": "Vectorial Brand Representation", "c": "OFF-SITE", "w": 7}, {"id": "ai26", "n": "AI Answer Layer Coverage", "c": "OFF-SITE", "w": 9}, {"id": "ai27", "n": "intents.json Schema v1.1+", "c": "ON-SITE", "w": 8}, {"id": "ai28", "n": "ai-proof.json Verification", "c": "ON-SITE", "w": 8}, {"id": "ai29", "n": "entity-index SSOT", "c": "ON-SITE", "w": 7}, {"id": "ai30", "n": "AI-Ready Score Declaration", "c": "ON-SITE", "w": 7}, {"id": "ai31", "n": "Zero-Hallucination Anchors", "c": "ON-SITE", "w": 8}, {"id": "ai32", "n": "Cross-AI Consistency Score", "c": "OFF-SITE", "w": 9}]};

/* ---------- normalizare URL ---------- */
function normalizeUrl(raw) {
  if (!raw) return null;
  let u = raw.trim();
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try { return new URL(u); } catch { return null; }
}

/* ---------- fetch cu timeout, nu arunca la eroare de rețea ---------- */
async function safeFetch(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { ...opts, signal: ctrl.signal, redirect: 'follow' });
    const text = await r.text();
    return { ok: r.ok, status: r.status, text, headers: r.headers };
  } catch (e) {
    return { ok: false, status: 0, text: '', error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

/* ---------- extrage toate blocurile JSON-LD si aplatizeaza @type ---------- */
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      blocks.push(parsed);
    } catch { /* json-ld invalid, ignorat */ }
  }
  const types = new Set();
  const nodes = [];
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node['@graph']) walk(node['@graph']);
    if (node['@type']) {
      const t = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      t.forEach(x => types.add(String(x)));
      nodes.push(node);
    }
    for (const k of Object.keys(node)) {
      if (k !== '@type' && typeof node[k] === 'object') walk(node[k]);
    }
  }
  blocks.forEach(walk);
  return { blocks, types, nodes };
}

function getNode(nodes, type) {
  return nodes.find(n => {
    const t = Array.isArray(n['@type']) ? n['@type'] : [n['@type']];
    return t.includes(type);
  });
}

function metaTag(html, attr, name) {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, 'i');
  const m = html.match(re) || html.match(re2);
  return m ? m[1] : null;
}

function tagsOf(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1].replace(/<[^>]+>/g, '').trim());
  return out;
}

/* ---------- culege toate dovezile despre site ---------- */
async function gatherEvidence(target) {
  const origin = target.origin;
  const [main, robots, sitemap, llms, aitxt] = await Promise.all([
    safeFetch(target.href),
    safeFetch(origin + '/robots.txt'),
    safeFetch(origin + '/sitemap.xml'),
    safeFetch(origin + '/llms.txt'),
    safeFetch(origin + '/ai.txt'),
  ]);

  const jsonFiles = {};
  const jsonNames = ['ai.json', 'entities.json', 'governance.json', 'intents.json',
    'authority.json', 'policy.json', 'ai-proof.json', '.well-known/agent-card.json',
    'llms-full.txt'];
  await Promise.all(jsonNames.map(async n => {
    const r = await safeFetch(origin + '/' + n);
    jsonFiles[n] = r.ok;
  }));

  const html = main.text || '';
  const ld = extractJsonLd(html);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const imgsWithAlt = imgs.filter(t => /alt=["'][^"']+["']/i.test(t)).length;
  const links = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
  const internalLinks = links.filter(h => h.startsWith('/') || h.includes(target.host)).length;
  const externalLinks = links.filter(h => /^https?:\/\//i.test(h) && !h.includes(target.host)).length;
  const wordCount = html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/).filter(Boolean).length;

  return {
    target, mainOk: main.ok, status: main.status, html,
    robots: robots.ok ? robots.text : null,
    sitemap: sitemap.ok, sitemapText: sitemap.ok ? sitemap.text : '',
    llms: llms.ok ? llms.text : null,
    aitxt: aitxt.ok ? aitxt.text : null,
    jsonFiles,
    ldTypes: ld.types, ldNodes: ld.nodes,
    langAttr: (html.match(/<html[^>]+lang=["']([^"']+)["']/i) || [])[1] || null,
    canonical: (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || [])[1] || null,
    viewport: !!html.match(/<meta[^>]+name=["']viewport["']/i),
    ogTitle: metaTag(html, 'property', 'og:title'),
    ogDesc: metaTag(html, 'property', 'og:description'),
    ogImage: metaTag(html, 'property', 'og:image'),
    twCard: metaTag(html, 'name', 'twitter:card'),
    metaDesc: metaTag(html, 'name', 'description'),
    title: (tagsOf(html, 'title')[0] || ''),
    h1: tagsOf(html, 'h1'),
    h2: tagsOf(html, 'h2'),
    hreflang: [...html.matchAll(/<link[^>]+hreflang=["']([^"']+)["']/gi)].length,
    semanticTags: ['header', 'nav', 'main', 'article', 'section', 'footer']
      .filter(t => new RegExp(`<${t}[\\s>]`, 'i').test(html)).length,
    breadcrumbNav: /aria-label=["']breadcrumb["']/i.test(html) || ld.types.has('BreadcrumbList'),
    faqBlocks: (html.match(/<dt[\s>]/gi) || []).length + (html.match(/\?\s*<\/(h[2-6]|dt|strong|b)>/gi) || []).length,
    imgTotal: imgs.length, imgWithAlt: imgsWithAlt,
    internalLinks, externalLinks, wordCount,
    https: target.protocol === 'https:',
    robotsBots: {
      gptbot: /GPTBot/i.test(robots.text || ''),
      claudebot: /ClaudeBot/i.test(robots.text || ''),
      googleExtended: /Google-Extended/i.test(robots.text || ''),
      perplexitybot: /PerplexityBot/i.test(robots.text || ''),
      ccbot: /CCBot/i.test(robots.text || ''),
      anyDisallowAll: /User-agent:\s*\*[\s\S]{0,40}Disallow:\s*\/\s*$/im.test(robots.text || ''),
    },
    sitemapInRobots: /Sitemap:/i.test(robots.text || ''),
  };
}

/* ---------- reguli de evaluare pe dovezi reale — cheie: keyword din numele semnalului ---------- */
const SCHEMA_KEYWORDS = [
  [/FAQ Schema/i, 'FAQPage'],
  [/HowTo Schema/i, 'HowTo'],
  [/Article Schema/i, 'Article'],
  [/Breadcrumb Schema/i, 'BreadcrumbList'],
  [/Product Schema/i, 'Product'],
  [/Review \/ Rating Schema/i, 'AggregateRating'],
  [/Video Schema/i, 'VideoObject'],
  [/Event Schema/i, 'Event'],
  [/Local Business Schema/i, 'LocalBusiness'],
  [/Person \/ Author Schema/i, 'Person'],
  [/ClaimReview Schema/i, 'ClaimReview'],
  [/Speakable Schema/i, 'SpeakableSpecification'],
  [/Organization Schema/i, 'Organization'],
];

function evalSignal(sig, ev) {
  const n = sig.n;

  for (const [re, type] of SCHEMA_KEYWORDS) {
    if (re.test(n)) return ev.ldTypes.has(type)
      ? { status: 'pass', score: 90, method: `JSON-LD @type="${type}" gasit` }
      : { status: 'fail', score: 20, method: `JSON-LD @type="${type}" lipseste` };
  }

  if (/llms\.txt/i.test(n)) return ev.llms
    ? { status: 'pass', score: 85, method: 'llms.txt raspunde 200, ' + ev.llms.length + ' caractere' }
    : { status: 'fail', score: 0, method: 'llms.txt lipseste' };

  if (/ai\.txt/i.test(n)) return ev.aitxt
    ? { status: 'pass', score: 80, method: 'ai.txt raspunde 200' }
    : { status: 'fail', score: 0, method: 'ai.txt lipseste' };

  if (/robots\.txt AI Crawler/i.test(n)) {
    const b = ev.robotsBots;
    const allowed = [b.gptbot, b.claudebot, b.googleExtended, b.perplexitybot, b.ccbot].filter(Boolean).length;
    if (b.anyDisallowAll) return { status: 'fail', score: 5, method: 'Disallow: / global gasit in robots.txt' };
    return { status: allowed >= 3 ? 'pass' : allowed > 0 ? 'partial' : 'fail',
      score: Math.round((allowed / 5) * 100), method: `${allowed}/5 crawlere AI explicit permise` };
  }

  if (/\.json/i.test(n)) {
    const fname = (n.match(/([\w.-]+\.json)/i) || [])[1];
    if (fname && fname in ev.jsonFiles) return ev.jsonFiles[fname]
      ? { status: 'pass', score: 85, method: `/${fname} raspunde 200` }
      : { status: 'fail', score: 0, method: `/${fname} lipseste` };
  }

  if (/agent[- ]?card|A2A/i.test(n)) return ev.jsonFiles['.well-known/agent-card.json']
    ? { status: 'pass', score: 85, method: '.well-known/agent-card.json prezent' }
    : { status: 'fail', score: 0, method: '.well-known/agent-card.json lipseste' };

  if (/sitemap/i.test(n)) return ev.sitemap
    ? { status: 'pass', score: 80, method: 'sitemap.xml raspunde 200' }
    : { status: 'fail', score: 10, method: 'sitemap.xml lipseste sau eroare' };

  if (/canonical/i.test(n)) return ev.canonical
    ? { status: 'pass', score: 85, method: `<link rel="canonical"> = ${ev.canonical}` }
    : { status: 'fail', score: 20, method: 'lipseste tag canonical' };

  if (/hreflang/i.test(n)) return ev.hreflang > 0
    ? { status: 'pass', score: 75, method: `${ev.hreflang} tag-uri hreflang gasite` }
    : { status: 'na', method: 'niciun hreflang — posibil site mono-limba, nu e neaparat un fail' };

  if (/Open\s?Graph/i.test(n)) {
    const c = [ev.ogTitle, ev.ogDesc, ev.ogImage].filter(Boolean).length;
    return { status: c === 3 ? 'pass' : c > 0 ? 'partial' : 'fail',
      score: Math.round((c / 3) * 100), method: `${c}/3 taguri OG (title/description/image)` };
  }

  if (/Twitter Card/i.test(n)) return ev.twCard
    ? { status: 'pass', score: 80, method: `twitter:card = ${ev.twCard}` }
    : { status: 'fail', score: 15, method: 'lipseste meta twitter:card' };

  if (/Alt (Text|Tag)/i.test(n) || /Image Alt/i.test(n)) {
    if (ev.imgTotal === 0) return { status: 'na', method: 'pagina nu are imagini' };
    const pct = ev.imgWithAlt / ev.imgTotal;
    return { status: pct > 0.8 ? 'pass' : pct > 0.3 ? 'partial' : 'fail',
      score: Math.round(pct * 100), method: `${ev.imgWithAlt}/${ev.imgTotal} imagini cu alt text` };
  }

  if (/Semantic HTML5/i.test(n)) return { status: ev.semanticTags >= 4 ? 'pass' : ev.semanticTags >= 2 ? 'partial' : 'fail',
    score: Math.round((ev.semanticTags / 6) * 100), method: `${ev.semanticTags}/6 tag-uri semantice (header/nav/main/article/section/footer)` };

  if (/Viewport|Mobile/i.test(n)) return ev.viewport
    ? { status: 'pass', score: 90, method: 'meta viewport prezent' }
    : { status: 'fail', score: 0, method: 'lipseste meta viewport — nu e mobile-ready' };

  if (/HTTPS|SSL/i.test(n)) return ev.https
    ? { status: 'pass', score: 100, method: 'site servit pe HTTPS' }
    : { status: 'fail', score: 0, method: 'site NU e pe HTTPS' };

  if (/Word Count|Content (Length|Depth)/i.test(n)) return { status: ev.wordCount >= 600 ? 'pass' : ev.wordCount >= 250 ? 'partial' : 'fail',
    score: Math.min(100, Math.round((ev.wordCount / 600) * 100)), method: `${ev.wordCount} cuvinte pe pagina principala` };

  if (/Internal Link/i.test(n)) return { status: ev.internalLinks >= 10 ? 'pass' : ev.internalLinks >= 3 ? 'partial' : 'fail',
    score: Math.min(100, ev.internalLinks * 8), method: `${ev.internalLinks} linkuri interne detectate` };

  if (/External Link/i.test(n)) return { status: ev.externalLinks >= 3 ? 'pass' : ev.externalLinks >= 1 ? 'partial' : 'fail',
    score: Math.min(100, ev.externalLinks * 20), method: `${ev.externalLinks} linkuri externe detectate` };

  if (/Breadcrumb/i.test(n) && !/Schema/i.test(n)) return ev.breadcrumbNav
    ? { status: 'pass', score: 80, method: 'nav breadcrumb detectat in HTML' }
    : { status: 'fail', score: 20, method: 'nicio structura breadcrumb detectata' };

  if (/FAQ Coverage|Q&A Format|PAA Coverage/i.test(n)) return { status: ev.faqBlocks >= 3 ? 'pass' : ev.faqBlocks >= 1 ? 'partial' : 'fail',
    score: Math.min(100, ev.faqBlocks * 15), method: `${ev.faqBlocks} blocuri tip Q&A detectate` };

  if (/H1|Heading|NLP-Friendly Headings/i.test(n)) return { status: ev.h1.length === 1 ? 'pass' : ev.h1.length === 0 ? 'fail' : 'partial',
    score: ev.h1.length === 1 ? 90 : ev.h1.length === 0 ? 0 : 50, method: `${ev.h1.length} tag-uri H1 pe pagina (ideal: 1)` };

  if (/Title Tag|Meta Description/i.test(n)) {
    const okT = ev.title && ev.title.length >= 15 && ev.title.length <= 65;
    const okD = ev.metaDesc && ev.metaDesc.length >= 50 && ev.metaDesc.length <= 165;
    return { status: okT && okD ? 'pass' : (okT || okD) ? 'partial' : 'fail',
      score: (okT ? 50 : 0) + (okD ? 50 : 0), method: `title=${ev.title.length}c, meta description=${ev.metaDesc ? ev.metaDesc.length : 0}c` };
  }

  if (/Language Declaration|Lang Attribute/i.test(n)) return ev.langAttr
    ? { status: 'pass', score: 90, method: `<html lang="${ev.langAttr}">` }
    : { status: 'fail', score: 10, method: 'lipseste atributul lang pe <html>' };

  if (/sameAs/i.test(n)) {
    const org = getNode(ev.ldNodes, 'Organization') || getNode(ev.ldNodes, 'Person');
    const cnt = org && Array.isArray(org.sameAs) ? org.sameAs.length : 0;
    return { status: cnt >= 3 ? 'pass' : cnt > 0 ? 'partial' : 'fail',
      score: Math.min(100, cnt * 25), method: `${cnt} referinte sameAs in Organization schema` };
  }

  /* semnale care cer date externe platite (backlinks, PageSpeed, Wikidata verificat,
     Crunchbase, LinkedIn, presa, NAP local, Google Business, Core Web Vitals) —
     onest marcate NA, niciodata FAIL sau scor inventat */
  return { status: 'na', method: 'necesita sursa externa (API platit) neconectata in acest deploy' };
}

function evaluate(ev) {
  const scores = {};
  const signals = {};
  let totalTested = 0, totalNa = 0;

  for (const dim of Object.keys(SIG)) {
    signals[dim] = [];
    let sum = 0, count = 0;
    for (const sig of SIG[dim]) {
      const r = evalSignal(sig, ev);
      signals[dim].push({ id: sig.id, n: sig.n, c: sig.c, w: sig.w, status: r.status, score: r.score ?? null, method: r.method });
      if (r.status !== 'na') { sum += r.score; count++; totalTested++; } else { totalNa++; }
    }
    scores[dim] = count ? Math.round(sum / count) : null;
  }

  const validDims = Object.values(scores).filter(v => v !== null);
  const global = validDims.length ? Math.round(validDims.reduce((a, b) => a + b, 0) / validDims.length) : 0;

  return { scores, signals, global, tested: totalTested, na: totalNa, totalSignals: totalTested + totalNa };
}

function buildActionPlan(report) {
  const allFails = [];
  for (const dim of Object.keys(report.signals)) {
    report.signals[dim].filter(s => s.status === 'fail').forEach(s => allFails.push({ dim, ...s }));
  }
  allFails.sort((a, b) => b.w - a.w);
  const top = allFails.slice(0, 9);
  const chunk = (arr, n) => arr.slice(n * 3, n * 3 + 3);
  return {
    critical: { title: 'Repara imediat', items: chunk(top, 0).map(s => s.n), impact: 'Cele mai grele FAIL-uri gasite, pondere mare', delta: '+ puncte in cateva zile' },
    important: { title: 'Urmatorul pas', items: chunk(top, 1).map(s => s.n), impact: 'FAIL-uri cu pondere medie', delta: '+ puncte in 30 zile' },
    optimize: { title: 'Optimizare fina', items: chunk(top, 2).map(s => s.n), impact: 'Ajustari fine', delta: '+ puncte in 90 zile' },
  };
}

async function fetchSynthesis(report, env) {
  if (!env.ANTHROPIC_API_KEY) return null;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 300,
        messages: [{ role: 'user', content: `URL:${report.url} scor global:${report.global}/100. Scoruri: ${JSON.stringify(report.scores)}. Testate real:${report.tested}, NA:${report.na}. Scrie 3 propozitii, ton editorial, declarativ, fara clisee, in engleza.` }]
      })
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j.content?.[0]?.text || null;
  } catch { return null; }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname === '/audit' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(body.url);
      if (!target) return json({ error: 'invalid url' }, 400);

      const ev = await gatherEvidence(target);
      if (!ev.mainOk) return json({ error: 'unreachable', detail: `nu am putut accesa ${target.href}`, status: ev.status }, 200);

      const evalResult = evaluate(ev);
      const report = { url: target.href, ...evalResult };
      report.plan = buildActionPlan(report);

      if (env.RATE_KV) {
        try {
          const n = Number(await env.RATE_KV.get('audit_count') || 0) + 1;
          await env.RATE_KV.put('audit_count', String(n));
        } catch {}
      }
      return json(report);
    }

    if (url.pathname === '/synth' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const synth = await fetchSynthesis(body.report || {}, env);
      return json({ synthesis: synth, available: !!synth });
    }

    if (url.pathname === '/lead' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      if (!body.email) return json({ error: 'email required' }, 400);
      if (env.RATE_KV) {
        try { await env.RATE_KV.put(`lead:${Date.now()}:${body.email}`, JSON.stringify({ email: body.email, url: body.url || '', ts: new Date().toISOString() })); } catch {}
      }
      return json({ ok: true });
    }

    if (url.pathname === '/stats') {
      let count = 0;
      if (env.RATE_KV) { try { count = Number(await env.RATE_KV.get('audit_count') || 0); } catch {} }
      return json({ audits: count, version: '3.0', engine: 'evidence-based', signals: 167, brand: '3webs', network: '5thElement.ai', a2a: '/a2a', agent_card: '/.well-known/agent-card.json' });
    }


    /* ═══════════ A2A v1.0 — JSON-RPC 2.0 endpoint ═══════════
       Skills: obs_one_shot · obs_permanent · obs_diff · obs_explain · obs_catalogue */
    if (url.pathname === '/a2a' && request.method === 'POST') {
      let rpc;
      try { rpc = await request.json(); }
      catch { return json({ jsonrpc: '2.0', id: null,
        error: { code: -32700, message: 'Parse error' } }, 200); }

      const id = rpc.id ?? null;
      const rpcErr = (code, message, data) => json({ jsonrpc: '2.0', id,
        error: data ? { code, message, data } : { code, message } }, 200);

      if (rpc.jsonrpc !== '2.0') return rpcErr(-32600, 'Invalid Request: jsonrpc must be "2.0"');
      if (rpc.method !== 'message/send') return rpcErr(-32601, 'Method not found: only message/send is supported');

      const msg = rpc.params && rpc.params.message;
      const parts = (msg && msg.parts) || [];
      const dataPart = parts.find(p => p.kind === 'data' || p.type === 'data');
      const textPart = parts.find(p => p.kind === 'text' || p.type === 'text');
      const payload = (dataPart && (dataPart.data || dataPart.payload)) || {};
      const skill = payload.skill || (rpc.params && rpc.params.skill) || 'obs_one_shot';

      const reply = (obj) => json({
        jsonrpc: '2.0', id,
        result: {
          kind: 'message', role: 'agent',
          messageId: crypto.randomUUID(),
          parts: [{ kind: 'data', data: obj }]
        }
      });

      /* ── obs_catalogue ── */
      if (skill === 'obs_catalogue') {
        const cat = {};
        for (const dim of Object.keys(SIG)) {
          cat[dim] = SIG[dim].map(s => ({ id: s.id, name: s.n, category: s.c, weight: s.w }));
        }
        return reply({
          skill: 'obs_catalogue',
          total: Object.values(SIG).reduce((a, b) => a + b.length, 0),
          webs: {
            human_web: { dimensions: ['SEO'], question: 'What does a person see?' },
            ai_web: { dimensions: ['AEO', 'GEO', 'AIO'], question: 'What does an answer engine see?' },
            machine_web: { dimensions: ['AI_SIGNALS'], question: 'What does an agent see?' }
          },
          catalogue: cat
        });
      }

      /* ── obs_one_shot ── */
      if (skill === 'obs_one_shot') {
        const raw = payload.url || (textPart && textPart.text) || '';
        const target = normalizeUrl(String(raw).trim());
        if (!target) return rpcErr(-32602, 'Invalid params: a valid url is required');

        const ev = await gatherEvidence(target);
        if (!ev.mainOk) return reply({ skill: 'obs_one_shot', url: target.href,
          status: 'unreachable', detail: 'could not fetch ' + target.href });

        const r = evaluate(ev);
        const report = { url: target.href, ...r };
        report.plan = buildActionPlan(report);

        const byWeb = {
          human_web: report.scores.SEO,
          ai_web: (() => {
            const v = ['AEO', 'GEO', 'AIO'].map(k => report.scores[k]).filter(x => x !== null);
            return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
          })(),
          machine_web: report.scores.AI_SIGNALS
        };

        if (env.RATE_KV) {
          try {
            const n = Number(await env.RATE_KV.get('audit_count') || 0) + 1;
            await env.RATE_KV.put('audit_count', String(n));
          } catch {}
        }
        return reply({ skill: 'obs_one_shot', mode: 'one-shot',
          observationId: 'obs_' + Date.now().toString(36),
          url: report.url, global: report.global,
          three_webs: byWeb, dimensions: report.scores,
          tested: report.tested, not_applicable: report.na,
          signals: report.signals, plan: report.plan,
          determinism: 'rule-based; no score generated by a language model' });
      }

      /* ── obs_permanent ── */
      if (skill === 'obs_permanent') {
        const target = normalizeUrl(String(payload.url || '').trim());
        if (!target) return rpcErr(-32602, 'Invalid params: a valid url is required');
        const interval = payload.interval || 'weekly';
        if (!['daily', 'weekly', 'monthly'].includes(interval))
          return rpcErr(-32602, 'Invalid params: interval must be daily, weekly or monthly');
        const notify = payload.notify || null;
        if (!notify) return rpcErr(-32602, 'Invalid params: notify (callback url or email) is required');

        const subId = 'perm_' + crypto.randomUUID();
        const sub = { id: subId, url: target.href, interval, notify,
          threshold: payload.threshold ?? 3, status: 'registered',
          registeredAt: new Date().toISOString() };

        if (env.RATE_KV) {
          try { await env.RATE_KV.put('sub:' + subId, JSON.stringify(sub)); } catch {}
        }
        return reply({ skill: 'obs_permanent', mode: 'permanent',
          subscriptionId: subId, url: sub.url, interval, notify,
          threshold: sub.threshold, status: 'registered',
          note: 'Scheduled re-observation requires a Cron Trigger to be configured on this Worker. Until then the subscription is recorded but not yet executing.',
          cancel: { method: 'POST', path: '/a2a', skill: 'obs_permanent', action: 'cancel', subscriptionId: subId } });
      }

      /* ── obs_explain ── */
      if (skill === 'obs_explain') {
        const target = normalizeUrl(String(payload.url || '').trim());
        const sigId = payload.signal_id || payload.signalId;
        if (!target || !sigId) return rpcErr(-32602, 'Invalid params: url and signal_id are required');

        let found = null, dim = null;
        for (const d of Object.keys(SIG)) {
          const s = SIG[d].find(x => x.id === sigId);
          if (s) { found = s; dim = d; break; }
        }
        if (!found) return rpcErr(-32602, 'Invalid params: unknown signal_id ' + sigId);

        const ev = await gatherEvidence(target);
        if (!ev.mainOk) return reply({ skill: 'obs_explain', url: target.href, status: 'unreachable' });
        const v = evalSignal(found, ev);
        return reply({ skill: 'obs_explain', url: target.href,
          signal: { id: found.id, name: found.n, dimension: dim, category: found.c, weight: found.w },
          verdict: v.status, score: v.score ?? null, evidence: v.method });
      }

      /* ── obs_diff ── */
      if (skill === 'obs_diff') {
        const target = normalizeUrl(String(payload.url || '').trim());
        const baseline = payload.baseline_id || payload.baselineId;
        if (!target || !baseline) return rpcErr(-32602, 'Invalid params: url and baseline_id are required');
        let stored = null;
        if (env.RATE_KV) {
          try { stored = await env.RATE_KV.get('obs:' + baseline); } catch {}
        }
        if (!stored) return reply({ skill: 'obs_diff', status: 'baseline_not_found',
          detail: 'No stored observation with id ' + baseline + '. Run obs_one_shot first and retain its observationId.' });
        const before = JSON.parse(stored);
        const ev = await gatherEvidence(target);
        if (!ev.mainOk) return reply({ skill: 'obs_diff', status: 'unreachable' });
        const after = evaluate(ev);
        const changed = [];
        for (const d of Object.keys(after.signals)) {
          after.signals[d].forEach((s, i) => {
            const b = before.signals?.[d]?.[i];
            if (b && b.status !== s.status) changed.push({ dimension: d, id: s.id, name: s.n,
              from: b.status, to: s.status, evidence: s.method });
          });
        }
        return reply({ skill: 'obs_diff', url: target.href,
          baseline_id: baseline, global_before: before.global, global_after: after.global,
          delta: after.global - before.global, changed_signals: changed });
      }

      return rpcErr(-32601, 'Unknown skill: ' + skill,
        { supported: ['obs_one_shot', 'obs_permanent', 'obs_diff', 'obs_explain', 'obs_catalogue'] });
    }

    /* GET /a2a → serves the agent card, for discovery */
    if (url.pathname === '/a2a' && request.method === 'GET') {
      return Response.redirect(url.origin + '/.well-known/agent-card.json', 302);
    }

    /* /signals → the catalogue, plain REST */
    if (url.pathname === '/signals' && request.method === 'GET') {
      const cat = {};
      for (const dim of Object.keys(SIG)) {
        cat[dim] = SIG[dim].map(s => ({ id: s.id, name: s.n, category: s.c, weight: s.w }));
      }
      return json({ total: Object.values(SIG).reduce((a, b) => a + b.length, 0), catalogue: cat });
    }

    /* /observe → permanent observation, plain REST */
    if (url.pathname === '/observe' && request.method === 'POST') {
      let body; try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const target = normalizeUrl(body.url);
      if (!target) return json({ error: 'invalid url' }, 400);
      const interval = body.interval || 'weekly';
      if (!['daily','weekly','monthly'].includes(interval))
        return json({ error: 'interval must be daily, weekly or monthly' }, 400);
      if (!body.notify) return json({ error: 'notify (callback url or email) is required' }, 400);
      const subId = 'perm_' + crypto.randomUUID();
      const sub = { id: subId, url: target.href, interval, notify: body.notify,
        threshold: body.threshold ?? 3, status: 'registered', registeredAt: new Date().toISOString() };
      if (env.RATE_KV) { try { await env.RATE_KV.put('sub:' + subId, JSON.stringify(sub)); } catch {} }
      return json(sub);
    }

    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('3webs OBS engine — 3webobs.com', { headers: CORS });
  }
};
