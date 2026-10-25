# Official source research log

Last reviewed: 2026-10-25. Status: initial public-site inspection only; no production integration approved.

## Official starting points and observations

| Board | Source | Observation | Integration status |
|---|---|---|---|
| DLB | https://www.dlb.lk/ | Homepage publicly displays a "Latest Result" section with lottery names, draw numbers, dates and fields | Not integrated |
| DLB | https://www.dlb.lk/result/en | Results page is publicly indexed with lottery names, draw numbers, dates and result fields | Not integrated; page content/markup and date routing need validation |
| DLB | https://www.dlb.lk/lottery/en | Lottery catalogue includes published prize structures for several lottery types | Research only; each rule needs draw-effective-date validation and independent review |
| NLB | https://www.nlb.lk/ | Official board homepage | Not integrated |
| NLB | https://www.nlb.lk/resultsdlb | Official page indexed with multiple NLB lottery results and draw numbers/dates | Not integrated; confirm current route, full content, and intended machine access |

The official DLB homepage showed results dated 2026-10-24 during the 2026-10-25 review. This is a dated observation, not a cached result for the application and not proof that a result is eligible for a particular ticket. The NLB search/index snapshot surfaced older July 2026 material, so that snapshot alone is not evidence of current NLB freshness.

Primary sources reviewed:
- DLB homepage: https://www.dlb.lk/
- DLB results: https://www.dlb.lk/result/en
- DLB catalogue: https://www.dlb.lk/lottery/en
- NLB results: https://www.nlb.lk/resultsdlb

## API, terms and permission status

No documented public API or explicit automated-retrieval permission has been verified in this research pass. This does not prove that no API or permission exists; it means the repository currently has insufficient evidence to build a production connector safely.

Before an adapter is enabled, obtain and retain:
1. Official API/feed documentation or written permission.
2. Applicable website terms and rules for caching, transformation, attribution and redistribution.
3. Rate limits, permitted request cadence, and contact for correction reports.
4. Expected schema, publication timestamps, draw identity and correction process.
5. A method to validate historical fixtures and detect layout/schema changes.

Do not assume a public results page implies permission for unrestricted automated collection or commercial reuse. Do not bypass access controls, CAPTCHAs, rate limits or anti-bot protections. Do not reverse-engineer private endpoints as a substitute for permission.

## Required provenance per result

- Board and canonical lottery ID/name.
- Draw date and draw number when provided.
- Structured fields preserving leading zeroes, positions, letters and symbols.
- Original source URL and retrieval timestamp in UTC.
- Source publication timestamp if provided.
- Verification status assigned by trusted source policy.
- Schema/parser version and applicable rule-set version.
- Immutable internal record ID and content hash where useful.
- Correction/supersession status and replacement record reference.

## Defined verification states

- `VERIFIED_CURRENT`: source policy for this exact lottery/draw has validated identity, schema, current eligibility and correction state.
- `VERIFIED_BUT_OLD`: data appears authentic but the per-lottery policy does not permit a current ticket verdict.
- `SOURCE_UNAVAILABLE`: source could not be reached or required content was not available.
- `UNVERIFIED`: required source validation is incomplete.
- `CONFLICTING_SOURCES`: credible source records disagree; affected verdicts stop.
- `CORRECTED_OR_SUPERSEDED`: a record has been replaced or is under correction; do not use it for a verdict.

These states describe trust/eligibility, not whether a draw is recent in calendar terms. A recent fetch may contain an old draw. Freshness policy must be configured and documented for each lottery's publication schedule, and a source adapter must set the status only after checking draw identity.

## Failure behaviour

If the official source is unavailable, cannot be parsed, has an unexpected layout, lacks unambiguous draw identity, conflicts with another record, or appears corrected, stop automated verdicts. Never silently fall back to a prior draw and label it current. If a historical result is displayed for reference, clearly show its date and status and disable matching when policy does not allow it.

## OCR and voice research

Text recognition must be benchmarked on lawfully obtained, representative ticket images from both boards, including low light, blur, glare, folds and different print layouts. Google's published ML Kit Text Recognition v2 language/script list does not establish Tamil/Sinhala script support; do not assume either language can be accurately read by that engine. See https://developers.google.com/ml-kit/vision/text-recognition/v2/languages.

Android text-to-speech availability depends on the installed engine and locale. Check runtime voice availability, offer readable text and manual entry, and never make speech the only way to understand the result.

## Privacy/legal research

The Sri Lankan Data Protection Authority currently lists the Personal Data Protection Act No. 9 of 2022, the Personal Data Protection (Amendment) Act No. 22 of 2025, and an Extraordinary Gazette dated 2026-07-22. The current legal effect, commencement provisions and applicable regulations must be reviewed from the official instruments with qualified Sri Lankan counsel before release. See https://www.dpa.gov.lk/guidelines.php. This repository makes no claim of legal compliance.
