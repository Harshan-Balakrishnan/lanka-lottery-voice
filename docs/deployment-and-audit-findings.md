# Deployment access and implementation audit

Audit date: 2026-10-25
Scope: repository source available on `main`, Vercel project metadata available to the connected account, and the candidate preview deployment. This is a code/configuration review, not a penetration test or legal opinion.

## Deployment identity and access

| Item | Observed value |
|---|---|
| GitHub default branch | `main` |
| Candidate preview | `lanka-lottery-voice-preview-9cwagh1jj.vercel.app` |
| Candidate deployment ID | `dpl_GoDaKXz5aBH82wVFkPAWckiSLvSb` |
| Candidate project | `lanka-lottery-voice-preview` / `prj_nzBUYTSeu5QrMa0HIbAnXxZUIIZd` |
| Candidate source | `improvements/tri-language-safety` |
| Candidate commit | `3dd65b54e0cc51591232b7e27a7ab58f452df6e0` |
| Candidate build state | `READY` |
| Candidate target | Preview (`target: null`) |
| Stable preview alias | `lanka-lottery-voice-preview.vercel.app`, mapped to a separate deployment on `engineering/phase-zero-audit` at `c1522288fbbd450933d47ae496e5b6d697a8efee` |
| Project SSO protection | Enabled, deployment type `all_except_custom_domains` |
| Project password protection | Disabled |
| Trusted IP protection | Disabled |

### Finding: authentication gate

**Confirmed at the project-configuration level:** Vercel reports SSO/Deployment Protection enabled for all deployments except custom domains. The candidate uses a generated `.vercel.app` deployment hostname, not a custom domain. This setting is consistent with Vercel intercepting the request before the application loads.

This confirms a platform-level protection configuration that can explain the login page. It does not establish that every user-facing redirect was captured in a browser, and it does not indicate that the app has its own authentication system. No application login implementation was found in the inspected static web entry points.

The candidate deployment is `READY`, but that alone does not verify browser rendering, mobile usability, or successful reviewer access. A Vercel share-link request was denied with 403 for the deployment lookup, so a working reviewer share link has **not** been confirmed. Do not disable project-wide protection to work around this.

### Safe reviewer access options

1. Keep the current protected project and grant approved Vercel team access to reviewers who need private previews.
2. If public usability testing is required, create a separate public preview project/environment with only non-sensitive source and no secrets or private data. Set its access policy explicitly and test that URL from a signed-out browser.
3. Do not change production protection or promote a deployment as part of this audit.

## Current application functionality

### Implemented in source

- Static responsive HTML/CSS/JavaScript web prototype.
- NLB/DLB board selector, lottery name, optional draw date, manual number/letter entry, and user confirmation checkbox.
- Local browser photo preview; no upload is performed by this prototype.
- English, Sinhala and Tamil strings, plus optional browser speech synthesis.
- A clear disclosure that no live official results are connected and that no win/loss conclusion is made.
- TypeScript domain contracts and fail-closed matching guards, with tests for user confirmation, result verification, draw identity, freshness and rule version.
- GitHub Actions workflows exist for domain/web checks and a separate Android debug build.

### Not implemented or not verified

- No authorised live NLB/DLB connector or machine-readable feed.
- No OCR engine; selecting a photo does not extract text.
- No production lottery-specific rule catalogue, verified production results, backend, admin console, database or authentication system.
- No production release, browser end-to-end run, accessibility audit, penetration test or real-device validation evidenced by this review.
- The repository README and source-research document explicitly say official-source permission and production rules remain unresolved.
- The Android workflow is separate from the current web prototype; no real-device Android test is evidenced here.

## Findings and severity

