# QA and Release

## Current automated checks

GitHub Actions runs:
- `npm test`
- `npm run typecheck`
- `node --check apps/web/app.js`
- `node apps/web/verify-ui.mjs`
- JSON parsing of `apps/web/manifest.webmanifest`
- `npm audit --audit-level=high`

Check the exact workflow run and commit before reporting a pass. A passing CI job does not prove accessibility, browser rendering, Android compatibility or legal compliance.

## Manual and automated acceptance matrix

- Viewports: 320, 360, 375, 390, 412, 430, 768, 1024, 1440 px.
- Languages: English, Sinhala and Tamil, including long labels and errors.
- Images: valid JPEG/PNG/WebP, wrong MIME, >10 MB, oversized decoded dimensions, corrupt file, camera denied, camera unavailable, retake/remove.
- Form: empty required fields, whitespace, leading zeros, unexpected characters, invalid dates and unconfirmed values.
- Result source: unavailable, timeout, stale, malformed, wrong board, wrong lottery, wrong draw date, conflicting sources and unsupported rule version.
- Accessibility: keyboard-only, focus order, screen reader, 200% zoom, text scaling, reduced motion, contrast and live status announcements.
- PWA: install prompt availability, icon paths, update lifecycle, offline shell and explicit offline results warning.
- Android: install, permission denied, lifecycle/rotation, back navigation, offline, timeout and low-memory device.

## Release gates

1. Audit code and verify the original logo/icon assets in the built output.
2. Run the exact commit's CI and dependency audit.
3. Confirm authorized result source access and rule fixtures.
4. Test browser and accessibility workflows against the candidate preview.
5. Test on a real Android device if a native app exists.
6. Verify candidate URL, commit SHA and deployment status.
7. Keep production separate; do not merge/promote or weaken deployment protection without authorization.
8. Maintain a rollback target and record release evidence.
