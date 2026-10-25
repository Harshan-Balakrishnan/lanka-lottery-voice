# Architecture

Status: target architecture for incremental implementation; not a claim that all components exist.

## Current repository shape

- `src/domain/`: small TypeScript domain layer for ticket/result/rule contracts.
- `tests/`: Vitest safety-gate tests.
- `apps/web/`: static responsive web prototype; no API calls or OCR.
- `apps/android/`: native Kotlin + XML Views starter with local photo preview, language resources and optional TTS; no live API or OCR.
- `.github/workflows/`: web/domain checks and an Android debug-APK build workflow.
- `docs/`: source and release research.

There is currently no production API, database, source adapter, admin service or production-ready mobile app.

## Proposed modular monolith

Keep deployment simple until traffic and operational needs justify splitting services.

- **Web/PWA** (`apps/web`): accessible ticket capture/manual entry, user confirmation, result/source display, localised text and optional voice.
- **Android** (`apps/android`): separate native Kotlin application using XML Views, selected in decision D-007. It currently provides manual entry, system camera/gallery selection, a cache-local preview and optional TTS; do not wrap the web app in a WebView as the native deliverable.
- **API** (`services/api`): validated endpoints for lottery catalogue, eligible result lookup, ticket-check request and source health. Source credentials and privileged logic stay server-side.
- **Domain package** (`src/domain` initially): pure deterministic contracts and match guards. Later move to a shared package only when both API and clients need it; avoid duplicating business rules in clients.
- **Source adapters** (`services/api/src/sources` when created): one adapter per approved source method; parsers are isolated and fixture-tested.
- **Rule registry**: versioned lottery-specific rules with official source, effective date range, reviewer and test fixtures. Unsupported rules cannot be selected.
- **Operations**: structured minimal logs, health checks, alerting and correction history; never log ticket image bytes or unnecessary ticket contents.

## Trust boundaries and data flow

1. Browser/Android receives an image chosen by the user.
2. Local image checks and optional OCR produce candidate fields only.
3. User reviews and confirms fields.
4. API validates board, lottery, draw date, field format and supported rule version.
5. Result registry returns only a result eligible under that lottery's documented source/freshness policy.
6. Domain matching evaluates confirmed fields using the exact effective rule version.
7. UI shows outcome, source URL, draw identity, retrieval time, verification status and limitations.

Untrusted inputs: image bytes, OCR text, form fields, source HTML/JSON, source timestamps, user-supplied URLs, and cached data.

Privileged assets: source credentials, rule approval permissions, deployment secrets, and result correction history.

## API contract principles

- Version all public schemas.
- Preserve number strings, including leading zeroes.
- Use ISO 8601 UTC timestamps for retrieval and explicit local draw dates for draw identity.
- Never let the client set a result's verification status or rule version.
- Never accept an arbitrary URL from a client for server-side fetching.
- Responses distinguish unsupported, unavailable, stale, ambiguous, and conflicting results.
- A ticket match is a possible match under a documented rule, not an official prize claim.

## Failure behavior

Fail closed when a result is missing, old under the applicable policy, source status is uncertain, draw identity differs, fields are ambiguous, rules are missing/out of date, a correction is pending, or the source parser detects an unexpected schema. Manual navigation to the official board remains the fallback.

## Decision record

See `docs/decision-log.md`. Changes to result eligibility, matching rules, image retention, source access, or authentication require explicit rationale and tests.
