# Feature Specification: French DELF B2 Oral Exam Simulator (Production Orale)

**Feature Branch**: `001-delf-b2-speaking-simulator`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "Build a modern, interactive web application simulating the official French DELF B2 oral exam (Production Orale). The user selects or gets a random trigger document (document déclencheur). The app provides a preparation timer (10 mins) and then initiates the Monologue phase with a live audio recording waveform. Once the monologue concludes, an AI Examiner (equipped with native French neural voice) enters the Debate phase, challenging the user with 3-5 critical thinking questions based directly on their arguments. Finally, the app outputs an official 25-point CEFR B2 evaluation report analyzing coherence, grammar, vocabulary, pronunciation, and argumentation fluency."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Exam Simulation Journey (Priority: P1)

As a candidate preparing for the DELF B2 French certification, I want to experience a complete, realistic simulation of the Production Orale exam—from selecting a trigger document to delivering my monologue, debating an AI examiner in spoken French, and receiving an official score report—so that I can accurately assess my readiness under exam conditions.

**Why this priority**: This represents the central value proposition and core loop of the application. Without an end-to-end flow connecting preparation, monologue, debate, and scoring, the candidate cannot complete an exam session.

**Independent Test**: Can be tested by starting a session with a default trigger document, letting the preparation timer run (or skipping it), recording a 3-minute oral monologue with live audio waveform display, completing a 3-question debate with the examiner's spoken French voice prompts, and generating an official 25-point CEFR B2 report.

**Acceptance Scenarios**:

1. **Given** the candidate is on the exam launch page, **When** they click "Start Exam Session", **Then** the system presents a selected or randomly chosen authentic DELF B2 trigger document and begins the 10-minute preparation phase countdown.
2. **Given** the preparation timer finishes or the candidate manually concludes preparation, **When** the candidate transitions to the Monologue phase, **Then** the microphone activates, a live audio recording waveform visualizer reflects their voice in real time, and an elapsed timer tracks their 5–7 minute speaking window.
3. **Given** the candidate finishes and submits their monologue recording, **When** the system processes their oral presentation, **Then** the AI Examiner introduces itself verbally in native French, posing a first critical debate question directly challenging one of the arguments raised in the candidate's monologue.
4. **Given** the AI Examiner has spoken a debate question, **When** the candidate records their spoken counter-argument, **Then** the debate progresses dynamically through 3 to 5 turn-taking exchanges where the examiner actively counter-argues or requests clarification.
5. **Given** the final debate exchange concludes, **When** the candidate triggers evaluation, **Then** the system produces a comprehensive 25-point CEFR B2 evaluation report detailing scores across official DELF B2 criteria, full speech transcripts, detected strengths, and actionable linguistic feedback.

---

### User Story 2 - Trigger Document Selection & Preparation Scratchpad (Priority: P2)

As a candidate, I want to select a specific debate theme or draw a random authentic trigger document, and use a dedicated digital scratchpad during the 10-minute preparation window, so that I can practice structuring my oral argument (introduction, problematique, arguments/examples, conclusion) prior to speaking.

**Why this priority**: Realistic exam preparation requires genuine trigger documents (150–250 words) reflecting current societal debates (e.g., ecology, telecommuting, artificial intelligence, education, consumerism) and space to organize structured notes that remain visible while recording.

**Independent Test**: Can be tested independently by browsing available trigger documents, selecting or drawing one at random, typing bullet points into the scratchpad during the 10-minute preparation countdown, and verifying the notes remain pinned and readable during the subsequent monologue recording.

**Acceptance Scenarios**:

1. **Given** the candidate is choosing a topic, **When** they choose "Random Draw (Tirage au sort)", **Then** the system selects a trigger document from the curated repository and hides other options, mimicking the official exam protocol.
2. **Given** the candidate prefers focused thematic practice, **When** they filter by category (e.g., "Travail & Société", "Environnement", "Numérique"), **Then** the catalog displays relevant authentic-style debate documents with word count and source attribution.
3. **Given** the candidate is in the 10-minute preparation phase, **When** they type notes into the preparation scratchpad, **Then** notes are automatically preserved and can be organized into standard DELF B2 sections (Introduction / Problématique / Plan / Arguments / Conclusion).
4. **Given** the candidate is using practice mode, **When** they pause, adjust (+/- 1 min), or skip the 10-minute preparation timer, **Then** the system adjusts accordingly without losing written scratchpad content.

---

