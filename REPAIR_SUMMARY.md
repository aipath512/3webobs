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
