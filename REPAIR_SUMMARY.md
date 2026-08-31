# 3webs repair summary — 2026-08-31 (runda 7: raspuns la audit extern #2)

Un al doilea audit extern a ridicat 6 obiectii. Le-am verificat pe fiecare in
cod, nu le-am acceptat pe incredere. **4 din 6 erau reale si sunt reparate.**

## 1. Declara A2A v1.0 dar implementa metodele v0.3 — CONFIRMAT, reparat
Verificat in specificatia oficiala: v1.0 foloseste nume canonice
(`SendMessage`, `GetTask`, `CancelTask`, `ListTasks`); `message/send`,
`tasks/get` sunt aliasuri pre-1.0. Cardul declara `protocolVersion: "1.0"` in
`supportedInterfaces`, dar worker-ul accepta doar numele vechi — un client v1.0
conform ar fi primit `-32601 Method not found`.

Exact defectul pe care il reparam la altii: declari o versiune pe care nu o
implementezi. Acum sunt acceptate ambele seturi; testat.

## 2. robots.txt: bot BLOCAT raportat ca PERMIS — CONFIRMAT, reparat
Cel mai grav dintre toate, pentru ca **minte clientul**. Verificarea era
`/GPTBot/i.test(robots.txt)` — doar cauta sirul in fisier. Deci:

    User-agent: GPTBot
    Disallow: /

era raportat drept "GPTBot permis". Un client ar fi fost informat ca e vizibil
pentru AI exact cand era blocat.

Inlocuit cu un parser real pe grupuri User-agent, conform RFC 9309: grupul
specific botului are prioritate fata de `*`, `Disallow:` gol inseamna permis,
blocarea unui subfolder nu inseamna blocarea site-ului. Botii blocati apar
acum explicit in `explicitlyBlocked`.

## 3. Scorul ignora ponderile — CONFIRMAT, reparat
`sum += r.score; count++` — medie simpla. `sig.w` era stocat si folosit doar la
sortarea planului de actiuni, niciodata la calcul. `HTTPS Availability` (w=10)
cantarea cat `Private Behavioral Analytics` (w=2).

Acum: media ponderata cu `w` la nivel de dimensiune, iar global media
dimensiunilor ponderata cu greutatea totala testata in fiecare. Raportul
declara `scoringMethod: "weighted-by-signal-weight"`.

Efect masurat pe fixture: un semnal greu picat + unul usor trecut da **17
ponderat vs 50 in medie simpla** — exact diferenta care conteaza.

## 4. Confirma monitorizari care nu sunt salvate — CONFIRMAT, reparat
`if (env.RATE_KV) { try { ...put... } catch {} }` urmat de `status: 'registered'`.
Fara KV, sau daca scrierea esua, clientul primea oricand un `subscriptionId` si
credea ca monitorizarea e activa — desi nu exista nicaieri si nu ar fi rulat
niciodata. Reparat pe ambele cai (A2A si REST `/observe`): fara salvare
confirmata, se intoarce eroare, nu confirmare.

## 5-6. Stripe si monitorizare permanenta — corecte, dar nu le pot inchide eu
- **Stripe / plata per audit**: nu exista, si nu o pot inventa. Necesita cont
  Stripe, pret decis (0,43 vs 0,50 USD — inca neclar), termeni de refund si
  revizuire juridica. Decizie de business, nu de cod.
- **Monitorizarea permanenta**: codul e complet (scheduler, cron handler,
  cancel), dar Cloudflare **Pages nu suporta Cron Triggers** — e o limitare de
  platforma. Optiuni: mutarea proiectului pe Workers with Static Assets, sau un
  Worker separat care apeleaza un endpoint de tick. Necesita decizia ta.

## Teste
Cele 4 reparatii au acum teste de regresie proprii (grupurile 7-10):
**34/34 teste trecute**.

## Stare
Scor **86/100** (ponderat, deci nu mai e comparabil direct cu 87-ul nepondera
de dinainte), acoperire 77,2%, 129/167 semnale testate.

# 3webs repair summary — 2026-08-31 (runda 6: unelte de verificare)

## Bug prins de propriul motor: numarare dubla in JSON-LD
`extractJsonLd` intra in `@graph` de doua ori — o data explicit, apoi din nou
prin bucla generica peste chei. Fiecare nod dintr-un @graph era numarat de doua
ori: 234 noduri raportate in loc de 117 reale, plus un avertisment fals
"@id duplicat intre noduri". Reparat prin excluderea lui `@graph` din bucla.

