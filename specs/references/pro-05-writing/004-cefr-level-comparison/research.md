# Technical Research & Architecture Decisions: CEFR Level Multi-Comparison (A1-C2)

**Feature**: `004-cefr-level-comparison` | **Date**: 2026-09-24

---

## 1. Context & Key Engineering Questions

The goal is to allow learners to select **1 or 2 CEFR levels** (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`) using checkboxes. When "Improve with AI" is clicked, **1 or 2 comparison windows** must open accordingly, displaying AI-rewritten French essays tailored to those specific levels alongside visual diffs, linguistic metrics, and pedagogical criteria.

### Key Questions:
1. **Selection Control UX**: What is the most intuitive and accessible UI pattern for enforcing "min 1, max 2" selection among 6 CEFR levels?
2. **Multi-Window Layout Architecture**: How should the workspace grid scale cleanly when transitioning from 1 window to 2 windows without breaking layout or horizontal scroll?
3. **AI Generation Strategy**: Should level rewrites be generated concurrently (parallel API calls) or via a single batched prompt?
4. **Mock vs Real AI Service**: How to generate convincing, educationally authentic French rewrites for A1 through C2 when running offline or without an API key?
5. **Standalone Distribution Parity**: How to maintain exact 100% parity in [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html) with zero build tools?

---

## 2. Research & Evaluation

### 2.1 Level Selection UX Pattern (Min 1, Max 2)

| Approach | Description | Pros | Cons | Decision |
| :--- | :--- | :--- | :--- | :--- |
| **A. Standard Native HTML Checkboxes** | 6 `<input type="checkbox">` elements in a row | Accessible, familiar browser controls | Visually basic; hard to show vibrant CEFR color branding | Reject |
| **B. Segmented Pill Badges with Hidden Checkboxes** | Custom styled button/pill group (`role="checkbox"`, `aria-checked`) with level color coding and checkmark indicator | Modern, high aesthetic, touch-friendly, color-coded per CEFR level, WCAG accessible | Requires custom keyboard navigation (`Space`/`Enter`) and `aria-checked` | **Adopted** |
| **C. Multi-select Dropdown** | Dropdown with checkboxes inside | Saves vertical space | Hides active comparison levels; extra clicks to inspect or switch | Reject |

**Enforcement Logic for Min 1 / Max 2**:
- If `selectedLevels.length === 1` and the user clicks the active level, the uncheck is prevented, with subtle micro-feedback: *"At least 1 level must be selected"* (`Il faut sélectionner au moins 1 niveau`).
- If `selectedLevels.length === 2` and the user clicks a 3rd unchecked level:
  - Option 1 (Block): Disable remaining checkboxes or show a toast/hint *"Maximum 2 levels to compare"*.
  - Option 2 (FIFO Rotate): Automatically replace the oldest selected level with the new one.
  - **Decision**: **Block with clear helper message**. Disabling unchecked boxes when 2 are selected is standard form behavior and avoids accidental removal of a level the user wanted to keep.

---

### 2.2 Multi-Window Responsive Grid Architecture

Currently, the application layout uses a 2-column grid (`.workspace-grid`):
```css
.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
```

#### Layout Options for 2 Comparison Windows:
- **Option 1: 3-Column Grid on Wide Screens (`grid-template-columns: 1fr 1fr 1fr`)**:
  - `Editor Pane` (col 1) | `Window Level 1` (col 2) | `Window Level 2` (col 3).
  - Works wonderfully on desktop monitors (≥ 1400px).
  - Can get cramped on smaller laptops (1024px - 1366px).
- **Option 2: 2-Column Grid with Right Column Sub-Grid / Tabs**:
  - `Editor Pane` (fixed/flexible left column) | `Comparison Workspace` (right column).
  - When 1 level is active: Right column takes full width.
  - When 2 levels are active: Right column uses an internal 2-column subgrid (`grid-template-columns: 1fr 1fr`) on wide screens (≥ 1280px), or stacked/tabbed on narrower screens.
  - **Decision**: **Option 2 (Hierarchical Grid)**.
    - Container `.workspace-grid` stays 2 columns (Editor on left, Comparison Zone on right).
    - `.comparison-zone` becomes `.comparison-multi-window` displaying either 1 full window or 2 side-by-side sub-windows.
    - On screens ≥ 1400px: Grid adjusts to `1fr 1fr 1fr` or `1.1fr 1fr 1fr` for optimal wide-screen reading.
    - On screens < 1200px: The two windows can be displayed side-by-side with compact padding, or toggled via quick sub-tabs (`[ B1 Version ] [ C1 Version ]`).

---

### 2.3 AI Prompt & Generation Strategy (Parallel vs Batched)

When the user selects 2 levels (e.g., `B1` and `C1`), we need two `ImprovementResult` objects:

1. **Option A: Two Concurrent Requests (`Promise.all`)**:
   - `service.improveEssay({ ...params, level: 'B1' })` and `service.improveEssay({ ...params, level: 'C1' })`.
   - **Pros**: Independent error handling; independent progress; completely modular.
   - **Cons**: 2 API calls.
2. **Option B: Single Batched Request**:
   - Ask Gemini to return a JSON object containing both `{ "B1": { ... }, "C1": { ... } }`.
   - **Pros**: 1 API call, ensures synchronized comparison.
   - **Cons**: Larger prompt, higher risk of output truncation with long essays, more complex schema parsing.
3. **Decision**:
   - In **Gemini Service**: Support both. For single level, send single level prompt. For dual levels, invoke concurrent parallel calls `Promise.all([improveForLevel(l1), improveForLevel(l2)])` for maximum robustness and fault isolation. If one fails, the other can still succeed.
   - In **Mock Service**: Instant dictionary-based retrieval for each selected level.

---

### 2.4 Authentic Level-Specific Rewriting Descriptors

To ensure educational validity, the AI rewrites must embody concrete CEFR descriptors:

- **A1**: Very short sentences (5-8 words). Present indicative of common regular verbs (*être, avoir, aimer, habiter*). Basic vocabulary (*ville, travail, ami*). No connectors except *et*.
- **A2**: Simple compound sentences. Use of *passé composé* with *avoir/être*, basic future (*futur proche*). Simple connectors (*parce que, mais, donc*).
- **B1**: Chronological progression. Expressing personal opinions (*je pense que, à mon avis, il me semble*). Connectors (*d'abord, ensuite, cependant, par exemple*). Relative pronouns (*qui, que, où*).
- **B2 (DELF B2 Standard)**: Formal argumentative letter format. Politeness formulas (*Madame, Monsieur / Veuillez agréer...*). Varied logical connectors (*en premier lieu, néanmoins, par conséquent, force est de constater*). Subjunctive mood (*il est nécessaire que nous fassions*), conditional (*il serait souhaitable*), passive voice.
- **C1 (DALF C1 Standard)**: Elevated stylistic register. Dense argumentation, concession-counterargument structures (*bien que, quand bien même, nonobstant*). Inverted syntax, nominalizations (*l'instauration de..., la prolifération de...*), subtle nuance and rhetoric.
- **C2 (DALF C2 Standard)**: Native eloquence. Masterful synthesis, literary cadence, rich lexical fields, idiomatic authority, flawless philosophical or socio-political exposition.

---

## 3. Conclusions & Adopted Architecture

1. **New Domain Types**:
   - Export `CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'`.
   - Add `CEFR_LEVELS` array with metadata (name, description, color, badges).
   - Update `UserSettings` to include `selectedLevels: CEFRLevel[]` (default `['B2']`).
2. **New React Component**:
   - `src/components/CEFRLevelSelector.tsx` rendering the 6 interactive checkboxes/pills with tooltips, level color accents, and selection constraints (1-2 levels).
3. **Multi-Window Comparison**:
   - Update `ComparisonPane.tsx` to accept an array of active levels or render multiple comparison windows (`ComparisonWindow.tsx`), each with its own visual diff, tabs, word count, and copy button.
4. **Standalone Parity**:
   - Integrate the level selector, multi-pane flex/grid container, and level-adapted mock texts directly into `standalone.html`.
