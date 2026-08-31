/* ===================================================================
   AIVENTURE GDPR CONSENT WORKER — shared across all sites
   One Worker, embedded via a single <script> tag on any site:

   <script src="https://gdpr.aiventure.ro/gdpr.js"
           data-site="ecbtax"
           data-lang="auto"
           data-accent="#0051a8"
           data-privacy-url="/gdpr.html"
           defer></script>

   Serves:
     GET  /gdpr.js       — the embeddable banner script (self-contained)
     POST /consent       — logs a consent decision (audit trail, no raw IP stored)
     GET  /consent/count — quick aggregate count per site (owner-only, no PII)
   =================================================================== */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
}

/* ---------- traduceri ---------- */
const I18N = {
  en: {
    title: 'We use cookies',
    body: 'This site uses cookies to work properly and, only with your consent, for analytics and marketing. You can accept all, decline non-essential cookies, or choose exactly what to allow.',
    acceptAll: 'Accept all',
    declineAll: 'Decline non-essential',
    customize: 'Customize',
    save: 'Save preferences',
    back: 'Back',
    necessary: 'Necessary',
    necessaryDesc: 'Required for the site to function. Cannot be disabled.',
    analytics: 'Analytics',
    analyticsDesc: 'Helps us understand how visitors use the site.',
    marketing: 'Marketing',
    marketingDesc: 'Used to show relevant ads and measure their performance.',
    alwaysOn: 'Always on',
    privacyLink: 'Privacy Policy',
  },
  fr: {
    title: 'Nous utilisons des cookies',
    body: "Ce site utilise des cookies pour fonctionner correctement et, uniquement avec votre consentement, à des fins d'analyse et de marketing. Vous pouvez tout accepter, refuser les cookies non essentiels, ou choisir précisément ce que vous autorisez.",
    acceptAll: 'Tout accepter',
    declineAll: 'Refuser le non-essentiel',
    customize: 'Personnaliser',
    save: 'Enregistrer les préférences',
    back: 'Retour',
    necessary: 'Nécessaires',
    necessaryDesc: 'Requis pour le fonctionnement du site. Ne peuvent pas être désactivés.',
    analytics: 'Analytique',
    analyticsDesc: 'Nous aide à comprendre comment les visiteurs utilisent le site.',
    marketing: 'Marketing',
    marketingDesc: 'Utilisé pour afficher des publicités pertinentes et mesurer leur performance.',
    alwaysOn: 'Toujours actif',
    privacyLink: 'Politique de confidentialité',
  },
  ro: {
    title: 'Folosim cookie-uri',
    body: 'Acest site folosește cookie-uri pentru a funcționa corect și, doar cu acordul tău, pentru analiză și marketing. Poți accepta tot, poți refuza cookie-urile neesențiale, sau poți alege exact ce permiți.',
    acceptAll: 'Accept tot',
    declineAll: 'Refuz neesențialele',
    customize: 'Personalizează',
    save: 'Salvează preferințele',
    back: 'Înapoi',
    necessary: 'Necesare',
    necessaryDesc: 'Necesare pentru funcționarea site-ului. Nu pot fi dezactivate.',
    analytics: 'Analitice',
    analyticsDesc: 'Ne ajută să înțelegem cum folosesc vizitatorii site-ul.',
    marketing: 'Marketing',
    marketingDesc: 'Folosit pentru reclame relevante și măsurarea performanței lor.',
    alwaysOn: 'Mereu activ',
    privacyLink: 'Politica de confidențialitate',
  },
};

