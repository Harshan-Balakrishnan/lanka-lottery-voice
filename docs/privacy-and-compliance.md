# Privacy and compliance

Status: engineering checklist, not legal advice or a claim of compliance.

## Primary legal research starting points
- Data Protection Authority of Sri Lanka: https://www.dpa.gov.lk/
- DPA guidelines and downloads: https://www.dpa.gov.lk/guidelines.php
- Personal Data Protection Act No. 9 of 2022.
- Personal Data Protection (Amendment) Act No. 22 of 2025.
- DPA-listed Extraordinary Gazette No. 2498/16 dated 22 July 2026.
- DPA guidance, regulations, circulars and subsequent gazettes current at the time of launch.

The DPA's current downloads page lists the 2022 Act, the 2025 Amendment Act and a July 2026 Gazette. The contents and legal effect of all applicable provisions, commencement dates, regulations and transitional provisions must be reviewed from the official instruments by qualified Sri Lankan counsel. Do not rely on outdated secondary summaries or assume a prior deadline is still applicable.

## Data inventory (planned)
| Data | Purpose | Default handling |
|---|---|---|
| Ticket image | User-requested reading | Process locally where feasible; do not upload/store by default |
| OCR candidates | Help user transcribe the ticket | Keep only for the active check; allow correction and discard |
| Confirmed ticket fields | Match the requested draw | Avoid account-linked persistence; clear when user starts over or leaves |
| Source result and provenance | Explain the check | Store only under a reviewed, permitted source/cache policy |
| Operational logs | Reliability/security | Exclude image bytes, full ticket values and unnecessary identifiers |
| Language preference | User experience | Store locally only if the user chooses or browser defaults suffice |

## Product requirements
- Explain the purpose of camera/gallery permission at the point of use.
- Do not request camera access at first launch.
- Do not require account creation for basic checking unless a documented need is established.
- Do not collect NIC, bank details, address, contact list, audio, precise location or advertising identifiers for the core feature.
- Do not train models on submitted tickets by default.
- If server-side processing is introduced, disclose exactly what is sent, why, where it is processed, who can access it, retention/deletion period, and any international transfers.
- Provide a clear discard/reset flow.
- Never log raw images, OCR text or ticket fields unless an independently justified, documented and lawfully reviewed need exists.
- Analytics, crash reporting and advertising SDKs require separate minimisation and legal review.

## Questions for legal review
1. Which provisions of the Act as amended and applicable regulations are in force on the intended release date?
2. Is the operator a controller, processor, or both for each processing purpose?
3. What lawful basis, notices, rights-handling, security, breach response, DPIA, DPO, records and retention obligations apply?
4. Do any children use the service and what additional safeguards are required?
5. Are overseas cloud/OCR/TTS services used, and what transfer restrictions or safeguards apply?
6. Are lottery results and prize structures subject to reuse, attribution, copyright, database or contractual restrictions?
7. Are disclaimers, consumer protection, accessibility and any sector-specific requirements adequate?

## Release gate
Do not claim "PDPA compliant" until the current official legal instruments have been reviewed by qualified counsel, a data inventory and retention schedule exist, user notices and controls are implemented, vendor/data-transfer contracts are reviewed, and required assessments/records are completed.
