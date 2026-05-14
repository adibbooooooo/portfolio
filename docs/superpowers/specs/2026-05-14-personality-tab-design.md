# Personality tab — design spec

**Date:** 2026-05-14  
**Status:** Approved for implementation planning  
**Scope:** Add a site-level tab before Work Experience, plus a dedicated Personality page with two in-page modes (Approach 2).

## Goals

1. **Stakeholder lens:** Help visitors quickly answer how Adib fits a team, drives impact and productivity, contributes to product or company growth, and what collaboration feels like.
2. **Evidence lens:** Provide nearly full content from the Crystal Personality Handbook and the ISTP cognitive guide (long-form), without turning the first screen into a wall of text.
3. **Consistency:** Match existing portfolio patterns (`EditorScaffold`, typography, Skill Demos segmented tabs).

## Navigation and routing


| Layer                                 | Label (UI)                                                          | Path / behavior                         |
| ------------------------------------- | ------------------------------------------------------------------- | --------------------------------------- |
| Site top tab (desktop + mobile sheet) | `my.personality`                                                    | `/personality`                          |
| Tab order                             | `my.info` → `skill.demo` → `**my.personality`** → `work.experience` | Router `meta.order` updated accordingly |


## In-page structure (Approach 2)

Single route `/personality` with **segmented in-page tabs** (same visual pattern as `WorkPage.vue` demo category tabs: bordered pill group, emerald active state).


| Panel | Tab label (code-style) | Purpose                                                                                                                                                                                                         |
| ----- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A     | `my.fit`               | **Recruiter skim (~10 s):** glance deck — minimal copy, compact signals, optional handbook handoff. Long narrative lives in `my.handbook` only. |
| B     | `my.handbook`          | Detailed export: Crystal chapters in handbook order, then ISTP cognitive material. **Collapsible sections** (accordion or `<details>`) per chapter / major part so the panel stays navigable.                   |


**URL sync (recommended):** Query string `?view=fit` and `?view=handbook` (or equivalent) synced with the active in-page tab for shareable links and predictable back/forward. Default when missing: `fit`.

## Content mapping (`my.fit`)

**Primary reader:** hiring manager / recruiter **10-second skim** (choice **A**).

Structured answers stay **one line per theme** on screen; extended bullets and assessment prose live under **`my.handbook`**.

### `my.fit` v3 — glance deck (current)

- **Type row:** ISTP‑T · Virtuoso · operator + compact I‑S‑T‑P glyphs (no paragraph).
- **Signals:** Small framework chips + **two** percentile bars (not three) to reduce noise.
- **Tiles:** Six cards in a **2×3 / 3×2** grid — five hiring dimensions + one **Evidence** tile (click → `my.handbook`). No bullet lists on the surface.
- **Virtuoso lane:** **Pills only** (initials + truncated name + `fiction` / `public`); full note on **hover `title`**. One-line disclaimer.
- **Motion:** Light stagger and hover nudge; respect **`prefers-reduced-motion`**.

### `my.fit` v2 (superseded)

Bento + long bullets + scroll cards — retired in favor of v3 skim-first layout.

## Content mapping (`my.handbook`)

- **Crystal:** Sections follow handbook order: summary, accuracy/traits, assessments (per framework), natural style, decisions, energy and stress, relationships, career, personal growth. Sub-collapsibles where a chapter is large (e.g. per assessment).
- **ISTP PDF:** One major block or nested collapsibles; full cognitive narrative; avoid repeating the short 16Personalities ISTP snippet if it already appears under assessments.

## Visual and UX notes

- **Hero:** Page title + one-line thesis (Crystal-informed, original wording).
- **Accessibility:** `role="tablist"` / `tab` / `tabpanel`, `aria-selected`, keyboard operable controls; logical heading hierarchy (`h1` once).
- **Mobile:** Segmented control wraps or goes full width under the hero; both panels scroll within `EditorScaffold` as on other pages.
- **Attribution:** Footer note in `my.handbook` (or page footer): content synthesized from personal Crystal handbook and ISTP cognitive material; frameworks credited to their respective sources.

## Implementation shape (for planning — not executed in this doc)

- New `PersonalityPage.vue` (or equivalent) using `EditorScaffold`.
- Content in dedicated modules: `personalityGlanceDeck.ts`, `personalityFitSignals.ts`, `personalityVirtuosoLane.ts`, handbook parsers.
- Router + `MainLayout.vue`: register route, desktop tabs, mobile sheet, tab indicator `registerTab` map keys.

## Out of scope

- Peer review uploads or live Crystal API integration.
- PDF download hosting unless added later as a separate task.

## Testing (acceptance)

- `/personality` loads; `my.personality` appears before `work.experience` in desktop and mobile nav.
- In-page tabs switch panels; URL query (if implemented) stays in sync.
- Keyboard navigation on tabs and collapsibles; no duplicate `h1`.