### User Story 3 - Spoken Debate Phase with Context-Aware AI Examiner (Priority: P3)

As a candidate, I want the AI Examiner to speak out loud with an authentic, natural French voice, listening to my arguments and challenging my assertions with nuanced follow-up questions, so that I experience the pressure and interactivity of the official DELF B2 "exercice en interaction".

**Why this priority**: The second half of DELF B2 Production Orale is an unscripted 5–6 minute debate where the examiner pushes back against the candidate's thesis. A static questionnaire fails to prepare students; questions must be contextually generated from the candidate's actual speech.

**Independent Test**: Can be tested by providing an oral monologue advocating for telework, and verifying that the examiner's spoken French response challenges specific points (e.g., social isolation, worker monitoring) rather than generic canned questions.

**Acceptance Scenarios**:

1. **Given** the candidate has completed their monologue, **When** the debate phase initializes, **Then** the AI Examiner plays natural French audio voicing an opening observation and a targeted question based on the candidate's stated thesis.
2. **Given** the AI Examiner finishes speaking a question, **When** the candidate clicks "Respond" or speaks, **Then** the candidate's microphone records their live spoken rebuttal with audio feedback.
3. **Given** the candidate submits their response to question $N$ (where $N < 3-5$), **When** the system evaluates the candidate's defense, **Then** the AI Examiner produces the next logical counter-point in spoken French.
4. **Given** the candidate requires clarification, **When** the candidate requests repetition or asks the examiner to rephrase ("Pourriez-vous répéter la question ?"), **Then** the examiner rephrases the question in spoken French without penalizing the candidate inappropriately.

---

### User Story 4 - Official 25-Point CEFR B2 Diagnostic Evaluation Report (Priority: P4)

As a candidate, I want to receive a diagnostic evaluation aligned with the official France Éducation international 25-point scoring grid, including transcripts of my speech, pinpointed grammatical errors, vocabulary enrichment recommendations, and pronunciation guidance, so that I understand exactly what score I would receive on exam day and how to improve.

**Why this priority**: Candidates need more than a pass/fail grade; they need actionable linguistic diagnostics mapping directly to the official rubric categories that real DELF examiners evaluate.

**Independent Test**: Can be tested by running an evaluation on completed recordings, verifying that all four official rubric dimensions are scored (Monologue /9, Débat /6, Lexique /4, Morphosyntaxe /5, Phonologie /1 totaling 25 points) along with highlighted transcripts and feedback.

**Acceptance Scenarios**:

1. **Given** the candidate finishes the debate, **When** the evaluation report loads, **Then** the system displays a 25-point scorecard broken down into:
   - Part 1 (Monologue suivi): Prise de position et présentation structurée des arguments (/9)
   - Part 2 (Débat): Justification d'un point de vue et défense face à l'examinateur (/6)
   - Linguistic competence: Étendue et maîtrise du vocabulaire (/4), Correction morphosyntaxique (/5), Maîtrise du système phonologique et prosodie (/1)
2. **Given** the evaluation report is displayed, **When** the candidate inspects their speech transcript, **Then** specific grammatical errors are highlighted with explanatory corrections, and sophisticated B2/C1 synonyms or connectors (connecteurs logiques) are suggested.
3. **Given** the evaluation report is displayed, **When** the candidate reviews pronunciation and fluency, **Then** the report identifies hesitations, pacing issues, rhythmic delivery, and problematic French phonemes with guidance.
4. **Given** the evaluation report is complete, **When** the candidate clicks "Export Report", **Then** a cleanly formatted, printable/downloadable summary containing the score, transcript, and action items is generated.

---

### Edge Cases

- **Microphone Access Denied or Hardware Unavailable**: The system detects lack of audio input device permissions, alerts the candidate with clear instructions on enabling browser microphone permissions, and offers an audio setup check prior to starting the monologue.
- **Silent or Inaudible Recording**: If the monologue or debate response contains no detectable voice audio or falls below the minimum volume threshold, the system flags the issue before proceeding and asks the candidate to verify their microphone.
- **Monologue Prematurely Short or Excessively Long**: If a monologue is under 2 minutes (official expectation is ~5 to 7 minutes), the system warns the candidate that a brief presentation severely impacts the coherence and argumentation score, offering them an opportunity to continue recording or proceed anyway. If speaking past 8 minutes, a visual gentle warning indicates the time ceiling.
- **Non-French or Mixed-Language Speech**: If the candidate speaks predominantly in a language other than French, the evaluation system recognizes language divergence, penalizes linguistic competence accordingly, and advises the user to maintain French throughout.
- **Examiner Audio Playback Failure or Network Delay**: If neural voice generation is delayed, a visual loading indicator appears, with fallback closed captions/text display for the examiner's question, allowing the exam to continue smoothly without blocking.
- **Accidental Page Reload or Browser Closure**: Exam progress (current phase, chosen trigger document, scratchpad notes, completed audio turns) is automatically persisted in the browser session so the candidate can resume or restart their session without losing their state.

