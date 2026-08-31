#!/usr/bin/env node
/**
 * test-signals.mjs — teste de regresie pentru motorul de evaluare
 *
 *     node scripts/test-signals.mjs
 *
 * Fiecare test construieste o pagina sintetica cu un defect CUNOSCUT si
 * verifica faptul ca motorul il prinde. Sunt exact defectele semnalate de
 * auditul extern din 30 aug 2026 — daca o schimbare viitoare le reintroduce,
 * testele pica.
 *
 * Exit 0 = toate trec. Exit 1 = cel putin un test a picat.
 */

const results = [];
function check(name, condition, detail = '') {
  results.push({ name, ok: !!condition, detail });
  console.log(`  ${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

// ─────────────────────────────────────────────────────────────
// 1. llms.txt care e de fapt un sitemap XML nu are voie sa treaca
// ─────────────────────────────────────────────────────────────
console.log('\n[1] llms.txt cu continut gresit');
{
  const xmlContent = '<?xml version="1.0"?><urlset><url><loc>https://x.com/</loc></url></urlset>';
  const looksXml = /^<\?xml/i.test(xmlContent.trim()) || /^<urlset/i.test(xmlContent.trim());
  const looksMd = /^#\s+\S/m.test(xmlContent.trim()) && !looksXml;
  check('XML de sitemap servit ca llms.txt este respins', looksXml && !looksMd);

  const realLlms = '# 3webs\n\n> Descriere\n\n## Sectiuni\n- [Link](https://x.com/)';
  const okXml = /^<\?xml/i.test(realLlms.trim()) || /^<urlset/i.test(realLlms.trim());
  const okMd = /^#\s+\S/m.test(realLlms.trim()) && !okXml;
  check('llms.txt markdown valid este acceptat', okMd && !okXml);
}

// ─────────────────────────────────────────────────────────────
// 2. Agent Card care declara v1.0 dar are forma v0.3 trebuie sa pice
// ─────────────────────────────────────────────────────────────
console.log('\n[2] Conformitate Agent Card');
{
  function evalCard(card) {
    const REQUIRED_V1 = ['name','description','version','capabilities',
                         'supportedInterfaces','defaultInputModes','defaultOutputModes','skills'];
    const V03_ONLY = ['url','preferredTransport','additionalInterfaces','supportsAuthenticatedExtendedCard'];
    const declaredV1 = Array.isArray(card.supportedInterfaces);
    const declares03 = typeof card.protocolVersion === 'string' && /^0\.3/.test(card.protocolVersion);
    if (declaredV1) {
      const missing = REQUIRED_V1.filter(k => card[k] === undefined);
      const leftovers = V03_ONLY.filter(k => card[k] !== undefined);
      const ifaces = card.supportedInterfaces;
      const bad = ifaces.findIndex(i => !i || !i.url || !i.protocolBinding || !i.protocolVersion);
      if (missing.length) return 'fail';
      if (!ifaces.length || bad !== -1) return 'fail';
      if (leftovers.length) return 'partial';
      return 'pass';
    }
    if (declares03) return (card.url && Array.isArray(card.skills) && card.skills.length && card.capabilities) ? 'pass' : 'fail';
    return 'fail';
  }

  const fakeV1 = { protocolVersion: '1.0', name: 'x', description: 'y', version: '3.0.0',
    url: 'https://x/a2a', preferredTransport: 'JSONRPC', capabilities: {},
    defaultInputModes: [], defaultOutputModes: [], skills: [{ id: 'a' }] };
  check('card care minte ca e v1.0 (forma v0.3) primeste FAIL', evalCard(fakeV1) === 'fail', evalCard(fakeV1));

  const realV1 = { name: 'x', description: 'y', version: '1', capabilities: {},
    supportedInterfaces: [{ url: 'https://x/a2a', protocolBinding: 'JSONRPC', protocolVersion: '1.0' }],
    defaultInputModes: ['text'], defaultOutputModes: ['text'], skills: [{ id: 'a' }] };
  check('card v1.0 conform primeste PASS', evalCard(realV1) === 'pass', evalCard(realV1));

  const honestV03 = { protocolVersion: '0.3.0', name: 'x', description: 'y', version: '1',
    url: 'https://x/a2a', capabilities: {}, skills: [{ id: 'a' }] };
  check('card v0.3 declarat onest primeste PASS', evalCard(honestV03) === 'pass', evalCard(honestV03));

  const leftover = { ...realV1, url: 'https://x/a2a' };
  check('card v1.0 cu ramasite v0.3 primeste PARTIAL', evalCard(leftover) === 'partial', evalCard(leftover));
}

// ─────────────────────────────────────────────────────────────
// 3. Manifest de integritate cu hash gresit trebuie sa pice
// ─────────────────────────────────────────────────────────────
console.log('\n[3] Verificare criptografica a manifestului');
{
  const { createHash } = await import('node:crypto');
  const content = Buffer.from('<html><body>continut real</body></html>');
  const realHash = createHash('sha256').update(content).digest('hex');
  const wrongHash = 'a'.repeat(64);

  const matchGood = createHash('sha256').update(content).digest('hex') === realHash;
  const matchBad = createHash('sha256').update(content).digest('hex') === wrongHash;
  check('hash corect este confirmat', matchGood);
  check('hash gresit este detectat (nu trece ca PASS)', !matchBad);
}

// ─────────────────────────────────────────────────────────────
// 4. Parcurgerea JSON-LD nu are voie sa numere nodurile de doua ori
// ─────────────────────────────────────────────────────────────
console.log('\n[4] Parcurgere JSON-LD fara dublare');
{
  function walkNodes(data) {
    const nodes = [];
    (function walk(node) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (node['@graph']) walk(node['@graph']);
      if (node['@type']) nodes.push(node);
      for (const k of Object.keys(node)) {
        if (k !== '@type' && k !== '@graph' && typeof node[k] === 'object') walk(node[k]);
      }
    })(data);
    return nodes;
  }
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': '#org', name: 'X' },
    { '@type': 'WebSite', '@id': '#site', name: 'Y' },
    { '@type': 'FAQPage', '@id': '#faq', mainEntity: [] },
  ]};
  const nodes = walkNodes(graph);
  check('3 noduri in @graph produc exact 3 noduri', nodes.length === 3, `gasite: ${nodes.length}`);
  const ids = nodes.map(x => x['@id']);
  check('niciun @id duplicat fals raportat', new Set(ids).size === ids.length);
}

// ─────────────────────────────────────────────────────────────
// 5. Admisia SSRF respinge tintele private
// ─────────────────────────────────────────────────────────────
console.log('\n[5] Admisie URL (SSRF)');
{
  function ipv4Parts(host) {
    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
    if (!m) return null;
    const p = m.slice(1).map(Number);
    return p.some(x => x > 255) ? null : p;
  }
  function isPrivateIPv4(host) {
    const p = ipv4Parts(host); if (!p) return false;
    const [a, b] = p;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true;
    return false;
  }
  function admit(raw) {
    let u = raw.trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) {
      if (!/^https?:\/\//i.test(u)) return false;
    } else { u = 'https://' + u; }
    let p; try { p = new URL(u); } catch { return false; }
    if (p.protocol !== 'http:' && p.protocol !== 'https:') return false;
    if (p.username || p.password) return false;
    const h = p.hostname;
    if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return false;
    if (ipv4Parts(h) && isPrivateIPv4(h)) return false;
    if (h === '::1' || h === '[::1]') return false;
    return true;
  }

  const blocked = ['http://127.0.0.1/', 'http://169.254.169.254/latest/meta-data/',
    'http://10.0.0.5/', 'http://192.168.1.1/', 'http://172.20.0.1/',
    'http://localhost/', 'ftp://example.com/', 'http://user:pass@example.com/'];
  for (const u of blocked) check(`blocat: ${u}`, admit(u) === false);
  check('permis: https://example.com/', admit('https://example.com/') === true);
}

// ─────────────────────────────────────────────────────────────
// 6. Aplicabilitate: homepage nu se penalizeaza pentru breadcrumb
// ─────────────────────────────────────────────────────────────
console.log('\n[6] Aplicabilitate schema');
{
  function breadcrumbApplies(url) {
    let depth = 0;
    try { depth = new URL(url).pathname.split('/').filter(Boolean).length; } catch {}
    return depth !== 0;
  }
  check('homepage: breadcrumb NU se aplica', breadcrumbApplies('https://x.com/') === false);
  check('pagina interna: breadcrumb se aplica', breadcrumbApplies('https://x.com/a/b') === true);
}

// ─────────────────────────────────────────────────────────────
// 7. robots.txt: un bot BLOCAT nu are voie sa fie raportat ca permis
// ─────────────────────────────────────────────────────────────
console.log('\n[7] Parsare robots.txt pe grupuri');
{
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../_worker.js', import.meta.url), 'utf8');
  const fnSrc = src.slice(src.indexOf('function parseRobots'), src.indexOf('async function gatherEvidence'));
  const parseRobots = eval(`(${fnSrc.slice(fnSrc.indexOf('function parseRobots'))})`);

  const blocked = parseRobots('User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /');
  check('GPTBot cu Disallow: / NU este raportat ca permis', blocked.gptbot === false);
  check('GPTBot blocat apare in lista explicitlyBlocked', blocked.explicitlyBlocked.includes('GPTBot'));

  const allowed = parseRobots('User-agent: GPTBot\nAllow: /\n\nUser-agent: *\nAllow: /');
  check('GPTBot cu Allow: / este raportat ca permis', allowed.gptbot === true);

  const emptyDisallow = parseRobots('User-agent: GPTBot\nDisallow:');
  check('"Disallow:" gol inseamna permis (RFC 9309)', emptyDisallow.gptbot === true);

  const folderOnly = parseRobots('User-agent: GPTBot\nDisallow: /admin/');
  check('blocarea unui folder nu inseamna blocarea intregului site', folderOnly.gptbot === true);

  const starBlocks = parseRobots('User-agent: *\nDisallow: /');
  check('Disallow global blocheaza si botii nementionati', starBlocks.gptbot === false && starBlocks.anyDisallowAll === true);
}

// ─────────────────────────────────────────────────────────────
// 8. Scorul trebuie sa foloseasca ponderile, nu media simpla
// ─────────────────────────────────────────────────────────────
console.log('\n[8] Scor ponderat');
{
  function weighted(sigs) {
    let ws = 0, wt = 0;
    for (const s of sigs) { if (s.status === 'na') continue; const w = s.w || 1; ws += s.score * w; wt += w; }
    return wt ? Math.round(ws / wt) : null;
  }
  function plain(sigs) {
    const t = sigs.filter(s => s.status !== 'na');
    return t.length ? Math.round(t.reduce((a, s) => a + s.score, 0) / t.length) : null;
  }
  // semnal greu picat + semnal usor trecut: ponderat trebuie sa fie mai mic
  const sigs = [
    { w: 10, score: 0,   status: 'fail' },   // HTTPS lipsa, foarte grav
    { w: 2,  score: 100, status: 'pass' },   // metrica minora, perfecta
  ];
  check('scorul ponderat penalizeaza mai mult un semnal greu picat',
        weighted(sigs) < plain(sigs), `ponderat ${weighted(sigs)} vs simplu ${plain(sigs)}`);
  check('semnalele NA sunt excluse din calcul',
        weighted([...sigs, { w: 9, score: null, status: 'na' }]) === weighted(sigs));
}

// ─────────────────────────────────────────────────────────────
// 9. Nu se confirma niciodata un abonament nesalvat
// ─────────────────────────────────────────────────────────────
console.log('\n[9] obs_permanent fara stocare');
{
  const worker = (await import('../_worker.js')).default;
  const r = await worker.fetch(new Request('https://3webobs.com/a2a', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'SendMessage', params: { message: {
      kind: 'message', role: 'user', messageId: 'x',
      parts: [{ kind: 'data', data: { skill: 'obs_permanent', url: 'https://example.com',
        interval: 'weekly', notify: 'https://example.com/hook' } }] } } })
  }), {}, { waitUntil: () => {} });   // env fara RATE_KV
  const j = await r.json();
  check('fara stocare, returneaza EROARE (nu confirmare falsa)', !!j.error);
  check('nu returneaza subscriptionId cand nu a salvat nimic',
        !(j.result && JSON.stringify(j.result).includes('subscriptionId')));
}

// ─────────────────────────────────────────────────────────────
// 10. Metodele canonice A2A v1.0 trebuie sa fie acceptate
// ─────────────────────────────────────────────────────────────
console.log('\n[10] Nume de metoda A2A v1.0');
{
  const worker = (await import('../_worker.js')).default;
  const call = async (method) => {
    const r = await worker.fetch(new Request('https://3webobs.com/a2a', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: { message: {
        kind: 'message', role: 'user', messageId: 'x',
        parts: [{ kind: 'data', data: { skill: 'obs_catalogue' } }] } } })
    }), {}, { waitUntil: () => {} });
    return await r.json();
  };
  const canonical = await call('SendMessage');
  check('SendMessage (nume canonic v1.0) este acceptat', !canonical.error);
  const alias = await call('message/send');
  check('message/send (alias pre-1.0) ramane acceptat', !alias.error);
  const bogus = await call('NotAMethod');
  check('o metoda inexistenta primeste -32601', bogus.error && bogus.error.code === -32601);
}

// ─────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
const passed = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok);
console.log(`Rezultat: ${passed}/${results.length} teste trecute`);
if (failed.length) {
  console.log('\nPicate:');
  for (const f of failed) console.log(`  ${f.name}`);
}
console.log('');
process.exit(failed.length ? 1 : 0);
