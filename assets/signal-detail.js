/* Logica paginilor de detaliu, o singura data.
   Cele sase pagini — una per dimensiune — sunt fisiere subtiri care declara
   ce dimensiune arata si incarca scriptul asta. Sase URL-uri reale, fiecare
   cu titlu, descriere si graf propriu, deci sase pagini indexabile; dar o
   singura implementare, deci o reparatie se face o data.
   Dimensiunea vine din data-dim pe <body>, cu ?dim= ca rezerva pentru
   linkurile vechi. */

(async function(){
  var q = new URLSearchParams(location.search);
  var obs = q.get('obs');
  var dim = ((document.body.getAttribute('data-dim') || q.get('dim') || 'AEO')).toUpperCase();
  /* Observatia de referinta — starea dinainte. Fara ea pagina arata o
     fotografie; cu ea arata ce s-a schimbat, si asta e singurul lucru care
     dovedeste ca injectia a facut ceva. */
  var before = q.get('before') || q.get('baseline');
  var el = document.getElementById('sd-body');

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  if (!obs) {
    el.innerHTML = '<p class="sec-s">This page shows one observation. Run an audit from the <a href="/">home page</a>, then open a dimension from its result card.</p>';
    return;
  }

  var rep, repBefore = null;
  try {
    var r = await fetch('/observation?id=' + encodeURIComponent(obs));
    if (!r.ok) throw new Error(r.status === 404 ? 'not found' : 'http ' + r.status);
    rep = await r.json();
    if (before) {
      try {
        var rb = await fetch('/observation?id=' + encodeURIComponent(before));
        if (rb.ok) repBefore = await rb.json();
      } catch (e2) {}
    }
  } catch (e) {
    el.innerHTML = '<p class="sec-s">This observation could not be loaded'
      + (String(e.message).indexOf('not found') >= 0 ? ' &mdash; observations are kept for 90 days, and this one may have expired.' : '.')
      + ' <a href="/">Run a fresh audit</a>.</p>';
    return;
  }

  var LABEL = { AEO:'Answer Engine Optimization', GEO:'Generative Engine Optimization',
    AIO:'AI Optimization', SEO:'Search Engine Optimization',
    AI_SIGNALS:'Machine Trust Signals', A2A:'Agent-to-Agent Signals',
    SCHEMA:'Schema.org &mdash; the layer both webs read' };

  var nav = ['AEO','GEO','AIO','SEO','AI_SIGNALS','A2A','SCHEMA'].filter(function(k){
    return k === 'SCHEMA' ? !!rep.schema : (rep.signals && rep.signals[k]);
  }).map(function(k){
    return '<a href="/signal-detail?obs=' + encodeURIComponent(obs) + '&dim=' + k + '"'
      + (k === dim ? ' aria-current="page"' : '') + '>' + k.replace('_',' ') + '</a>';
  }).join('');

  var meta = '<div class="sd-meta">' + esc(rep.url || '') + ' &middot; ' + esc(rep.ts || '')
    + ' &middot; observation <code>' + esc(obs) + '</code></div>';

  if (dim === 'SCHEMA') { renderSchema(); return; }

  var sigs = (rep.signals && rep.signals[dim]) || [];
  if (!sigs.length) { el.innerHTML = meta + '<p class="sec-s">No signals recorded for this dimension.</p>'; return; }

  var d = rep.dimensions ? rep.dimensions[dim] : null;
  var pass = sigs.filter(function(s){ return s.status === 'pass'; }).length;
  var na   = sigs.filter(function(s){ return s.status === 'na'; }).length;
  var bad  = sigs.filter(function(s){ return s.status === 'fail' || s.status === 'partial'; }).length;

  document.getElementById('sd-title').innerHTML = dim.replace('_',' ') + ' <em>detail</em>';

  var scoreNow = rep.scores[dim];
  var scoreBefore = repBefore && repBefore.scores ? repBefore.scores[dim] : null;
  var diff = (scoreBefore != null && scoreNow != null) ? scoreNow - scoreBefore : null;

  el.innerHTML =
      '<div class="sd-head"><span class="sd-score">' + (scoreNow != null ? scoreNow : '&mdash;') + '</span>'
    + '<span style="font-size:14px;opacity:.7">' + LABEL[dim] + '</span></div>'
    + (diff != null
        ? '<div class="sd-cmp"><span>before <b>' + scoreBefore + '</b></span>'
          + '<span>after <b>' + scoreNow + '</b></span>'
          + '<span class="' + (diff > 0 ? 'up' : diff < 0 ? 'dn' : '') + '">'
          + (diff > 0 ? '+' : '') + diff + '</span></div>'
        : '')
    + meta
    + '<div class="sd-nav">' + nav + '</div>'
    + (repBefore
        ? '<div class="sd-note"><strong>Two marks per signal.</strong> The first is the state before, '
          + 'the second is the state now. A signal that moved carries a label &mdash; '
          + '<span class="sd-delta d-fixed">fixed</span> or <span class="sd-delta d-broken">broken</span> &mdash; '
          + 'and is sorted to the top, because what changed matters more than what stayed still. '
          + 'Comparing against observation <code>' + esc(before) + '</code>'
          + (repBefore.session ? ' from session <code>' + esc(repBefore.session) + '</code>' : '')
          + (repBefore.at || repBefore.ts ? ', ' + esc(String(repBefore.at || repBefore.ts).slice(0,10)) : '') + '.</div>'
        : '')
    + '<div class="sd-note"><strong>How to read the marks.</strong> '
    + '<span style="color:var(--green)">&#10003;</span> the signal is present and correct. '
    + '<span style="color:var(--gold)">&#9679;</span> not applicable &mdash; it could not be tested from outside, or it does not apply to this page type; it is never counted as a failure. '
    + '<span style="color:var(--red)">&#10007;</span> the signal applies here and is absent or wrong, so it is work worth doing. '
    + (d ? 'This dimension scored from ' + d.tested + ' of ' + d.total + ' signals &mdash; ' + Math.round(d.coverage) + '% coverage, ' + d.confidence + ' confidence.' : '')
    + '</div>'
    + '<div class="sd-tally">'
    +   '<span class="sd-pill p-pass">' + pass + ' present</span>'
    +   '<span class="sd-pill p-na">' + na + ' not applicable</span>'
    +   '<span class="sd-pill p-fail">' + bad + ' to fix</span>'
    + '</div>'
    + '<div class="sd-filter" id="sd-filter">'
    +   '<button data-f="all" aria-pressed="true">All</button>'
    +   (repBefore ? '<button data-f="fixed" aria-pressed="false">Fixed</button>'
                   + '<button data-f="broken" aria-pressed="false">Broken</button>' : '')
    +   '<button data-f="fail" aria-pressed="false">To fix</button>'
    +   '<button data-f="na" aria-pressed="false">Not applicable</button>'
    +   '<button data-f="pass" aria-pressed="false">Present</button>'
    + '</div><div id="sd-list"></div>';

  function markFor(st){
    if (st === 'pass') return '<span class="sd-mark m-pass">&#10003;</span>';
    if (st === 'na')   return '<span class="sd-mark m-na">&#9679;</span>';
    if (st === 'partial') return '<span class="sd-mark m-partial">&#9680;</span>';
    return '<span class="sd-mark m-fail">&#10007;</span>';
  }

  /* Indexul starii dinainte, pe id de semnal. Cheia e id-ul, nu numele:
     numele se pot schimba intre versiuni de catalog, id-urile nu. */
  var beforeById = {};
  if (repBefore && repBefore.signals) {
    Object.keys(repBefore.signals).forEach(function(k){
      repBefore.signals[k].forEach(function(x){ beforeById[x.id] = x; });
    });
  }

  function deltaOf(bSt, aSt){
    if (!bSt || bSt === aSt) return null;
    var wasBad = bSt === 'fail' || bSt === 'partial';
    var isBad  = aSt === 'fail' || aSt === 'partial';
    if (wasBad && !isBad) return 'fixed';
    if (!wasBad && isBad) return 'broken';
    return 'changed';
  }

  function render(f){
    var items = sigs.filter(function(s){
      if (f === 'all') return true;
      if (f === 'fixed' || f === 'broken') {
        var b = beforeById[s.id];
        return b && deltaOf(b.status, s.status) === f;
      }
      if (f === 'fail') return s.status === 'fail' || s.status === 'partial';
      return s.status === f;
    }).sort(function(a,b){
      /* Ce s-a schimbat urca sus. Un semnal reparat sau stricat de la ultima
         observatie e mai relevant decat unul care a stat pe loc. */
      var da = beforeById[a.id] ? deltaOf(beforeById[a.id].status, a.status) : null;
      var db = beforeById[b.id] ? deltaOf(beforeById[b.id].status, b.status) : null;
      if (!!da !== !!db) return da ? -1 : 1;
      return (b.w||0) - (a.w||0);
    });

    document.getElementById('sd-list').innerHTML = items.length
      ? items.map(function(s){
          var b = beforeById[s.id];
          var d = b ? deltaOf(b.status, s.status) : null;
          var pair = b
            ? '<span class="sd-pair">' + markFor(b.status)
              + '<span class="sd-arrow">&rarr;</span>' + markFor(s.status) + '</span>'
            : markFor(s.status);
          var badge = d
            ? '<span class="sd-delta d-' + d + '">' + (d === 'fixed' ? 'fixed' : d === 'broken' ? 'broken' : 'changed') + '</span>'
            : '';
          return '<div class="sd-sig' + (d ? ' sd-moved' : '') + '">' + pair
            + '<div><div class="sd-n">' + esc(s.n) + badge + '</div>'
            + '<div class="sd-why">' + esc(s.method || '') + '</div>'
            + (b && b.method && b.method !== s.method
                ? '<div class="sd-was">before: ' + esc(b.method) + '</div>' : '')
            + '<div class="sd-w">' + esc(s.c || '') + ' &middot; weight ' + (s.w || 0)
            + (s.score != null ? ' &middot; scored ' + s.score : '') + '</div></div></div>';
        }).join('')
      : '<p class="sec-s">Nothing in this category.</p>';
  }

  document.getElementById('sd-filter').addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    [].forEach.call(this.querySelectorAll('button'), function(x){ x.setAttribute('aria-pressed', String(x === b)); });
    render(b.dataset.f);
  });
  render('all');

  function renderSchema(){
    var sch = rep.schema;
    document.getElementById('sd-title').innerHTML = 'Schema.org <em>detail</em>';
    var color = sch.status === 'error' ? 'var(--red)' : sch.status === 'warning' ? 'var(--gold)'
              : sch.status === 'valid' ? 'var(--green)' : 'var(--light)';
    var issues = (sch.issues || []).map(function(i){
      return '<div class="sd-sig">'
        + (i.level === 'error' ? '<span class="sd-mark m-fail">&#10007;</span>' : '<span class="sd-mark m-na">&#9679;</span>')
        + '<div><div class="sd-n">' + esc(i.type) + '</div>'
        + '<div class="sd-why"><code>' + esc(i.property) + '</code> &mdash; ' + esc(i.message) + '</div></div></div>';
    }).join('');

    el.innerHTML =
        '<div class="sd-head"><span class="sd-score" style="color:' + color + '">'
      +   (sch.score != null ? sch.score : '&mdash;') + '</span>'
      +   '<span style="font-size:14px;opacity:.7">' + LABEL.SCHEMA + '</span></div>'
      + meta
      + '<div class="sd-nav">' + nav + '</div>'
      + '<div class="sd-note"><strong>What this measures.</strong> Structured data is the one layer a search engine and an AI system read the same way. '
      + 'A graph can be valid JSON and still wrong: a property placed on a type that does not define it, or a reference pointing at the wrong kind of object. '
      + 'The page renders, the JSON parses, and the meaning is broken. These are our own structural checks against the schema.org vocabulary &mdash; '
      + 'schema.org publishes no API for its validator, so we do not claim to call it. '
      + 'A type outside our checked vocabulary is reported as unverified, not as valid. '
      + '<a href="/schema">Our own graph, checked the same way &rarr;</a></div>'
      + '<div class="sd-tally">'
      +   '<span class="sd-pill p-pass">' + sch.valid + ' valid</span>'
      +   '<span class="sd-pill p-na">' + sch.warning + ' warnings</span>'
      +   '<span class="sd-pill p-fail">' + sch.error + ' errors</span>'
      +   '<span class="sd-pill">' + sch.objects + ' objects</span>'
      +   (sch.unverified ? '<span class="sd-pill">' + sch.unverified + ' unverified</span>' : '')
      + '</div>'
      + (sch.invalidBlocks ? '<div class="sd-note" style="border-left-color:var(--red)"><strong>'
          + sch.invalidBlocks + ' JSON-LD block(s) do not parse.</strong> A consumer skips them entirely.</div>' : '')
      + (issues || '<p class="sec-s">No structural problem found. Every property belongs to its type, and every reference resolves to the type it expects.</p>')
      + (sch.types && sch.types.length
          ? '<p class="sec-s" style="margin-top:20px"><strong>Types declared:</strong> ' + sch.types.map(esc).join(', ') + '</p>'
          : '');
  }
})();
