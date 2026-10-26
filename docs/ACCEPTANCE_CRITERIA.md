# Acceptance Criteria

## Branding and PWA
- [ ] Original supplied logo is committed as an actual binary asset and tracked by Git.
- [ ] Header and relevant brand surfaces reference the original logo with meaningful alt text.
- [ ] Square, 192 px, 512 px, maskable, favicon and touch icons are reproducibly derived and visually inspected.
- [ ] Manifest has valid icon metadata and correct paths; all referenced assets return success from the deployed build.
- [ ] No LV text placeholder or broken logo reference remains.

## Core workflow
- [x] NLB/DLB selection and manual ticket details are available in the current web prototype.
- [x] Photo selection previews locally with file-size and decoded-pixel guardrails.
- [x] User sees that OCR and live results are not connected.
- [ ] Real OCR supports review/edit and uncertainty indicators.
- [ ] Authorized official results and verified lottery-specific rules are available.
- [ ] Unavailable, stale, conflicting and unsupported states are tested and fail closed.

## Language and accessibility
- [x] English, Sinhala and Tamil translation dictionary exists.
- [ ] Every UI string and error path is verified in all three languages.
- [ ] Screen-reader, keyboard-only, contrast, zoom and reduced-motion tests pass.
- [ ] Responsive checks pass at 320, 360, 375, 390, 412, 430, 768, 1024 and 1440 px.

## Platform and release
- [x] Automated CI runs unit tests, type checking, syntax checks, localization/safety checks, manifest parsing and dependency audit.
- [ ] Browser smoke tests pass against the exact candidate deployment.
- [ ] Real Android device and installation tests pass.
- [ ] Native Android application exists and is tested (currently not found in the audited tree).
- [ ] Legal/source-access review and privacy review are signed off.
- [ ] Production promotion is separately authorized.
