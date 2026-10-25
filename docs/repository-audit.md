# Repository audit

Audit date: 2026-10-25  
Repository: `Harshan-Balakrishnan/lanka-lottery-voice`  
Default branch at audit start: `main`

## Scope and evidence

Repository metadata and source files were inspected through the connected GitHub integration. The local container could not clone the repository because DNS/network access to github.com was unavailable. Therefore, local dependency installation and test execution could not be completed in this environment.

## Inventory

| Area | Observed state | Risk / next action |
|---|---|---|
| README | Describes trust rules and prototype status, but some architecture text was out of sync after web files were added | Update the README and link current docs |
| TypeScript config | Strict mode, NodeNext, no emit | Keep strictness; run typecheck in CI |
| package.json | TypeScript + Vitest, test/typecheck scripts | No lockfile was present in inspected files; add a reproducible lockfile through a network-enabled environment |
| Domain types | Basic ticket/result/rule contracts | Verification statuses were too broad; strengthen provenance and rule-effective-date guards |
| Matching | Checks user confirmation, result verification, draw identity, a generic max-age parameter and rule version | Replace universal age check with explicit source-policy status; validate ISO dates and rule effective dates |
| Tests | Safety-gate unit tests | Expand statuses, malformed data, leading zeros and rule boundary cases |
| Web | Static HTML/CSS/JS prototype with photo preview, manual fields, language strings and browser speech | No OCR, backend, live results, or verified TTS locale; avoid presenting the form as an actual results check |
| Android | No native Android project found in inspected repository paths | Separate deliverable remains unimplemented |
| API/backend | None found | No official data adapter or production matching endpoint |
| CI | GitHub Actions workflow configured for test and typecheck | Combined status returned no status entries at audit time; do not claim a passing run |
| Deployment | No deployment configuration or verified production URL inspected | Not deployed/verified |
| Secrets | No environment config was observed in inspected file set; not a complete secret scan | Run repository secret scanning in GitHub and review full history |
| Dependency/licence/vulnerability audit | Not run because the environment cannot install/resolve dependencies | Run dependency/licence/security scans in CI or a network-enabled environment |

## Existing commit/branch history

The default branch was `main`. The repository contained an initial sequence of small file commits. At audit time, only `main` was returned by branch search; the current audit changes are isolated on `engineering/phase-zero-audit`.

## Tests actually run

- GitHub metadata and file fetch: completed.
- GitHub combined commit status lookup: returned an empty status list, not a successful build.
- Local `git clone`: failed because the container could not resolve github.com.
- `npm install`, `npm test`, `npm run typecheck`, lint, build, vulnerability scan: **not run**.

## Key defects/risks to address

1. Existing status values did not distinguish current verified data from old verified data.
2. The generic max-age parameter risks treating all lottery schedules alike.
3. Rule effective dates were documented but not enforced by the matching guard.
4. Result provenance lacked explicit schema version and correction/supersession state.
5. Web strings and placeholders were not consistently localised.
6. Browser speech synthesis was used without checking for a voice matching the selected locale.
7. The web form does not send ticket data to a backend, but this boundary needs clear UX wording.
8. No real OCR, API, native Android app, source permissions, or validated lottery rules exist yet.

## Audit conclusion

The repository is an early prototype/foundation, not a production service. The safe next steps are stronger domain guardrails, documented architecture/privacy/security requirements, test expansion, and an accessible UI that continues to refuse a win/loss verdict until an approved data source and lottery-specific rule set exist.
