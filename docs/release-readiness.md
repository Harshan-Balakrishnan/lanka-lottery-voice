# Release readiness

Current release status: **NOT READY**.

## Release blockers
- [ ] No official source integration permission documented.
- [ ] No live result adapter or source-health checks.
- [ ] No reviewed lottery catalogue and versioned production rules.
- [ ] No API/backend or safe result persistence.
- [ ] No OCR engine or benchmark.
- [ ] No native Android app.
- [ ] Tests/typecheck/CI result not yet verified.
- [ ] No dependency lockfile or completed vulnerability/licence scan.
- [ ] No legal review of current Sri Lankan data protection obligations.
- [ ] No security, accessibility or real-device test evidence.
- [ ] No privacy notice, support process, retention controls or incident response evidence for a production service.

## Minimum release evidence
1. Approved source access method and attribution.
2. Independently reviewed rules for every enabled lottery and draw period.
3. Test report with zero known false-positive match defects.
4. OCR evaluation report by critical field and ticket conditions, or a manual-only launch scope.
5. Privacy/legal review and implemented notices/controls.
6. Threat-model review and selected ASVS/mobile security checklist results.
7. CI test/typecheck/build and dependency/security scans passing.
8. Manual test report on low-end Android and current mobile browsers.
9. Source outage, stale draw, correction and conflicting-source simulations.
10. Backups, monitoring, incident response and rollback procedure if backend persistence is introduced.

## Safe limited launch alternative
A static helper that guides users to official NLB/DLB pages and supports manual navigation can be released only after accessibility, privacy, security and deployment checks. It must not claim to check a ticket or display a match/no-match verdict.
