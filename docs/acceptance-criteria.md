# Acceptance criteria

Status: target criteria. Items are not complete merely because they are documented.

## Ticket workflow
- [ ] A first-time user can choose Tamil, Sinhala or English before entering ticket data.
- [ ] Camera/gallery access occurs only after an explicit user action.
- [ ] Manual entry is available if photo capture/OCR fails.
- [ ] All detected fields are editable and require confirmation before checking.
- [ ] Leading zeroes are preserved.
- [ ] Unsupported or unrecognised ticket types are rejected without guessing.

## Result trust
- [ ] Only supported lottery IDs and reviewed rule versions can be checked.
- [ ] A result includes board, lottery, draw identity, source URL, retrieved-at UTC, verification state, schema version, and applicable rule version.
- [ ] Old, unavailable, unverified, conflicting or superseded results never produce a match/no-match verdict.
- [ ] A recently retrieved old draw is not treated as current.
- [ ] A correction invalidates affected prior checks until the replacement is reviewed.
- [ ] UI says "possible match" rather than guaranteeing a prize.
- [ ] Manual link to the official board is available on every result state.

## Domain correctness
- [ ] Rule effective date range must include the ticket's draw date.
- [ ] Ticket and result board, lottery ID, draw date and draw number (when known) must agree.
- [ ] Missing/invalid dates, empty required fields and mismatched rule versions fail closed.
- [ ] Each lottery rule has source evidence, independent review and positive/negative/boundary tests.
- [ ] No unvalidated generic rule can be registered as production-ready.

## Accessibility and localisation
- [ ] Core journey works at 320 CSS pixels wide without horizontal scrolling.
- [ ] Touch targets, focus indicators, labels, fieldsets and status announcements are tested.
- [ ] Status is communicated by text and not colour alone.
- [ ] Reduced-motion preferences are honoured.
- [ ] Tamil/Sinhala/English strings are reviewed by fluent human reviewers before production.
- [ ] Voice is optional, stoppable, and has text fallback; runtime voice availability is checked.

## Privacy/security
- [ ] Ticket images stay local by default; any server processing is disclosed before upload.
- [ ] Image file content and dimensions are validated, with size/time/resource limits.
- [ ] No unnecessary identity or payment data is collected.
- [ ] Retention/deletion behaviour is implemented and documented before persistence is introduced.
- [ ] No secret is committed or shipped to clients.
- [ ] Source retrieval cannot fetch arbitrary client-provided URLs.
- [ ] Admin/source correction permissions are least-privilege and audited if an admin interface is added.
- [ ] Applicable security verification requirements and exceptions are documented.

## Operations and release
- [ ] CI installs deterministically and runs tests/typecheck/build.
- [ ] Dependency, licence and secret scans run in CI.
- [ ] Monitoring distinguishes source outage, stale result, parser error and application error.
- [ ] Source failures never silently use a prior draw as current.
- [ ] Android and web clients are tested on representative low-end devices and network conditions.
- [ ] No production release until legal review, source permissions, rules review and device testing are evidenced.
