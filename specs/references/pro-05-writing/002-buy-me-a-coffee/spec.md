# Feature Specification: Buy Me a Coffee Support Button

**Feature Branch**: `002-buy-me-a-coffee`

**Created**: 2026-09-22

**Status**: Draft

**Input**: User description: "/specify create a button \"buy me a coffee\""

---

## 1. Overview & Business Intent

The goal is to provide a non-intrusive, aesthetically pleasing "Buy Me a Coffee" (Soutenir le projet / Offrez-moi un café) button within the DELF B2 Writing Practice application. Candidates and educators who find value in the free exam preparation tool can easily support its development and hosting.

In accordance with the project's **Constitution (Principle II: Exceptional User Experience & Learner Delight)**, the button must remain harmonious, polite, and distraction-free—never obstructing or cluttering the primary essay composition and review workflow.

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Header Support Button & Direct Donation Link (Priority: P1)

As a candidate or educator who appreciates the application, I want to see a visible, tasteful "Buy Me a Coffee" button in the application header/navigation, so that I can click it to support the creator on Buy Me a Coffee (or a configured donation platform).

**Why this priority**: Delivers the immediate core value of giving learners a clear and direct path to support the project without unnecessary complexity.

**Independent Test**: Can be tested by loading the application, observing the button in the top navigation bar, clicking it, and confirming that the creator's donation link opens in a secure new browser tab (`target="_blank"` with `rel="noopener noreferrer"`).

**Acceptance Scenarios**:

1. **Given** the user is viewing the application header, **When** the page renders in either dark or light mode, **Then** the "Buy Me a Coffee" button is displayed with an appropriate warm coffee icon (e.g., Lucide `Coffee`), concise text (or responsive icon-only badge on narrow mobile screens), and harmonious hover styling.
2. **Given** the user clicks the "Buy Me a Coffee" button, **When** clicked, **Then** the destination URL opens securely in a new browser tab without disrupting ongoing writing drafts, active timers, or unsaved inputs.
3. **Given** keyboard navigation, **When** a user tabs through the header controls, **Then** the support button receives clear visual focus and can be triggered via `Enter` or `Space` key.

---

### User Story 2 - Responsive & Distraction-Free Layout (Priority: P2)

As a user on mobile or smaller laptop screens, I want the button to adapt its display gracefully (e.g. collapsing to a neat coffee icon button with a tooltip) so that the editor header remains clean, uncluttered, and readable.

**Why this priority**: Exam candidates require maximum focus and unobstructed screen estate on various devices (tablets, laptops, phones).

**Independent Test**: Can be tested by resizing the browser viewport from desktop (1280px+) down to tablet (768px) and mobile (<480px) and verifying that the header does not wrap awkwardly or overlap other actions.

**Acceptance Scenarios**:

1. **Given** a desktop viewport (>768px), **When** viewed, **Then** the button shows both the coffee icon and descriptive label ("Buy me a coffee" or "Offrir un café").
2. **Given** a mobile viewport (<=768px), **When** viewed, **Then** the button smoothly collapses into a compact icon-only circular/pill button with full accessibility attributes (`aria-label="Buy me a coffee"` and `title="Soutenir le projet / Buy me a coffee"`).

---

### User Story 3 - Configurable Support URL in Settings (Priority: P3)

As an administrator, self-hoster, or future maintainer, I want the donation URL to be configurable (or fall back to a sensible project default URL), so that the destination link can be customized without editing core component code.

**Why this priority**: Promotes modularity and maintainability (Constitution Principle IV: Domain Separation & Modular Architecture).

**Independent Test**: Can be tested by verifying that the target link is derived from an application configuration/settings constant and can optionally be updated through settings or environment configuration.

**Acceptance Scenarios**:

1. **Given** a default installation, **When** no custom link is provided in settings, **Then** the button defaults to the official project Buy Me a Coffee URL (e.g., `https://buymeacoffee.com/writingdelfb2` or configurable handle).
2. **Given** the Settings modal, **When** inspected, **Then** an optional field or credit link shows the project support destination.

---

### User Story 4 - Parity with Standalone Single-File Distribution (Priority: P4)

As a learner using the zero-dependency [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html) offline version, I want the exact same "Buy Me a Coffee" button and behavior present in `standalone.html`, ensuring parity between the Vite React build and the standalone package.

**Why this priority**: The standalone file is a first-class distribution vehicle for users in environments without Node.js.

**Independent Test**: Can be tested by opening `standalone.html` in any browser and verifying that the button is rendered with identical styling and behavior as the Vite application.

**Acceptance Scenarios**:

1. **Given** `standalone.html` is opened directly in a browser, **When** the header renders, **Then** the "Buy Me a Coffee" button appears with Lucide coffee icon and operates identical to the main React application.

---

### Edge Cases

- **Offline Usage**: When the learner is offline without internet access, clicking the external link should fail gracefully via normal browser offline indicators without crashing the app or resetting the user's active essay draft.
- **Extreme Viewport Shrinkage (<360px)**: The button must not cause header overflow or push the theme toggle or settings button offscreen; header flex-wrap or truncation rules must maintain stability.
- **Accidental Click During Timed Practice**: Because the link opens with `target="_blank"`, the active session tab remains completely unaffected and preserved.

---

## 3. Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render a "Buy Me a Coffee" action button in the primary navigation header of both the React application (`Header.tsx`) and the single-file distribution (`standalone.html`).
- **FR-002**: System MUST use a recognizable coffee icon (Lucide `Coffee`) accompanied by clear label text ("Buy me a coffee" / "Offrir un café").
- **FR-003**: System MUST open the donation URL in a new browser tab (`target="_blank"`) with security hardening attributes (`rel="noopener noreferrer"`).
- **FR-004**: System MUST supply a default URL constant (e.g., `DEFAULT_BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/writingdelfb2'`).
- **FR-005**: System MUST collapse text to an icon-only button on mobile screens (<768px) to protect header layout integrity.
- **FR-006**: Button styling MUST support both dark and light modes with proper WCAG 2.1 AA contrast and smooth hover/active micro-transitions.
- **FR-007**: Button MUST include complete accessible labels (`aria-label="Buy me a coffee - Soutenir le projet"`) and keyboard focus indicators.

### Key Entities

- **SupportConfig**:
  - `url`: `string` (valid web URL for Buy Me a Coffee or Ko-Fi profile)
  - `label`: `string` (display text: "Buy me a coffee" / "Offrir un café")
  - `enabled`: `boolean` (whether the button is visible, defaults to `true`)

---

## 4. Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking the button opens the destination URL in a new tab in 100% of tested modern browsers (Chrome, Edge, Firefox, Safari) without altering editor state.
- **SC-002**: Zero layout regression or horizontal scrollbars introduced across all standard viewports (360px to 1920px+).
- **SC-003**: 100% feature parity maintained between Vite React components and `standalone.html`.
- **SC-004**: Automated tests (e.g., `Header.test.tsx`) pass verifying button rendering, accessibility attributes, and link target behavior.

---

## 5. Assumptions

- Target donation platform is Buy Me a Coffee (`buymeacoffee.com`), with flexibility to point to Ko-fi or GitHub Sponsors via configuration.
- The button is a direct anchor/button that requires no backend payment processing inside the app itself, preserving the client-side/offline-first nature of the application.
- The default text can be in English ("Buy me a coffee") or French ("Offrir un café"), with English being the internationally recognized brand name for Buy Me a Coffee.
