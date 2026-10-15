# Data Model: DELF B2 Writing Practice Application

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/spec.md) | **Date**: 2026-09-21 | **Status**: Complete

## 1. Entity Definitions

### 1.1 Prompt
Represents an official French DELF B2 Production Écrite assignment.

| Field | Type | Required | Description | Validation / Constraints |
|---|---|---|---|---|
| `id` | `string` | Yes | Unique prompt identifier | Non-empty slug (e.g. `lettre-reclamation-mairie`) |
| `category` | `PromptCategory` | Yes | Exam genre | `'lettre_formelle'` \| `'essai_argumentatif'` \| `'article_forum'` |
| `title` | `string` | Yes | Human-readable title in French | 10–120 characters |
| `scenario` | `string` | Yes | Background context / situation | Non-empty French text |
| `instructions` | `string` | Yes | Exact exam instructions / consignes | Includes recipient/role guidelines |
| `targetWordCount` | `number` | Yes | Minimum recommended target words | Default: 250 |

---

### 1.2 EssayDraft
Represents candidate composition for a specific prompt.

| Field | Type | Required | Description | Validation / Constraints |
|---|---|---|---|---|
| `promptId` | `string` | Yes | Reference to associated Prompt | Must match an existing Prompt `id` |
| `content` | `string` | Yes | Raw essay body composed by user | UTF-8 French text, supports all diacritics |
| `wordCount` | `number` | Yes | Real-time computed French word count | Calculated by `frenchWordCounter` (>= 0) |
| `lastSavedAt` | `number` | Yes | Epoch timestamp of last local autosave | Unix timestamp (milliseconds) |

---

### 1.3 DiffToken
Represents a segment of text resulting from word-level diffing between original and improved essay.

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | `string` | Yes | Text segment including words or whitespace |
| `type` | `DiffType` | Yes | `'unchanged'` \| `'removed'` \| `'added'` |

---

### 1.4 PedagogicalNote
Instructional feedback mapped to official DELF B2 evaluation criteria.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier (e.g., `note-1`) |
| `criterion` | `DelfCriterion` | Yes | One of the 4 official criteria |
| `title` | `string` | Yes | Short title of the correction / rule |
| `originalExcerpt` | `string` | No | Text snippet from candidate's draft |
| `improvedExcerpt` | `string` | Yes | Upgraded B2 text snippet |
| `explanation` | `string` | Yes | Pedagogical explanation in French (or bilingual) |

#### DELF B2 Criteria Enum:
1. `sociolinguistic`: *Correction sociolinguistique & Registre* (formality, politeness formulas, vouvoiement).
2. `coherence`: *Cohérence et cohésion* (logical connectors, argumentative structure, paragraph flow).
3. `grammar`: *Compétence morphosyntaxique* (subjunctive, conditional, tense harmony, agreements).
4. `vocabulary`: *Richesse et précision lexicale* (B2 idioms, formal vocabulary, precision).

---

### 1.5 ImprovementResult
Result of the AI / mock evaluation for a draft.

| Field | Type | Required | Description |
|---|---|---|---|
| `promptId` | `string` | Yes | Reference to the evaluated Prompt |
| `originalText` | `string` | Yes | Candidate's original submitted draft |
| `improvedText` | `string` | Yes | Elevated B2-level rewrite |
| `diffTokens` | `DiffToken[]` | Yes | Word-level tokens for visual diff rendering |
| `pedagogicalNotes` | `PedagogicalNote[]` | Yes | List of explanations for significant changes |
| `overallFeedback` | `string` | Yes | High-level summary of strengths and areas to elevate |
| `evaluatedAt` | `number` | Yes | Timestamp of generation |

---

### 1.6 UserSettings
Persistent user preferences in local storage.

| Field | Type | Required | Description |
|---|---|---|---|
| `provider` | `'mock' \| 'gemini' \| 'openai'` | Yes | Active AI improvement engine |
| `apiKey` | `string` | No | API Key for external LLM provider (optional) |
| `theme` | `'dark' \| 'light'` | Yes | Active UI visual theme |

---

## 2. State Lifecycle & Transitions

```text
[Select Prompt / Load Draft]
       │
       ▼
   [DRAFTING] ◄────────┐
       │ (autosave)    │ (edit text)
       │ (debounced)   │
       ▼               │
[Saved to LocalStorage]│
       │               │
       ▼ (click 'AI Improve')
  [ANALYZING]
       │
       ├─► [ERROR] ──► [Retry / Fallback to Mock]
       │
       ▼ (success)
  [COMPARISON VIEW]
   - Original vs Improved
   - Red visual diff highlights
   - Pedagogical notes
```
