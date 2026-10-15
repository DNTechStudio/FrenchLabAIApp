# Feature Specification: CEFR Level Multi-Comparison (A1, A2, B1, B2, C1, C2)

**Feature Branch**: `004-cefr-level-comparison`  
**Created**: 2026-09-24  
**Status**: Draft  
**Input**: User request: `"/specify add checkboxes A1 A2 B1 B2 C1 C2, user can click on one or two check boxes, one or two windows will be open accordingly, for example: if B1 and C1 are selected, 2 windows according to B1 and C1 will be opened, when the user click on the button "Improve with AI", 2 AI written versions will be created in two windows"`

---

## 1. Overview & Pedagogical Intent

In language pedagogy—especially for high-stakes examinations like DELF and DALF—one of the most effective ways for a learner to internalize linguistic progression is **comparative contrastive analysis**. When candidates see how their own drafted essay transforms across distinct CEFR levels (Cadre Européen Commun de Référence pour les Langues - CECRL: **A1, A2, B1, B2, C1, C2**), they immediately grasp the precise vocabulary registers, syntactic complexity, logical connectors, and rhetorical structures required to progress.

This feature enables learners to select **1 or 2 target CEFR levels** via intuitive checkboxes (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`). When the user clicks **"Improve with AI"** (Améliorer avec l'IA):
- If **1 level** is checked (e.g., `B2`): **1 comparison window** opens with the AI rewritten essay tailored to that CEFR level.
- If **2 levels** are checked (e.g., `B1` and `C1`): **2 dedicated comparison windows** open side-by-side, each rendering its level-tailored AI rewrite, word-level visual diff against the candidate's draft, and level-specific pedagogical feedback.

In accordance with the project's **Constitution (Principle II: Exceptional User Experience & Learner Delight)**, the layout must be responsive, aesthetically stunning with distinct level badges and accents, preserve active draft text without data loss, and maintain 100% parity across both the React application and the single-file distribution ([`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html)).

---

## 2. CEFR Level Definitions & Progression

| Level | Code | Name (FR / EN) | Linguistic Characteristics in French | Color Accent |
| :--- | :--- | :--- | :--- | :--- |
| **A1** | `A1` | Découverte / Discovery | Simple isolated phrases, basic present tense, essential daily vocabulary, no complex clauses. | Emerald / Teal |
| **A2** | `A2` | Survie / Elementary | Short simple sentences, basic past (*passé composé*), common conjunctions (*et, mais, parce que*). | Cyan / Sky |
| **B1** | `B1` | Seuil / Intermediate | Connected text, basic argumentation, opinions expressed with *à mon avis*, standard chronology. | Blue / Indigo |
| **B2** | `B2` | Avancé / Upper Intermediate | Structured argumentation, formal register (*lettre formelle*), varied connectors (*néanmoins, par conséquent*), subjunctive, passive voice. **(Default DELF Exam Target)** | Violet / Purple |
| **C1** | `C1` | Autonome / Advanced | Fluent, nuanced expression, sophisticated syntax, rich vocabulary, subtle irony/rhetoric, inverted structures. | Pink / Rose |
| **C2** | `C2` | Maîtrise / Mastery | Academic & literary excellence, flawless stylistic precision, idiomatic mastery, native eloquence. | Amber / Orange |

---

## 3. User Scenarios & Acceptance Criteria *(mandatory)*

### User Story 1 - CEFR Level Selection Checkboxes (Priority: P1) 🎯 MVP

As a candidate preparing for the exam, I want to select 1 or 2 CEFR levels (A1, A2, B1, B2, C1, C2) via checkboxes above the editor action buttons, so that I can choose which language levels I want to target for comparison.

**Why this priority**: Core interaction mechanic. Governs how many windows will open and which AI versions will be generated.

**Selection Constraints**:
- **Minimum**: Exactly **1 level** must always be selected. A user cannot uncheck all boxes (the last remaining checkbox cannot be deselected).
- **Maximum**: Exactly **2 levels** can be selected simultaneously.
- **Enforcement on 3rd click**: If 2 levels are already selected and the user clicks a 3rd box, the application displays a friendly tooltip or auto-replaces the older selection (configurable/accessible behavior: disable the remaining unchecked checkboxes with a clear hint: *"Maximum 2 levels for comparative view"*).
- **Default State**: `B2` is checked by default on initial application load.

