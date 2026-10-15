# Implementation Plan: Buy Me a Coffee Support Button

**Branch**: `002-buy-me-a-coffee` | **Date**: 2026-09-22 | **Spec**: [specs/002-buy-me-a-coffee/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/002-buy-me-a-coffee/spec.md)

**Input**: Feature specification from `specs/002-buy-me-a-coffee/spec.md`

## Summary

Implement an accessible, responsive, and visually harmonious "Buy Me a Coffee" button within the application header. 
- Integrated in [`Header.tsx`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/src/components/Header.tsx) and [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html).
- Uses Lucide `Coffee` icon with warm amber/gold styling.
- Responsive design collapses text label into a compact icon button on mobile screens (<768px).
- Secure target link isolation (`target="_blank" rel="noopener noreferrer"`).
- Zero distraction to active candidate writing workflow (Constitution Principle II).

---

## Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022

**Primary Dependencies**: `react`, `lucide-react` (or SVG icon)

**Storage**: N/A (configuration constants, zero breaking storage changes)

**Testing**: `vitest` + `@testing-library/react` for component rendering, accessibility, and link target verification

**Target Platform**: Modern Web Browsers (desktop & mobile)

**Project Type**: Client-side Web Application (Vite React SPA & Standalone HTML)

**Performance Goals**: Zero performance impact (<0.1ms render, 0 external runtime network calls)

**Constraints**: Must preserve exam learner focus; no intrusive popups or disruptive modals.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, zero dead code | Dedicated `SupportConfig` interface, structured constants in `src/domain/constants.ts` | **PASS** |
| **II. Exceptional UX & Learner Delight** | Distraction-free, accessible contrast, responsive | Non-obtrusive header placement, responsive label collapse on mobile, WCAG 2.1 AA compliant | **PASS** |
| **III. Test-First & Automated Verification** | Automated component testing | Component tests in `tests/Header.test.tsx` verifying link, icon, and attributes | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decoupled configuration | Support configuration decoupled from UI via domain constants | **PASS** |
| **V. Performance & Offline Resilience** | Offline resilience, no blocking network calls | Static anchor link with direct URL; does not require network to render | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## Project Structure

### Documentation (this feature)

```text
specs/002-buy-me-a-coffee/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Technical Research & Architecture Decisions
├── data-model.md        # Data Model & Configuration
└── quickstart.md        # Verification & Testing Guide
```

### Source Code Modifications

```text
src/
├── domain/
│   └── constants.ts     # [NEW] DEFAULT_SUPPORT_CONFIG and SupportConfig interface
├── components/
│   └── Header.tsx       # [MODIFY] Render Buy Me a Coffee button with responsive label
├── index.css            # [MODIFY] Add .btn-bmc and responsive media queries
standalone.html          # [MODIFY] Add Buy Me a Coffee button & CSS in standalone app
tests/
└── Header.test.tsx      # [NEW/MODIFY] Add component tests for Header support button
```
