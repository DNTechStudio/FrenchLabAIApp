# Pedagogical Research & Rubric Standards: French Lab AI

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Associated Specification**: [spec.md](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/spec.md)

---

## 1. France Éducation International CEFR Standards

French Lab AI adopts the official evaluation scales published by **France Éducation international** for the Diplôme d'Études en Langue Française (DELF) and Diplôme Approfondi de Langue Française (DALF).

### 1.1 Production Écrite (Writing) 25-Point Grid

| Criterion | Max Points | Key Competencies Evaluated |
| :--- | :---: | :--- |
| **1. Respect de la consigne & Longueur** | 5 | Respect of official format (lettre, essai, article), stance adoption, minimum length requirement ($\ge 250$ mots). |
| **2. Cohérence & Cohésion textuelle** | 6 | Logical sequencing of paragraphs (Introduction, Développement, Conclusion), transitions, punctuation. |
| **3. Compétence morphosyntaxique** | 7 | Mastery of complex sentence structures, verbal modes (Subjonctif, Conditionnel), concordance des temps, spelling agreement. |
| **4. Compétence lexicale / Vocabulaire** | 7 | Range of nuanced vocabulary, abstract concepts, idiomatic collocations, avoidance of generic terms (*chose, faire*). |
| **Total** | **25** | **Seuil de réussite: 12.5/25 (Note éliminatoire: < 5/25)** |

### 1.2 Production Orale (Speaking) 25-Point Grid

| Criterion | Max Points | Key Competencies Evaluated |
| :--- | :---: | :--- |
| **1. Monologue suivi (Présentation)** | 6 | Structured oral defense: Introduction of trigger document, clear problématique, cohesive arguments with illustrations. |
| **2. Exercice en interaction (Débat)** | 6 | Ability to respond spontaneously to examiner challenges, defend thesis, reformulate, and concede gracefully. |
| **3. Lexique & Registre de langue** | 5 | Richness and accuracy of spoken vocabulary, appropriateness of formal/standard register. |
| **4. Morphosyntaxe orale** | 5 | Spoken grammatical accuracy, mastery of connectors and subordinate clauses. |
| **5. Maîtrise phonologique** | 3 | Pronunciation, intonation, prosody, expressive cadence, absence of distracting phonetic interference. |
| **Total** | **25** | **Seuil de réussite: 12.5/25 (Note éliminatoire: < 5/25)** |

---

## 2. Connecteurs Logiques (Logical Connectors) Taxonomy

For the **Débat Arena** and **Writing Lab**, the system maintains an analytical taxonomy of French connectors to recognize and evaluate candidate reasoning:

```
                                Connecteurs Logiques
                                          │
       ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
       ▼                  ▼                               ▼                  ▼
     Cause           Conséquence                     Opposition          Concession
  (parce que,       (par conséquent,               (en revanche,        (bien que + subj,
   puisque, en       donc, ainsi, d'où,             au contraire,        certes, même si,
  raison de, car)   c'est pourquoi)                 alors que)          il est vrai que)
```

1. **Cause**: *parce que, puisque, étant donné que, car, en raison de, grâce à*.
2. **Conséquence**: *par conséquent, c'est pourquoi, ainsi, donc, d'où, de ce fait*.
3. **Opposition**: *en revanche, par contre, alors que, tandis que, au contraire*.
4. **Concession**: *bien que (+ subjonctif), quoique, certes, même si, néanmoins, toutefois, il n'en reste pas moins que*.
5. **Addition & Classement**: *d'une part... d'autre part, en premier lieu, de surcroît, par ailleurs, enfin*.
6. **Conclusion**: *en définitive, pour conclure, tout bien considéré, en somme*.

---

## 3. Rhetorical Strategies for Advanced Debate (B2 - C2)

The **Débat Arena** coaches candidates through three core classical dialectical maneuvers:

1. **La Thèse & L'Antithèse**: Articulating a well-grounded initial claim, substantiated by verifiable societal evidence.
2. **La Concession Stratégique**: Acknowledging the validity of the opponent's counterpoint before neutralizing it:
   - *Exemple*: *"Certes, l'introduction de l'intelligence artificielle engendre des mutations professionnelles incontestables, néanmoins elle libère les salariés des tâches répétitives..."*
3. **La Réfutation Ciblée**: Directly exposing logical fallacies, overgeneralizations, or unsubstantiated premises in the adversary's argument:
   - *Exemple*: *"Il me semble abusif d'affirmer que... Dans la mesure où les données statistiques démontrent le contraire..."*

---

## 4. Provenance & Inheritance from Prior Projects

- **PRO-05 DELF-DALF Lab Writing** provided:
  - Validated French word count tokenization rules.
  - Character-by-character and word-by-word visual diff algorithms.
  - Official writing prompt corpus and Dictation practice mode.
- **PRO-06 DELF-DALF Lab Speaking** provided:
  - 10-minute countdown preparation timer and digital scratchpad layout.
  - Web Speech API and MediaRecorder speech recognition workflows.
  - Spoken AI Examiner turn-taking prompts and dual-level B2/C1 speech elevation formulas.
