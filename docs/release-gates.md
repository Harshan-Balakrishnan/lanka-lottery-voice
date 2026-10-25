# Release gates

No item below is considered complete until evidence is attached to an issue or pull request.

## Source integrity
- [ ] Confirm official public feed/API or written permission for collection.
- [ ] Document terms, attribution, rate limits, cache policy, and contact for corrections.
- [ ] Test parser against archived examples and current official pages.
- [ ] Fail closed on missing fields, HTML layout changes, wrong dates, duplicates, and stale data.
- [ ] Maintain immutable provenance and correction history.

## Lottery rules
- [ ] Inventory NLB and DLB lottery products.
- [ ] Confirm each prize tier and exact matching conditions from official rule material.
- [ ] Version rules by effective date and draw.
- [ ] Independently review rules with a human reviewer.
- [ ] Add positive, negative, boundary, and historical regression tests for each lottery.

## Photo and OCR
- [ ] Ask permission before camera/gallery access and explain image use.
- [ ] Confirm detected board, lottery, draw date, numbers, and letters with the user.
- [ ] Test across languages, lighting, blur, folds, glare, and device cameras.
- [ ] Measure field-level accuracy on a consented, representative test set.
- [ ] Provide manual entry and easy correction at every point.
- [ ] Delete images by default unless the user explicitly opts into retention.

## Accessibility and voice
- [ ] Test large text, high contrast, screen readers, one-handed use, and low-end Android devices.
- [ ] Support Tamil, Sinhala, and English with explicit language selection.
- [ ] Verify installed TTS locale at runtime and provide text fallback.
- [ ] Use plain language and avoid announcing an unverified win/loss.

## Security and privacy
- [ ] Threat model ticket images, user history, admin access, and source credentials.
- [ ] No secrets in client apps or repository.
- [ ] Authenticate and authorise admin actions; log sensitive changes.
- [ ] Add abuse controls, request limits, dependency checks, and security tests.
- [ ] Obtain local privacy/legal review, including currently applicable PDPA provisions.
- [ ] Publish privacy notice, retention/deletion controls, and support contact.

## Release
- [ ] Automated tests and type checks pass in CI.
- [ ] Website/PWA tested on mobile and desktop.
- [ ] Android app tested on real devices and multiple Android versions.
- [ ] Backup/restore and incident response rehearsed.
- [ ] Result source freshness and outages visible to users.
- [ ] Independent review signs off on all supported lottery rules.
