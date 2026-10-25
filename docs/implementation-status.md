# Implementation status

Last updated: 2026-10-25  
Working branch: `engineering/phase-zero-audit`

## Implemented in repository
- TypeScript domain contracts now distinguish current, old, unavailable, unverified, conflicting and corrected/superseded source states.
- Matching guard checks user confirmation, valid ISO draw dates/timestamps, result provenance fields, exact board/lottery/draw identity, rule version and effective dates.
- The domain no longer uses one universal max-age number; trusted source policy must assign current/old status for each lottery.
- Unit tests cover core trust gates, leading-zero preservation, old/unavailable/conflicting/corrected results, draw mismatch and effective-date boundaries.
- Static responsive web prototype with manual ticket entry, local image preview, 10 MB/20 MP preview guard, language strings, read-aloud control and explicit stop control.
- Browser speech output checks that a voice matching the selected language is available and otherwise reports a fallback.
- PWA manifest includes an SVG icon; service worker caches the static shell only.
- CI workflow runs on pushes and pull requests, with domain tests, TypeScript typecheck, JavaScript syntax check and manifest JSON validation.
- Native Android Kotlin/XML Views starter with language resources, system camera/gallery selection, cache-local photo preview, manual ticket fields, TTS locale checks and official-site links.
- Separate Android build workflow configured to assemble a debug APK with JDK 17 and Gradle 8.9.
- Documentation added/updated: architecture, repository audit, acceptance criteria, threat model, source research, privacy/compliance, OCR validation, testing strategy, release readiness and decision log.

## Not implemented / not verified
- No official NLB/DLB API or permitted automated data connector has been confirmed.
- No live results are fetched or cached; the prototype never issues a real ticket verdict.
- No OCR is performed on ticket photos.
- No production backend, database, authentication, admin console, monitoring or secrets manager.
- Native Android starter exists, but the Gradle build has not been verified and no real-device testing has been performed.
- Browser TTS depends on available device/browser voices; this has not been tested on real devices.
- No lockfile is present, so dependency resolution is not fully reproducible.
- Tests, typecheck, build, vulnerability scan and real-device tests have not been run successfully in this environment. The configured CI run must be checked.
- Not ready for public release or for claiming a ticket has won.

## Next engineering steps
1. Review and merge the Phase Zero audit branch only after CI evidence is available.
2. Generate and commit a lockfile in a network-enabled environment; review dependencies and licences.
3. Build a reviewed catalogue of supported lotteries and official rules with sources and effective dates.
4. Obtain source-access permission and implement one connector with parser fixtures, freshness policy and correction handling.
5. Implement shared API and server-side source-policy enforcement.
6. Build the separate native Android app and validate camera, OCR/TTS choices and accessibility on actual devices.
7. Complete local legal review, security verification, accessibility testing and release sign-off.
