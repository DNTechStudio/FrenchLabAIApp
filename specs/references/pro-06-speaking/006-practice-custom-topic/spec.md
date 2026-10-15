# Feature Specification: User-Defined Custom Topics in Practice Mode (Mode Entraînement)

**Feature**: `006-practice-custom-topic`  
**Target Release**: v1.5.0  
**Status**: DRAFT  
**Author**: Antigravity  

---

## 1. Executive Summary & Educational Rationale

In **Mode Entraînement** (Freeform Practice Mode), candidates develop spoken fluency by recording or typing spontaneous French speech, and comparing their words with AI-elevated versions across any 2 chosen CEFR proficiency tiers (A1 to C2).

Currently, Practice Mode selects topics from a static list of curated prompts (`PRACTICE_PROMPTS`) using a `🎲 Changer de sujet` button. However, learners frequently need to practice topics relevant to their specific interests, coursework, upcoming university or job interviews, or specific DELF oral production themes.

This feature adds a dedicated action button `✏️ Sujet personnalisé` to the Practice Mode header, opening an **Inline Expandable Form**. Candidates can compose custom prompts (title, domain, context questions, and suggested starter sentence), immediately practice their oral expression on that subject, and receive multi-tier CEFR speech elevation.

---

## 2. User Stories & Acceptance Criteria

### User Story 1 (P1): Toggle Custom Topic Form in Practice Mode
> **As a** language learner in Practice Mode,  
> **I want to** click a "Sujet personnalisé" button next to "Changer de sujet",  
> **So that** an inline creation form opens smoothly without navigating away or losing my current draft transcript.

- **Acceptance Criteria**:
  - `US1.1`: A button `✏️ Sujet personnalisé` is displayed in the hero header row of `PracticeView` adjacent to `🎲 Changer de sujet`.
  - `US1.2`: Clicking the button toggles an inline expandable card container directly above the active topic card with smooth CSS transition.
  - `US1.3`: The form includes an "Annuler" (Cancel) button to collapse the form without applying changes.

---

### User Story 2 (P1): Practice Topic Fields & Validation
> **As a** language learner,  
> **I want to** specify the topic title, thematic domain, description/reflection questions, and optional starter sentence,  
> **So that** my practice session has clear focus and guidance.

- **Acceptance Criteria**:
  - `US2.1`: The form provides structured fields:
    - **Titre du sujet** (`title`): Text input (Required, min 5 characters).
    - **Thématique / Domaine** (`category`): Category chips or custom input (Default chips: *Société*, *Travail*, *Éducation*, *Écologie*, *Santé*, *Technologie*, *Culture*, *Voyage & Loisirs*).
    - **Description / Pistes de réflexion** (`description`): Multi-line textarea (Required, min 10 characters).
    - **Amorce suggérée** (`starterSentence`): Text input (Optional, fallback: *"À mon avis, ..."*).
  - `US2.2`: Real-time validation alerts the user if mandatory fields (title, category, description) are missing or too short.
  - `US2.3`: Submit button (`🚀 Appliquer ce sujet`) is disabled or displays inline error hints if validation fails.

---

### User Story 3 (P1): Instant Active Topic Update & AI Elevation
> **As a** language learner,  
> **I want** the active topic card in Practice Mode to reflect my custom topic immediately,  
> **So that** I can record my response and elevate it to my target CEFR levels with AI.

- **Acceptance Criteria**:
  - `US3.1`: Submitting the form updates `this.currentTopic` immediately with the custom prompt object:
    ```javascript
    {
      id: `custom-practice-${Date.now()}`,
      title: string,
      category: string,
      description: string,
      starterSentence: string,
      sampleQuestions: string[],
      isCustom: true,
      createdAt: number
    }
    ```
  - `US3.2`: The active topic card displays the new content with a distinctive `🎨 Personnalisé` badge.
  - `US3.3`: The custom topic is saved to the active practice session in `localStorage` (`delf_speaking_practice_session`), ensuring that refreshing the browser retains the custom topic.
  - `US3.4`: The AI speech elevation engine (`PracticeElevationEngine`) elevates the candidate's speech seamlessly with this custom topic.

---

### User Story 4 (P2): Custom Practice Topics Storage & Reusability
> **As a** language learner,  
> **I want** my custom practice topics saved in my local library,  
> **So that** I can revisit and re-practice them in future sessions.

- **Acceptance Criteria**:
  - `US4.1`: Created practice topics are appended to `localStorage` under `delf_speaking_custom_practice_topics`.
  - `US4.2`: The `🎲 Changer de sujet` button seamlessly includes custom practice topics in its pool when any exist.
  - `US4.3`: Custom practice topics can be cleared or reset if needed.

---

### User Story 5 (P2): Multilingual Localization Across All 4 Locales
> **As an** international candidate,  
> **I want** all form labels, placeholders, buttons, and error messages translated into French, English, Chinese, and Vietnamese,  
> **So that** I can easily create my custom practice topic in my preferred language.

- **Acceptance Criteria**:
  - `US5.1`: Localized translation keys added to `fr.js`, `en.js`, `zh.js`, and `vi.js`:
    - `practice.custom_topic_btn`
    - `practice.custom_form_heading`, `practice.custom_form_desc`
    - `practice.custom_title_label`, `practice.custom_title_placeholder`
    - `practice.custom_category_label`
    - `practice.custom_desc_label`, `practice.custom_desc_placeholder`
    - `practice.custom_starter_label`, `practice.custom_starter_placeholder`
    - `practice.custom_apply_btn`, `practice.custom_cancel_btn`
    - `practice.custom_badge`

---

## 3. Data Model

```typescript
export interface CustomPracticePrompt {
  id: string;              // e.g. "custom-practice-1790635000000"
  title: string;           // min 5 characters
  category: string;        // e.g. "Société", "Technologie", etc.
  description: string;     // min 10 characters
  starterSentence: string; // e.g. "Selon mon expérience, ..."
  sampleQuestions: string[];
  isCustom: true;
  createdAt: number;
}
```

---

## 4. Non-Functional Requirements & Design Aesthetics

1. **Non-Destructive State**: Opening or submitting the custom topic form must NOT wipe any existing text in the candidate's speech recording console.
2. **Animation**: Smooth pure CSS inline accordion expansion matching the application's glassmorphic design system.
3. **No External Libraries**: 100% pure vanilla JavaScript and Vanilla CSS.