/* ---------- scriptul embeddable, generat ca text ---------- */
function buildScript() {
  return `(function(){
  var CS = document.currentScript;
  if (!CS) return;
  var SITE = CS.getAttribute('data-site') || location.hostname;
  var ACCENT = CS.getAttribute('data-accent') || '#0051a8';
  var PRIVACY_URL = CS.getAttribute('data-privacy-url') || '/privacy';
  var LANG_ATTR = (CS.getAttribute('data-lang') || 'auto').toLowerCase();
  var WORKER_ORIGIN = new URL(CS.src, location.href).origin;
  var STORE_KEY = 'aiv_consent_' + SITE;

  var I18N = ${JSON.stringify(I18N)};
  function detectLang(){
    if (LANG_ATTR !== 'auto' && I18N[LANG_ATTR]) return LANG_ATTR;
    var htmlLang = (document.documentElement.lang || '').slice(0,2).toLowerCase();
    if (I18N[htmlLang]) return htmlLang;
    var nav = (navigator.language || 'en').slice(0,2).toLowerCase();
    return I18N[nav] ? nav : 'en';
  }
  var L = I18N[detectLang()];

  function readStored(){
    try { var v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : null; } catch(e){ return null; }
  }
  function writeStored(choice){
    try { localStorage.setItem(STORE_KEY, JSON.stringify(choice)); } catch(e){}
  }
  function applyConsent(choice){
    window.aivConsent = choice;
    try {
      window.dispatchEvent(new CustomEvent('aiv:consent', { detail: choice }));
    } catch(e){}
  }
  function logConsent(choice){
    try {
      fetch(WORKER_ORIGIN + '/consent', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ site: SITE, choice: choice, ts: new Date().toISOString(),
          lang: detectLang(), gpc: !!navigator.globalPrivacyControl })
      }).catch(function(){});
    } catch(e){}
  }

  var existing = readStored();
  if (existing) { applyConsent(existing); return; }

  // Global Privacy Control: daca browserul semnaleaza GPC, pre-completam refuz
  // pe analytics/marketing dar tot aratam bannerul (utilizatorul poate schimba).
  var gpcActive = !!navigator.globalPrivacyControl;

  var wrap = document.createElement('div');
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-live', 'polite');
  wrap.setAttribute('aria-label', L.title);
  wrap.style.cssText = 'position:fixed!important;left:16px!important;right:16px!important;bottom:16px!important;'
    + 'z-index:2147483000!important;max-width:900px!important;margin:0 auto!important;'
    + 'background:#000!important;color:#fff!important;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;'
    + 'padding:22px 24px!important;border-radius:14px!important;box-shadow:0 8px 40px rgba(0,0,0,.5)!important;'
    + 'font-size:15px!important;line-height:1.6!important;display:block!important;visibility:visible!important;'
    + 'opacity:1!important;text-align:left!important;';

  /* Unele site-uri (ex. cele cu tema dark/light comutabila) au reguli globale
     de tipul html.dark body * { color: ... !important } care suprascriu culorile
     din banner si il fac ilizibil. Injectam un <style> cu specificitate mare,
     limitat strict la interiorul banner-ului, ca sa fim imuni la CSS-ul gazdei. */
  var guardStyle = document.createElement('style');
  guardStyle.textContent =
    '#aiv-consent-banner, #aiv-consent-banner *{color:#fff!important;font-family:inherit!important;'
    + 'box-sizing:border-box!important;text-shadow:none!important;letter-spacing:normal!important;}'
    + '#aiv-consent-banner a{color:' + ACCENT + '!important;text-decoration:underline!important;}'
    + '#aiv-consent-banner button{color:#000!important;background:' + ACCENT + '!important;'
    + 'border:none!important;border-radius:100px!important;padding:12px 28px!important;'
    + 'font-size:15px!important;font-weight:500!important;cursor:pointer!important;'
    + 'line-height:1.2!important;text-transform:none!important;margin:0!important;width:auto!important;}'
    + '#aiv-consent-banner strong{color:#fff!important;font-weight:600!important;}'
    + '#aiv-consent-banner input[type=checkbox]{accent-color:' + ACCENT + '!important;width:18px!important;height:18px!important;}';
  wrap.id = 'aiv-consent-banner';

  function pillBtn(label, primary){
    return '<button type="button" data-act="' + label.act + '" style="'
      + 'padding:12px 28px;border-radius:100px;font-size:15px;font-weight:500;cursor:pointer;border:none;'
      + (primary ? ('background:' + ACCENT + ';color:#000;') : 'background:' + ACCENT + ';color:#000;opacity:.92;')
      + '">' + label.text + '</button>';
  }

  function renderBanner(){
    wrap.innerHTML =
      '<div style="max-width:900px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between;">'
      + '<div style="flex:1;min-width:240px;">'
      +   '<strong style="display:block;margin-bottom:4px;">' + L.title + '</strong>'
      +   '<span style="opacity:.75;">' + L.body + '</span> '
      +   '<a href="' + PRIVACY_URL + '" style="color:' + ACCENT + ';text-decoration:underline;">' + L.privacyLink + '</a>'
      + '</div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0;">'
      +   pillBtn({act:'customize', text:L.customize}, false)
      +   pillBtn({act:'decline', text:L.declineAll}, false)
      +   pillBtn({act:'accept', text:L.acceptAll}, true)
      + '</div>'
      + '</div>';
    wire();
  }

  function renderCustomize(){
    function toggle(id, label, desc, checked, disabled){
      return '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:10px 0;border-top:1px solid rgba(255,255,255,.1);">'
        + '<div><strong style="display:block;font-size:13px;">' + label + (disabled ? ' <span style="opacity:.5;font-weight:400;">(' + L.alwaysOn + ')</span>' : '') + '</strong>'
        + '<span style="opacity:.65;font-size:12px;">' + desc + '</span></div>'
        + '<input type="checkbox" data-cat="' + id + '" ' + (checked ? 'checked' : '') + ' ' + (disabled ? 'disabled' : '')
        + ' style="flex-shrink:0;width:18px;height:18px;accent-color:' + ACCENT + ';margin-top:2px;">'
        + '</div>';
    }
    wrap.innerHTML =
      '<div style="max-width:640px;margin:0 auto;">'
      + '<strong style="display:block;margin-bottom:10px;">' + L.title + '</strong>'
      + toggle('necessary', L.necessary, L.necessaryDesc, true, true)
      + toggle('analytics', L.analytics, L.analyticsDesc, !gpcActive, false)
      + toggle('marketing', L.marketing, L.marketingDesc, !gpcActive, false)
      + '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">'
      +   pillBtn({act:'back', text:L.back}, false)
      +   pillBtn({act:'save', text:L.save}, true)
      + '</div>'
      + '</div>';
    wire();
  }

  function wire(){
    wrap.querySelectorAll('[data-act]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var act = btn.getAttribute('data-act');
        if (act === 'customize') return renderCustomize();
        if (act === 'back') return renderBanner();
        if (act === 'accept') return finish({ necessary: true, analytics: true, marketing: true });
        if (act === 'decline') return finish({ necessary: true, analytics: false, marketing: false });
        if (act === 'save') {
          var analytics = wrap.querySelector('[data-cat="analytics"]').checked;
          var marketing = wrap.querySelector('[data-cat="marketing"]').checked;
          return finish({ necessary: true, analytics: analytics, marketing: marketing });
        }
      });
    });
  }

  function finish(choice){
    writeStored(choice);
    applyConsent(choice);
    logConsent(choice);
    wrap.remove();
  }

  var mounted = false;
  function mount(){
    if (mounted) return;
    if (!document.body) return;   // inca nu exista body — reincercam
    mounted = true;
    document.head.appendChild(guardStyle);
    document.body.appendChild(wrap);
    renderBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  // plasa de siguranta: daca ceva a mers prost mai sus, mai incercam o data
  setTimeout(mount, 300);
})();`;
}

