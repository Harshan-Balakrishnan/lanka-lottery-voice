# Design System

## Brand source of truth

Use the user-supplied original 1254 × 1254 PNG for the official mark. Do not recreate or replace it. The repository still requires the actual binary asset to be committed; until then, do not claim that the live logo has been updated.

## Existing palette

Current web tokens are provisional and must be sampled/refined against the original artwork after the source asset is integrated:

- Navy: `#123c75`
- Deep navy: `#0a2850`
- Pale blue: `#eaf2ff`
- Ink: `#182536`
- Muted text: `#5a6879`
- Border: `#d7e0eb`
- Surface: `#ffffff`
- Page: `#f3f6fa`
- Warning background: `#fff6df`

## Interaction and accessibility tokens

- Body typography: system sans-serif with native Tamil/Sinhala fallback.
- Layout spacing: use a consistent 4 px base scale.
- Inputs and buttons: minimum 48 px touch height where practical.
- Focus: visible high-contrast outline; never remove focus indication.
- Motion: brief, non-essential transitions only; honor `prefers-reduced-motion`.
- Status: pair colour with clear text and an accessible announcement.
- Logo: preserve aspect ratio; do not crop the original artwork. Use padded derivatives for maskable icons.

## Design guardrails

Prioritize readability and the ticket-checking task over decoration. No celebratory gambling effects, fake result panels, dead controls, or animations that imply an unverified outcome. Test long Tamil/Sinhala strings and large text before release.
