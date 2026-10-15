# Tasks: Multilingual UI Language Options (FR, EN, ZH, VI)

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/003-language-options/spec.md) | **Plan**: [plan.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/003-language-options/plan.md) | **Date**: 2026-09-22

## Phase 1: Setup & Translation Dictionaries

**Purpose**: Establish type-safe translation dictionaries and helper functions for French, English, Chinese, and Vietnamese.

- [X] T001 [P] Create `src/domain/translations.ts` defining `SupportedLanguage`, `SUPPORTED_LANGUAGES`, the `AppTranslations` interface, and complete dictionaries for `fr`, `en`, `zh`, and `vi`
- [X] T002 [P] Implement `getTranslation(lang: SupportedLanguage): AppTranslations` helper with safe fallback to `fr` in `src/domain/translations.ts`
- [X] T003 [P] Update `UserSettings` interface in `src/domain/types.ts` to include optional `language?: SupportedLanguage`
- [X] T004 Update `StorageService` in `src/services/storageService.ts` to persist and restore `language` in `UserSettings`

---

## Phase 2: User Story 1 - Header Language Selector & Instant UI Switch (Priority: P1) 🎯 MVP

**Goal**: Render a language selector dropdown in the header and bind all primary UI strings to the active language dictionary with instantaneous switching (<50ms) and zero draft loss.

**Independent Test**: Load the app, switch to `en`, `zh`, or `vi` from the header dropdown, and verify all button labels, status messages, and pane titles translate immediately while preserving any typed draft text.

### Tests for User Story 1 🧪
- [X] T005 [P] [US1] Add dictionary key completeness tests to `tests/run-all-tests.mjs` verifying 100% key parity across `fr`, `en`, `zh`, and `vi` dictionaries

### Implementation for User Story 1
- [X] T006 [US1] Create `LanguageSelector` component in `src/components/LanguageSelector.tsx` rendering flag + code with accessible dropdown
- [X] T007 [US1] Integrate `LanguageSelector` into `src/components/Header.tsx` and localize header elements (engine indicator, theme tooltips, settings label)
- [X] T008 [US1] Update `src/components/EditorPane.tsx`, `PromptSelector.tsx`, and `WordCounterBadge.tsx` to use translated labels (pane title, clear, random topic, categories, word counter status)
- [X] T009 [US1] Update `src/components/ComparisonPane.tsx` to use translated labels (pane title, tabs, criteria badges, diff legend, feedback titles, copy button)
- [X] T010 [US1] Wire `currentLanguage` state in `src/App.tsx`, providing translations down to components and updating `localStorage` on change

**Checkpoint**: User Story 1 is functional; switching languages updates all UI labels instantly without losing drafted text.

---

## Phase 3: User Story 2 & 3 - Settings Modal Synchronization (Priority: P2 & P3)

**Goal**: Allow candidates to configure the interface language from within the Settings modal, kept in sync with the header selector and persistent across reloads.

**Independent Test**: Open Settings modal, change language to `vi`, close modal, refresh page (F5), and verify the application boots in Vietnamese.

- [X] T011 [US3] Add Language selection section with localized labels in `src/components/SettingsModal.tsx`
- [X] T012 [US2] Verify `StorageService.loadSession()` restores the persisted language preference on initial render in `src/App.tsx`

---

## Phase 4: User Story 4 - Standalone Single-File App Parity (Priority: P4)

**Goal**: Bring 100% feature parity to [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html) with embedded translation dictionaries, language selector in header, and localized UI controls.

**Independent Test**: Open `standalone.html` in browser without internet access, cycle through `FR`, `EN`, `ZH`, and `VI`, and verify all UI elements translate cleanly.

- [X] T013 [US4] Embed complete `TRANSLATIONS` dictionary object for `fr`, `en`, `zh`, and `vi` in `standalone.html`
- [X] T014 [US4] Add language selector dropdown in header actions of `standalone.html`
- [X] T015 [US4] Bind all UI rendering calls (`pane-title`, buttons, badges, tabs, criteria, settings) to `TRANSLATIONS[currentLanguage]` in `standalone.html`

---

## Phase 5: Verification & Review Gate

**Purpose**: Run automated dictionary tests and verify multilingual experience across desktop and mobile viewports.

- [X] T016 Run automated test suite (`node tests/run-all-tests.mjs`)
- [X] T017 Manual end-to-end verification in browser subagent (switching through all 4 languages, checking draft preservation, verifying mobile collapse)
- [X] T018 Update `tasks.md` checklist with completion status
