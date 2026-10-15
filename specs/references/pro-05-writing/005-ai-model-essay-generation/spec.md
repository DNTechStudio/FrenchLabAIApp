# Feature Specification: 005 — AI Model Essay Generation on Empty Input

**Feature Branch**: `005-ai-model-essay-generation`  
**Created**: 2026-09-25  
**Status**: Draft  
**Input**: User request: `"make the button "Améliorer avec l'IA" available even if the user does not write anythng. In this case, the AI just answer the question by himself."`  

---

## 1. Overview & Pedagogical Rationale

In language learning and exam preparation (DELF/DALF), candidates often face "blank page syndrome" (*le syndrome de la page blanche*). When confronted with a complex argumentative prompt or formal administrative letter, learners frequently need to inspect an **exemplary model answer** (*une production modèle*) to understand how a native or proficient speaker structures arguments, introduces formal salutations, and deploys cohesive rhetorical devices.

Previously, the **« Améliorer avec l'IA »** button was strictly disabled whenever the editor textarea was empty (`!text.trim()`), forcing candidates to type something before accessing AI assistance.

This feature unlocks the **« Améliorer avec l'IA »** button at all times. When a candidate clicks the button with an **empty draft**:
1. The AI autonomously writes a complete, exemplary exam essay answering the selected topic/prompt from scratch.
2. The model answer is strictly calibrated to the candidate's selected CEFR level(s) (`A1`, `A2`, `B1`, `B2`, `C1`, or `C2`).
3. If two levels are selected (e.g., `B1` and `C1`), the application generates two contrasting model essays side-by-side, allowing the candidate to compare how the exact same exam question is addressed at an intermediate level versus an advanced autonomous level.
4. The result pane defaults to the clean model text view (`viewMode: 'clean'`), providing an uncluttered, distraction-free reading experience with pedagogical notes highlighting the key structural choices made by the AI.

---

## 2. User Scenarios & Acceptance Criteria *(mandatory)*

### User Story 1 - One-Click Model Answer Generation from Empty Editor (Priority: P1) 🎯 MVP

As an exam candidate facing a new prompt, I want to click **« Améliorer avec l'IA »** without typing any text, so that the AI generates a complete, high-scoring model essay answering the topic for my target CEFR level.

**Why this priority**: Solves the blank page obstacle and immediately delivers pedagogical value through exemplary demonstration.

**Independent Test**: Load the app, leave editor empty, select any prompt (e.g., *Télétravail* or *Pistes cyclables*), click « Améliorer avec l'IA », and verify that a complete, coherent model essay appears in the comparison window.

**Acceptance Scenarios**:
1. **Given** the editor contains no text (or only whitespace), **When** the candidate views the editor action bar, **Then** the « Améliorer avec l'IA » button is **enabled** (not disabled or grayed out).
2. **Given** an empty editor and a selected prompt (e.g., *Maintien du télétravail*), **When** the user clicks « Améliorer avec l'IA », **Then** the application triggers generation, displays the loading spinner, and returns a fully articulated model answer answering that prompt at the target level (default `B2`).
3. **Given** the model answer is generated for an empty draft, **Then** the comparison window automatically displays in **Clean / Improved Text view** (`viewMode: 'clean'`), presenting the full exemplary essay ready for reading and copying.

---

### User Story 2 - Comparative Model Essays Across Multiple CEFR Levels (Priority: P1) 🎯 MVP

As a learner studying the progression between CEFR levels, when I have 2 levels selected (e.g., `B1` and `C1`) and click « Améliorer avec l'IA » on an empty draft, I want the AI to generate two distinct model essays answering the same prompt—one at B1 and one at C1—so that I can compare their linguistic sophistication.

**Why this priority**: Seamlessly integrates with Feature 004 (CEFR Multi-Comparison), providing immediate contrastive learning without requiring user drafting.

**Independent Test**: Select checkboxes `B1` and `C1`, leave editor empty, click « Améliorer avec l'IA », verify 2 windows open simultaneously: Window 1 displays a B1 model essay (~160-180 words, standard connectors), Window 2 displays a C1 model essay (~250-300 words, advanced rhetoric).

**Acceptance Scenarios**:
1. **Given** `B2` and `C1` checkboxes are selected and editor is empty, **When** the candidate clicks « Améliorer avec l'IA », **Then** both windows initiate generation in parallel.
2. **Given** generation completes, **Then** Window 1 presents a B2 model answer with B2 pedagogical criteria notes, and Window 2 presents a C1 model answer with C1 pedagogical criteria notes.
3. **Given** each window has a copy button, **When** the user clicks « Copier le texte », **Then** the corresponding level's model essay is copied to the clipboard with visual confirmation.

---

### User Story 3 - Visual Diff Behavior on Empty Draft (Priority: P2)

