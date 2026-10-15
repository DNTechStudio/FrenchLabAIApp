# Technical Research & Architecture Decisions: Buy Me a Coffee Button

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/002-buy-me-a-coffee/spec.md) | **Branch**: `002-buy-me-a-coffee` | **Date**: 2026-09-22

## 1. Technical Objectives & Constraints

- **Non-Intrusive UX**: Must respect Constitution Principle II (Exceptional UX & Learner Delight). Candidates are in an exam preparation context; any donation element must be tasteful, polite, and never obscure timer, editor, or feedback panels.
- **Responsive Layout**: On desktop screens (>768px), display both icon and label. On smaller screens (<=768px), smoothly collapse to a compact icon-only button with full accessibility attributes (`aria-label`, `title`).
- **Zero Heavy Dependencies**: Rely on existing dependencies (`lucide-react` for React Vite, standalone Lucide or inline SVG for `standalone.html`).
- **Security & Tab Isolation**: External links must always use `target="_blank"` with `rel="noopener noreferrer"` to prevent tab hijacking and preserve user session state.
- **Dual Target Parity**: Both the Vite React app (`src/components/Header.tsx`) and the single-file distribution (`standalone.html`) must remain in 100% feature parity.

---

## 2. Options Considered

### Option A: Modal Dialog with Embedded Widget
- **Description**: Clicking the button opens an internal modal with an embedded iframe or multiple donation tiers (Stripe/PayPal/BMC).
- **Pros**: Keeps user within the application.
- **Cons**: High complexity, external iframe security/CSP restrictions, requires network connectivity, distracting for an offline-first practice tool.
- **Verdict**: **Rejected** (Violates Simplicity & Constitution Principle V).

### Option B: Clean Header Anchor Button with Direct Link (Recommended)
- **Description**: An accessible `<a>` styled as a button in the header actions with a Lucide `Coffee` icon and label. Links directly to the creator's page in a new tab.
- **Pros**:
  - Extremely lightweight (<1 KB CSS/HTML).
  - 100% resilient offline (clicking it behaves naturally if offline; never crashes the editor).
  - Zero state disruption for active drafts or running timers.
  - Effortless parity between React SPA and `standalone.html`.
- **Verdict**: **Accepted**.

---

## 3. Styling & Design System Integration

- **Color Palette**:
  - Uses CSS variable tokens already established in `index.css`:
    - Base: `var(--bg-tertiary)` / `var(--border-color)`
    - Hover: subtle amber/coffee glow (`#FFDD00` or `var(--accent-primary)`) with darkened text or contrasting badge.
  - Light & dark mode compliant with WCAG 2.1 AA contrast ratio.
- **Typography & Layout**:
  - Fits inside `.header-actions` flex container alongside theme toggle and settings button.
  - Uses `@media (max-width: 768px)` to hide text label and maintain a clean 36x36px circular/rounded icon button.