/* ---------- contor comun de vizitatori/evenimente, partajat pe toate site-urile ----------
   Nu stocheaza niciodata IP brut. Pentru "vizitatori unici" calculeaza un hash
   SHA-256(ip + user-agent + data + salt) doar tranzitoriu, ca sa deduplice —
   hash-ul insusi devine cheia KV, nu IP-ul. E o aproximare (standard in
   analytics privacy-friendly, gen Cloudflare Web Analytics / Plausible), nu
   un numar bancar-precis. */
async function hashVisitor(ip, ua, salt) {
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${ip}|${ua}|${day}|${salt}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
}

async function pingVisit(env, site, type, request) {
  if (!env.GDPR_KV) return;
  site = String(site || 'unknown').slice(0, 100);
  type = ['pageview', 'audit_complete'].includes(type) ? type : 'pageview';
  try {
    // total per tip, per site — si un total agregat "all" pentru contorul comun
    for (const scope of [site, 'all']) {
      const key = `stat:${scope}:${type}`;
      const n = Number(await env.GDPR_KV.get(key) || 0) + 1;
      await env.GDPR_KV.put(key, String(n));
    }
    if (type === 'pageview') {
      const ip = request.headers.get('cf-connecting-ip') || '';
      const ua = request.headers.get('user-agent') || '';
      const h = await hashVisitor(ip, ua, site);
      const uniqKey = `uniq:${site}:${new Date().toISOString().slice(0, 10)}:${h}`;
      const seen = await env.GDPR_KV.get(uniqKey);
      if (!seen) {
        await env.GDPR_KV.put(uniqKey, '1', { expirationTtl: 60 * 60 * 26 });
        for (const scope of [site, 'all']) {
          const key = `stat:${scope}:unique`;
          const n = Number(await env.GDPR_KV.get(key) || 0) + 1;
          await env.GDPR_KV.put(key, String(n));
        }
      }
    }
  } catch {}
}

