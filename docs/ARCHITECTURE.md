# Architecture

## Current implementation

- `apps/web/index.html`, `styles.css`, `app.js`: static responsive web UI and language strings.
- `apps/web/manifest.webmanifest`: PWA metadata (icons still need to be added).
- `apps/web/service-worker.js`: caches an explicit static application shell; it must never cache live lottery responses as if they were current.
- `src/domain/match-ticket.ts` and `src/domain/types.ts`: shared domain matching guard and contracts.
- `tests/match-ticket.test.ts`: domain regression tests.
- `.github/workflows/ci.yml`: automated checks.

## Target boundaries

1. **Presentation clients:** Web/PWA and a separate native Android client. The current repository has the web client only; native Android must not be represented as complete.
2. **Ticket recognition:** Optional OCR adapter. OCR output is untrusted input and requires user review. Manual entry remains available.
3. **Result providers:** Provider adapters must use explicitly authorized official or licensed access. Provider response is untrusted until schema, identity, draw date, retrieval time and provenance validate.
4. **Domain rules:** Each supported lottery/rule version has its own deterministic evaluator and effective dates. Unknown lottery/rule versions fail closed.
5. **Result UI:** Only displays a match outcome after the source, draw and rule gates pass. Unavailable, stale, conflicting and unverified results must be distinguishable.

## Trust boundary

Do not add a production backend, upload endpoint, external OCR service, analytics, account system or live provider until its data flows, access rights, secrets and retention are reviewed. Never put provider secrets in browser code.

## Offline contract

Only the application shell may be cached by the service worker. Offline state must explicitly say that live results cannot be checked; any future cached result must retain draw date and freshness/provenance metadata.
