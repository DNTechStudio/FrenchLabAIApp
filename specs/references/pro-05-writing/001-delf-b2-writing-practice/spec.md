# Feature Specification: DELF B2 Writing Practice Application

**Feature Branch**: `001-delf-b2-writing-practice`

**Created**: 2026-09-21

**Status**: Draft

**Input**: User description: "Build a web application designed for candidates practicing French DELF B2 writing (Production Écrite). The application allows users to select an essay topic from a dropdown list of official DELF B2 prompts (e.g., formal complaint letters, argumentative essays, forum articles) or random topic. Candidates compose their French essay in a clean, distraction-free text editor with a real-time word counter (tracking the target of 250+ words). When the user clicks an 'AI Improve' button, a dedicated comparison pane displays the improved DELF B2-level version of their essay, highlighting in red (visual diff) any words, grammar corrections, or vocabulary enhancements that differ from the user's original text, along with brief pedagogical notes explaining the corrections according to DELF B2 criteria."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prompt Selection & Distraction-Free Composition (Priority: P1)

As a DELF B2 candidate, I want to choose an official writing prompt (or get a random one) and compose my essay in a distraction-free editor with live word counting, so that I can practice writing under authentic exam conditions.

**Why this priority**: Without prompt selection, writing space, and word tracking, candidates cannot begin practicing. This forms the essential Minimum Viable Product (MVP).

**Independent Test**: Can be tested by opening the application, picking a prompt from the dropdown or clicking "Random Topic", typing text into the editor, and observing the live word counter change and display progress towards 250 words.

**Acceptance Scenarios**:

1. **Given** the candidate is on the main page, **When** they select a prompt category and title from the dropdown (e.g., "Lettre formelle au maire"), **Then** the prompt instructions, context, and official requirements appear clearly above the editor.
2. **Given** the candidate does not have a specific topic in mind, **When** they click the "Random Topic" action, **Then** a random official prompt from the repository is selected and loaded immediately into view.
3. **Given** the candidate is typing an essay, **When** they input text, **Then** the real-time word counter updates immediately, indicating whether the current count is under the 250-word minimum or has met the requirement.
4. **Given** the candidate refreshes or closes the page unexpectedly, **When** they return, **Then** their essay draft for that prompt is automatically restored without data loss.

---

### User Story 2 - AI Essay Improvement & Visual Diff Comparison (Priority: P2)

As a candidate who has drafted an essay, I want to trigger an AI-assisted improvement that displays my original text alongside an upgraded B2-level version with differences highlighted in red/visual diff styling, so that I can instantly see what changed and how to elevate my writing.

**Why this priority**: The core educational value proposition is comparing one's current writing against refined DELF B2 standard expressions, sentence structures, and vocabulary.

**Independent Test**: Can be tested by entering an essay draft of at least 50 words, clicking "AI Improve", and verifying that a side-by-side or comparative diff view appears highlighting exact substitutions, additions, and deletions.

**Acceptance Scenarios**:

1. **Given** a drafted essay in the editor, **When** the candidate clicks "AI Improve", **Then** the system initiates evaluation and displays a loading/analyzing state while preserving the candidate's input.
2. **Given** the improved text is generated, **When** the comparison pane renders, **Then** original text and improved DELF B2 text are displayed with visual diff markers (red highlight for modifications/removals and distinct styling for enhancements).
3. **Given** the candidate reviews the comparison pane, **When** they toggle between side-by-side view and unified diff view, **Then** the layout adjusts cleanly without truncating text.

---

### User Story 3 - DELF B2 Pedagogical Notes & Rubric Feedback (Priority: P3)

As a candidate reviewing improvements, I want to see brief pedagogical explanations categorized by official DELF B2 evaluation criteria, so that I understand the linguistic reasoning behind each correction and how to score higher.

**Why this priority**: Showing corrected text without explaining the underlying grammar rules, register requirements, or logical connectors leaves the candidate guessing why the change was made.

**Independent Test**: Can be tested by inspecting the comparison pane after an improvement run to verify the presence of clear pedagogical notes referencing DELF B2 criteria (e.g., Morphosyntaxe, Lexique, Cohérence, Respect de la consigne).

**Acceptance Scenarios**:

1. **Given** an improved essay is displayed, **When** the candidate views the pedagogical notes section, **Then** each key improvement is accompanied by a concise explanation mapped to an official DELF B2 rubric criterion.
2. **Given** a candidate hovers over or clicks a highlighted difference in the comparison pane, **When** selected, **Then** the corresponding pedagogical explanation is highlighted or brought into focus.

---

### User Story 4 - Essay Copying, Export & Session Reset (Priority: P4)

As a candidate practicing multiple topics, I want to easily copy the improved essay or reset my session for a new attempt, so that I can store my progress in external study notes.

**Why this priority**: Enables a smooth study workflow for candidates maintaining external study journals or flashcards.

**Independent Test**: Can be tested by clicking "Copy Improved Essay" and checking that clipboard receives the plain text, or clicking "New Essay" to clear and switch topics cleanly.

**Acceptance Scenarios**:

1. **Given** the improved essay is visible, **When** the candidate clicks "Copy Improved Version", **Then** the text is copied to the clipboard with an instant confirmation notification.
2. **Given** an active writing session, **When** the candidate clicks "Reset / Clear", **Then** the system prompts for confirmation to avoid accidental deletion, then resets the editor upon approval.