## Requirements *(mandatory)*

### Functional Requirements

#### Trigger Document Management
- **FR-001**: System MUST provide a curated library of authentic-style DELF B2 trigger documents covering major recurring exam themes (e.g., Travail & Nouveaux Modes de Vie, Écologie & Consommation, Nouvelles Technologies & IA, Éducation & Société, Santé & Bien-être).
- **FR-002**: System MUST support a "Random Draw" (Tirage au sort) mode that presents a document at random, simulating the official exam room draw.
- **FR-003**: System MUST allow users to preview and manually select a trigger document by theme or difficulty.
- **FR-004**: System MUST allow candidates to paste their own custom trigger document text with a title and source for personalized preparation.

#### Preparation Phase (10 Minutes)
- **FR-005**: System MUST provide a synchronized 10-minute countdown timer representing the official preparation time.
- **FR-006**: System MUST provide practice timer controls allowing the candidate to pause, resume, fast-forward, or immediately skip to the monologue phase.
- **FR-007**: System MUST provide a digital scratchpad with structured outline guidance (Introduction / Définition du problème, Thèse / Prise de position, Plan structuré en 2-3 parties, Arguments et exemples personnels, Conclusion / Ouverture).
- **FR-008**: System MUST persist scratchpad notes and keep them accessible in a collapsible side drawer during the Monologue and Debate recording phases.

#### Part 1: Monologue Suivi Phase
- **FR-009**: System MUST record candidate audio from the browser microphone during the Monologue phase.
- **FR-010**: System MUST display a live real-time audio waveform visualizer confirming active microphone capture.
- **FR-011**: System MUST display an elapsed speaking timer highlighting the recommended 5–7 minute speaking window (with color coding: green for target range, amber for under 3 minutes, red for over 8 minutes).
- **FR-012**: System MUST permit the candidate to pause, resume, or finish and submit their monologue recording.
- **FR-013**: System MUST provide an audio playback check allowing the candidate to review their recorded monologue before proceeding to the debate.

#### Part 2: Spoken Debate Phase (Exercice en Interaction)
- **FR-014**: System MUST analyze the transcribed monologue to identify the candidate's core thesis and supporting arguments.
- **FR-015**: System MUST generate 3 to 5 targeted, critical-thinking examiner questions in French that challenge counter-arguments, probe contradictions, or demand concrete justification.
- **FR-016**: System MUST vocalize all examiner questions and interventions using a native French neural speech voice (examinateur DELF).
- **FR-017**: System MUST provide an interactive turn-taking interface allowing the candidate to listen to the examiner's spoken question and record their spoken rebuttal for each turn.
- **FR-018**: System MUST display examiner speech transcript alongside the audio playback controls (with an option to hide/reveal transcript to practice pure listening comprehension).
- **FR-019**: System MUST complete between 3 and 5 debate turns before concluding the oral exam and advancing to evaluation.

#### Evaluation & 25-Point Scoring
- **FR-020**: System MUST evaluate the complete oral exam session according to the official France Éducation international 25-point DELF B2 Production Orale rubric:
  - **Partie 1 - Monologue suivi (9 points)**:
    - Présentation claire et ordonnée des faits / Problématique dégagée (/3)
    - Prise de position argumentée et illustrée d'exemples précis (/3)
    - Cohérence globale, structure du discours et transitions logiques (/3)
  - **Partie 2 - Exercice en interaction / Débat (6 points)**:
    - Justification et défense de son point de vue face aux objections (/3)
    - Réactivité, relance et négociation de l'argumentation avec l'examinateur (/3)
  - **Compétence linguistique pour l'ensemble des 2 parties (10 points)**:
    - Étendue et correction du vocabulaire, registres et nuances (/4)
    - Maîtrise morphosyntaxique, structures de phrases complexes, modes/temps (/5)
    - Maîtrise du système phonologique, intonation, débit et prononciation (/1)
