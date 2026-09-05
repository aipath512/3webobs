3WEBOBS — SAFE PROGRESS PATCH

This package does NOT contain an old repository snapshot.
It patches the CURRENT index.html already on GitHub.

HOW TO USE
1. Unzip this package.
2. Upload the included path exactly as-is to the root of aipath512/3webobs:
   .github/workflows/add-audit-progress.yml
3. Commit to main.
4. GitHub Actions will run automatically.
5. The workflow patches ONLY index.html, validates the change, commits it,
   and removes the temporary workflow from the repository.

WHAT CHANGES
- Adds a visible loading progress line.
- Adds an estimated 30-second countdown.
- Shows stages:
  Connecting to the site
  Collecting public evidence
  Checking links & sitemap
  Measuring performance signals
  Finalizing deterministic report
- If the estimate reaches zero before the backend returns, it shows
  "Finalizing…" plus elapsed time instead of falsely claiming completion.
- On actual completion: "Observation complete · 0 sec".

WHAT DOES NOT CHANGE
- _worker.js
- scoring
- 167-signal registry
- audit rules
- evidence logic
- PageSpeed timeout
- registry logging

After you upload it and GitHub finishes the Action, send me the resulting ZIP
or the new commit and I will verify it read-only.