---

### Edge Cases

- **Very short or incomplete draft**: If the candidate clicks "AI Improve" with fewer than 30 words, the system warns that meaningful DELF B2 assessment requires a substantive paragraph or draft before proceeding.
- **Accidental navigation or tab close**: Autosave continuously preserves the active essay text per topic in local storage so that no keystrokes are lost.
- **French diacritics & punctuation**: Accents (é, è, ê, à, ç, etc.), ligatures (œ), and French quotation marks (« ») or non-breaking spaces must not corrupt word counting, diff highlighting, or text formatting.
- **French word counting rules**: Compound words separated by hyphens (e.g., *peut-être*, *c'est-à-dire*) and elided words with apostrophes (e.g., *l'homme*, *qu'il*) are counted according to French exam standard conventions (each lexical unit separated by space or apostrophe counted appropriately).
- **Network interruption during improvement**: If an external AI service fails or is unreachable, the system displays a graceful error message with a retry option, without clearing the candidate's composed essay.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a curated repository of official DELF B2 prompts organized into the three primary exam genres:
  - Formal Letters (*Lettre formelle* - e.g., to a mayor, director, or administrative body).
  - Argumentative Essays (*Essai argumentatif* - defending a stance on a societal debate).
  - Forum Articles / Contributions (*Article de presse / Courrier des lecteurs / Forum en ligne*).
- **FR-002**: The system MUST allow the candidate to select a prompt via a categorized dropdown menu or click a "Random Topic" button to choose one at random.
- **FR-003**: The system MUST display the full context, role/persona, scenario, and specific instructions for the selected prompt.
- **FR-004**: The system MUST offer a distraction-free text editor that supports full French text input, auto-expanding or scrolling smoothly with comfortable line spacing and typography.
- **FR-005**: The system MUST calculate and display the current word count in real time as the candidate types, with clear visual progress toward the official DELF B2 minimum threshold of 250 words (e.g., warning state under 250, success/ready state at 250+).
- **FR-006**: The system MUST automatically save candidate drafts locally so that switching topics or refreshing the browser preserves progress.
- **FR-007**: The system MUST provide an "AI Improve" action button, enabled when a candidate has written a draft.
- **FR-008**: The system MUST render a dedicated comparison pane that contrasts the candidate's original text with the improved DELF B2-level version.
- **FR-009**: The system MUST highlight differences between original and improved text using visual diff styling (highlighting removed/modified words and phrasing in red, and new/enhanced phrasing in a contrasting highlight).
- **FR-010**: The system MUST provide concise pedagogical explanations for significant modifications, categorized under official DELF B2 criteria:
  - *Correction sociolinguistique & Registre* (formal tone, polite formulas, *vouvoiement*).
  - *Cohérence et cohésion* (logical connectors, transition phrases, paragraph progression).
  - *Compétence morphosyntaxique* (subjunctive moods, conditionnel, complex tenses, agreement).
  - *Richesse et précision lexicale* (B2-level idiomatic expressions, nuanced vocabulary).
- **FR-011**: The system MUST allow candidates to copy the improved essay to the system clipboard with a single click.
- **FR-012**: The system MUST allow candidates to reset or switch their practice session with confirmation to prevent accidental data loss.

### Key Entities

- **Prompt**: Represents a DELF B2 writing assignment.
  - *Attributes*: Identifier, title, genre/category (Formal Letter, Argumentative Essay, Forum Article), scenario context, instructions, word count guideline (250 words).
- **Essay Draft**: Represents the candidate's composition.
  - *Attributes*: Prompt identifier, raw text content, current word count, autosave timestamp, completion status.
- **Improvement Result**: Represents the AI assessment and elevated essay version.
  - *Attributes*: Original text, improved B2 text, diff tokens (unchanged, deleted/modified, added), overall feedback summary.
- **Pedagogical Note**: Represents a specific instructional explanation for a change.
  - *Attributes*: DELF B2 criterion category, original snippet, improved snippet, pedagogical rationale in French/English.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The real-time word counter updates within 50 milliseconds of any keystroke.
- **SC-002**: Prompt selection and randomizer switch topics and display the new prompt context within 100 milliseconds.
- **SC-003**: 100% of candidate drafts are preserved during browser refreshes or accidental tab closures via client-side autosave.
- **SC-004**: The comparison pane clearly displays diff highlights without text misalignment or clipped content across desktop and tablet screen widths (>=768px).
- **SC-005**: Improvement responses include pedagogical notes covering at least 3 distinct DELF B2 criteria areas for essays exceeding 150 words.
- **SC-006**: 95% of first-time users can understand their word count progress and access the comparison view without needing external instructions.

## Assumptions

- **Target Audience**: Candidates actively preparing for the DELF B2 French certification examination seeking targeted written production practice.
- **Word Target**: In accordance with France Éducation international guidelines, the standard minimum word target is set to 250 words with an allowable margin (usually ±10% in examination grading, but aiming for 250+ as optimal practice).
- **Language Environment**: The user interface is presented with clean French / English bilingual cues (or French-first learning environment) with all prompts and essays strictly in French.
- **Platform**: Modern desktop and tablet web browsers (Chrome, Firefox, Safari, Edge) with responsive layout.
- **Offline / Standalone Capability**: The application architecture will accommodate an offline mode / fallback mock for demonstration or self-hosted deployment, adhering to Constitution Principle V.
