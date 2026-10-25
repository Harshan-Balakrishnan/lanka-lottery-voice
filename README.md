# Lanka Lottery Voice

A Sri Lanka-focused lottery ticket assistant designed for people who find official result websites difficult to use. The product direction is **photo-first, voice-friendly, Tamil/Sinhala/English**, and supports lotteries published by both the National Lotteries Board (NLB) and Development Lotteries Board (DLB).

## Current status

**Phase 1 foundation — not production-ready.** This repository starts with a small TypeScript domain core, fail-closed matching rules, tests, and research notes. It does not yet include a live results feed, OCR pipeline, website/PWA, or Android app. No official public API or permission to scrape either board has been confirmed.

## Non-negotiable trust rules

- Never invent, infer, or silently reuse lottery results.
- Every result must retain its board, lottery name, draw date/number (when published), source URL, retrieval time, and verification state.
- If the source is stale, unavailable, ambiguous, or unverified, say so and do not announce a win/loss.
- OCR output is a suggestion. Ask the user to confirm unclear ticket numbers and letters.
- Apply only a verified rule set for the exact lottery and draw. Do not use one generic matching rule for all lotteries.
- Present matches as **possible match / no match under the verified rules**, not as a guarantee that a ticket is valid or payable. The relevant board remains authoritative.
- Do not request NIC numbers, bank details, or other unnecessary personal data. Ticket images should be processed minimally and have an explicit delete/retention policy.

## Planned architecture

1. `apps/web` — accessible responsive web app / PWA.
2. `apps/android` — separate Android app (Kotlin or Java decision to be made explicitly; no Compose assumption).
3. `services/api` — shared API, source registry, result provenance, rule versions, audit logs.
4. `packages/domain` — board-agnostic, tested ticket/result matching contracts.
5. `docs` — source research, privacy, release gates, and test plans.

The initial commit contains only the domain foundation and research documents. The app directories above are planned, not implemented yet.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm test
npm run typecheck
```

## Official source starting points

- DLB: https://www.dlb.lk/
- DLB results: https://www.dlb.lk/result/en
- DLB lottery catalogue: https://www.dlb.lk/lottery/en
- NLB: https://www.nlb.lk/
- NLB results: https://www.nlb.lk/resultsdlb

These links are research starting points, not proof of a stable API, permission to automate collection, or current result freshness. See `docs/source-research.md`.

## Release gate

Do not release automated ticket verdicts until current official source access, permitted collection method, lottery-specific prize rules, draw-date alignment, Tamil/Sinhala OCR accuracy, accessibility, privacy obligations, and real-device testing have been validated and documented.
