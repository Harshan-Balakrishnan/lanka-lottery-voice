# Lanka Lottery Voice

An independent Sri Lankan lottery ticket helper concept for people who find official result websites difficult to use. The intended experience is photo-first, voice-friendly, and available in Tamil, Sinhala and English, supporting validated lottery formats from both the National Lotteries Board (NLB) and Development Lotteries Board (DLB).

## Current status

**Early prototype — not production-ready.**

Implemented:
- A strict TypeScript domain foundation with result provenance and fail-closed matching gates.
- Unit tests for core safety gates.
- A static responsive web prototype with manual entry, local photo preview, language strings and optional browser speech.
- Documentation for architecture, source research, privacy, OCR validation, threat modelling and release gates.

Not implemented or verified:
- No live NLB/DLB results API or authorised automated connector.
- No production backend, database, authentication, OCR or admin console.
- An initial native Android Kotlin/XML Views prototype exists under `apps/android`; its debug APK builds in CI, but it has not been tested on a real device.
- No verified production lottery rule sets.
- GitHub Actions has passed domain tests, TypeScript typecheck, web JavaScript syntax and manifest validation; npm install reported zero known vulnerabilities. The Android debug APK also built successfully in CI. No real-device tests have been performed.
- No production deployment is verified.

## Trust rules

- Never invent, infer or silently reuse lottery results.
- Treat OCR as a candidate transcription and require confirmation.
- Use only a reviewed rule set effective for the exact draw.
- Do not verdict old, unverified, conflicting or corrected/superseded results.
- Say "possible match" rather than guarantee a prize or ticket validity.
- Keep ticket images local by default and avoid unnecessary personal data.
- If verification is unavailable, direct the user to the relevant official board.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm test
npm run typecheck
```

A lockfile is not currently present; dependency resolution is therefore not fully reproducible yet. Generate and commit the lockfile from a network-enabled environment before relying on CI for release evidence.

## Official research starting points

- NLB: https://www.nlb.lk/
- NLB results page currently referenced by the site: https://www.nlb.lk/resultsdlb
- DLB: https://www.dlb.lk/
- DLB results: https://www.dlb.lk/result/en
- DLB lottery catalogue/prize structures: https://www.dlb.lk/lottery/en
- Sri Lanka Data Protection Authority: https://www.dpa.gov.lk/guidelines.php

These are research starting points, not proof of an API, automated retrieval permission, reuse rights, or verified rule coverage. See [source research](docs/source-research.md).

## Documentation

- [Architecture](docs/architecture.md)
- [Repository audit](docs/repository-audit.md)
- [Acceptance criteria](docs/acceptance-criteria.md)
- [Threat model](docs/threat-model.md)
- [Source research](docs/source-research.md)
- [Privacy and compliance](docs/privacy-and-compliance.md)
- [OCR validation](docs/ocr-validation.md)
- [Testing strategy](docs/testing-strategy.md)
- [Release readiness](docs/release-readiness.md)
- [Decision log](docs/decision-log.md)

## Release gate

Do not enable automated ticket verdicts until source access is permitted, result provenance and freshness policies are validated, every supported lottery's rules are independently reviewed, OCR is benchmarked or manual-only checking is selected, and security/privacy/accessibility/device testing has evidence.