async function getStatsSummary(env, site) {
  if (!env.GDPR_KV) return { pageviews: 0, uniqueVisitors: 0, auditsRun: 0, note: 'storage unavailable' };
  const scope = site || 'all';
  const [pv, uq, ac] = await Promise.all([
    env.GDPR_KV.get(`stat:${scope}:pageview`).catch(() => null),
    env.GDPR_KV.get(`stat:${scope}:unique`).catch(() => null),
    env.GDPR_KV.get(`stat:${scope}:audit_complete`).catch(() => null),
  ]);
  return { pageviews: Number(pv || 0), uniqueVisitors: Number(uq || 0), auditsRun: Number(ac || 0) };
}

function buildStatsScript() {
  return `(function(){
  var CS = document.currentScript;
  if (!CS) return;
  var SITE = CS.getAttribute('data-site') || location.hostname;
  var WORKER_ORIGIN = new URL(CS.src, location.href).origin;
  var SCOPE = CS.getAttribute('data-scope') || 'all';

  fetch(WORKER_ORIGIN + '/stats/ping', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ site: SITE, type: 'pageview' })
  }).catch(function(){});

  window.aivStats = window.aivStats || {};
  window.aivStats.ping = function(type){
    fetch(WORKER_ORIGIN + '/stats/ping', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ site: SITE, type: type || 'audit_complete' })
    }).catch(function(){});
  };

  function animate(el, to){
    var from = 0, dur = 1200, start = null;
    function step(ts){
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = Math.floor(from + (to - from) * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderWidgets(){
    var nodes = document.querySelectorAll('[data-aiv-stats]');
    if (!nodes.length) return;
    fetch(WORKER_ORIGIN + '/stats/summary?scope=' + encodeURIComponent(SCOPE))
      .then(function(r){ return r.json(); })
      .then(function(s){
        nodes.forEach(function(el){
          var metric = el.getAttribute('data-aiv-stats');
          var val = metric === 'pageviews' ? s.pageviews : metric === 'unique' ? s.uniqueVisitors
            : metric === 'audits' ? s.auditsRun : s.pageviews;
          animate(el, val || 0);
        });
      }).catch(function(){});
  }
  if (document.readyState !== 'loading') renderWidgets();
  else document.addEventListener('DOMContentLoaded', renderWidgets);
})();`;
}

