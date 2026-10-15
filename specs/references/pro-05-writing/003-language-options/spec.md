# Feature Specification: Multilingual UI Language Options (FR, EN, ZH, VI)

**Feature Branch**: `003-language-options`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "/specify add language options: english, french, chinese, vietnamese"

---

## 1. Overview & Business Intent

While the DELF B2 exam requires candidates to compose essays strictly in French, candidates preparing for the exam come from diverse linguistic backgrounds across the world—notably native speakers of English, Chinese, and Vietnamese alongside French learners. 

Providing a native UI interface (prompts guidance, button labels, criteria explanations, status badges, settings, and tooltips) in **French (Français)**, **English**, **Chinese (中文)**, and **Vietnamese (Tiếng Việt)** dramatically lowers initial friction, boosts cognitive clarity for beginners/intermediates, and improves learner confidence.

In accordance with the project's **Constitution (Principle II: Exceptional User Experience & Learner Delight)**, the language switch must be instantaneous (<50ms), persistent across sessions (Constitution Principle II: Zero Data Loss), accessible via the top navigation, and available in both the React application and the single-file distribution ([`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html)).

---

## 2. Supported Languages

| Code | Display Name | Localized Name | Flag / Symbol | Default |
| :--- | :--- | :--- | :--- | :--- |
| `fr` | French | Français | 🇫🇷 FR | **Yes** (Default) |
| `en` | English | English | 🇬🇧 EN | No |
| `zh` | Chinese | 中文 | 🇨🇳 ZH | No |
| `vi` | Vietnamese | Tiếng Việt | 🇻🇳 VI | No |

---

## 3. User Scenarios & Testing *(mandatory)*

### User Story 1 - Header Language Selector & Instant UI Switch (Priority: P1) 🎯 MVP

As a language learner whose native language is English, Chinese, or Vietnamese, I want to switch the interface language from a clean dropdown in the header, so that all navigation, buttons, tooltips, and rubrics appear immediately in my preferred language.

**Why this priority**: Core Minimum Viable Product (MVP). Enables candidates to immediately navigate the application in their comfortable language without cognitive overload.

**Independent Test**: Load the application, click the language selector in the header, select "Tiếng Việt" (or "English" / "中文"), and verify all buttons, labels, and status badges translate instantaneously (<50ms) without page refresh or resetting active essay content.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the candidate views the header, **Then** a language selector dropdown is visible displaying the active language (e.g. `🇫🇷 FR`).
2. **Given** the candidate opens the language dropdown, **When** they select `🇬🇧 English`, `🇨🇳 中文`, or `🇻🇳 Tiếng Việt`, **Then** all UI text strings (e.g. "AI Improve", "Clear", "Engine", "DELF B2 Criteria", word counter status) update instantaneously across both panes.
3. **Given** the candidate is actively drafting an essay in the editor, **When** they change the UI language, **Then** the draft text in the editor and current word count remain 100% intact without loss.

---

### User Story 2 - Language Persistence Across Sessions (Priority: P2)

As a candidate returning to practice repeatedly, I want my selected language preference to be saved in localStorage, so that each time I revisit the app, it loads directly in my preferred language.

**Why this priority**: Eliminates repetitive manual configuration, upholding Constitution Principle II (Zero Data Loss & Frictionless Practice).

**Independent Test**: Select "中文" as the language, refresh the browser (F5) or close and reopen the tab, and confirm that the interface loads in Chinese immediately on startup.

**Acceptance Scenarios**:

1. **Given** a candidate selects a non-default language (e.g. `vi`), **When** the change is made, **Then** the preference is saved in `localStorage` under `UserSettings.language`.
2. **Given** saved language preferences in `localStorage`, **When** the application initializes, **Then** it reads the stored preference and renders the chosen language prior to the first frame.
3. **Given** no existing preference in `localStorage`, **When** the application boots, **Then** it gracefully defaults to `fr` (French) or inspects browser `navigator.language` as a fallback.

---

### User Story 3 - Settings Modal Language Synchronization (Priority: P3)

As a candidate customizing my experience, I want to also view or change the language setting inside the Settings modal alongside AI provider and theme configurations.

**Why this priority**: Keeps application configuration unified and intuitive for learners who explore the settings panel.

**Independent Test**: Open Settings modal, locate the "Interface Language" dropdown, change language, and confirm both the modal and main workspace update in sync.

