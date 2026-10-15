# Data Model: User-Defined Practice Topics

**Feature**: `006-practice-custom-topic`  
**Status**: APPROVED  

---

## 1. Entities & Interfaces

### `CustomPracticePrompt`

```typescript
export interface CustomPracticePrompt {
  id: string;               // e.g. "custom-practice-1790636000000"
  title: string;            // Title of practice discussion, min 5 chars
  category: string;         // E.g. "Société", "Travail", "Éducation", "Écologie", "Santé", "Technologie", "Culture", "Voyage"
  description: string;      // Guidance/reflection prompt, min 10 chars
  starterSentence: string;  // Suggested speech starter sentence
  sampleQuestions: string[];// Generated or entered discussion questions
  isCustom: true;           // Identifies user-created practice prompt
  createdAt: number;        // Epoch timestamp (ms)
}
```

---

## 2. Storage Helpers (`customPracticeStorage.js`)

Located in `src/data/practice/customPracticeStorage.js`:

```typescript
export const CUSTOM_PRACTICE_STORAGE_KEY = 'delf_speaking_custom_practice_topics';

export function getCustomPracticePrompts(): CustomPracticePrompt[];
export function saveCustomPracticePrompt(promptData: Partial<CustomPracticePrompt>): CustomPracticePrompt;
export function deleteCustomPracticePrompt(id: string): boolean;
export function getAllPracticePrompts(): Array<PracticePrompt | CustomPracticePrompt>;
export function getRandomCombinedPracticePrompt(): PracticePrompt | CustomPracticePrompt;
export function validateCustomPracticePrompt(formData: {
  title?: string;
  category?: string;
  description?: string;
  starterSentence?: string;
}): { isValid: boolean; errors: Record<string, string> };
```

---

## 3. Validation Constraints

| Field | Type | Required | Constraint | Error Message Key |
| :--- | :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | `length >= 5` | `practice.err_missing_title` |
| `category` | `string` | Yes | Non-empty | `practice.err_missing_category` |
| `description`| `string` | Yes | `length >= 10` | `practice.err_missing_desc` |
| `starterSentence` | `string` | No | Fallback: `"À mon avis, ..."` | N/A |
