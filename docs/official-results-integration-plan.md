# Official results source assessment — October 2026

## What is verified so far

- DLB public results homepage: https://dlb.lk/home/en
- DLB results pages: https://www.dlb.lk/result/en
- NLB public results page surfaced in official search results: https://www.nlb.lk/resultsdlb

These pages provide useful human-readable official-result destinations. Their existence does not itself establish permission for automated scraping, API access, republication, or use of their data in a third-party service.

## Important research lead

A DLB procurement document indexed publicly describes publishing results through an API for third parties and e-lottery agents. This is evidence that an API capability has been contemplated in a DLB system, not evidence that an unrestricted public API is currently available to this project. Obtain written confirmation, API documentation, credentials, permitted usage, rate limits, attribution requirements, and change-notification arrangements from DLB before integration.

## Safe implementation decision

Until the boards confirm an authorised machine-readable feed:
- Keep clear links to the official results pages.
- Do not scrape pages from a browser client or treat parsed snippets/search results as a live data source.
- Do not calculate or announce a win/loss from unverified data.
- Show source identity, draw number/date, retrieval timestamp and validation status for any future integration.
- Fail closed if the lottery identity, draw date, rule version, or source freshness cannot be verified.
- Preserve a manual official-page fallback when connectivity or the data feed is unavailable.

## Release gates

1. Written source/API permission or an explicitly documented licence.
2. Schema and source-change contract.
3. Per-lottery matching rules reviewed against known official historical draws.
4. Automated regression tests including corrected, missing, stale, duplicate and conflicting results.
5. Real-device accessibility and language testing.
6. Privacy/security review before collecting or uploading ticket images.

## Public references for investigation

- DLB: https://dlb.lk/home/en
- DLB results: https://www.dlb.lk/result/en
- NLB results page: https://www.nlb.lk/resultsdlb
- Publicly indexed DLB procurement document mentioning an API for third parties: https://www.dlb.lk/front_attachment/1572254877LMS_Bid_Document.pdf

Last reviewed: 2026-10-25. This document is a technical research note, not legal advice or proof of API authorisation.

## Practical next step

Use [`official-results-api-access-request.md`](./official-results-api-access-request.md) to request an authorised machine-readable feed from each board. Do not activate an automated connector until permission, documentation, schema, correction policy, and test access are confirmed.
