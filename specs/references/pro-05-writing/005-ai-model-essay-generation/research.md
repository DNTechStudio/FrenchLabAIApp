# Technical Research & Architecture Decisions: 005 — AI Model Essay Generation on Empty Input

**Feature**: `005-ai-model-essay-generation`  
**Date**: 2026-09-25  

---

## 1. Context & Problem Statement

Candidates preparing for DELF B2 and other CEFR exams often experience hesitation or "blank page syndrome" when facing a difficult writing topic. Currently, the application requires at least 10 words (`disabled={isLoading || wordCount < 10}`) before allowing the user to click **« Améliorer avec l'IA »**.

The user requirement is:
> *"Make the button 'Améliorer avec l'IA' available even if the user does not write anything. In this case, the AI just answers the question by itself."*

This research evaluates how to support autonomous exam response generation while maintaining architectural cleanliness, backward compatibility with Feature 004 (CEFR Multi-Comparison), and offline resilience.

---

## 2. Architectural Analysis & Key Decisions

### Decision 1: Button Enabled State & Trigger Logic
* **Current implementation**:
  - `standalone.html`: `disabled: isAnyLoading || wordCount < 10`
  - `EditorPane.tsx`: `disabled={isLoading || wordCount < 10}`
* **Decision**:
  - Update condition to: `disabled: isAnyLoading` (or `disabled: isAnyLoading || (wordCount > 0 && wordCount < 3)` if preventing single-letter typos, or simply `disabled: isAnyLoading`).
  - In `handleImprove`:
    - Inspect `const isAutonomous = !content.trim();`
    - If `isAutonomous` is `true`: Call the improvement service with `content = ""` and `isAutonomous = true`.
    - If `isAutonomous` is `false`: Proceed with standard correction/improvement flow.

### Decision 2: Autonomous Model Essay Generation in Mock Engine
* **Current mock engine** (`mockImprovementService.ts` and `standalone.html`):
  - Pre-defined rewrites take the user's drafted text and replace grammar/vocabulary tokens.
* **Decision for autonomous mode**:
  - For each prompt in `PROMPTS` (e.g., `tele-travail`, `pistes-cyclables`, `uniforme-scolaire`, `ia-education`, `semaine-4-jours`) and for each target CEFR level (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`):
    - Curate authentic, exemplary model texts answering that prompt's scenario and instructions.
    - Provide structured pedagogical notes explaining the rhetorical choices made at that CEFR level.
  - If a prompt does not have a dedicated pre-baked answer for a specific non-B2 level, use a robust rule-based template synthesizer that creates an exemplary answer using proper greetings, arguments, and salutations for that prompt category.

### Decision 3: Autonomous Prompting for Gemini API Engine
* **Current Gemini prompt** (`geminiImprovementService.ts` and `standalone.html`):
  - System prompt: *"Tu es un examinateur expert du CECRL. Adapte fidèlement le texte du candidat au niveau ${level}..."*
* **Decision for autonomous mode**:
  - When `isAutonomous` is true, dynamically adjust the prompt instruction:
    ```text
    Tu es un candidat modèle et expert du CECRL.
    Rédige de toutes pièces une production écrite modèle complète et exemplaire en français répondant scrupuleusement au sujet d'examen suivant :
    - Catégorie : [Type de texte, ex: Lettre formelle]
    - Titre : [Titre du sujet]
    - Scénario & Consignes : [Consignes officielles de l'examen]
    - Niveau CECRL visé : [A1 | A2 | B1 | B2 | C1 | C2]
    - Nombre de mots requis : [Recommandation selon le niveau, ex: 250-280 mots pour B2]

    Format de réponse JSON attendu :
    {
      "improvedText": "...(texte complet rédigé de façon exemplaire)...",
      "overallFeedback": "...(analyse pédagogique du modèle et des points forts)...",
      "pedagogicalNotes": [
        { "id": "1", "criterion": "sociolinguistic", "title": "...", "explanation": "..." },
        ...
      ]
    }
    ```

### Decision 4: Diff & Comparison Window Behavior
* **Challenge**: When there is no original candidate text, a traditional visual diff highlighting insertions vs deletions would either mark the entire essay in green additions or look confusing.
* **Decision**:
  - When `isAutonomous` is true:
    - Default `levelViewModes[lvl]` to `'clean'` so the user immediately reads the clean model text.
    - If user switches to `'diff'`, all tokens are treated as neutral or added tokens with a clean title: *"Texte modèle généré par l'IA"*.
    - The word counter in the comparison window header accurately displays the word count of the generated model essay.

### Decision 5: Test-First Strategy
* Create automated unit tests in `tests/run-all-tests.mjs` ensuring:
  1. `mockImprovementService.improveEssay("", prompt, level)` returns a non-empty `improvedText` with >50 words.
  2. The generated model essay has a matching CEFR level signature.
  3. `diffTokens` generation handles empty original text gracefully without throwing errors.
