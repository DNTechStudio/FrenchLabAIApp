# Feature Specification: 100% High-Fidelity UI Alignment for Standalone Dictation Module (« Mode Dictée »)

**Feature Branch**: `002-dictation-module`

**Created**: 2026-10-02 | **Last Amended**: 2026-10-02

**Status**: Ready for Implementation

**Input**: User request: `"/specify làm lại giao diện của mục \"Dictation\" giống như vầy"` with visual reference screenshot of PRO-05's Mode Dictée card.

---

## Visual Design Reference & Layout Contract

The Dictation workspace UI MUST replicate **100% of the visual layout, controls, and components** from the provided screenshot of PRO-05's **« Mode Dictée »**:

1. **Top Control Bar**:
   - **Back / Navigation button**: `← Rédaction` (or `← Bibliothèque` to pick other exercises).
   - **Module Title**: `🎧 Mode Dictée`.
   - **CEFR Level Badge**: Pill badge with subtle border (e.g. `B1` or `B2`).
   - **TTS Voice Badge**: `🎙️ Web Speech` (or `🎙️ Neural2-A (IA)`).
   - **Speed Selector**: `Vitesse :` with two toggleable pills `0.75x` and `1.0x`.

2. **Audio Control Deck Card (`dictation-deck-card`)**:
   - **Stepper Header**: `Phrase X sur Y` (e.g. *Phrase 1 sur 4*).
   - **Progress Bar**: Thin, smooth progress bar right beneath the stepper label.
   - **Audio & Navigation Controls**:
     - `◀ Précédent` with `<kbd class="shortcut-kbd">Ctrl+←</kbd>`.
     - Prominent center action button: `► Écouter` (vibrant indigo/purple `#6366f1` / `#4f46e5` with subtle glow; switches to `⏸ Pause` while playing).
     - `🔁 Réécouter` with `<kbd class="shortcut-kbd">Ctrl+Space</kbd>`.
     - `Suivant ▶` with `<kbd class="shortcut-kbd">Ctrl+→</kbd>` (below or arranged cleanly alongside).

3. **Transcription Input Area (`dictation-input-container`)**:
   - **View Mode Tabs**:
     - Active sentence tab: `Phrase 1` (highlighted indigo pill).
     - Full text tab: `Texte intégral (4 phrases)` (secondary pill).
   - **Dark Inset Textarea**:
     - Distinct dark background with rounded corners and subtle focus glow.
     - Placeholder: `Écoutez la phrase 1 et tapez ce que vous entendez en français... (Ctrl+Espace pour réécouter)` (or full text equivalent).
   - **Action & Word Count Bar**:
     - Left: `Mots transcrits : 0  (Attendu : ~44 mots)`.
     - Middle/Right: `Effacer` (secondary button to clear active sentence input).
     - Right: `🎯 Corriger ma dictée` (vibrant gradient button `#6366f1` -> `#8b5cf6`).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 100% Fidelity Visual Layout Matching Screenshot (Priority: P1)

As a candidate practicing French listening and spelling,
I want the Dictation screen to look identical to the established PRO-05 Mode Dictée interface (deck card, progress bar, shortcuts, tabbed transcription, and indigo action buttons),
So that I have an intuitive, familiar, and distraction-free learning experience.

**Why this priority**:
Ensures strict visual consistency and user satisfaction by directly adopting the proven layout requested.

**Independent Test**:
Navigate to Dictation → verify the presence of:
1. Top bar with `← Rédaction`, `🎧 Mode Dictée`, `B1`, `🎙️ Web Speech`, and `Vitesse: 0.75x 1.0x`.
2. Audio deck card with `Phrase 1 sur 4`, progress bar, `◀ Précédent [Ctrl+←]`, `► Écouter`, `🔁 Réécouter [Ctrl+Space]`, `Suivant ▶ [Ctrl+→]`.
3. Tabs `Phrase 1` and `Texte intégral (4 phrases)`.
4. Textarea with exact placeholder text.
5. Bottom bar with word counts, `Effacer`, and `🎯 Corriger ma dictée`.