- **FR-021**: System MUST calculate an overall score out of 25, clearly indicating whether the candidate passed the DELF B2 speaking threshold (minimum 5/25 eliminatory mark, recommended passing target $\ge 12.5/25$).
- **FR-022**: System MUST generate a verbatim annotated transcript of both the monologue and all debate exchanges, with interactive audio playback aligned to speech segments.
- **FR-023**: System MUST identify specific language errors in the transcript (grammar, agreement, tense usage, false friends) and provide clear explanations with correct French reformulations.
- **FR-024**: System MUST evaluate lexical diversity and provide a list of recommended B2/C1 idiomatic expressions and logical connectors (*connecteurs logiques*) that would elevate the candidate's score.
- **FR-025**: System MUST provide a qualitative synthesis summarizing main strengths, critical weaknesses, and a prioritized study action plan.

#### Session Management & Export
- **FR-026**: System MUST persist completed exam sessions in local browser storage, allowing candidates to review past exam attempts and track score progression.
- **FR-027**: System MUST provide a formatted printable/downloadable summary (PDF or print view) of the official evaluation report.
- **FR-028**: System MUST allow candidates to re-attempt the same trigger document or immediately start a new simulation with a fresh topic.

### Key Entities

- **Trigger Document (Document Déclencheur)**: Represents the source text prompt. Attributes include: Unique ID, Title, Source, Category/Theme, Content Text (150–250 words), Vocabulary Level, Sample Problématique Questions.
- **Preparation Scratchpad**: Represents the candidate's notes created during the 10-minute prep. Attributes include: Document ID, Notes Content (Freeform & Structured Plan), Elapsed Prep Time.
- **Oral Monologue**: Represents the candidate's initial presentation. Attributes include: Audio Recording URI/Blob, Audio Duration, Transcription Text, Identified Thesis, Extracted Arguments.
- **Debate Exchange (Tour de Débat)**: Represents a single turn in the interaction. Attributes include: Turn Number (1–5), Examiner Question Text, Examiner Audio Voice URI, Candidate Response Audio URI, Candidate Response Transcription, Contextual Focus/Argument Challenged.
- **Evaluation Report (Bilan d'Évaluation DELF B2)**: Represents the comprehensive score sheet. Attributes include: Session ID, Date/Timestamp, Trigger Document Title, Subscores (Monologue /9, Débat /6, Vocabulaire /4, Grammaire /5, Phonologie /1), Total Score (/25), Pass/Fail Status, Verbatim Annotated Transcript, Grammatical Corrections List, Lexical Enrichment Suggestions, Qualitative Feedback.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Candidates can start a new exam simulation session and access their trigger document within 3 seconds of page load.
- **SC-002**: Live audio recording waveform visualizer updates with smooth real-time visual feedback (at least 30 fps) without stutter or audio dropout.
- **SC-003**: The AI Examiner's spoken audio question begins playing within 4 seconds after the candidate submits each debate turn.
- **SC-004**: 100% of generated evaluation reports include all 5 official rubric sub-scores totaling exactly 25 points, adhering to the France Éducation international grid.
- **SC-005**: The evaluation report is generated and displayed within 15 seconds after the conclusion of the final debate turn.
- **SC-006**: Candidates can access and review past exam attempts and score histories with complete transcripts and ratings preserved across sessions.
- **SC-007**: 95% of test users can complete an entire simulation (prep, monologue, debate, review) without encountering unhandled audio or navigation errors.

## Assumptions

- **Target Audience**: French learners actively preparing for the DELF B2 examination (upper-intermediate proficiency, CEFR B1–B2 level) seeking realistic oral exam rehearsal.
- **Browser Capabilities**: The candidate uses a modern web browser with standard microphone access and audio playback capabilities.
- **Exam Rules Alignment**: The simulation adheres to the official France Éducation international DELF B2 Production Orale format (10 min preparation, 5–7 min monologue exposé, followed by 5–6 min debate with 3–5 examiner interventions).
- **Audio Voice Synthesis**: Examiner questions are voiced in authentic standard French (FR-fr) neural speech with realistic pacing and intonation appropriate for a certified DELF examiner.
- **Local Independence**: The core UI, timer, scratchpad, audio waveform visualizer, document library, and local session persistence function seamlessly in the browser interface.
- **Practice Controls**: While the official exam strictly enforces 10 minutes preparation without pausing, the simulator includes optional practice controls (pause, skip, add time) to accommodate varied learner schedules.
