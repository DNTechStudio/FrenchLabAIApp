# Feature Specification: Multilingual Interface & Pedagogical Guidance (English, Chinese, Vietnamese)

**Feature Branch**: `002-multilingual-support`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "add languages english, chinese, vietnamese"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant UI Language Switcher (Priority: P1) 🎯 MVP

As an international candidate preparing for DELF B2 whose native language is English, Chinese, or Vietnamese, I want to switch the interface language between French, English, Chinese (中文), and Vietnamese (Tiếng Việt) at any time from the application header, so that I can easily navigate the simulator, understand timers, and follow exam instructions without cognitive overload.

**Why this priority**: Core accessibility for non-francophone learners. International candidates often need interface clarity (stepper, buttons, instructions, permissions modal) to focus their mental energy entirely on oral French production.

**Independent Test**: Can be tested independently by toggling the language selector dropdown in the header between Français (FR), English (EN), 中文 (ZH), and Tiếng Việt (VI), and verifying that all UI labels, buttons, navigation stepper steps, and scratchpad guide titles update instantly and persist across page reloads.

**Acceptance Scenarios**:
1. **Given** a candidate is on any view of the application, **When** they select "English" from the language picker, **Then** all header titles, phase steps, buttons ("Start preparation", "Begin recording", "Conclude debate"), and timer labels switch to English immediately without reloading the page.
2. **Given** a candidate selects "Tiếng Việt", **When** they open the preparation scratchpad, **Then** the section headers ("1. Mở bài & Vấn đề", "2. Dàn ý 2 phần", "3. Luận điểm & Dẫn chứng", "4. Kết luận") display in Vietnamese with proper diacritics.
3. **Given** a candidate selects "中文", **When** they inspect the preparation or debate screens, **Then** all UI prompts and guidance are rendered in simplified Chinese.
4. **Given** a candidate has selected a preferred language, **When** they refresh the browser or return in a new session, **Then** the simulator remembers their language preference from local storage.

---

### User Story 2 - Multilingual Pedagogical Feedback & Diagnostic Explanations (Priority: P2)

As a candidate reviewing my official DELF B2 evaluation report, I want the qualitative feedback, detected grammar error explanations, and recommended logical connectors to provide bilingual translations and pedagogical explanations in my selected language (English, Chinese, or Vietnamese), so that I can deeply understand my linguistic mistakes and study effectively.

**Why this priority**: While the candidate's speech and official rubric scores remain in French, pedagogical feedback (e.g., explaining why a subjunctive is required or why an agreement was wrong) is significantly more comprehensible when explained in the learner's native or strongest working language.

**Independent Test**: Can be tested by generating an evaluation report with English, Chinese, or Vietnamese active, verifying that the diagnostic analysis, action plan, and grammatical rule explanations are displayed in the chosen language while preserving verbatim French citations and the official 25-point scoring grid.

**Acceptance Scenarios**:
1. **Given** the candidate has selected Vietnamese and completes the exam, **When** the evaluation report renders, **Then** the qualitative strengths, weaknesses, and 3-step action plan are rendered in Vietnamese.
2. **Given** the candidate has selected English, **When** they review detected grammatical errors, **Then** the explanation card provides the French grammar rule explanation in English (e.g., "Subject-verb agreement: 'les gens' is plural and takes a 3rd-person plural verb").
3. **Given** the candidate has selected Chinese, **When** they review the recommended B2/C1 logical connectors, **Then** each French connector (e.g. "Néanmoins", "Par conséquent") includes a concise Chinese translation and usage example.

---

### User Story 3 - Bilingual Lexical Guidance for Trigger Documents (Priority: P3)

As a learner during the 10-minute preparation phase, I want the option to view a contextual bilingual vocabulary glossary for difficult B2 terms in the trigger document and examiner questions, so that I can expand my active vocabulary without getting blocked by unfamiliar French societal idioms.

**Why this priority**: Authentic DELF B2 trigger documents from French media (*Le Monde*, *Libération*, *Le Figaro*) contain advanced idiomatic expressions (e.g., *« en demi-teinte »*, *« effritement »*, *« fausse bonne idée »*). Providing an optional inline translation tooltip accelerates learner comprehension.

