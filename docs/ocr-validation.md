# OCR validation plan

Status: no OCR engine is integrated and no accuracy claim is made.

## Product principle
OCR proposes candidate fields; users confirm or correct them. A high aggregate character accuracy is not enough: one wrong digit can change a ticket check. The matching engine must never treat raw OCR output as confirmed data.

## Candidate pipeline
1. Image is captured/selected after explicit user action.
2. Validate file content, dimensions and decode success.
3. Detect obvious blur, glare, clipping and skew; return actionable recapture advice.
4. Evaluate board/layout and extract candidate fields.
5. Preserve raw OCR confidence per field when provided by the engine.
6. Apply format checks specific to the selected lottery.
7. Present candidates beside the image, with every field editable.
8. Require explicit confirmation before matching.
9. Discard image and candidate data when the user resets or closes the flow.

## Dataset governance
- Use official/publicly reusable samples or ticket images contributed with documented consent and rights.
- Do not scrape user tickets or use private images without authorisation.
- Separate train/tune/test sets by physical ticket/sample source to avoid near-duplicate leakage.
- Record board, lottery/layout, language/script, device/camera class, lighting, blur, glare, angle, print condition and field types without collecting unrelated personal data.
- Store test assets in a restricted location with retention and deletion controls.
- Document sample counts and known sampling bias before reporting any accuracy metric.

## Evaluation metrics
- Exact-field accuracy for board, lottery ID, draw date, draw number, each number, letter/symbol and position.
- Exact full-ticket transcription rate.
- Critical-field false acceptance rate after the proposed confidence threshold.
- User correction rate and recapture rate.
- Metrics segmented by board, lottery layout, language/script, image quality and device class.
- Latency, memory and battery cost on low-end Android devices.

## Acceptance gates
- No invented accuracy thresholds: choose thresholds from measured data and a documented risk review.
- Every critical field is editable and explicitly confirmed.
- Low-confidence or unsupported layouts stop automatic checking.
- Manual entry remains available.
- Tamil/Sinhala text recognition is tested rather than assumed from a vendor's general OCR claims.
- Any model/engine/version change reruns the benchmark.

Google ML Kit Text Recognition v2's published script/language list should be checked before selection; Tamil/Sinhala support must not be assumed. See https://developers.google.com/ml-kit/vision/text-recognition/v2/languages.