/* ---------- EDGE INJECTOR ----------
   Cand acest Worker e atasat ca Route pe un domeniu (ex. aiventure.ro/*),
   cererea ajunge aici in loc sa mearga direct la origine. Luam raspunsul
   real de la origine si injectam cele doua scripturi inainte de </body>.
   Nu se atinge niciun fisier sursa al site-ului, si merge pe oricate
   domenii, doar adaugand cate o Route — fara alt deploy.

   Domeniul propriu al Worker-ului (gdpr.aiventure.ro) NU trece prin
   injector — acolo se servesc /gdpr.js, /stats.js si restul rutelor API. */
const WORKER_OWN_HOSTS = ['gdpr.aiventure.ro'];

const SITE_CONFIG = {
  'aiventure.ro':  { accent: '#f5c518', privacy: '/legal/' },
  '3webobs.com':    { accent: '#f5c518', privacy: '/gdpr.html' },
  'ecbtax.com':      { accent: '#f5c518', privacy: '/privacy-policy.html' },
  'eu-ai-act.ro':    { accent: '#f0c14b', privacy: '/legal' },
  '5thelement.ai':   { accent: '#f5c518', privacy: '/legal' },
  'eu-112.ro':       { accent: '#f0c14b', privacy: '/legal' },
  'eu-112.eu':       { accent: '#f0c14b', privacy: '/legal' },
  '1clic-ia.eu':     { accent: '#f5c518', privacy: '/legal' },
  'ai-lens.eu':      { accent: '#f5c518', privacy: '/legal' },
  'aiventure.uk':    { accent: '#f5c518', privacy: '/legal' },
};
const DEFAULT_SITE_CONFIG = { accent: '#f5c518', privacy: '/' };

class ScriptInjector {
  constructor(host, workerOrigin) {
    this.host = host;
    this.workerOrigin = workerOrigin;
  }
  element(el) {
    const cfg = SITE_CONFIG[this.host] || DEFAULT_SITE_CONFIG;
    const tag =
      `<script src="${this.workerOrigin}/gdpr.js" data-site="${this.host}" data-lang="auto"` +
      ` data-accent="${cfg.accent}" data-privacy-url="${cfg.privacy}" defer></script>` +
      `<script src="${this.workerOrigin}/stats.js" data-site="${this.host}" data-scope="all" defer></script>`;
    el.append(tag, { html: true });
  }
}

/* Originea reala, DETECTATA AUTOMAT — fara lista de domenii.

   Problema: o ruta pe `site.ro/*` trimite catre acest Worker ORICE cerere
   spre acel host, inclusiv cererea pe care Worker-ul o face el insusi ca sa
   ia pagina. Bucla; Cloudflare o taie tacut (0 subrequests, pagina neatinsa).

   Solutia fara configurare: adaugam un header propriu la cererea de origine.
   Cand cererea revine in Worker (pentru ca ruta o prinde din nou), vedem
   header-ul, stim ca e propria noastra cerere, si o lasam sa treaca direct
   la origine fara sa mai injectam — se rupe bucla exact o data, iar
   raspunsul real ajunge inapoi la prima invocare, care face injectia.

   Rezultat: pentru orice site nou e suficienta ruta. Zero cod de schimbat. */
const LOOP_GUARD = 'x-aiv-injector-pass';

