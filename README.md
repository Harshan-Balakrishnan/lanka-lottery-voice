# Lanka Lottery Voice

An independent Sri Lankan lottery-ticket helper concept for people who find official results websites difficult to use. The intended experience is photo-first, voice-friendly and available in Tamil, Sinhala and English, covering NLB and DLB within verified capabilities.

## Current status

**Prototype — not production-ready.** The repository includes a static responsive web/PWA prototype and a tested TypeScript domain foundation. It does not yet have a live official results connector, OCR engine, verified production rule sets, backend or native Android source tree.

The user-supplied official logo is available in the conversation, but has not yet been committed as a binary repository asset. The current web header still uses the temporary `LV` mark and the PWA manifest icon list remains empty. Do not treat the branding integration as complete until the original PNG is tracked in Git and all icon paths are verified.

## Non-negotiable trust rules

- Never invent, infer, or silently reuse lottery results.
- Every future result must retain board, lottery, draw date/number, source URL, retrieval time, verification state and rule version.
- If a source is stale, unavailable, ambiguous, conflicting or unverified, do not announce a win/loss.
- OCR output is a suggestion. Ask the user to review and confirm uncertain ticket numbers and letters.
- Apply only a verified rule set for the exact lottery and draw. Never apply a generic matching rule blindly.
- Describe any match as a possible match under verified rules, not a guarantee that a ticket is valid or payable.
- Do not request NIC numbers, bank details or other unnecessary personal data. Minimize photo retention.

## Current features

- Responsive web form with NLB/DLB selection.
- Manual ticket details and draw-date entry.
- Local ticket photo preview with type/size/dimension safeguards.
- English, Sinhala and Tamil UI translations.
- Browser text-to-speech where the browser supports it.
- Static-shell service worker with offline shell caching.
- TypeScript domain matching guardrails and regression tests.

## Missing or unverified

- Authorized live result access for NLB and DLB.
- Production-verified lottery-specific prize rules.
- OCR extraction and correction workflow.
- Backend, accounts, history or result administration.
- Native Android application.
- Verified official logo integration and complete PWA/Android icon set.
- Full browser, accessibility and real-device test evidence.
- Legal/privacy sign-off for future processing and official data reuse.

## Architecture

- `apps/web` — static web app/PWA.
- `src/domain` — shared TypeScript matching contracts and fail-closed guard.
- `tests` — automated domain tests.
- `docs` — audit, architecture, design system, acceptance criteria, privacy/security, QA/release and decisions.

See [Repository Audit](docs/REPOSITORY_AUDIT.md), [Architecture](docs/ARCHITECTURE.md), [Design System](docs/DESIGN_SYSTEM.md), [Acceptance Criteria](docs/ACCEPTANCE_CRITERIA.md), [Security and Privacy](docs/SECURITY_AND_PRIVACY.md), [QA and Release](docs/QA_AND_RELEASE.md) and [Decisions](docs/DECISIONS.md).

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm test
npm run typecheck
node --check apps/web/app.js
node apps/web/verify-ui.mjs
```

## Official source starting points

- NLB: https://www.nlb.lk/
- NLB results: https://www.nlb.lk/resultsdlb
- DLB: https://www.dlb.lk/
- DLB results: https://www.dlb.lk/result/en

These links are research starting points, not proof of a stable API, permission to automate collection, or current result freshness. Review `docs/source-research.md`.

## Release gate

Do not release automated ticket verdicts until authorized official source access, permitted collection method, lottery-specific rules, draw-date alignment, OCR accuracy, accessibility, privacy/legal obligations and real-device tests are validated and documented. Keep changes in preview until the acceptance checklist is satisfied.
