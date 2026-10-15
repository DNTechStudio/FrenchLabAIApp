# Research & Technical Decisions: User-Defined Practice Topics

**Feature**: `006-practice-custom-topic`  
**Date**: 2026-09-29  
**Status**: APPROVED  

---

## 1. UX Design & Interaction Patterns in Practice Mode

### Problem Statement
In `PracticeView`, candidates have an active workspace with:
1. Active Practice Topic Card (Title, Category, Context, Suggested Starter Sentence).
2. Live Recording Console & Transcription Textarea.
3. CEFR Dual-Level Target Picker.
4. "Améliorer avec l'IA" Trigger.

If a candidate types a transcript or starts recording, then decides to change the topic to their own custom subject, the form must:
- Expand smoothly without resetting the candidate's draft transcript.
- Allow fast switching with minimal cognitive overhead.
- Visually mark custom topics with a `🎨 Personnalisé` badge so learners know they are in a custom session.

### Technical Decision
Implement an **Inline Accordion Form** (`CustomPracticeTopicForm.js`) mounted in a dedicated slot between the hero header and the active topic card.
- Smooth CSS `max-height` transition (`.custom-practice-expandable`).
- Real-time inline field validation (title length >= 5, description length >= 10).
- Instant state synchronization: submitting the form updates `this.currentTopic` and re-renders only the topic card element, keeping the audio recorder and transcript console untouched.

---

## 2. Storage & Randomization Architecture

### Storage Key
`delf_speaking_custom_practice_topics`

### Data Schema
```typescript
interface CustomPracticePrompt {
  id: string;               // e.g. "custom-practice-1790636000000"
  title: string;            // min 5 chars
  category: string;         // e.g. "Société", "Technologie", etc.
  description: string;      // min 10 chars
  starterSentence: string;  // e.g. "À mon avis..."
  sampleQuestions: string[];// array of prompts
  isCustom: true;
  createdAt: number;
}
```

### Randomization Integration
When the user clicks `🎲 Changer de sujet`:
- It pulls from a combined list: `[...PRACTICE_PROMPTS, ...getCustomPracticePrompts()]`.
- Ensures user-created prompts seamlessly rotate into future practice sessions.

---

## 3. Backward Compatibility & Test Coverage
- Zero disruption to `PracticeElevationEngine.js`. The elevation engine operates on speech transcripts and CEFR linguistic criteria, remaining fully agnostic to the topic source.
- Session persistence (`PRACTICE_STORAGE_KEY`) already serializes `this.currentTopic`. Adding custom fields (`isCustom: true`) works out-of-the-box.
