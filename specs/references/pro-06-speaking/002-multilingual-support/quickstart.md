# Quickstart Validation Guide: Multilingual Support

**Feature**: `002-multilingual-support` | **Date**: 2026-09-28

---

## Validation Scenario 1: Language Switcher UI Verification
1. Open the simulator at `http://localhost:5173/`.
2. Locate the Language Selector dropdown in the header bar.
3. Switch to **English (🇬🇧 English)**:
   - Stepper changes to: *1. Topic • 2. Preparation • 3. Monologue • 4. Debate • 5. Report*.
   - Random draw button displays: *🎲 Random Draw (Official Exam Protocol)*.
4. Switch to **Tiếng Việt (🇻🇳 Tiếng Việt)**:
   - Stepper changes to: *1. Chọn đề • 2. Chuẩn bị (10m) • 3. Thuyết trình • 4. Tranh luận IA • 5. Bảng điểm*.
   - Scratchpad tabs display: *1. Mở bài & Vấn đề • 2. Dàn ý 2 phần • 3. Luận điểm & Dẫn chứng • 4. Kết luận*.
5. Switch to **中文 (🇨🇳 中文)**:
   - All navigation labels and buttons render simplified Chinese text.

## Validation Scenario 2: Multilingual Pedagogical Feedback
1. Complete or trigger an evaluation report.
2. Verify that grammar error explanations, points forts/faibles, and action plans are translated into the chosen language while official sub-scores and French speech citations remain intact.
