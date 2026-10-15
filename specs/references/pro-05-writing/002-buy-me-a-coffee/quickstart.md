# Quickstart & Verification Guide: Buy Me a Coffee Support Button

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/002-buy-me-a-coffee/spec.md) | **Branch**: `002-buy-me-a-coffee` | **Date**: 2026-09-22

## 1. Overview
This guide provides verification steps to validate the "Buy Me a Coffee" button across both the React application and the single-file distribution (`standalone.html`).

---

## 2. Automated Verification

Run unit and component tests:
```bash
npm test -- tests/Header.test.tsx
```

### Expected Test Assertions:
1. **Renders Button with Correct Attributes**:
   - Element is rendered in `.header-actions`.
   - `href` attribute equals `https://buymeacoffee.com/writingdelfb2` (or configured URL).
   - `target` is `_blank` and `rel` includes `noopener noreferrer`.
2. **Accessible Elements**:
   - `aria-label` or `title` is present and matches the accessibility description.
3. **Coffee Icon Presence**:
   - Verifies rendering of the Lucide `Coffee` SVG icon.

---

## 3. Manual Browser Verification

### Scenario 1: Desktop Viewport (>768px)
1. Open the application (via Vite server or [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html)).
2. Inspect the top-right header section.
3. Verify that the "Buy Me a Coffee" button shows both the warm coffee icon and text label (e.g. *"Offrez-moi un café"*).
4. Hover over the button: verify subtle amber glow and smooth transition.
5. Click the button: verify the donation page opens in a new tab without disturbing the editor or word count.

### Scenario 2: Mobile Viewport (<=768px)
1. Open Developer Tools (F12) and toggle mobile device simulation (e.g., iPhone 14 or 375px width).
2. Verify that the button label is hidden, collapsing gracefully into an icon-only circular/pill button.
3. Verify that the header does not wrap awkwardly or overlap with the brand title or settings button.

### Scenario 3: Theme Toggle
1. Switch between Dark mode and Light mode.
2. Verify the button maintains high contrast (WCAG 2.1 AA compliant) in both themes.
