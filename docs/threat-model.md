# Threat model

Status: initial qualitative model; validate during design and before public release. No penetration test has been performed.

## Assets
- Integrity of published lottery result records and rule versions.
- Integrity of the matching decision and its explanation.
- Source adapter credentials and deployment secrets.
- User ticket images and OCR-derived ticket fields.
- Admin rule approvals and result correction history.
- Availability of the application and its source-checking service.

## Trust boundaries
- User device/browser ↔ API.
- Uploaded image/OCR output ↔ validated ticket fields.
- External official source ↔ parser/normalised result.
- Draft rule change ↔ reviewed/approved rule version.
- Public user ↔ privileged admin/operations functions.
- Runtime configuration/secrets ↔ application code.

## Threats and controls
| Threat | Impact | Initial controls / required evidence |
|---|---|---|
| Forged or stale source data | False match or false no-match | Explicit source status, draw identity, schema validation, correction history, fixture tests, alert on parser drift |
| Wrong lottery rules or rule drift | Incorrect prize assessment | Versioned rules, effective dates, official evidence, independent review, regression tests |
| OCR confusion (e.g. 0/O, 1/I) | Incorrect ticket fields | User confirmation, editable fields, confidence measured per field, manual fallback |
| Malicious image or oversized upload | Resource exhaustion or parser compromise | Local processing preferred; server limits, MIME/content validation, safe decoder, pixel/dimension limits, timeouts |
| Malicious source URL / SSRF | Internal service exposure | No client-supplied fetch URLs; allowlisted source hosts; block redirects to private/internal addresses; egress controls |
| HTML/script injection in source text | XSS or UI compromise | Treat source content as untrusted data; structured parser; context-appropriate output encoding; CSP |
| API abuse / DoS | Outage and cost | Rate limits, quotas, timeouts, bounded work, caching under permitted policy, monitoring |
| Secret leakage | Source/account compromise | Secret manager, least privilege, scanning, rotation, no client secrets |
| Privilege escalation in rule/admin tools | Malicious rules or tampering | Strong auth, role checks, review/approval separation, immutable audit trail |
| Ticket image exposure | Privacy harm | Local processing by default, no image logging, no retention by default, deletion controls, TLS if upload is necessary |
| Dependency compromise | Supply-chain risk | Lockfile, dependency and licence scanning, pinned CI actions where practical, update process |
| Cache poisoning or wrong draw reuse | Incorrect verdict | Cache key includes board, lottery, draw identity and schema/rule version; explicit status; no silent stale fallback |
| Unavailable speech locale | User misunderstanding | Detect voices, text fallback, do not claim audio support without runtime evidence |

## Security baseline
Use OWASP ASVS 5.0.0 as a requirements checklist for the web/API, selecting applicable verification requirements and recording exceptions. Assess Android separately using an appropriate mobile security standard. See https://asvs.owasp.org/.

## Release-blocking findings
Any known false-positive match, ability to change a result/rule without authorisation, secret exposure, cross-user image leak, SSRF path into internal resources, or ability to present stale/conflicting data as current blocks release.

## Test boundaries
Test only owned code and authorised environments. Do not run intrusive tests against NLB/DLB or other third-party systems without explicit permission.
