# Official source research log

Status: **initial discovery only; no integration approved**. Re-check every item before implementation or release.

## Official starting points

| Board | Starting point | Purpose | Current integration status |
|---|---|---|---|
| DLB | https://www.dlb.lk/ | Official board homepage | Not integrated |
| DLB | https://www.dlb.lk/result/en | Results page | Not integrated; inspect current markup, draw dates, and terms before any automation |
| DLB | https://www.dlb.lk/lottery/en | Lottery catalogue | Not integrated; lottery-specific rules still need to be extracted and verified |
| NLB | https://www.nlb.lk/ | Official board homepage | Not integrated |
| NLB | https://www.nlb.lk/resultsdlb | Results page linked during initial discovery | Not integrated; confirm current routing and content manually |

## Unresolved before a connector can be built

1. Does either board publish an official, documented public API or downloadable results feed?
2. Do website terms or written permission allow automated retrieval, caching, transformation, and display?
3. What are the canonical IDs and exact current prize rules for every supported lottery, including draw-date and effective-date changes?
4. What is the official correction policy when a published result changes?
5. Can the displayed result be checked against a second official artefact or a human review process?
6. What request rate, cache lifetime, and attribution are permitted?

Do not assume that a results webpage implies an API or permission to scrape. Do not reverse-engineer private endpoints as a substitute for permission.

## Source record required for every result

- Board and lottery ID
- Official source URL and retrieval timestamp
- Published draw date and draw number, if available
- Raw response hash or immutable internal record ID
- Parser/connector version
- Verification state and any human review
- Rule-set version effective for that draw
- Correction history, if a result is revised

## Freshness and failure behavior

If the official source is unavailable, cannot be parsed, has an unexpected layout, or lacks an unambiguous draw date, mark it unavailable/ambiguous and stop. Never silently fall back to a cached draw and label it current. If cache is shown for reference, show its draw date and retrieval time clearly and disable ticket verdicts unless the freshness policy explicitly permits it.

## OCR and voice research

Text recognition must be benchmarked against real, consented ticket images from both boards, including Tamil/Sinhala/English labels, blur, glare, folds, low light, and different print quality. Google ML Kit Text Recognition v2's published script support does not list Tamil or Sinhala, so do not assume it can accurately read those scripts. Test alternative on-device/server OCR options and document accuracy per field and language.

Android text-to-speech support depends on the installed engine and available locale. Check locale availability at runtime, offer readable text and a language selector, and never make voice the only way to understand a result.

## Privacy and legal review

The Sri Lankan Personal Data Protection Act has had amendments; determine the currently commenced provisions and applicable obligations with qualified local advice before collecting or storing ticket images or analytics. Minimise collection, encrypt data in transit and at rest, define deletion and retention periods, and avoid storing images by default.