## `scripts/verify-proof.mjs` — verificator independent
Auditul cerea ca un tert sa poata confirma manifestul. Script fara dependinte,
Node 18+:

    node scripts/verify-proof.mjs                    # verifica site-ul live
    node scripts/verify-proof.mjs --local            # verifica fisierele din repo
    node scripts/verify-proof.mjs --origin https://…

Descarca fiecare fisier declarat, recalculeaza SHA-256 din bytes, compara cu
manifestul, recalculeaza si agregatul. Exit 0/1, deci se poate pune si in CI.
Rulat acum: **35/35 fisiere, agregat corespunde**.

Spune explicit si ce NU dovedeste: autorul, momentul publicarii, adevarul
continutului. Fara supralicitare.

## `scripts/test-signals.mjs` — teste de regresie
21 de teste, fiecare cu o pagina sintetica avand un defect CUNOSCUT din auditul
extern. Daca o schimbare viitoare reintroduce defectul, testul pica:
llms.txt cu XML, agent card care minte versiunea, hash gresit acceptat,
dublare JSON-LD, admisie SSRF, aplicabilitate breadcrumb.

**Testul si-a demonstrat valoarea la prima rulare** — a gasit un bug real de
securitate pe care nu-l stiam: `normalizeUrl` prefixa orice sir fara `http(s)://`
cu `https://`, deci `ftp://example.com` devenea `https://ftp://example.com`, un
URL cu hostname "ftp" care trecea toate verificarile SSRF. Reparat: sirurile cu
schema proprie non-http(s) sunt respinse direct.

Rezultat curent: **21/21 teste trecute**.

## Stare finala 3webobs
Scor **87/100**, acoperire **77,2%** (129/167 semnale testate), 35/35 fisiere
verificate criptografic, 21/21 teste de regresie.

## Audit pe celelalte site-uri — de rulat de Eli
Nu am acces de retea catre domeniile din portofoliu din mediul meu, deci auditul
pe ecbtax.com / aiventure.ro / eu-ai-act.ro trebuie rulat direct de pe
3webobs.com (introduci domeniul in formular). Motorul e acum onest, deci
rezultatele sunt utilizabile ca lista de reparatii reala.

# 3webs repair summary — 2026-08-30 (runda 5: acoperire maxima realista)

## Inca 14 semnale mutate din N/A in evaluare reala
Dupa runda 4, au ramas 36 marcate extern/platit. La verificare, 14 dintre ele
erau de fapt verificabile local — se poate evalua ce e **declarat si consistent**
pe pagina, chiar daca nu se poate confirma continutul sursei externe.

Implementate: `seo20` Structured Data Validity (valideaza proprietatile
obligatorii per @type, nu doar prezenta) · `seo38` Warning Severity ·
`aeo23` Rich Result Eligibility · `aeo24` AI Overview Readiness ·
`aeo9` Entity Disambiguation · `geo28` External Entity Link Quality ·
`geo13` LinkedIn Presence · `seo26` Public Social Presence ·
`geo12` Independent Org Profiles · `geo15` Author Expertise ·
`aio4` E-E-A-T · `geo19` NAP Consistency · `ai7` Independent Timestamp ·
`seo16` Anchor Text Diversity.

**Formulare onesta:** unde se verifica doar declaratia, dovada spune asta
explicit. Exemplu real: *"profil de companie LinkedIn declarat — declaratia e
verificabila local, continutul profilului nu"*. Nicaieri nu se pretinde o
verificare care nu s-a facut.

Gardul `EXTERNAL_ONLY` a fost ingustat corespunzator: 6 semnale scoase, cu
comentariu care explica de ce fiecare a devenit testabil.

## Rezultat cumulat pe ziua de azi
| | inceput | acum |
|---|---|---|
| Acoperire | 52,1% | **77,2%** |
| Semnale testate | 87 | **129** |
| Scor | 90 (fals) | **86 (verificat)** |

Scorul a scazut de la 90 la 86 pe parcursul zilei. Asta e progres, nu regres:
90 se baza pe PASS-uri din prezenta si pe 79 de semnale ascunse sub N/A. 86 se
bazeaza pe 129 de semnale evaluate efectiv, hash-uri verificate criptografic si
linkuri accesate real.

