# Quickstart & Verification Guide: Multilingual UI Support

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/003-language-options/spec.md) | **Branch**: `003-language-options` | **Date**: 2026-09-22

## 1. Overview
This guide provides verification procedures to validate multilingual support across French, English, Chinese, and Vietnamese.

---

## 2. Automated Test Verification

Run translation dictionary integrity test:
```bash
node tests/run-all-tests.mjs
```

### Expected Test Assertions:
1. **Key Completeness**: All 4 dictionaries (`fr`, `en`, `zh`, `vi`) implement every key in `AppTranslations` with no missing or undefined strings.
2. **Fallback Safety**: Requesting an unsupported language code falls back gracefully to French (`fr`).
3. **Storage Persistence**: Verifies `StorageService` preserves and restores `settings.language`.

---

## 3. Manual Browser Verification

### Scenario 1: Language Switcher Dropdown (Desktop)
1. Open the app in browser or [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html).
2. Locate the language selector in the header (default: `🇫🇷 FR`).
3. Switch to `🇬🇧 English`:
   - Verify header shows "Engine: MOCK", "Buy me a coffee", button tooltip "AI Settings".
   - Verify editor pane shows "DELF B2 Essay Composition", "Random Topic", "Clear", "Words", "Target: 250 words minimum".
   - Verify comparison pane shows "Improve with AI", "AI Analysis & DELF B2 Feedback".
4. Switch to `🇨🇳 中文`:
   - Verify UI displays in Chinese ("引擎：", "AI设置", "DELF B2 主题写作", "随机题目", "清空", "AI 提升", "字数").
5. Switch to `🇻🇳 Tiếng Việt`:
   - Verify UI displays in Vietnamese ("Động cơ: ", "Cài đặt AI", "Luyện viết DELF B2", "Chủ đề ngẫu nhiên", "Xóa", "Cải thiện với AI", "Số từ").

### Scenario 2: Zero Loss of Candidate Draft During Switch
1. Type a paragraph of French essay text into the editor.
2. Cycle through all 4 languages.
3. Confirm the editor textarea content and word counter value remain 100% intact without reset.

### Scenario 3: Persistence Across Reloads
1. Select `Tiếng Việt` (`vi`).
2. Refresh the browser page (`F5`).
3. Confirm the application reloads directly in Vietnamese.