**Independent Test**: Can be tested by clicking "Vocabulaire clé (Key Vocabulary)" on a trigger document card and verifying that difficult B2 terms display translations in the currently active language (English, Chinese, or Vietnamese).

**Acceptance Scenarios**:
1. **Given** a candidate is reading the trigger document in Preparation phase, **When** they click "Glossaire", **Then** key terms and idiomatic phrases display tooltips/definitions translated into the chosen language.
2. **Given** the candidate switches languages while viewing the document, **When** the glossary is open, **Then** the translated definitions update dynamically.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Language Management & Localization (i18n)
- **FR-001**: System MUST support four active application languages: French (`fr`, default), English (`en`), Chinese (`zh`), and Vietnamese (`vi`).
- **FR-002**: System MUST provide a language selector in the persistent application header featuring flag icons, language native names, and ISO codes (🇫🇷 Français, 🇬🇧 English, 🇨🇳 中文, 🇻🇳 Tiếng Việt).
- **FR-003**: System MUST persist the selected language preference in `localStorage` under `delf_speaking_language_pref` and restore it automatically on session reload.
- **FR-004**: System MUST localize all UI chrome:
  - Stepper navigation: Sujet / Topic / 题目 / Chủ đề; Préparation / Preparation / 准备 / Chuẩn bị; Exposé / Monologue / 陈述 / Thuyết trình; Débat / Debate / 辩论 / Tranh luận; Bilan / Report / 报告 / Báo cáo.
  - Scratchpad section titles, guidance placeholders, and auto-save badges.
  - Timer headers and status messages (countdown, optimal window, time exceeded).
  - Controls, dialogs, microphone permission modals, and print export buttons.

#### Pedagogical Bilingual Feedback
- **FR-005**: System MUST provide localized qualitative synthesis (points forts, points faibles, plan d'action) in the chosen language.
- **FR-006**: System MUST translate pedagogical grammatical error explanations into the candidate's selected language while preserving the verbatim French mistake and the French correction.
- **FR-007**: System MUST provide bilingual glosses for all recommended B2/C1 logical connectors (*connecteurs logiques*).
- **FR-008**: System MUST preserve official DELF B2 oral exam integrity: the trigger documents, candidate speech recording, examiner voice audio, and official 25-point scoring grid metrics MUST remain in French.

#### Typography & Font Support
- **FR-009**: System MUST support clean typography rendering for Vietnamese diacritical marks (Unicode UTF-8) and simplified Chinese ideograms without glyph clipping or fallback font artifacts.

---

### Key Entities

- **Locale**: Enum representing supported languages: `'fr'` (Français), `'en'` (English), `'zh'` (中文), `'vi'` (Tiếng Việt).
- **TranslationDictionary**: Key-value nested dictionary mapping translation keys (e.g. `header.brand_title`, `prep.timer_remaining`, `rubric.monologue_title`) to localized strings for each supported locale.
- **LocalizedPedagogyItem**: Represents a pedagogical feedback item containing the core French pedagogical concept and localized student-facing explanations in EN, ZH, and VI.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Switching the application language updates 100% of visible UI text within 100 milliseconds without page refresh or audio interruption.
- **SC-002**: Selected language preference persists across 100% of browser reloads and exam session transitions.
- **SC-003**: 100% of diagnostic reports display bilingual error explanations and action plans when EN, ZH, or VI is selected.
- **SC-004**: Zero typography corruption or character encoding defects across all 4 languages.
- **SC-005**: The official 25-point CEFR oral exam rubric calculations and French audio debate flow remain 100% compliant with France Éducation international standards regardless of the chosen UI language.

---

## Assumptions

- **Official Exam Fidelity**: The candidate recognizes that the real DELF B2 examination takes place exclusively in French. Multilingual support serves as a pedagogical scaffold and UX accelerator, not as a replacement for French oral comprehension and production.
- **Speech Recognition & Neural Voice**: Voice recording (STT) and AI Examiner voice synthesis (TTS) remain configured to French (`fr-FR`) to evaluate French speaking proficiency.
- **Fallback Behavior**: If any obscure translation key is missing in a specific language, the system gracefully falls back to French (`fr`) or English (`en`).
