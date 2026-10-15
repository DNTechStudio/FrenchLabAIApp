# Data Model: User-Defined Custom Topics

**Feature**: `005-custom-topic-input`  
**Status**: APPROVED  

---

## 1. Entities & Interfaces

### 1.1 `CustomTriggerDocument`

Conforms to the existing `TriggerDocument` interface while providing custom metadata flags and timestamps.

```typescript
export interface CustomTriggerDocument {
  id: string;               // Unique ID, format: `custom-${Date.now()}` or UUID
  title: string;            // Title of trigger article, min 5 chars
  category: string;         // E.g. "Société", "Travail", "Éducation", "Écologie", "Santé", "Technologie", "Culture"
  source: string;           // E.g. "Le Monde, Septembre 2026" or "Document personnalisé du candidat"
  vocabularyLevel: string;  // Defaults to "B2"
  wordCount: number;        // Calculated via countFrenchWords(content), min 30
  content: string;          // Full article text
  problematique: string;    // Core debate question / thesis
  isCustom: true;           // Flag distinguishing custom user topics from built-in catalog
  createdAt: number;        // Unix epoch timestamp (ms)
}
```

---

## 2. Storage Helpers & Functions (`customTopicsStorage.js`)

Located in `src/data/documents/customTopicsStorage.js`:

```typescript
export const CUSTOM_TOPICS_STORAGE_KEY = 'delf_speaking_custom_topics';

export function getCustomTopics(): CustomTriggerDocument[];
export function saveCustomTopic(doc: Partial<CustomTriggerDocument>): CustomTriggerDocument;
export function deleteCustomTopic(id: string): boolean;
export function countFrenchWords(text: string): number;
export function validateCustomTopic(formData: {
  title?: string;
  category?: string;
  content?: string;
  problematique?: string;
}): { isValid: boolean; errors: Record<string, string>; wordCount: number };
```

---

## 3. Validation Rules

| Field | Type | Required | Constraint | Error Key |
| :--- | :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | `length >= 5` | `custom_topic.err_missing_title` |
| `category` | `string` | Yes | Non-empty | `custom_topic.err_missing_category` |
| `content` | `string` | Yes | `wordCount >= 30` | `custom_topic.err_too_short` |
| `source` | `string` | No | Fallback: `"Document personnalisé du candidat"` | N/A |
| `problematique` | `string` | No / Suggested | Fallback: First sentence or generic | N/A |

---

## 4. UI Form State Representation

Within `CustomTopicForm.js`:

```typescript
interface CustomTopicFormState {
  isOpen: boolean;
  title: string;
  category: string;
  source: string;
  content: string;
  problematique: string;
  wordCount: number;
  errors: Record<string, string>;
  isSubmitting: boolean;
}
```