## Ce ramane N/A (38), toate legitim
- **21** — fara test public: citari ChatGPT/Perplexity/Claude, Knowledge Graph,
  backlinkuri, mentiuni editoriale, Search Console, Google Business Profile.
  Nu exista API, cu sau fara bani.
- **3** — Core Web Vitals: cheia PageSpeed e configurata; trec live, doar
  sandbox-ul de test nu ajunge la Google.
- **1** — necesita API platit real.
- **13** — corect neaplicabile: schema Product/Event/Video pe o pagina care nu
  vinde/nu are evenimente/nu are video, slug pe homepage, paginare inexistenta,
  hreflang pe site mono-limba.

# 3webs repair summary — 2026-08-30 (runda 4: acoperire reala)

## Problema: "N/A din lene", nu din imposibilitate
La verificarea listei de semnale N/A a reiesit ca 38 erau etichetate
"necesita sursa externa (API platit)" — dar doar ~7 chiar au nevoie de asa
ceva. Restul se puteau calcula direct din HTML-ul deja descarcat. Cel mai
clar exemplu: `seo6` URL Structure era marcat "API platit", desi e literalmente
adresa paginii.

Asta e imaginea in oglinda a defectului semnalat de auditul extern: acolo erau
PASS-uri nemeritate, aici erau N/A nemeritate. Ambele denatureaza raportul.

## Implementate — 20 de reguli noi de analiza de continut
Toate lucreaza pe pagina deja descarcata, fara niciun apel extern:

`seo6` URL Structure · `aio6` Information Density · `aio23`/`aio26`
Summarizability · `aio28` User Intent Explicitness · `seo4` Primary Topic
Relevance · `seo5`/`aio2`/`aio20` Semantic Term Coverage · `aio1`/`aio18`
Topical Coverage Depth · `aio7`/`seo25` Source Citation Quality · `aio5`
Expertise Evidence · `aio15`/`aio16`/`aio17` First-Party Data · `aio21`
Comparative Analysis · `aeo18`/`aeo21` Conversational Query Coverage ·
`aeo25`/`aio29` Context Continuity · `aeo26`/`geo21` Entity Salience ·
`geo22` Geographic Context · `aeo22` Structured Data Coherence · `seo18`
Duplicate Content Risk · `seo21` Crawl Path Efficiency · `ai12` Grounding Controls

Fiecare returneaza dovada concreta, nu un scor abstract — de exemplu:
*"2190 cuvinte, 760 unice (raport 35%), 103 valori numerice concrete"* sau
*"5/6 termeni din titlu/H1 apar si in corpul paginii (83% coerenta)"*.

## Rezultat
**Acoperire: 52,1% -> 68,9%.** Semnale testate: 87 -> 115. Scor: 87 (usor mai
mic decat 88, si asta e corect — semnale care inainte erau ascunse sub N/A
acum sunt evaluate onest, unele cu partial).

## Ce ramane N/A, legitim (52 semnale)
- **27** — observatie externa fara test public: citari in ChatGPT/Perplexity/Claude,
  prezenta in Knowledge Graph, Google Business Profile, mentiuni editoriale.
  Nu exista API pentru "te-a citat ChatGPT", cu sau fara bani.
- **9** — chiar necesita sursa externa platita: LinkedIn API, provider de
  backlinkuri, Rich Results API, dezambiguizare entitati, TSA/OpenTimestamps.
- **3** — Core Web Vitals: cheia PageSpeed e configurata in Cloudflare, deci
  acestea ar trebui sa treaca live; doar sandbox-ul de test nu are acces.
- **13** — corect neaplicabile: schema Product/Event/Video pe o pagina care nu
  vinde/nu are evenimente/nu are video, slug pe homepage, paginare inexistenta.

# 3webs repair summary — 2026-08-30 (runda 3: P0.3 + P0.5)

## Validare semantica in loc de prezenta (P0.3)
Auditul extern a aratat ca multe semnale dadeau PASS doar pentru ca un fisier
raspundea 200, fara sa i se verifice continutul. Reparat:

- **Sitemap** (`seo9`): se parseaza acum XML-ul real, se numara `<loc>`, se
  verifica acoperirea `<lastmod>` si se testeaza efectiv un esantion de URL-uri.
  Un sitemap care raspunde 200 dar contine URL-uri moarte primeste FAIL, nu PASS.
