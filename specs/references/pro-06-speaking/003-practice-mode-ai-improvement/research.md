# Technical & Pedagogical Research: Practice Mode & AI Speech Elevation

**Feature**: `003-practice-mode-ai-improvement`  
**Date**: 2026-09-28  

---

## 1. CEFR Spoken French Linguistic Hierarchy (A1 to C2)

France Éducation international and the Council of Europe define precise qualitative descriptors for oral production:

| CEFR Level | Syntactic Depth | Argumentative Connectors | Lexical Register & Collocations |
| :--- | :--- | :--- | :--- |
| **A1 (Introductif)** | SVO simple clauses, present indicative, direct assertions. | `et`, `mais`, `parce que` | Basic survival terms (*aimer, habiter, faire, travail*). |
| **A2 (Intermédiaire)** | Coordinated clauses, passé composé, futur proche, basic time sequences. | `d'abord`, `puis`, `ensuite`, `après` | Everyday activities, concrete routines, simple preferences. |
| **B1 (Seuil)** | Relative clauses (`qui`, `que`, `où`), basic conditionnel, simple hypotheses (`si + imparfait`). | `donc`, `cependant`, `à mon avis`, `grâce à`, `puisque` | Personal opinions, comparisons, abstract feelings, justification of choices. |
| **B2 (Avancé)** | Subjunctive mood, nominalization, concessive clauses, passive & pronominal turns. | `bien que`, `en revanche`, `d'une part... d'autre part`, `toutefois` | Thematic debate vocabulary, economic/social terminology, nuanced balance. |
| **C1 (Autonome)** | Stylistic inversions, complex hypotheses, absolute participles, formal rhetoric. | `nonobstant`, `force est de constater`, `dès lors`, `il n'en demeure pas moins` | Academic expressions, sophisticated idioms, subtle concessions, elegant irony. |
| **C2 (Maîtrise)** | Native-level fluency, effortless structural variety, literary resonance. | `quand bien même`, `pour peu que`, `tant s'en faut` | Rich colloquialisms, evocative metaphors, precision of tone and subtext. |

---

## 2. Elevation Heuristics & Deterministic Transformation

To guarantee **zero-dependency runtime operation** and **sub-200ms latency** (as required by Constitution Principle I & V):
1. **Pattern Matching & Lexical Replacement Tables**:
   - Mapping colloquial B1 speech (e.g. *"Je pense que c'est un bon point"*) to B2 (e.g. *"Il convient de souligner la pertinence de cet aspect"*) and C1 (e.g. *"Force est d'admettre la portée décisive de ce facteur"*).
2. **Clause Restructuring & Connector Injection**:
   - Transforming paratactic simple sentences (*"Le travail à distance fatigue les gens. Les gens veulent rester chez eux."*) into hypotactic B2/C1 clauses (*"Bien que le télétravail engendre un certain isolement, nombreux sont les salariés qui plébiscitent sa flexibilité."*).
3. **Pluggable Architecture**:
   - The engine implements a clean interface `elevateSpeech({ originalTranscript, level1, level2, locale })`. If third-party AI keys (OpenAI / Anthropic / Gemini) are provided in environment variables, a remote LLM adapter can be optionally toggled without changing any UI or client contract.

---

## 3. Auditory Shadowing (TTS)

- Uses browser `window.speechSynthesis` with `fr-FR` voice profiles (Google Français, Microsoft Hortense, or Apple Thomas).
- Pacing calibrated per CEFR level:
  - `A1 - A2`: `rate = 0.88` (clear articulation for beginners)
  - `B1`: `rate = 0.93`
  - `B2`: `rate = 0.98`
  - `C1 - C2`: `rate = 1.02` (natural native conversational velocity).

---

## 4. Mode Switching Architecture & State Separation

- The app router/state machine separates **Exam Mode** (`/exam`) from **Practice Mode** (`/practice`).
- `SessionRepository` partitions storage keys:
  - `delf_speaking_active_session`: Official exam state (guarded from overwrite).
  - `delf_speaking_practice_session`: Practice recording buffer, chosen levels, and elevation history.
- Switching between modes is instantaneous and non-destructive.
