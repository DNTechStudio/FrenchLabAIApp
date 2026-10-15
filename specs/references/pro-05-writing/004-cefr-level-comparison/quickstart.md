# Quickstart & Verification Guide: CEFR Level Multi-Comparison (A1-C2)

**Feature**: `004-cefr-level-comparison` | **Date**: 2026-09-24

---

## 1. Automated Testing

Run the full automated test suite using Node's native test runner:

```bash
node tests/run-all-tests.mjs
```

### New Test Suites to Verify:
1. **CEFR Level Selection & Constraint Tests**:
   - Verifies minimum 1 level rule (cannot deselect last level).
   - Verifies maximum 2 levels rule (cannot select 3rd level).
   - Verifies fallback to `['B2']` on corrupted/empty storage.
2. **Translation Completeness for CEFR Metadata**:
   - Verifies all 6 levels have names, descriptors, and hints in `fr`, `en`, `zh`, and `vi`.
3. **Mock Level-Adapted Rewriting**:
   - Verifies `MockImprovementService` returns distinct rewrites for each level (A1 simple vs C2 sophisticated).

---

## 2. Interactive Manual Verification

### Scenario A: Selecting 1 Level (Default B2)
1. Load `standalone.html` or run the dev server (`npm run dev`).
2. Verify the 6 CEFR level checkboxes are visible above the action bar (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`).
3. Notice `B2` is selected by default with a distinct violet accent border.
4. Try unchecking `B2` -> Observe it remains checked (at least 1 level required).
5. Click **"Améliorer ma rédaction"** -> Observe **1 comparison window** opens with the B2 rewrite.

### Scenario B: Dual Level Selection (e.g. B1 and C1)
1. Click `B1` -> Now both `B1` and `B2` are checked.
2. Uncheck `B2`, then click `C1` -> Now `B1` and `C1` are checked.
3. Try clicking `A2` -> Observe `A2` is disabled or shows helper text *"Maximum 2 levels to compare"*.
4. Draft or keep an essay in the editor.
5. Click **"Améliorer ma rédaction"** (Improve with AI).
6. Observe:
   - **2 comparison windows open side-by-side** (`Window B1` and `Window C1`).
   - Window B1 shows B1-level text (clear, simple sentence structure, everyday vocabulary).
   - Window C1 shows C1-level text (elevated vocabulary, complex logical connectors, formal nuance).
   - Each window displays its own independent word count, criteria scores, visual diff against the original essay, and copy button.

### Scenario C: Switching Levels with Active Draft
1. While an essay is drafted, switch checkboxes from `B1 + C1` to `A2 + B2`.
2. Observe: The draft text in the editor and word counter are 100% preserved without data loss.

### Scenario D: Language Switching with CEFR Levels
1. Switch interface language to English (`EN`) or Vietnamese (`VI`).
2. Verify level titles and tooltips translate cleanly (e.g., `B2 - Upper Intermediate` / `B2 - Trung cấp nâng cao`).