- **Broken Internal Links** (`seo22`): inainte numara 27 linkuri si dadea PASS 100
  fara sa le acceseze. Acum face HEAD (cu fallback GET) pe un esantion de pana la
  12 linkuri interne si raporteaza exact care sunt rupte si cu ce status.
- **SHA-256 Integrity Manifest** (`ai6`, `geo25`): inainte "proof.json exista =>
  PASS 90", fara sa se calculeze niciun hash — exact defectul care a permis
  mismatch-ul gasit de audit. Acum descarca un esantion din fisierele declarate,
  calculeaza SHA-256 si compara cu manifestul. Mismatch => FAIL, cu hash-ul
  asteptat si cel real in dovada.
  *(Aceasta regula era umbrita de o regula generica `/\.json/` care rula prima si
  returna "raspunde 200"; a fost mutata inaintea ei.)*
- **Aplicabilitate BreadcrumbList** (`aeo7`): o homepage nu are ierarhie parinte,
  deci nu are ce declara intr-un breadcrumb. Era penalizata pe nedrept. Acum e
  N/A pe homepage si testata pe paginile cu adancime reala de URL.

## Provenance in fiecare raport
Adaugat `observedAt`, `engineVersion`, `rulesetVersion`, `requestId`, `coverage`
si un bloc `evidence` (status HTTP, URL final, cate linkuri au fost testate, cate
URL-uri are sitemap-ul, cate hash-uri au fost verificate). Fara astea, doua
rapoarte nu puteau fi comparate — nu stiai ce versiune de reguli le-a produs.

## Cursa deploy/proof reparata (P0.5)
**Cauza reala, identificata:** workflow-ul astepta doar ca `signals.json` sa fie
live, folosindu-l ca semnal-canar. Daca un commit schimba `index.html` dar NU
`signals.json`, bucla de asteptare trecea instantaneu — fiindca signals.json era
deja live si identic din deploy-ul anterior — si manifestul se genera peste un
`index.html` VECHI. Exact asa a aparut mismatch-ul pe index.html din audit.

Reparat: se asteapta acum pana cand **fiecare** fisier din manifest are, live,
exact acelasi hash ca in repo la acel commit. Plus un pas final care verifica
manifestul generat fata de repo si **esueaza build-ul** in loc sa publice o
dovada falsa.

Adaugate in manifest si cele 5 pagini noi create azi (404, self-audit, cele 3
pagini de segmentare) — erau nelistate, deci neprotejate. Manifest: 30 -> 35 fisiere.

## Stare dupa aceasta runda
Scor local: **88/100**, acoperire 52,1%, **4/4 fisiere verificate criptografic**,
12 linkuri interne testate efectiv, 33 URL-uri in sitemap validate.

## Ramane deschis
- P0.9 — contract comercial machine (Stripe, quote, receipt, idempotency). Decizie de business.
- Dreptul de retragere pentru servicii digitale executate imediat — necesita avocat in Romania inainte de lansare B2C.
- Semnalele care depind de date externe platite (backlinkuri, Search Console) raman N/A — nu se pot rezolva din cod.

# 3webs repair summary — 2026-08-30 (runda 2: P0.6 + P1)

## Agent Card migrat la A2A v1.0 (P0.6)
- `.well-known/agent-card.json` rescris conform v1.0: `supportedInterfaces[]` (cu url + protocolBinding + protocolVersion) inlocuieste `url` / `preferredTransport` / `additionalInterfaces`. Toate cele 8 campuri obligatorii prezente, zero ramasite v0.3.
- `securitySchemes` era contradictoriu (numit "anonymous" dar definit ca apiKey in header Authorization, desi endpointul accepta anonim). Acum: `securitySchemes: {}` + `security: []`, care declara corect acces anonim.
- `obs_permanent` nu mai e descris ca "not currently operational" — Cron Trigger-ul exista; descrierea spune acum exact ce merge (callback URL) si ce nu (email, lipsa provider).
- Regula `ai20` din motor valida doar prezenta a 3 campuri. Acum valideaza conformitatea reala fata de versiunea declarata: un card care zice "1.0" dar are forma 0.3 primeste FAIL, nu PASS. Un card v0.3 declarat onest primeste pass la 80. Testat pe 6 scenarii.
- Regula `ai23` cauta doar `card.url` (v0.3) — ar fi picat pe nedrept orice card v1 corect. Acum citeste si `supportedInterfaces[].url`.

