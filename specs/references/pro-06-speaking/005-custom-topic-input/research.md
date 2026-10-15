# Research & Technical Decisions: User-Defined Custom Topics in Test Simulation Mode

**Feature**: `005-custom-topic-input`  
**Date**: 2026-09-28  
**Status**: APPROVED  

---

## 1. UX & Interaction Research: Inline Expandable Form vs Modal

### Problem Statement
In `SelectionView`, candidates need to input custom trigger documents without feeling disoriented or losing their contextual position in the app.

### Evaluation of Approaches

| Criteria | Modal Dialog | Full-Page View Navigation | Inline Expandable Card (Chosen) |
| :--- | :--- | :--- | :--- |
| **Context Retention** | Disruptive overlay, blocks background | Destroys current view state | ✅ Preserves background context and scroll position |
| **Animation Fidelity** | Popover backdrop + scale | Hard route transition | ✅ Pure CSS `max-height` + `opacity` ease-out transition |
| **Form Editing Space** | Constrained by dialog max-width | Full space | ✅ Natural page-width card directly above catalog |
| **Mobile Adaptability** | Scroll lock issues on virtual keyboards | Good | ✅ Natural document flow without layout shift bugs |

### Decision
Implement an **Inline Expandable Form** (`CustomTopicForm.js` component) rendered immediately below the Hero banner and above the category filters in `SelectionView.js`. It starts collapsed (`max-height: 0; opacity: 0; overflow: hidden; pointer-events: none; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1)`) and toggles to expanded (`max-height: 900px; opacity: 1; pointer-events: auto;`).

---

## 2. Word Count & Content Validation Heuristics

### Official France Éducation international DELF B2 Trigger Document Specifications
- **Standard Word Count**: ~150 to 250 words.
- **Syntactic Complexity**: B2 level containing arguments, counter-arguments, and societal tension.
- **Minimum Viable Threshold**: A candidate cannot adequately construct a 10-minute structured presentation from a single sentence. Therefore, a minimum threshold of **30 words** is enforced.
- **Live Counter Algorithm**:
  ```javascript
  export function countFrenchWords(text) {
    if (!text || typeof text !== 'string') return 0;
    // Normalize apostrophes (l'arbre, d'accord) and match word tokens
    const tokens = text
      .trim()
      .replace(/['’]/g, ' ')
      .match(/[\p{L}\p{N}_\-]+/gu);
    return tokens ? tokens.length : 0;
  }
  ```
- **Live Feedback Tiers**:
  - `0 - 29 words`: Red badge (`⚠️ Trop court (min. 30 mots)`). Submit button disabled.
  - `30 - 139 words`: Amber badge (`📝 Acceptable (recommandé : 150-250 mots)`). Submit enabled.
  - `140 - 270 words`: Green badge (`✅ Format DELF B2 idéal (~150-250 mots)`). Submit enabled.
  - `> 270 words`: Blue badge (`ℹ️ Document long - veillez à ne pas surcharger la lecture`). Submit enabled.

---

## 3. Persistence Architecture & Storage Contracts

### Storage Key
`delf_speaking_custom_topics`

### Serialization
Stored as a JSON array of `CustomTriggerDocument` objects in `localStorage`.

### Storage Operations
1. `getCustomTopics()`: Safely retrieves and parses array, returning `[]` on parse error or SSR.
2. `saveCustomTopic(doc)`: Adds or updates doc, ensures unique `id`, prepends to array, and saves.
3. `deleteCustomTopic(id)`: Removes doc by `id` from array and updates storage.

### Fail-Safe Handling
- Corrupted JSON in `localStorage` is caught and resets to empty array without crashing.
- QuotaExceededError is caught gracefully with a user notification.

---

## 4. Integration with Exam Engines

### 1. `ExamFlowStateMachine.js`
The state machine already accepts any conforming `triggerDocument` in its state. When `SelectionView` invokes `onSelectDocument(customDoc)`, the state machine accepts it directly without schema discrimination.

### 2. `DebateEngine.js`
The debate engine uses `triggerDocument.category` to select contextual questions. To maximize responsiveness to user-defined topics:
- If `customDoc.problematique` is provided, `DebateEngine.generateExaminerQuestion` incorporates the candidate's exact problématique into Turn 1 examiner questioning:
  - *"Examinateur : Vous avez centré votre exposé sur la question suivante : « ${customDoc.problematique} ». Cependant, ne pensez-vous pas que..."*
- If `customDoc.category` matches one of the preset themes (*Travail*, *Technologies*, *Écologie*), it pulls from that theme's bank; otherwise, it uses the enriched default bank with keywords from the custom title.

### 3. `DelfB2EvaluationEngine.js`
Evaluation is performed on the spoken monologue and debate transcripts using deterministic CEFR rubrics. Having a custom trigger document requires no breaking changes to the scoring engine.
