# Repository Audit

**Audit date:** 2026-10-26  
**Branch inspected:** `branding/official-logo`  
**Observed baseline:** `56adf60ec9972211fa879c8c81459b1f15493e06`

## Actual repository state

- Node.js project with TypeScript domain logic, Vitest tests, and a static web application under `apps/web`.
- The web application includes manual ticket fields, NLB/DLB selection, local image preview, English/Sinhala/Tamil translations, browser speech synthesis where supported, a web manifest, and a service worker.
- `apps/web/manifest.webmanifest` currently has an empty `icons` array.
- `apps/web/index.html` currently uses a text `LV` brand placeholder.
- The expected original logo file is not present at `apps/web/assets/lanka-lottery-voice-logo.png` on the inspected branch.
- No native Android application source tree was found in the audited repository tree. Android is therefore a gap, not a feature to claim as implemented.
- No live NLB/DLB result provider or OCR engine is configured. The UI correctly discloses these limitations.
- Matching domain guardrails and tests exist, but verified production lottery rules and authorized official data access are not established.
- CI runs unit tests, TypeScript checks, web JavaScript syntax, localization/safety checks, manifest JSON parsing, and an npm audit gate.

## Severity-ranked findings

| Severity | Finding | Evidence | Action |
|---|---|---|---|
| High / release blocker | No authorized live results provider or verified production rule sets | Web copy says official results are not connected; no provider configuration identified | Do not show win/loss verdicts; obtain permission and validate per-lottery rules |
| High / release blocker | Original logo is not committed and PWA icons are empty | HTML uses `LV`; manifest `icons: []`; expected image path returns 404 | Add original PNG, derive reproducible icon sizes, wire references and verify deployment |
| High / release blocker | OCR is not implemented | UI explicitly says photo text-reading is not connected | Keep manual entry and disclose limitation until real OCR evaluation is complete |
| High | No native Android source was found | Repository tree inspected | Treat Android as separate future work; do not call the PWA a native app |
| Medium | Real browser, screen-reader, responsive viewport and Android device tests remain unverified | CI covers source-level checks only | Run automated browser/accessibility tests and manual device checks |
| Medium | Browser storage/platform logs need review before any broader privacy claim | App itself previews photos locally; hosting infrastructure is separate | Document hosting logs and review retention before launch |

## Confirmed working vs incomplete

**Present in source:** responsive static web UI, manual entry form, NLB/DLB selector, local photo preview with file limits, three-language UI dictionary, speech synthesis fallback, static-shell service worker, domain safety gates and automated tests.

**Not implemented or not verified:** OCR extraction/correction workflow, live official results, authorized source connector, production lottery-specific rules, verified prize amounts, backend, history/account features, native Android app, full WCAG audit, real-device QA, and deployed original logo/icons.

## Release recommendation

Keep preview-only. No production promotion until original branding assets are integrated, live data access is authorized, lottery rules are independently validated, privacy/legal review is complete, and browser/device acceptance tests pass.