async function handleInjection(request, host) {
  /* A doua trecere: cererea noastra proprie s-a intors prin ruta.
     O lasam sa mearga la origine fara injectie — asa se rupe bucla. */
  if (request.headers.get(LOOP_GUARD)) {
    return fetch(request, { cf: { cacheEverything: false } });
  }

  /* Prima trecere. Construim explicit o cerere noua cu headerele copiate
     manual — `new Request(request)` nu garanteaza pastrarea headerelor
     custom in toate contextele, si atunci guard-ul se pierde si bucla
     nu se mai rupe niciodata (worker apelat, dar pagina neinjectata). */
  const headers = new Headers();
  for (const [k, v] of request.headers) headers.set(k, v);
  headers.set(LOOP_GUARD, '1');

  const originRequest = new Request(request.url, {
    method: request.method,
    headers: headers,
    body: (request.method === 'GET' || request.method === 'HEAD') ? undefined : request.body,
    redirect: 'manual',
  });

  let originResponse;
  try {
    originResponse = await fetch(originRequest);
  } catch (e) {
    return fetch(request);   // orice esec: servim pagina originala, nemodificata
  }

  const contentType = originResponse.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return originResponse;

  return new HTMLRewriter()
    .on('body', new ScriptInjector(host, 'https://gdpr.aiventure.ro'))
    .transform(originResponse);
}

/* ---------- CEAS PENTRU ALTE PROIECTE ----------
   Acest Worker e un Worker adevarat, deci SUPORTA Cron Triggers. Proiectele
   de tip Pages (ex. 3webobs.com) nu suporta. Deci el se trezeste la ora
   stabilita si le apeleaza endpointul /cron-tick, cu un secret comun.

   Adaugarea unui proiect nou: o linie in TICK_TARGETS. Nimic altceva. */
const TICK_TARGETS = [
  { name: '3webobs', url: 'https://3webobs.com/cron-tick' },
];

async function runTicks(env) {
  const results = [];
  for (const t of TICK_TARGETS) {
    const started = Date.now();
    try {
      const r = await fetch(t.url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-cron-secret': env.CRON_SECRET || '',
        },
      });
      let body = null;
      try { body = await r.json(); } catch {}
      results.push({ target: t.name, status: r.status, ms: Date.now() - started, body });
    } catch (e) {
      results.push({ target: t.name, error: String(e && e.message || e), ms: Date.now() - started });
    }
  }
  return results;
}

