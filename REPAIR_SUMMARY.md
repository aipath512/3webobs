# 3webs repair summary — 2026-08-25

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