| Severity | Finding | Evidence / affected area | Action |
|---|---|---|---|
| Critical release blocker | No authorised official result connector or validated production rules | `docs/source-research.md`, `src/domain/match-ticket.ts` | Do not provide real win/loss verdicts until source access and each rule set are independently verified. |
| High | Candidate preview requires platform SSO for generated deployment URLs | Vercel project protection metadata | Use approved team access or a separate non-sensitive public preview. Preserve existing protection. |
| High | Photo preview accepted any `image/*` file without byte/pixel limits in `main` | `apps/web/app.js` before this branch | Add MIME allowlist, 10 MB cap, decoded 20 MP cap, safe failure text, and object URL cleanup. |
| High | Offline service worker cached arbitrary successful same-origin GET responses | `apps/web/service-worker.js` before this branch | Restrict caching to a fixed static shell allowlist; do not cache arbitrary paths or query URLs. |
| Medium | Changing language after submitting left dynamic result status in the previous language | `apps/web/app.js` before this branch | Re-render dynamic status messages from the selected dictionary. |
| Medium | CI only ran domain tests and TypeScript typecheck on `main` | `.github/workflows/ci.yml` | Add web syntax, locale coverage, photo safety, cache-policy and manifest checks. |
| Medium | No automated browser, screen-reader, keyboard, contrast or real-device evidence | Release-gate checklist | Add browser automation and human/device acceptance testing before public release. |
| Open legal question | Permission to retrieve, cache, transform and republish NLB/DLB data remains unconfirmed | `docs/source-research.md` | Obtain current terms/written permission and qualified Sri Lankan privacy/legal review; do not scrape private endpoints. |

## Changes proposed in this branch

- Enforce a local-photo MIME allowlist, 10 MB file limit, 20-megapixel decoded-image limit, readable validation messages, and temporary URL cleanup.
- Keep dynamic result-status text in the selected language after language changes.
- Restrict the service worker to known static shell assets only.
- Add CI regression checks for translations, safe result messaging, photo limits, object URL cleanup, external link protections, cache scope, JavaScript syntax and PWA manifest validity.
- Enforce lottery rule effective-from/effective-to dates, strict ISO draw dates, non-empty ticket number entries and HTTPS source URLs in the shared matching guard; add regression tests.
- Upgrade Vitest to 4.1.12 and add an npm audit gate after CI identified six advisories (including two critical) in the older test-runner dependency tree.

These changes do not add OCR, fetch results, establish legal permission, or make the application production-ready. The branch's latest recorded GitHub Actions run passed: 11 domain tests, TypeScript typecheck, JavaScript syntax, localization/photo/cache regression checks, manifest JSON validation and `npm audit --audit-level=high` (npm reported 0 vulnerabilities at install/audit time). This does not replace a real browser/device review before acceptance.


## Sri Lankan data-protection law — current-source caution

The Data Protection Authority's official downloads page lists both the **Personal Data Protection Act No. 9 of 2022**, the **Personal Data Protection (Amendment) Act No. 22 of 2025**, and **Extraordinary Gazette No. 2498/16 dated 22 July 2026**:
- https://www.dpa.gov.lk/guidelines.php
- Amendment Act PDF: https://www.dpa.gov.lk/acts/22-2025_E_251104_201549.pdf
- Gazette 2498/16 PDF: https://www.dpa.gov.lk/Gazet/2498-16_E.pdf

The 2025 amendment changed the commencement mechanism so provisions (other than the amendment's own commencement provision) come into operation on dates appointed by Gazette order. The DPA's older background page still describes the earlier 18 March 2025 timetable, so it must not be relied on alone as the current commencement position. The Gazette PDF was listed by the DPA but could not be reliably retrieved in this audit; therefore, this audit does **not** claim a definitive current commencement date or a legal-compliance conclusion.

Before any server-side image upload, analytics, account system, or third-party OCR is introduced, obtain and review the operative Gazette/order and current DPA guidance with qualified Sri Lankan counsel. Map controller/processor roles, purposes and lawful basis, notices and user rights, security controls, deletion/retention, incident response, processor contracts and any cross-border transfers. The current prototype keeps selected ticket photos local and has no result backend, but browser hosting/standard infrastructure logs may still exist outside the app's own code; do not promise zero platform-side processing.