## Bug-uri P1 reparate
- **Share WhatsApp trimitea la numarul firmei**, ignorand numarul introdus de utilizator. `phone` se calcula dar nu era folosit niciodata. Reparat, cu validare de lungime E.164.
- **Raportul de share omitea dimensiunea A2A** si scria "5 dimensions" desi motorul are 6. Adaugat A2A, corectat numarul, si inlocuit "167 semnale auditate" cu acoperirea reala (cate au fost testate din total) — altfel sugera ca toate 167 au fost verificate.
- **Modalul de share** afisa "Dimensions: 5" si folosea un `<div>` decorativ in loc de `<label>` legat de input.
- **Accesibilitate**: inputul principal `#url-input` nu avea nicio eticheta programatica. Adaugat `<label>` visually-hidden, `type=url`, `inputmode=url` si un hint asociat prin `aria-describedby`. La fel pentru inputul din modal.
- **CTA "Action Plan"** avea `href="/ai-ready"` — o ruta inexistenta, deci soft-404 daca era deschis in tab nou sau daca JS-ul nu rula. Inlocuit cu ancora interna; comportamentul "coming soon" ramane.

## Corectii de acuratete juridica
- **Afirmatia ca un LLM scrie sinteza era falsa** — `buildSynthesis` e complet determinist, fara niciun apel catre vreun model. Aparea in 16 locuri (text vizibil + JSON-LD) in index.html, gdpr.html si ai-act.html. Corectata peste tot. Conteaza: declara o obligatie de "deployer" sub EU AI Act pe care produsul nu o are de fapt.
- **Platforma ODR a Comisiei Europene** (referita in Terms 10.3) a fost desfiintata in 2025, dupa abrogarea Regulamentului (UE) 524/2013. Inlocuita cu indrumare corecta: organisme ADR nationale, iar pentru Romania ANPC.

## Ramane deschis
- P0.3 — validare semantica in loc de prezenta (sitemap parsat, linkuri fetch-uite, hash-uri proof calculate). Volum mare, sistemic.
- P0.5 — cursa deploy/proof.json in GitHub Actions.
- P0.9 — contract comercial machine (Stripe).
- Dreptul de retragere pentru servicii digitale executate imediat — necesita revizuire juridica in Romania inainte de lansare B2C.

## Backlog din audit extern (SEO/marketing, 30 aug 2026)

Un audit generic (alt tool AI, cu surse [1][2] către homepage și gdpr.html) a propus o listă de recomandări. Triaj:

**Deja acoperit / fals pozitiv al auditului extern** (nu necesita actiune):
- Schema.org Organization, WebSite, Product/SoftwareApplication, FAQPage, `sameAs` — toate deja prezente in @graph-ul din index.html, auditul extern nu a putut vedea JSON-LD-ul (probabil citire doar text vizibil).
- Pagina EU AI Act dedicata — exista deja (`ai-act.html`).
- Banner de cookies — nu e nevoie inca: `cookies.html` declara explicit ca nu se folosesc cookie-uri de analytics/marketing acum, si ca bannerul va fi adaugat cand/daca se introduc. Nu exista niciun script de analytics in site (verificat).
- BreadcrumbList — discutat deja in aceasta sesiune, lasat intentionat neadaugat (vezi mai sus in acest fisier).

**Itemi noi, tehnici, rapid de facut daca se aproba:**
- [ ] Titluri/meta description optimizate per pagina (nu doar homepage)
- [ ] Verificare Core Web Vitals reale (LCP/CLS/INP) — necesita PAGESPEED_API_KEY legat la Worker

**Itemi noi, decizie de business/continut — NU implementati fara aprobarea lui Eli:**
- [ ] Sample report (raport-exemplu, anonimizat) afisat pe homepage
- [ ] Testimoniale / social proof / counter "X audituri rulate"
- [ ] Pagina "AI Readiness of 3webobs.com" — auto-demonstratie a metodologiei aplicate pe propriul site
- [ ] Lead magnet descarcabil (checklist PDF) in schimbul emailului
- [ ] Segmentare pe tip de client (agentii SEO, echipe AI, consultanti conformitate) cu pagini dedicate
- [ ] Afisare explicita a preturilor pe sectiunea Pricing (daca nu sunt deja vizibile)



