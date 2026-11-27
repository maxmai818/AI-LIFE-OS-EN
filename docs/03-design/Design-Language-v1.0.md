# AI Life OS Design Language

- **Version**: v1.0 (Frozen — design baseline)
- **Status**: Frozen. Baseline frozen by: Max (2026-10-17, selected Variant 2 "Conversation-Guided Type", no annotations)
- **Owner**: lifeosdesign (maintenance); Max (approval and freezing)
- **Rule**: Required reading at the start of every design task; after each annotation/preference statement by Max, lifeosdesign writes it back into this file; the frozen baseline may only be changed via Max's annotations (version bump)
- **Boundary**: This file governs "what it looks like" (skin layer); for "what it is and why", see `docs/05-technical-architecture/Product-Core-v0.1.md` (kernel layer); the skin must not define its own business rules
- **First skin**: Variant 2 Conversation-Guided Type — `docs/03-design/prototypes/variant-2/index.html` (the prototype is a demo; in development, implement its interaction philosophy in the production skin)

## 1. Design Positioning

- Lightweight, trustworthy, usable in 5 minutes a day and then gone; the user is the CEO of their own life, and the tool does not disturb, judge, or manipulate.
- All data is "verifiable": every AI conclusion can be traced back to source-text evidence; when uncertain, show "unknown" and never fill in numbers with guesses.
- AI is a correctable candidate, not an authority: only confirmed entries enter long-term analysis, and revisions preserve the AI's original values.

## 2. UI Red Lines (Product Spec → UI Language)

| Red Line | UI Expression |
|---|---|
| The original Capture text is evidence and is never overwritten | Editing creates a new version; the entry point to the original text is always present |
| AI values and user-revised values are kept separate | Dual values displayed side by side ("AI inference / your revision"); source labeled after revision |
| No evidence = unknown, not neutral | Empty state is visible ("Cannot determine · impact degree pending"), never hidden |
| No fake progress | Non-quantifiable goals show qualitative status; no progress bars |
| ONE BIG CHANGE: zero or one | "No change needed this time" is a first-class option; never force suggestions |
| Bulk accept is not the default | Bulk actions are de-emphasized/collapsed; item-by-item confirmation is the primary path |
| Fact / speculation / theory / recommendation / limitation are labeled separately | Every conclusion block carries a type label and a (theory) source citation |

## 3. Style Baseline (Baseline Values)

- **Layout**: mobile-first, designed for 375px width; on PC, a narrow centered container. Four core screens: Capture → AI structuring confirmation → Five Life Dimensions view → Review.
- **Language**: Chinese UI.
- **Interaction philosophy (Variant 2 baseline)**: conversation as the main axis — capturing feels like sending a message, structured cards are confirmed in place, and the review is a guided conversation round; generous whitespace, medium corner radius, restrained motion (used only for state transitions, never stealing the show).
- **Five Life Dimension identity colors** (Design Language semantic tokens; consistent across all skins in development):

| Dimension | Name | Token |
|---|---|---|
| Time | Blue | `--time:#3E6DE0` |
| Health | Green | `--health:#158A4C` |
| Wealth | Amber | `--wealth:#C2740B` |
| Relationship | Rose | `--rel:#D4244E` |
| Purpose | Purple | `--purpose:#7135CE` |

- **Neutrals**: background `#F4F4F6`, surface `#FFFFFF`, body text `#17171A`, secondary `#71717A`, border `#E5E5EA`.
- **Semantic colors**: positive `#16A34A`, negative `#DC2626`, mixed `#B45309`, unknown `#A1A1AA`.

## 4. Max's Design Preference Record

**Confirmed**:
- Daily use ≤5 minutes; do not manufacture screen time.
- Mobile-first; the phone is the primary usage context.
- Privacy-first (single-person private experience, multiple independent accounts).
- Style baseline: Conversation-Guided Type (Variant 2), selected 2026-10-17, no annotations.

**To be confirmed** (answer along with the next annotation when convenient; no prompting):
- Type density preference (compact / comfortable)
- Whether to adjust the Five Life Dimension identity colors
- Motion level (none / restrained / rich)

**Rejected directions**: (none yet; record here when they occur, to avoid repeats)

## 5. Privacy Boundary (Public Demo Repository)

- The public demo repository (`maxmai818/ai-life-os-prototypes`) **contains only fictional demo data**.
- Real personal records, real screenshots, and real requirements data **belong only in the private main repository, forever**; before publishing any skin's demos/screenshots, lifeosdesign checks this.
- All demo pages carry `noindex,nofollow`.

## 6. Change Log

| Date | Version | Change | Source |
|---|---|---|---|
| 2026-10-10 | v0.1 | Initial creation: distilled shared style and red lines from the three G2 prototype variants | Three prototypes + POC-01 Spec v0.6 |
| 2026-10-17 | v1.0 | Frozen the design baseline: selected Variant 2 Conversation-Guided Type as the first skin; added the privacy boundary clause | Max decision (G2-Decision-001) |
