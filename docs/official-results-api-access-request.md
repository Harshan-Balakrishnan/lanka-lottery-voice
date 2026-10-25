# Official lottery-results data access request

Use this as a draft for a request to the National Lotteries Board (NLB) and Development Lotteries Board (DLB). Send each board a separate copy through a contact channel published on its official website. Do not send ticket photos, personal identifiers, or credentials in the initial request.

## Subject

Request for authorised machine-readable lottery results access for an accessibility-focused ticket helper

## Draft message

Dear [NLB/DLB] Team,

I am developing **Lanka Lottery Voice**, an independent Sri Lankan accessibility-focused project intended to help people understand printed lottery tickets more easily. The planned interface supports Sinhala, Tamil and English, manual ticket-detail confirmation, and spoken guidance for users who find official results websites difficult to navigate.

Before implementing any automated results feature, I would like to ask whether your organisation offers an official API, data feed, or other approved method for third-party applications to retrieve published lottery results.

If an approved method exists, could you please advise on:

1. The application process and whether written permission, a licence, or an agreement is required.
2. The current API/feed documentation, authentication method, sandbox or test environment, and onboarding contact.
3. Which lotteries and historical draw periods are covered, and which fields are authoritative (lottery identifier, draw number, draw date, result positions, letters/symbols, publication time).
4. How corrections, cancellations, delayed publication and superseded results are communicated.
5. Permitted caching, retention, transformation, attribution, display and redistribution requirements.
6. Rate limits, availability expectations, security requirements, and any fees.
7. Whether a non-commercial prototype may be tested before public release, and what review or approval is required.

The application would identify your organisation as the source, show the draw identity and retrieval/verification status, and direct users back to your official channel for final confirmation. It would not sell tickets, claim to be an official board service, or present a possible match as a guarantee of a payable prize.

I will not scrape or republish your website content as a live data service, or attempt to use private endpoints, unless an authorised method and its conditions have been confirmed. Until then, the prototype will link users to your official results pages and will not make automatic win/loss determinations.

Please let me know the appropriate department or contact person for this request.

Thank you for your time.

Kind regards,

Harshan Balakrishnan  
Developer, Lanka Lottery Voice  
GitHub project: https://github.com/Harshan-Balakrishnan/lanka-lottery-voice

## Official starting points

- NLB website: https://www.nlb.lk/
- NLB results page: https://www.nlb.lk/resultsdlb
- DLB website: https://www.dlb.lk/
- DLB results page: https://www.dlb.lk/result/en

Verify contact details on the official website before sending. This draft is not legal advice and does not imply that either board has approved the project.

## Do not enable production matching until all gates pass

- Written permission/licence or official API terms have been reviewed and retained.
- Credentials are stored server-side in a secrets manager, never committed to the repository or embedded in browser/mobile code.
- The schema preserves leading zeroes, result ordering, letters and symbols.
- Draw identity, source publication time, retrieval time, correction status and rule version are retained.
- Known official historical draws pass automated regression tests.
- Stale, missing, conflicting, corrected, malformed or ambiguous data fails closed.
- Lottery-specific prize/matching rules have been reviewed for the exact draw date.
- Privacy, security, accessibility, language, and real-device release checks are complete.