export default {
  /* Apelat automat de Cloudflare la fiecare declansare de cron.
     Nu poate fi apelat din exterior — doar de platforma. */
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runTicks(env));
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname.replace(/^www\./, '');

    /* daca cererea vine de pe un domeniu ROUTAT (un site real, nu domeniul
       propriu al Worker-ului), trecem in modul injector si nu atingem API-ul */
    const isOwnHost = WORKER_OWN_HOSTS.includes(host) || host.endsWith('.workers.dev');
    if (!isOwnHost) {
      return handleInjection(request, host);
    }

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    if (url.pathname === '/gdpr.js') {
      return new Response(buildScript(), {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=300', ...CORS },
      });
    }

    if (url.pathname === '/consent' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const site = String(body.site || 'unknown').slice(0, 100);
      const record = {
        site, choice: body.choice || {}, lang: body.lang || 'en',
        gpc: !!body.gpc, ts: new Date().toISOString(),
        country: request.headers.get('cf-ipcountry') || 'unknown', // fara IP brut — doar tara, suficient pentru evidenta
      };
      if (env.GDPR_KV) {
        try {
          const key = `consent:${site}:${Date.now()}:${crypto.randomUUID().slice(0, 8)}`;
          await env.GDPR_KV.put(key, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 400 }); // ~13 luni
          const countKey = `count:${site}`;
          const n = Number(await env.GDPR_KV.get(countKey) || 0) + 1;
          await env.GDPR_KV.put(countKey, String(n));
        } catch {}
      }
      return json({ ok: true });
    }

    if (url.pathname === '/consent/count') {
      const site = url.searchParams.get('site');
      if (!site || !env.GDPR_KV) return json({ error: 'site param required, or storage unavailable' }, 400);
      let n = 0;
      try { n = Number(await env.GDPR_KV.get(`count:${site}`) || 0); } catch {}
      return json({ site, totalConsentEvents: n });
    }

    /* contor comun — vizite, vizitatori unici, audituri rulate, pe toate site-urile */
    /* declansare manuala a ceasului, pentru testare — acelasi secret ca la cron.
       Fara el nu ai cum sa verifici ca merge decat asteptand o ora. */
    if (url.pathname === '/cron/run' && request.method === 'POST') {
      if (!env.CRON_SECRET) return json({ error: 'CRON_SECRET nu e configurat pe acest Worker' }, 503);
      if (request.headers.get('x-cron-secret') !== env.CRON_SECRET) return json({ error: 'unauthorized' }, 401);
      const results = await runTicks(env);
      return json({ ok: true, triggeredManually: true, results });
    }

    if (url.pathname === '/stats.js') {
      return new Response(buildStatsScript(), {
        headers: { 'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=300', ...CORS },
      });
    }

    if (url.pathname === '/stats/ping' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      await pingVisit(env, body.site, body.type, request);
      return json({ ok: true });
    }

    if (url.pathname === '/stats/summary') {
      const scope = url.searchParams.get('scope') || url.searchParams.get('site') || 'all';
      const summary = await getStatsSummary(env, scope === 'all' ? null : scope);
      return json(summary);
    }

    /* registru comun — fiecare URL introdus pe orice site AIVENTURE, per site.
       Nu e date personale ale vizitatorului — e URL-ul tinta (business data:
       ce domeniu a fost auditat/introdus), util pentru analiza de utilizare
       pe tot portofoliul. IP-ul vizitatorului NU e stocat aici. */
    if (url.pathname === '/registry/log' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid json' }, 400); }
      const site = String(body.site || 'unknown').slice(0, 100);
      const targetUrl = String(body.url || '').slice(0, 500);
      const type = String(body.type || 'audit').slice(0, 50);
      if (!targetUrl) return json({ error: 'url is required' }, 400);
      if (env.GDPR_KV) {
        try {
          const ts = Date.now();
          const key = `reg:${site}:${ts}:${crypto.randomUUID().slice(0, 8)}`;
          await env.GDPR_KV.put(key, JSON.stringify({ site, url: targetUrl, type, ts: new Date(ts).toISOString() }),
            { expirationTtl: 60 * 60 * 24 * 400 });
          const countKey = `regcount:${site}`;
          const n = Number(await env.GDPR_KV.get(countKey) || 0) + 1;
          await env.GDPR_KV.put(countKey, String(n));
          const countKeyAll = `regcount:all`;
          const na = Number(await env.GDPR_KV.get(countKeyAll) || 0) + 1;
          await env.GDPR_KV.put(countKeyAll, String(na));
        } catch {}
      }
      return json({ ok: true });
    }

    if (url.pathname === '/registry/list') {
      const site = url.searchParams.get('site');
      if (!site || !env.GDPR_KV) return json({ error: 'site param required, or storage unavailable' }, 400);
      const limit = Math.min(100, Number(url.searchParams.get('limit') || 20));
      try {
        const listed = await env.GDPR_KV.list({ prefix: `reg:${site}:`, limit: 1000 });
        const keys = listed.keys.map(k => k.name).sort().reverse().slice(0, limit);
        const entries = [];
        for (const k of keys) {
          const v = await env.GDPR_KV.get(k);
          if (v) { try { entries.push(JSON.parse(v)); } catch {} }
        }
        const total = Number(await env.GDPR_KV.get(`regcount:${site}`) || 0);
        return json({ site, total, entries });
      } catch (e) {
        return json({ error: 'list failed', detail: String(e) }, 500);
      }
    }

    return json({
      service: 'AIVENTURE Shared Infrastructure Worker',
      usage: {
        gdpr: 'GET /gdpr.js to embed the consent banner, POST /consent to log (called automatically)',
        stats: 'GET /stats.js to embed the visitor counter, POST /stats/ping (called automatically), GET /stats/summary?scope=all|<site>',
        registry: 'POST /registry/log {site,url,type} to log a submitted URL, GET /registry/list?site=<site>&limit=N to read it back',
      },
      languages: Object.keys(I18N),
    });
  },
};
