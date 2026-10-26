# Architecture and Product Decisions

## 2026-10-26 — Fail closed without authorized result access
**Decision:** Do not display a win/loss verdict while official result access and exact lottery rules are unverified.  
**Reason:** A false positive can cause financial harm and destroy trust.  
**Consequence:** Manual entry remains useful for preparing ticket details, but cannot imply a verified result.

## 2026-10-26 — Original logo must be used, not recreated
**Decision:** Use the exact user-supplied PNG as the source asset; generate only reproducible derivatives for icon sizes.  
**Reason:** Preserve the approved brand identity.  
**Status:** Source image is available in the conversation context, but the binary has not yet been committed to the inspected branch.

## 2026-10-26 — Native Android is a separate deliverable
**Decision:** Do not describe the website/PWA as a native Android app.  
**Reason:** No native Android source tree was found during the audit.  
**Consequence:** Android scope and tooling need a separate implementation and verification pass.

## 2026-10-26 — Preview-only until acceptance gates pass
**Decision:** Keep all changes on a non-production branch and do not alter production deployment protection.  
**Reason:** Official data, legal review, browser/device verification and the original asset integration remain incomplete.