As a candidate viewing an AI-generated model answer, I want clear visual options so that I can either read the clean essay or inspect how the AI formulated it.

**Why this priority**: Ensures the visual diff viewer remains intuitive even when there was no initial user text.

**Independent Test**: Generate a model answer on empty draft, switch between "Diff visuel" and "Version améliorée [Level]" tabs.

**Acceptance Scenarios**:
1. **Given** a model answer generated on empty text, **When** the user is on the default view, **Then** `viewMode` is `'clean'` (`Version améliorée [Level]`).
2. **Given** the user switches to `Diff visuel`, **Then** the diff viewer displays the model text with consistent styling (tokens marked as additions or neutral text) without syntax errors or broken layout.

---

### User Story 4 - Dual-Engine Support (Mock Offline & Gemini Online) (Priority: P2)

As a candidate using either the offline local mock engine or the online Google Gemini API, I want the autonomous model generation to work reliably in both modes.

**Why this priority**: Maintains Constitution Principle V (Offline Resilience & Performance).

**Acceptance Scenarios**:
1. **Given** the user is using the Built-in Local Engine (Offline / Mock), **When** they click « Améliorer avec l'IA » with an empty draft, **Then** the system retrieves a pre-crafted exemplary essay tailored to the active prompt and requested CEFR level.
2. **Given** the user has configured a Gemini API key and selects the Gemini Provider, **When** they click « Améliorer avec l'IA » with an empty draft, **Then** the system sends a specialized prompt instruction to Gemini:
   - *"Tu es un candidat modèle au DELF/DALF de niveau [Level]. Rédige de toutes pièces une production écrite exemplaire répondant au sujet suivant : [Sujet]. Respecte scrupuleusement les contraintes de forme, de longueur et de registre."*
   - Returns the generated model essay with structured pedagogical annotations.

---

## 3. Edge Cases & Boundary Conditions

1. **User types only whitespace (spaces, tabs, newlines)**:
   - *Behavior*: Treated identically to an empty string (`!text.trim()`). Generates a full model essay from scratch without error.
2. **User changes prompt while editor is empty**:
   - *Behavior*: Button remains enabled. Clicking generates a model essay for the newly selected prompt.
3. **User types a partial sentence (e.g., 5 words) vs completely empty (0 words)**:
   - *Behavior*:
     - If `text.trim().length === 0`: Triggers **Autonomous Model Generation** from prompt.
     - If `text.trim().length > 0`: Triggers **Draft Improvement & Correction** (existing behavior: correcting and upgrading user draft).
4. **Offline Mock prompt without a pre-baked model essay for an obscure level (e.g., A1 formal letter)**:
   - *Behavior*: System provides a solid fallback mock generator that adapts the prompt topic to the target level vocabulary and structure.

---

## 4. Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The « Améliorer avec l'IA » button MUST remain **enabled and clickable** when the editor textarea is empty or contains only whitespace characters.
- **FR-002**: When clicked with an empty draft, the system MUST inspect the active `selectedPrompt` and `selectedLevels` and request a full model essay for each selected level.
- **FR-003**: The engine MUST support generating model essays for all 6 CEFR levels (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`) across formal letters (*lettre formelle*), argumentative essays (*essai argumentatif*), and forum contributions (*article de forum*).
- **FR-004**: In the resulting comparison window for an empty draft, the system MUST default the view mode to `'clean'` (`Version améliorée [Level]`) to avoid showing an entirely red/green diff on empty text.
- **FR-005**: The word counter badge in the comparison window MUST calculate and display the exact word count of the generated model answer.
- **FR-006**: Both [`standalone.html`](standalone.html) and the React component suite (`EditorPane.tsx`, `ComparisonWindow.tsx`, `mockImprovementService.ts`, `geminiImprovementService.ts`) MUST implement this capability with identical behavior.

### Key Entities

- **ModelEssayRequest**: Contains `prompt: ExamPrompt`, `targetLevel: CEFRLevel`, `isAutonomous: boolean` (true when draft is empty).
- **ImprovementResult**: Unchanged schema (`improvedText`, `diffTokens`, `pedagogicalNotes`, `overallFeedback`), ensuring 100% backward compatibility with all existing viewers.

---

## 5. Success Criteria *(mandatory)*

- **SC-001**: Candidate can open the application and immediately click « Améliorer avec l'IA » on first launch without typing a single character.
- **SC-002**: Model essay generation completes in <100ms in Mock mode and <4s in Gemini API mode.
- **SC-003**: Generated model essay complies with standard DELF/DALF word count expectations:
  - `A1`: 60–80 words
  - `A2`: 100–120 words
  - `B1`: 160–190 words
  - `B2`: 250–300 words
  - `C1`: 250–350 words
  - `C2`: 300–400 words
- **SC-004**: 100% test coverage for empty-input handling in domain services and UI components.
