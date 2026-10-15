# Tasks: Buy Me a Coffee Support Button

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/002-buy-me-a-coffee/spec.md) | **Plan**: [plan.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/002-buy-me-a-coffee/plan.md) | **Date**: 2026-09-22

## Phase 1: Setup & Domain Configuration

**Purpose**: Define data interfaces and default configuration constants for the support button.

- [X] T001 [P] Define `SupportConfig` interface and `DEFAULT_SUPPORT_CONFIG` constant with default URL, labels, and aria attributes in `src/domain/constants.ts`
- [X] T002 [P] Export and wire `SupportConfig` into `src/domain/types.ts`

---

## Phase 2: User Story 1 - Header Support Button & Direct Link (Priority: P1) 🎯 MVP

**Goal**: Render an accessible, polite "Buy Me a Coffee" button in the application header linking securely to the creator support page in a new browser tab.

**Independent Test**: Load the application, click the button in `.header-actions`, and verify it opens the destination URL in a new tab without resetting active text or editor state.

### Tests for User Story 1 🧪
- [X] T003 [P] [US1] Create component tests verifying button rendering, `href`, `target="_blank"`, `rel="noopener noreferrer"`, and Lucide `Coffee` icon presence in `tests/Header.test.tsx` and `tests/run-all-tests.mjs`

### Implementation for User Story 1
- [X] T004 [US1] Import `Coffee` icon from `lucide-react` and render the anchor button inside `.header-actions` in `src/components/Header.tsx`
- [X] T005 [US1] Pass optional `supportConfig` prop through `Header` component with fallback to `DEFAULT_SUPPORT_CONFIG` in `src/components/Header.tsx` and `src/App.tsx`

**Checkpoint**: User Story 1 is functional; clicking the button opens the support page safely.

---

## Phase 3: User Story 2 - Responsive & Theme-Aware Styling (Priority: P2)

**Goal**: Ensure the button adheres to WCAG 2.1 AA contrast in both Dark and Light themes, with smooth hover transitions and responsive collapse on mobile screens (<=768px).

**Independent Test**: Resize browser viewport below 768px to verify the label collapses into an icon-only pill button, and toggle dark/light theme to verify contrast.

- [X] T006 [US2] Add `.btn-bmc`, `.btn-bmc-text`, and hover micro-interaction styles using design tokens in `src/index.css`
- [X] T007 [US2] Add responsive `@media (max-width: 768px)` rules to collapse button text to a compact icon button on mobile screens in `src/index.css`
- [X] T008 [US2] Verify focus outline and keyboard accessibility (`Enter`/`Space`) for tab navigation in `src/index.css`

---

## Phase 4: User Story 3 & 4 - Standalone Single-File Parity (Priority: P4)

**Goal**: Bring 100% feature parity to the zero-dependency [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html) distribution so offline and standalone users enjoy the exact same button and behavior.

**Independent Test**: Open `standalone.html` directly in any web browser and confirm the coffee button renders, scales responsively, and toggles seamlessly across themes.

- [X] T009 [US4] Add CSS rules for `.btn-bmc` and responsive mobile collapse in `standalone.html`
- [X] T010 [US4] Add the "Buy Me a Coffee" button markup with Lucide coffee icon and link attributes into the header of `standalone.html`

---

## Phase 5: Verification & Review Gate

**Purpose**: Run automated tests and perform manual browser verification across desktop and mobile viewports.

- [X] T011 Run unit and component test suite (`tests/Header.test.tsx` and `tests/run-all-tests.mjs`)
- [X] T012 Manual end-to-end verification in browser subagent (desktop view, mobile simulation, dark/light theme, tab isolation)
- [X] T013 Update `tasks.md` checklist with completion status
