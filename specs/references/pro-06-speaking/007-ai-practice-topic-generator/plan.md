# Implementation Plan: AI-Assisted Custom Topic Generator

**Feature**: `007-ai-practice-topic-generator`  
**Target Release**: v1.6.0  
**Phase**: Planning & Architecture  

---

## 1. Technical Architecture & File Changes

### A. New Service: `src/core/practice/TopicIdeaGenerator.js`
A dedicated domain engine that takes raw multingual user drafts and produces structured DELF B2/DALF practice topics:
- Multilingual keyword matching and domain classification across all 7 categories:
  - `Société & Culture`
  - `Travail & Nouveaux Modes de Vie`
  - `Éducation & Formation`
  - `Environnement & Écologie`
  - `Santé & Bien-être`
  - `Nouvelles Technologies & IA`
  - `Loisirs & Tourisme`
- Synthesis algorithms for:
  - Concise debate title in French (*Titre du sujet*)
  - Thematic context and 2 balanced opposing questions (*Contexte et questions de réflexion*)
  - Authentic oral starter sentence (*Amorce suggérée*)
- Curated fallback templates for trending DELF topics if draft is empty.

### B. Component Update: `src/ui/components/CustomPracticeTopicForm.js`
- Integrate a designated quick-draft container with:
  - Input/textarea: `Brouillon ou idée brute (dans votre langue : tiếng Việt, English, français...)`
  - Action button: `✨ Améliorer avec l'IA` (single AI icon, localized).
- Add method `handleAIGenerate()`:
  - Trigger `TopicIdeaGenerator.generateTopicFromDraft(draftText, currentLocale)`
  - Update form inputs: title, category chips selection, description/context, starter sentence.
  - Clear field error indicators.
  - Add visual highlight effect on updated fields.

### C. Localization: `src/core/i18n/locales/*.js`
- Add localized strings for `fr.js`, `en.js`, `vi.js`, `zh.js`:
  - `practice.ai_draft_label`
  - `practice.ai_draft_placeholder`
  - `practice.ai_generate_btn`
  - `practice.ai_generating`
  - `practice.ai_generate_hint`

### D. Automated Tests
- Unit test: `tests/unit/TopicIdeaGenerator.test.js`
  - Tests multilingual draft inputs (Vietnamese, English, French keywords)
  - Tests classification into correct categories
  - Tests empty draft fallback generation
- Integration test: `tests/integration/CustomPracticeTopicAIGenerator.test.js`
  - Tests end-to-end form fill and submit flow into Practice Mode.
