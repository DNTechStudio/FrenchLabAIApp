# Feature Specification: AI-Assisted Custom Topic Generator (Génération & Amélioration de Sujet par l'IA)

**Feature**: `007-ai-practice-topic-generator`  
**Target Release**: v1.6.0  
**Status**: SPECIFIED  
**Author**: Antigravity  

---

## 1. Executive Summary & Educational Value

In **Mode Entraînement** (Freeform Practice Mode), learners have the flexibility to create custom speaking topics via the `✏️ Sujet personnalisé` form. However, many candidates struggle to:
1. Translate and formulate a structured debate topic in authentic French DELF B2/DALF format when their initial idea is conceived in their native language (e.g., Vietnamese, English, Chinese).
2. Articulate a balanced problem statement (*problématique*), balanced reflection questions, and a suitable introductory oral starter sentence (*amorce*).
3. Identify which CEFR thematic domain (*Société & Culture*, *Travail*, *Éducation*, *Environnement*, etc.) their idea belongs to.

This feature adds an **"Améliorer avec l'IA" (Generate / Improve with AI)** capability inside the `Sujet d'entraînement personnalisé` window. The candidate can simply draft their raw idea in their own language (or rough notes), click the AI button, and the system automatically synthesizes and auto-fills:
- A polished, authentic French debate **Titre du sujet** (*« ... : atout ou menace ? »*).
- The best-matching **Thématique** category chip.
- A well-developed **Contexte et questions de réflexion** with 2 balanced debate angles.
- An idiomatic French **Amorce suggérée** with formal oral connectors.

---

## 2. User Stories & Acceptance Criteria

### User Story 1 (P1): Draft Idea Input & "Améliorer avec l'IA" Trigger
> **As a** language learner preparing for DELF/DALF oral exams,  
> **I want to** type or dictate a rough draft of my topic in my native language (Vietnamese, English, etc.) inside the custom topic window and click "Améliorer avec l'IA",  
> **So that** I don't get blocked by French vocabulary or formal structuring at the brainstorming stage.

- **Acceptance Criteria**:
  - `US1.1`: An intuitive draft input area or direct enhancement trigger is accessible in the `CustomPracticeTopicForm` card.
  - `US1.2`: A dedicated action button `✨ Améliorer avec l’IA` (or `✨ Structurer avec l’IA`) is positioned prominently within the form.
  - `US1.3`: If the candidate enters an idea in any language (e.g. Vietnamese *"ảnh hưởng của mạng xã hội đến giới trẻ"*, English *"remote work impact on productivity"*, French rough notes *"voiture electrique pas cher"*), clicking the button initiates generation.
  - `US1.4`: If the candidate clicks the button without typing any draft idea, the AI generates a spontaneous trending DELF B2 topic based on current events to inspire the learner immediately.

---

### User Story 2 (P1): Automatic Field Synthesis & Auto-Fill
> **As a** candidate,  
> **I want** the AI to auto-fill all form fields with authentic, high-level French DELF B2/DALF content,  
> **So that** I have a complete, well-formulated debate topic ready to practice.

- **Acceptance Criteria**:
  - `US2.1`: **Titre du sujet** is auto-populated with a concise French debate title meeting DELF B2 standards (e.g. *"L'impact des plateformes numériques sur la jeunesse : émancipation ou aliénation ?"*).
  - `US2.2`: **Thématique** automatically activates the most relevant category chip among the 7 defined categories (*Société & Culture*, *Travail & Nouveaux Modes de Vie*, *Éducation & Formation*, *Environnement & Écologie*, *Santé & Bien-être*, *Nouvelles Technologies & IA*, *Loisirs & Tourisme*).
  - `US2.3`: **Contexte et questions de réflexion** is auto-filled with an introductory context paragraph followed by 2 structured debate questions illustrating opposing viewpoints.
  - `US2.4`: **Amorce suggérée** is auto-filled with a natural introductory sentence incorporating standard oral logical connectors (*"Force est de constater que...", "D'un côté..., mais d'un autre côté..."*).
  - `US2.5`: All auto-filled fields remain 100% editable by the candidate before submitting.

---

### User Story 3 (P2): Visual Feedback & Smooth Animation
> **As a** user,  
> **I want** clear feedback when AI generation is taking place and when fields are updated,  
> **So that** I know the system is actively helping me.

- **Acceptance Criteria**:
  - `US3.1`: Clicking the AI button displays a brief loading state (*"✨ Génération en cours..."* with subtle pulsing dot/glow).
  - `US3.2`: Auto-filled fields receive a gentle highlight flash/glow effect to signal where new content has been populated.
  - `US3.3`: Any pre-existing validation errors (e.g. "Le titre doit contenir au moins 5 caractères") are automatically cleared upon successful auto-fill.

---

### User Story 4 (P2): Multilingual Support
> **As an** international learner,  
> **I want** the button labels, helper text, and placeholders localized across all 4 supported app languages (French, English, Vietnamese, Chinese),  
> **So that** the interface is completely accessible.

- **Acceptance Criteria**:
  - `US4.1`: Added localization keys in `fr.js`, `en.js`, `vi.js`, `zh.js`:
    - `practice.ai_draft_label`
    - `practice.ai_draft_placeholder`
    - `practice.ai_generate_btn`
    - `practice.ai_generating`
    - `practice.ai_generate_hint`

---

## 3. Architecture & Data Flow

```
[Candidate types rough draft in any language]
                 │
                 ▼
[Clicks "✨ Améliorer avec l'IA"]
                 │
                 ▼
[TopicIdeaGenerator.generateTopicFromDraft(draftInput, locale)]
   ├── 1. Analyze keywords & language intent
   ├── 2. Classify domain -> Select PRACTICE_CATEGORY
   ├── 3. Synthesize French DELF B2 Title
   ├── 4. Generate balanced context + 2 reflection questions
   └── 5. Provide authentic oral starter sentence
                 │
                 ▼
[Auto-fill form inputs in CustomPracticeTopicForm]
                 │
                 ▼
[Candidate reviews / edits and clicks "🚀 Appliquer ce sujet"]
                 │
                 ▼
[Active in Practice Mode with multi-tier CEFR speech elevation]
```

---

## 4. Test Scenarios & Quality Gates

1. **Empty Draft Click**: Generates a spontaneous high-quality DELF B2 topic with valid title, category, context, and starter sentence.
2. **Vietnamese Draft Input**: E.g. *"trí tuệ nhân tạo trong giáo dục"* -> Auto-selects `Éducation & Formation`, generates French title, context questions, and starter.
3. **English Draft Input**: E.g. *"electric cars and environmental impact"* -> Auto-selects `Environnement & Écologie`, generates French title, context questions, and starter.
4. **French Raw Keywords**: E.g. *"semaine de 4 jours travail"* -> Auto-selects `Travail & Nouveaux Modes de Vie`, synthesizes formal DELF B2 debate prompt.
5. **Form Validation**: Auto-filled fields satisfy all `validateCustomPracticePrompt` thresholds without triggering validation errors.