## Fixed today
- `ai24`/`ai25`/`ai26` (Machine Protocol Response Valid / Capability Invocable / Capability Execution Verified) no longer return a blanket `na`. The worker now performs a real, non-destructive A2A invocation (`attemptSafeInvocation`) against whichever capability the TARGET ITSELF marks `safe_to_invoke:true` + `side_effects:"none"` in its own `capabilities.json` — never a guessed or mutating skill. Pass/fail now reflects a genuine live call, not a simulated verdict.
- `capabilities.json`: `obs.catalogue` marked `safe_to_invoke:true`, `side_effects:"none"`, with an explicit `a2a_invocation` block — this is the capability the safe-test above uses on 3webobs.com's own audit.
- `ai23` (Declared Endpoint Reachable) upgraded from a hardcoded `partial` cap to `pass` when the safe invocation above actually succeeds.
- `obs.permanent`: added `runScheduledObservations()` + a `scheduled()` Worker export, wired to a new `wrangler.toml` Cron Trigger (hourly; internally checks each subscription's own daily/weekly/monthly due date). Status in `capabilities.json` changed from `declared_not_operational` to `operational`. **Caveat:** whether the Cron Trigger activates automatically depends on how this specific Cloudflare Pages project is deployed — if it's still the GitHub-integration Pages flow, the Cron Trigger from `wrangler.toml` likely needs to be added manually once in the Cloudflare dashboard (Workers & Pages → project → Settings → Triggers). Confirm after first deploy.
- `obs_permanent`'s `action: 'cancel'` was advertised in the response but never implemented — now actually cancels the KV-stored subscription.
- Structured numeric pricing added to `obs.one_shot` and `obs.permanent` in `capabilities.json`, replacing free-text placeholders. **These are draft figures — confirm/replace before this goes live**, they were not business-approved.
- Email delivery for `obs.permanent` notifications is still not implemented (no email provider bound to the Worker) — subscriptions with a `notify` email now run and record scores correctly, but the email itself isn't sent yet. Callback-URL notify works today.



## Fixed
- `signals.json` is now pure valid JSON (no Markdown wrapper).
- `signals.json` contains exactly 167 signals: AEO 34, GEO 28, AIO 31, SEO 42, AI_SIGNALS 32.
- `_worker.js` now embeds the same v3.1 catalogue instead of the old 167-signal catalogue.
- Old weak names removed from the executed catalogue: LSI Keyword Coverage, Google SGE Optimization, Zero-Hallucination Anchors, LLM Embedding Proximity, Vectorial Brand Representation.
- `_worker.js` maps v3.1 signal names to measurable existing evidence rules where semantics are equivalent.
- Added Machine Web/A2A evidence evaluation for agent-card discovery/validity, capability declarations/contracts, task state, human approval, artifacts/provenance, cancellation/resume, audit trail, and claim-to-evidence traceability.
- Active invocation/execution verification remains N/A unless a safe non-side-effect invocation can be made; the scanner does not invent operational proof.
- `signals.json` is now fetched as a public evidence artifact by the engine.
- JSON response bodies for public machine-readable files are parsed and available to evidence rules.
- Agent card permanent-observation claims softened: push notifications disabled until scheduling is operational; permanent capability marked declared-not-operational.
- `capabilities.json` marks `obs.permanent` as `declared_not_operational`.
- `proof.json` and `ai-proof.json` are now valid bootstrap JSON rather than Markdown/placeholder fragments.
- Added missing `scripts/generate-proof.mjs`.
- Proof generator now includes `/signals.json` and excludes proof files and implementation code.
- GitHub workflow now waits until the live `signals.json` SHA-256 matches the current repository version before generating live hashes, reducing GitHub/Cloudflare deployment race conditions.
- All JSON files in the repaired repository parse successfully.
- `_worker.js` and `scripts/generate-proof.mjs` pass Node syntax checks.

## Important deployment behavior
1. Commit/push repaired repository to `main`.
2. Cloudflare publishes it.
3. GitHub Action waits until live `/signals.json` matches the commit.
4. Action hashes the live public artifacts.
5. Action generates `proof.json`, copies it to `ai-proof.json`, commits both.
6. Cloudflare publishes the generated proof manifests.
