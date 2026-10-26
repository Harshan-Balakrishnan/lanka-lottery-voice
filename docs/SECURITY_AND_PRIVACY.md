# Security and Privacy

## Current safeguards and limits

- The current web prototype previews selected ticket photos in the browser; it does not connect to a server-side OCR or result service.
- Image selection has an allowlist of supported image MIME types, a 10 MB limit, decoded-dimension checks and temporary object URL cleanup.
- The service worker should cache only static application assets, never user ticket images or live result responses.
- The matching guard fails closed when results are absent/unverified, draw metadata mismatches, dates are invalid, source URL is not HTTPS, or a compatible rule set is missing.
- No full penetration test or legal compliance certification has been performed.

## Required before introducing remote processing

1. Document every purpose, field, processor, retention period and cross-border transfer.
2. Use HTTPS, strict server-side validation, bounded request sizes, rate limits, safe error messages and authorization where needed.
3. Store secrets only in deployment secret configuration; never ship them to browser JavaScript or public repository files.
4. Avoid logging ticket images, extracted numbers or unnecessary identifiers.
5. Define deletion and retention behavior, processor contracts, incident response and access logging.
6. Review CSP, security headers, dependency advisories, external link handling and cache behavior.
7. Obtain qualified Sri Lankan legal advice and verify current operative data-protection provisions from authoritative sources before launch.

## Lottery source integrity

Official-looking pages are not proof of permission to scrape or republish data. Use authorized interfaces or documented permission. Do not bypass authentication, CAPTCHAs or anti-bot controls. Keep provider, source URL, draw date, retrieval timestamp, verification and rule version with every result. Conflicting or stale data must block a verdict.

## Privacy wording

Say that ticket photos are handled locally by the current prototype only when that statement matches the actual client flow. Do not promise zero platform-side processing or zero hosting logs. Explain any future remote processing before the user submits a photo.
