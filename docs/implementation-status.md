# Implementation status

Last updated: 2026-10-25

## Implemented in repository
- TypeScript domain contracts for board, lottery, draw date, result provenance, ticket readings, and versioned rule sets.
- Fail-closed result-checking guards.
- Unit tests for confirmation, verification, freshness, draw identity, and rule version.
- CI workflow configured to run Vitest and TypeScript type checking.
- Responsive web prototype with NLB/DLB selection, photo preview, manual ticket fields, English/Sinhala/Tamil interface strings, and browser speech synthesis fallback.
- Prototype states clearly that live results and OCR are not connected.
- Official-source research and release-gate documents.

## Not implemented / not verified
- No official NLB/DLB API or permitted automated data connector has been confirmed.
- No live results are fetched or cached.
- No OCR is performed on ticket photos; the image preview is local to the browser.
- Browser speech synthesis is device/browser dependent and Tamil/Sinhala voice availability is not guaranteed.
- No production backend, authentication, admin console, database, monitoring, or secrets management.
- No native Android app yet.
- No automated test or typecheck has been run in this environment; GitHub Actions is configured but its run result must be checked after GitHub starts the workflow.
- Not ready for public release or for claiming a ticket has won.

## Next engineering steps
1. Run CI and fix any type/test issues.
2. Build a reviewed catalogue of supported NLB and DLB lotteries and official rules, with sources and effective dates.
3. Resolve source access permission and implement one connector with parser fixtures and freshness tests.
4. Benchmark OCR on a consented, representative ticket set; preserve manual correction.
5. Build the shared API and admin review flow.
6. Build Android client and verify Tamil/Sinhala TTS/OCR choices on actual devices.
7. Conduct privacy, security, accessibility, and real-device release reviews.