**Acceptance Scenarios**:
1. **Given** the application is loaded, **When** the candidate views the Editor Pane, **Then** 6 level checkboxes (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`) are clearly visible with styled pill/checkbox buttons.
2. **Given** `B2` is checked, **When** the user clicks `C1`, **Then** both `B2` and `C1` are active (`selectedLevels = ['B2', 'C1']`).
3. **Given** `B2` and `C1` are active, **When** the user clicks `B1`, **Then** the UI prevents a 3rd selection and informs the user that a maximum of 2 levels can be compared at once.
4. **Given** only `B2` is active, **When** the user clicks on `B2` to uncheck it, **Then** `B2` remains checked (minimum 1 level required).

---

### User Story 2 - Dynamic Multi-Window Workspace Layout (Priority: P1) 🎯 MVP

As a learner, when I select 1 level I want 1 comparison window to display; when I select 2 levels (e.g., `B1` and `C1`), I want 2 comparison windows to open side-by-side, so that I can visually contrast the two different standards.

**Why this priority**: Direct core user requirement: *"one or two windows will be open accordingly, for example: if B1 and C1 are selected, 2 windows according to B1 and C1 will be opened"*.

**Acceptance Scenarios**:
1. **Given** 1 level is selected (e.g. `B2`), **When** AI improvement is triggered or results are displayed, **Then** the comparison area renders 1 window labeled `B2` with its visual diff and pedagogical evaluation.
2. **Given** 2 levels are selected (e.g. `B1` and `C1`), **When** AI improvement is triggered, **Then** 2 distinct comparison windows open (`Window B1` and `Window C1`):
   - On wide desktop screens (≥ 1280px): The layout displays a 3-column split (`Editor` | `Window B1` | `Window C1`) or responsive multi-window grid.
   - On medium/laptop screens (< 1280px): The comparison area splits into 2 side-by-side or tabbed/stacked sub-panes without horizontal scrolling or text clipping.
3. **Given** 2 windows are open, **When** the user unchecks one level (leaving only 1 checked), **Then** the unselected window smoothly closes, and the remaining window expands to fill the comparison area.

---

### User Story 3 - Dual AI Generation & Level-Specific Rewriting (Priority: P1) 🎯 MVP

As a learner, when I click "Improve with AI", I want the system to generate rewritten versions tailored specifically to each selected CEFR level, so that I can study how vocabulary and sentence structures change between levels.

**Why this priority**: Provides the actual educational content. Delivering generic text would defeat the purpose of comparative level analysis.

**Acceptance Scenarios**:
1. **Given** 2 levels are selected (e.g. `B1` and `C1`) and an essay is drafted, **When** the user clicks "Improve with AI", **Then** both windows show synchronized loading states ("Generating B1 version..." and "Generating C1 version...").
2. **Given** generation completes, **When** the user inspects `Window B1`, **Then** the text uses B1-level grammar (simple connectors, clear opinions, direct syntax).
3. **Given** generation completes, **When** the user inspects `Window C1`, **Then** the text uses C1-level grammar (elevated register, varied sentence rhythm, advanced idioms, nuanced argumentation).
4. **Given** Mock Service is active (no API key), **When** "Improve with AI" is clicked, **Then** the mock generator provides distinct, pre-crafted level-specific transformations for the selected prompt.
5. **Given** Gemini API is active, **When** "Improve with AI" is clicked, **Then** Gemini receives dedicated system prompts instructing it to produce CEFR-specific outputs for each selected level.

---

### User Story 4 - Independent Diff & Interaction per Window (Priority: P2)

As a candidate, I want each open level window to have its own independent controls (Diff Viewer, Clean Version tab, Copy button, Word Count, and Criteria badges), so that I can inspect and copy each version individually.

**Acceptance Scenarios**:
1. **Given** 2 windows are open, **When** the user toggles "Visual Diff" vs "Clean Version" in Window 1, **Then** Window 2 remains on its currently selected view mode without cross-interference.
2. **Given** Window 1 and Window 2 are rendered, **When** the user clicks "Copy" in Window 1, **Then** only Window 1's improved text is copied to clipboard, and Window 1 displays a "Copied!" confirmation badge.
3. **Given** each window has a word count badge, **When** rendered, **Then** each window shows its own word count according to French linguistic counting rules.

---

### User Story 5 - Standalone Distribution Parity (Priority: P3)

As a student using [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html) offline, I want the exact same 1-or-2 level checkboxes, dynamic 1-or-2 window opening, and level-specific rewriting available without any Node.js dependency.

**Acceptance Scenarios**:
1. **Given** `standalone.html` is opened in any modern browser, **When** the user selects 2 levels and clicks "Improve with AI", **Then** 2 comparison windows open with distinct level rewrites.

---

### User Story 6 - Multilingual UI Support (Priority: P3)

As a learner using English, Chinese, or Vietnamese UI, I want the level labels, descriptions, and selection guidelines to be localized in my active interface language.

**Acceptance Scenarios**:
1. **Given** the UI language is Vietnamese (`vi`), **When** viewing the CEFR level selector, **Then** level descriptions show Vietnamese tooltips (e.g. `B2 - Trung cấp nâng cao`, `C1 - Cao cấp`, `Tối đa 2 cấp độ để so sánh`).

---

## 4. UI Layout & Visual Specifications

### 4.1 Level Selector Component
- **Placement**: Located in the Editor Pane, prominently situated directly above or beside the primary action bar ("Clear", "Improve with AI").
- **Appearance**: A segmented pill bar or checkbox group containing 6 items:
  - `[ ] A1` | `[ ] A2` | `[ ] B1` | `[x] B2` | `[ ] C1` | `[ ] C2`
- **Active State Styling**: Glowing border and tinted background matching the level's signature color accent (e.g. Violet for B2, Rose for C1, Amber for C2).
- **Badge Indicators**: Small CEFR level tag with tooltip describing the level competency.
- **Selection Counter Hint**: *"Select 1 or 2 levels to compare"* (localized in FR, EN, ZH, VI).

### 4.2 Workspace Layout Progression
- **1 Level Selected**:
  ```text
  +-----------------------------+-----------------------------+
  |                             |   Comparison Window (B2)    |
  |         Editor Pane         |  [Visual Diff] [Clean Text] |
  |  - Prompt / Scenario        |  - Word Diff against Draft  |
  |  - Essay Textarea           |  - Pedagogical Notes (B2)   |
  |  - CEFR Checkboxes [x] B2   |  - DELF B2 Criteria Scores  |
  |  - [Improve with AI]        |  - [Copy B2 Text]           |
  +-----------------------------+-----------------------------+
  ```
- **2 Levels Selected (e.g., B1 and C1)**:
  ```text
  +-------------------+-----------------------+-----------------------+
  |                   |  Window 1 (B1 Seuil)  | Window 2 (C1 Autonome)|
  |    Editor Pane    | [Visual Diff] [Clean] | [Visual Diff] [Clean] |
  |  - Prompt         | - Diff vs Draft (B1)  | - Diff vs Draft (C1)  |
  |  - Textarea       | - Notes (B1 Level)    | - Notes (C1 Level)    |
  |  - [x]B1  [x]C1   | - B1 Criteria Badges  | - C1 Criteria Badges  |
  |  - [Improve AI]   | - [Copy B1 Text]      | - [Copy C1 Text]      |
  +-------------------+-----------------------+-----------------------+
  ```

---

## 5. Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST provide 6 CEFR level options: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
- **FR-002**: System MUST enforce that at least 1 and at most 2 levels can be checked at any time.
- **FR-003**: System MUST set `B2` as the initial default selected level.
- **FR-004**: System MUST open 1 comparison window when 1 level is checked, and 2 comparison windows when 2 levels are checked.
- **FR-005**: When "Improve with AI" is clicked, system MUST generate rewritten essays and pedagogical analyses corresponding specifically to each checked level.
- **FR-006**: Each open window MUST maintain its own view state (Visual Diff vs Clean Version), word count, copy button, and criteria scores.
- **FR-007**: System MUST support concurrent AI generation when 2 levels are selected without blocking the UI.
- **FR-008**: System MUST persist the learner's chosen level preference in `localStorage` under `UserSettings.selectedLevels`.
- **FR-009**: Switching level selections MUST NOT cause any data loss in the candidate's active essay draft or word counter.
- **FR-010**: System MUST provide localized level descriptions and selection hints in French, English, Chinese, and Vietnamese.
- **FR-011**: Both `MockImprovementService` and `GeminiImprovementService` MUST accept a target CEFR level parameter (`level: CEFRLevel`) and return level-adapted results.
- **FR-012**: System MUST implement full 1-or-2 window parity in [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html).

### Data Model Entities
- **`CEFRLevel`**: `'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'`
- **`CEFRLevelConfig`**:
  - `level`: `CEFRLevel`
  - `label`: `string` (e.g. `"B2"`)
  - `title`: `Record<SupportedLanguage, string>` (e.g. `{ fr: "Avancé", en: "Upper Intermediate", zh: "中高级", vi: "Trung cấp nâng cao" }`)
  - `description`: `Record<SupportedLanguage, string>`
  - `color`: `string` (Hex / HSL theme variable)
- **`ImprovementRequest`**:
  - `promptId`: `string`
  - `essayContent`: `string`
  - `levels`: `CEFRLevel[]` (array of 1 or 2 levels)
- **`ImprovementResultMap`**: `Partial<Record<CEFRLevel, ImprovementResult>>`

---

## 6. Success Criteria *(mandatory)*

- **SC-001**: User can toggle between 1 and 2 levels seamlessly in <50ms with instantaneous window layout adjustment.
- **SC-002**: Attempting to deselect the last remaining level is safely prevented (cannot have 0 selected).
- **SC-003**: Attempting to select a 3rd level is safely blocked with intuitive user feedback.
- **SC-004**: Clicking "Improve with AI" generates distinct, level-appropriate French essays in both windows when 2 levels are selected.
- **SC-005**: 100% test pass rate in automated test suite verifying level selection rules, prompt generation, and mock level responses.
- **SC-006**: Full functional parity between the React application and `standalone.html`.
- **SC-007**: Zero regression on existing features (word counter, Buy Me a Coffee button, 4-language switcher, theme toggle).

---

## 7. Assumptions & Technical Constraints

- The candidate's draft remains in authentic French. The AI generates French text at the requested CEFR difficulty level.
- When Gemini API is active, the two requests for level 1 and level 2 can be sent in parallel (`Promise.all`) or via a single structured prompt returning a JSON map of `{ [level]: ImprovementResult }` to conserve quota and minimize round-trip latency.
- In `standalone.html`, level comparison rules and responsive multi-window CSS grid are implemented cleanly with pure vanilla CSS and JS.
