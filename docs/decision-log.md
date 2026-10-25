# Decision log

## D-001 — No result verdict without a verified eligible source
- Date: 2026-10-25
- Decision: the domain core fails closed unless result provenance, draw identity, effective rule version and source-policy eligibility are valid.
- Reason: a false positive can mislead a user about a financial outcome.
- Consequence: unsupported lotteries and source outages require manual official-site fallback.

## D-002 — Do not assume scraping permission
- Date: 2026-10-25
- Decision: no production source adapter until API/feed documentation or a lawful, permitted collection method is evidenced.
- Reason: a public results page does not establish unrestricted automated reuse.
- Consequence: source integration remains blocked pending research/permission.

## D-003 — Separate native Android from web/PWA
- Date: 2026-10-25
- Decision: keep native Android as a separate deliverable sharing documented API/domain contracts; do not treat a WebView wrapper as the native app.
- Reason: camera lifecycle, offline handling, accessibility and device voice support need platform-specific treatment.
- Consequence: Android is not considered implemented by the web prototype.

## D-004 — Manual confirmation remains mandatory
- Date: 2026-10-25
- Decision: OCR is advisory and all critical fields are editable and confirmed before matching.
- Reason: character confusions can cause false matches.
- Consequence: no unconditional verdict directly from OCR output.

## D-005 — No production claim from configured CI
- Date: 2026-10-25
- Decision: only recorded command output or GitHub workflow status counts as test evidence.
- Reason: the initial workflow configuration and empty status response do not prove tests passed.
- Consequence: release remains blocked until CI is observed green.

## D-006 — Choose the simpler modular monolith
- Date: 2026-10-25
- Decision: start with a modular API and pure domain core; do not add microservices before operational need exists.
- Reason: reduces deployment and maintenance complexity for an early-stage product.
- Consequence: keep boundaries explicit in code while keeping deployment simple.
