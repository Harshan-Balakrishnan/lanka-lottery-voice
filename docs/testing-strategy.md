# Testing strategy

## Unit and domain tests
- Verify every result status and its matching eligibility.
- Test draw identity, draw number, rule effective-date boundaries, and rule-version mismatch.
- Preserve leading zeroes and test exact positional behaviour in each lottery-specific evaluator.
- Test invalid dates, malformed timestamps, empty fields and unexpected data.
- Keep matching deterministic and free of network/UI dependencies.

## Integration and UI tests
- Use authorised, saved fixtures for source parsers; do not make live scraping a normal CI dependency.
- Test source corrections, unavailable sources, conflicting sources, and cache keys.
- Test form validation, manual entry, photo preview/removal, language selection, voice fallback, keyboard focus and screen-reader status announcements.
- Test responsive layout at 320, 360, 390, 768 CSS pixels and desktop widths.

## Security and privacy tests
- Run dependency, licence and secret scans.
- Validate image content, size and dimensions before any server-side processing.
- Test output encoding for source/OCR text, request limits and allowlisted source fetching if those components are implemented.
- Test authorisation for privileged rule changes if an admin workflow is introduced.

## Evidence policy
A test counts as passed only when command output or a GitHub Actions run proves it. A configured workflow is not proof of success. Record commit SHA, runtime/tool versions, command, exit status and failures.

## Current execution record
Repository inspection succeeded through GitHub; local clone failed because this environment could not resolve github.com. GitHub Actions CI run 85 passed domain tests, TypeScript typecheck, web JavaScript syntax validation and manifest JSON validation. npm install reported zero known vulnerabilities. Android build run 36 successfully assembled the debug APK and uploaded an artifact. No real-device, accessibility, end-to-end, independent licence or penetration tests have been run.