**Acceptance Scenarios**:

1. **Given** the Settings modal is open, **When** inspected, **Then** an "Interface Language" option is available with radio buttons or a dropdown for all 4 languages.
2. **Given** the user selects a language in the Settings modal, **When** closed or applied, **Then** the header language selector reflects the updated choice.

---

### User Story 4 - Parity with Standalone Single-File App (Priority: P4)

As a user running the zero-dependency [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html), I want the exact same 4-language switcher and translations present and functioning offline.

**Why this priority**: Ensures 100% offline distribution parity for candidates without Node.js.

**Independent Test**: Open `standalone.html` in a web browser without internet connection, switch between all 4 languages, and verify UI elements translate completely.

**Acceptance Scenarios**:

1. **Given** `standalone.html` is open, **When** the user clicks the language switcher, **Then** English, French, Chinese, and Vietnamese options are fully available and functional.

---

### Edge Cases

- **Mixed Content**: The essay prompts and candidate writing remain in French (as DELF B2 tests French writing ability); only instructional UI labels, guidelines, error messages, and tooltips are localized. Optional bilingual prompt context/instructions can be supported where appropriate.
- **Narrow Mobile Screens (<375px)**: The language dropdown in the header must use compact styling (e.g. `FR`, `EN`, `ZH`, `VI` or flag emoji) to avoid crowding the header action buttons.
- **Corrupted or Unknown Stored Language**: If `localStorage` contains an invalid language code (e.g. `'de'` or `'null'`), the app must safely fall back to `'fr'`.

---

## 4. Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide support for four distinct UI languages: French (`fr`), English (`en`), Chinese (`zh`), and Vietnamese (`vi`).
- **FR-002**: System MUST render a language selector control in the application header accessible to mouse, touch, and keyboard users.
- **FR-003**: System MUST provide a dictionary-based translation system (`translations.ts`) mapping keys to localized strings across all 4 languages without requiring heavy third-party runtime bundles.
- **FR-004**: System MUST localize:
  - Header actions and brand badge
  - Engine indicators ("Moteur : " / "Engine: " / "引擎：" / "Động cơ: ")
  - Theme toggles & Settings button titles
  - Prompt selector labels, category names, and "Random Topic" button
  - Word counter status messages ("Under 250 words", "Nearing target", "Target achieved")
  - Editor action buttons ("Clear", "AI Improve", "Analyzing...", "Copy")
  - Comparison pane headers, tabs, and diff legend
  - DELF criteria badges (Sociolinguistic, Coherence, Grammar, Vocabulary)
  - Settings modal titles, descriptions, and buttons
  - "Buy Me a Coffee" button label / tooltip
- **FR-005**: System MUST persist the active language in `localStorage` under `UserSettings.language`.
- **FR-006**: System MUST default to `'fr'` if no valid saved language is found.
- **FR-007**: System MUST maintain 100% parity in [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html).

### Key Entities

- **SupportedLanguage**: `'fr' | 'en' | 'zh' | 'vi'`
- **LanguageOption**:
  - `code`: `SupportedLanguage`
  - `name`: `string` (e.g. "Français")
  - `label`: `string` (e.g. "FR")
  - `flag`: `string` (e.g. "🇫🇷")
- **TranslationDictionary**: Key-value mapping of interface tokens to localized text per language.

---

## 5. Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Switching language takes < 50ms and requires 0 page reloads.
- **SC-002**: 100% of defined UI strings render in the selected language without unlocalized fallback placeholders (`[KEY_NOT_FOUND]`).
- **SC-003**: Zero loss of candidate essay text or timer state when switching languages during active composition.
- **SC-004**: Automated unit tests verify all 4 language dictionaries contain complete key coverage without missing keys.
- **SC-005**: 100% functional parity between React components and `standalone.html`.

---

## 6. Assumptions

- The primary essay prompt text and sample student answers remain primarily in authentic French, consistent with the DELF B2 examination specification.
- Translations cover Simplified Chinese (`zh-Hans`), Standard English (`en`), Metropolitan French (`fr`), and Standard Vietnamese (`vi`).
- No bulky external i18n libraries (like heavy `i18next` bundles) are required; a clean, type-safe, lightweight dictionary system guarantees high performance and instant offline loading.