**Acceptance Scenarios**:
1. **Given** the candidate is on the Dictation module, **When** viewing the interface, **Then** all visual elements, buttons, badges, and layout hierarchy match the reference screenshot.
2. **Given** clicking `Vitesse : 0.75x` or `1.0x`, **When** the choice is toggled, **Then** the active pill highlights in solid indigo/purple and future playback respects that rate.
3. **Given** clicking `Phrase 1` or `Texte intégral (X phrases)`, **When** the tab is switched, **Then** the active tab updates and the textarea switches between single sentence input and full text review.

---

### User Story 2 - Audio Playback & Interactive Shortcuts (Priority: P1)

As a candidate transcribing spoken French,
I want to use the prominent `► Écouter` button and keyboard shortcuts (`Ctrl+Space`, `Ctrl+←`, `Ctrl+→`),
So that I can transcribe quickly without lifting my hands from the keyboard.

**Why this priority**:
Essential ergonomic requirement for fluid dictation practice.

**Independent Test**:
Press `Ctrl+Space` → verify current sentence audio plays. Press `Ctrl+Right` → verify navigation advances to sentence 2 and progress bar updates.

**Acceptance Scenarios**:
1. **Given** the candidate is typing in the textarea, **When** they press `Ctrl+Space`, **Then** the sentence audio replays.
2. **Given** typing sentence 1, **When** pressing `Ctrl+Right`, **Then** the interface transitions to sentence 2, updates the progress bar, and focuses the textarea.

---

### User Story 3 - Visual Correction & Linguistic Diagnostic (Priority: P2)

As a student clicking `🎯 Corriger ma dictée`,
I want to see the detailed diagnostic results with word-level diff, homophone tagging, and accuracy score,
So that I understand every mistake made.

**Acceptance Scenarios**:
1. **Given** text is transcribed, **When** clicking `🎯 Corriger ma dictée`, **Then** the diagnostic evaluation report card displays word accuracy %, mistake categories, and sentence-by-sentence diff.
2. **Given** viewing evaluation, **When** clicking `← Rédaction` or `Recommencer`, **Then** the candidate can return to edit or restart.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the exact header layout: `[← Rédaction] [🎧 Mode Dictée] [Level Badge] [🎙️ Voice Badge] [Vitesse: 0.75x 1.0x]`.
- **FR-002**: System MUST render the audio control deck card with `Phrase X sur Y`, linear progress fill bar, `◀ Précédent`, `► Écouter`, `🔁 Réécouter`, and `Suivant ▶`.
- **FR-003**: System MUST support keyboard shortcuts: `Ctrl+Space` (replay), `Ctrl+←` (prev), `Ctrl+→` (next).
- **FR-004**: System MUST render sentence mode tab (`Phrase X`) and full text mode tab (`Texte intégral (X phrases)`).
- **FR-005**: System MUST render transcription textarea with placeholder `Écoutez la phrase X et tapez ce que vous entendez en français... (Ctrl+Espace pour réécouter)`.
- **FR-006**: System MUST display `Mots transcrits : X (Attendu : ~Y mots)` alongside `Effacer` and `🎯 Corriger ma dictée`.
- **FR-007**: System MUST support French speech synthesis at both `0.75x` and `1.0x` speeds.
- **FR-008**: System MUST execute deterministic French dictation evaluation on submit, showing accuracy % and mistake breakdown.

---

## Success Criteria *(mandatory)*

- **SC-001**: The Dictation workspace matches the reference screenshot's structural layout and UI elements with 100% fidelity.
- **SC-002**: Audio starts within < 200ms of clicking `► Écouter` or pressing `Ctrl+Space`.
- **SC-003**: All keyboard shortcuts (`Ctrl+Space`, `Ctrl+←`, `Ctrl+→`) work seamlessly while typing in the textarea.
- **SC-004**: Word counter accurately tracks transcribed French words in real time.
