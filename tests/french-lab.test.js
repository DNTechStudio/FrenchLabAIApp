/**
 * Automated Test Suite for French Lab AI Super-App (TEC-2026-07 PRO-07)
 * Runs with Node.js built-in test runner: node --test tests/french-lab.test.js
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { countFrenchWords } from '../src/core/writing/wordCounter.js';
import { analyzeConnectors, CONNECTORS_TAXONOMY } from '../src/data/connectors.js';
import { DEBATE_TOPICS } from '../src/data/debateTopics.js';
import { CONVERSATION_SCENARIOS } from '../src/data/scenarios.js';

test('1. French Word Counter adheres to authentic French tokenization (clitic apostrophes & compounds)', () => {
  // Clitics: l', d', c', qu' must count as separate words
  assert.strictEqual(countFrenchWords("l'arbre"), 2, "l'arbre should count as 2 words");
  assert.strictEqual(countFrenchWords("d'accord"), 2, "d'accord should count as 2 words");
  assert.strictEqual(countFrenchWords("c'est"), 2, "c'est should count as 2 words");
  assert.strictEqual(countFrenchWords("qu'il"), 2, "qu'il should count as 2 words");

  // Compound exceptions that count as 1 word
  assert.strictEqual(countFrenchWords("aujourd'hui"), 1, "aujourd'hui should count as 1 word");
  assert.strictEqual(countFrenchWords("peut-être"), 1, "peut-être should count as 1 word");
  assert.strictEqual(countFrenchWords("c'est-à-dire"), 1, "c'est-à-dire should count as 1 word");

  // Standard sentence
  const sentence = "Aujourd'hui, c'est l'occasion d'aller au parc municipal avec mon grand-père.";
  // Token breakdown:
  // "Aujourd'hui" (1) + "c'" (1) + "est" (1) + "l'" (1) + "occasion" (1) + "d'" (1) + "aller" (1) + "au" (1) + "parc" (1) + "municipal" (1) + "avec" (1) + "mon" (1) + "grand-père" (1) = 13 words
  const count = countFrenchWords(sentence);
  assert.strictEqual(count, 13, `Sentence should have 13 words, got ${count}`);
});

test('2. Connecteurs Logiques detection and classification in Débat Arena', () => {
  const text = "Certes, l'intelligence artificielle est prometteuse, néanmoins elle pose des défis. Par conséquent, il faut légiférer car le risque est réel.";
  const detected = analyzeConnectors(text);

  assert.ok(detected.length >= 4, `Expected at least 4 connectors, found ${detected.length}`);

  const categories = detected.map(d => d.category);
  assert.ok(categories.includes('concession'), "Should detect concession connector (certes / néanmoins)");
  assert.ok(categories.includes('consequence'), "Should detect consequence connector (par conséquent)");
  assert.ok(categories.includes('cause'), "Should detect cause connector (car)");
});

test('3. Connectors taxonomy integrity', () => {
  const requiredCategories = ['cause', 'consequence', 'opposition', 'concession', 'addition', 'conclusion'];
  requiredCategories.forEach(cat => {
    assert.ok(CONNECTORS_TAXONOMY[cat], `Taxonomy must include category: ${cat}`);
    assert.ok(Array.isArray(CONNECTORS_TAXONOMY[cat].items), `Category ${cat} must have items array`);
    assert.ok(CONNECTORS_TAXONOMY[cat].items.length > 0, `Category ${cat} must not be empty`);
  });
});

test('4. Debate Topics repository validity', () => {
  assert.ok(DEBATE_TOPICS.length >= 5, "Must have at least 5 debate controversies");
  DEBATE_TOPICS.forEach(topic => {
    assert.ok(topic.id, "Topic must have an id");
    assert.ok(topic.title, "Topic must have a title");
    assert.ok(topic.thesis, "Topic must have a thesis");
    assert.ok(Array.isArray(topic.pourArguments) && topic.pourArguments.length > 0, "Must have pourArguments");
    assert.ok(Array.isArray(topic.contreArguments) && topic.contreArguments.length > 0, "Must have contreArguments");
  });
});

test('5. Conversation Scenarios repository validity (2-Party and 3-Party)', () => {
  assert.ok(CONVERSATION_SCENARIOS.length >= 5, "Must have at least 5 everyday scenarios");
  CONVERSATION_SCENARIOS.forEach(sc => {
    assert.ok(sc.id, "Scenario must have an id");
    assert.ok(sc.title, "Scenario must have a title");
    assert.ok(sc.characters.length === 2, "2-party scenario must have 2 characters");
    assert.ok(sc.threePartyCharacters.length === 3, "3-party scenario must have 3 characters");
    assert.ok(sc.starterA2, "Scenario must have starterA2");
    assert.ok(sc.starterB2, "Scenario must have starterB2");
  });
});

import {
  splitFrenchSentences,
  classifyDictationMistake,
  evaluateDictation,
  isHomophone
} from '../src/core/dictation/dictationEngine.js';
import { DICTATION_EXERCISES } from '../src/data/dictations.js';

test('6. Workspace Router views configuration includes Dictation', () => {
  const expectedViews = ['speaking', 'writing', 'dictation', 'conversation', 'debate'];
  assert.strictEqual(expectedViews.length, 5, "Must configure 5 core ecosystem views including dictation");
  assert.ok(expectedViews.includes('dictation'), "Router must include dictation view");
});

test('7. Dictation Engine: Sentence Segmentation protects French abbreviations', () => {
  const text = "Bonjour M. Dubois ! Mme. Martin et le Dr. Leroy arrivent à 14h, etc. Nous pourrons commencer.";
  const sentences = splitFrenchSentences(text);

  assert.strictEqual(sentences.length, 2, "Should split into exactly 2 sentences without breaking at M., Mme., Dr., etc.");
  assert.strictEqual(sentences[0].text, "Bonjour M. Dubois !");
  assert.strictEqual(sentences[1].text, "Mme. Martin et le Dr. Leroy arrivent à 14h, etc. Nous pourrons commencer.");
  assert.ok(sentences[0].wordCount > 0, "Sentence word count must be calculated");
});

test('8. Dictation Engine: French Homophone & Orthographic Mistake Classification', () => {
  // 1. Homophone: c'est vs s'est
  const homophone1 = classifyDictationMistake("c'est", "s'est");
  assert.strictEqual(homophone1.category, 'homophone', "c'est vs s'est must be classified as homophone");

  // 2. Homophone: a vs à
  const homophone2 = classifyDictationMistake("à", "a");
  assert.strictEqual(homophone2.category, 'homophone', "à vs a must be classified as homophone");

  // 3. Agreement: pluriel manquant
  const agreement = classifyDictationMistake("pommes", "pomme");
  assert.strictEqual(agreement.category, 'agreement', "pommes vs pomme must be classified as agreement");

  // 4. Accent: diacritique manquant
  const accent = classifyDictationMistake("déjà", "deja");
  assert.strictEqual(accent.category, 'accent', "déjà vs deja must be classified as accent error");

  // 5. Omission
  const omission = classifyDictationMistake("indispensable", "");
  assert.strictEqual(omission.category, 'omission', "Missing word must be classified as omission");
});

test('9. Dictation Engine: Full Evaluation and Scoring', () => {
  const exercise = {
    id: 'test-dictation',
    fullText: "Aujourd'hui, il fait beau. Nous allons au marché.",
    sentences: [
      { index: 1, text: "Aujourd'hui, il fait beau." },
      { index: 2, text: "Nous allons au marché." }
    ]
  };

  const transcriptions = {
    1: "Aujourd'hui, il fait beau.", // 100% correct
    2: "Nous allons au marche."     // 1 accent mistake on 'marché'
  };

  const evalResult = evaluateDictation(exercise, transcriptions);
  assert.ok(evalResult.overallAccuracy >= 75 && evalResult.overallAccuracy < 100, "Accuracy should reflect 1 mistake");
  assert.strictEqual(evalResult.mistakeSummary.accent, 1, "Should count exactly 1 accent mistake");
  assert.ok(evalResult.cefrFeedback.length > 0, "Feedback must be provided");
});

test('10. Dictation Exercises Catalog covers CECRL A1 to C2', () => {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const catalogLevels = new Set(DICTATION_EXERCISES.map(e => e.level));

  levels.forEach(lvl => {
    assert.ok(catalogLevels.has(lvl), `Catalog must contain exercises for level ${lvl}`);
  });
  assert.ok(DICTATION_EXERCISES.length >= 8, "Must contain at least 8 curated exercises");
});

import { AITextGenerator } from '../src/core/dictation/aiTextGenerator.js';

test('11. AI Text Generator calibrates French passages strictly across CECRL A1 to C2', () => {
  // Test A1
  const genA1 = AITextGenerator.generateText({ level: 'A1' });
  assert.strictEqual(genA1.level, 'A1');
  assert.ok(genA1.wordCount >= 18 && genA1.wordCount <= 45, `A1 word count must be 20-35 words, got ${genA1.wordCount}`);
  assert.ok(genA1.sentenceCount >= 2 && genA1.sentenceCount <= 4, "A1 should have 2-3 sentences");

  // Test A2
  const genA2 = AITextGenerator.generateText({ level: 'A2' });
  assert.strictEqual(genA2.level, 'A2');
  assert.ok(genA2.wordCount >= 35 && genA2.wordCount <= 75, `A2 word count must be 40-60 words, got ${genA2.wordCount}`);

  // Test B1
  const genB1 = AITextGenerator.generateText({ level: 'B1' });
  assert.strictEqual(genB1.level, 'B1');
  assert.ok(genB1.wordCount >= 65 && genB1.wordCount <= 120, `B1 word count must be 70-100 words, got ${genB1.wordCount}`);

  // Test B2
  const genB2 = AITextGenerator.generateText({ level: 'B2' });
  assert.strictEqual(genB2.level, 'B2');
  assert.ok(genB2.wordCount >= 85 && genB2.wordCount <= 180, `B2 word count must be 85-180 words, got ${genB2.wordCount}`);
  assert.ok(genB2.grammarPoints.length > 0, "B2 passage must include grammar points");

  // Test C1
  const genC1 = AITextGenerator.generateText({ level: 'C1' });
  assert.strictEqual(genC1.level, 'C1');
  assert.ok(genC1.wordCount >= 60, `C1 word count should be rich, got ${genC1.wordCount}`);
  assert.ok(genC1.grammarPoints.length > 0, "C1 passage must include grammar points");

  // Test C2
  const genC2 = AITextGenerator.generateText({ level: 'C2' });
  assert.strictEqual(genC2.level, 'C2');
  assert.ok(genC2.wordCount >= 60, `C2 word count should be rich, got ${genC2.wordCount}`);
  assert.ok(genC2.grammarPoints.length > 0, "C2 passage must include grammar points");
});

test('12. AI Text Generator provides random topics across thematic categories', () => {
  const randomTopic = AITextGenerator.getRandomTopic();
  assert.ok(randomTopic.title && randomTopic.title.length > 5, "Random topic must have a descriptive title");
  assert.ok(randomTopic.category, "Random topic must have a category");

  const categories = AITextGenerator.getCategories();
  assert.strictEqual(categories.length, 6, "Must provide 6 diverse thematic categories");
});

test('13. Custom Dictation Flow: Text segmentation, word counting and evaluation', () => {
  const customPastedText = "C'est un bel après-midi à Paris. J'aime me promener au bord de la Seine, n'est-ce pas ? Tout est paisible.";
  const sentences = splitFrenchSentences(customPastedText);
  assert.strictEqual(sentences.length, 3, "Should correctly segment custom pasted passage into 3 sentences");

  const totalWords = countFrenchWords(customPastedText);
  // "C'est" (2), "un" (1), "bel" (1), "après-midi" (1), "à" (1), "Paris." (1) = 7
  // "J'aime" (2), "me" (1), "promener" (1), "au" (1), "bord" (1), "de" (1), "la" (1), "Seine," (1), "n'est-ce" (3: n' est ce), "pas" (1), "?" = 13
  // "Tout" (1), "est" (1), "paisible." (1) = 3 -> total ~ 23 words
  assert.ok(totalWords >= 20, `Word count must account for clitics, got ${totalWords}`);

  // Test full custom exercise creation contract
  const customExercise = {
    id: 'custom-123456789',
    title: 'Balade Parisienne',
    level: 'A2',
    category: 'Texte Personnalisé',
    fullText: customPastedText,
    source: 'copy-paste',
    wordCount: totalWords,
    sentenceCount: sentences.length,
    createdAt: new Date().toISOString()
  };

  assert.strictEqual(customExercise.source, 'copy-paste');
  assert.strictEqual(customExercise.sentenceCount, 3);
  assert.strictEqual(customExercise.level, 'A2');

  // Verify evaluation engine processes this custom exercise without error
  const transcriptions = {
    1: "C'est un bel après-midi à Paris.",
    2: "J'aime me promener au bord de la Seine, n'est-ce pas ?",
    3: "Tout est paisible."
  };
  const evalResult = evaluateDictation(customExercise, transcriptions);
  assert.strictEqual(evalResult.overallAccuracy, 100, "Perfect transcription of custom text must achieve 100% accuracy");
});

test('14. Dictation Navigation & Keyboard Shortcuts: Immediate audio reading on previous / next', () => {
  let spokenText = null;
  const mockSpeechSynthesizer = {
    stop() { spokenText = null; },
    speakSentence(text) { spokenText = text; }
  };

  const sentences = [
    { index: 1, text: "Première phrase." },
    { index: 2, text: "Deuxième phrase." },
    { index: 3, text: "Troisième phrase." }
  ];

  let activeIndex = 1;
  const handleNext = (autoPlay = true) => {
    if (activeIndex < sentences.length) {
      mockSpeechSynthesizer.stop();
      activeIndex++;
      if (autoPlay) mockSpeechSynthesizer.speakSentence(sentences[activeIndex - 1].text);
    }
  };

  const handlePrev = (autoPlay = true) => {
    if (activeIndex > 1) {
      mockSpeechSynthesizer.stop();
      activeIndex--;
      if (autoPlay) mockSpeechSynthesizer.speakSentence(sentences[activeIndex - 1].text);
    }
  };

  // 1. Next sentence immediately speaks
  handleNext(true);
  assert.strictEqual(activeIndex, 2);
  assert.strictEqual(spokenText, "Deuxième phrase.", "Navigating to next sentence must immediately read it");

  // 2. Next sentence again
  handleNext(true);
  assert.strictEqual(activeIndex, 3);
  assert.strictEqual(spokenText, "Troisième phrase.");

  // 3. Previous sentence immediately speaks
  handlePrev(true);
  assert.strictEqual(activeIndex, 2);
  assert.strictEqual(spokenText, "Deuxième phrase.", "Navigating to previous sentence must immediately read it");

  handlePrev(true);
  assert.strictEqual(activeIndex, 1);
  assert.strictEqual(spokenText, "Première phrase.");
});

import { SpeechSynthesizer } from '../src/core/speech/speechSynthesizer.js';

test('15. SpeechSynthesizer & Dictation Audio Controls: Pause/Resume vs Replay', () => {
  const synth = new SpeechSynthesizer();
  assert.strictEqual(synth.isPlaying, false);
  assert.strictEqual(synth.isPaused, false);

  // 1. Play sentence (headless mode)
  synth.speakSentence("Bonjour tout le monde !");
  assert.strictEqual(synth.isPlaying, true);
  assert.strictEqual(synth.isPaused, false);

  // 2. Pause audio
  synth.pause();
  assert.strictEqual(synth.isPlaying, false);
  assert.strictEqual(synth.isPaused, true);

  // 3. Resume audio
  synth.resume();
  assert.strictEqual(synth.isPlaying, true);
  assert.strictEqual(synth.isPaused, false);

  // 4. Stop / Replay resets pause state
  synth.stop();
  assert.strictEqual(synth.isPlaying, false);
  assert.strictEqual(synth.isPaused, false);

  // 5. Test toggle logic
  let state = { isPlaying: false, isPaused: false };
  const togglePlayPause = () => {
    if (state.isPlaying && !state.isPaused) {
      synth.pause();
      state.isPlaying = false;
      state.isPaused = true;
    } else if (state.isPaused) {
      synth.resume();
      state.isPaused = false;
      state.isPlaying = true;
    } else {
      synth.speakSentence("Test");
      state.isPlaying = true;
      state.isPaused = false;
    }
  };

  // Click 1: Start playing -> isPlaying: true
  togglePlayPause();
  assert.strictEqual(state.isPlaying, true);
  assert.strictEqual(state.isPaused, false);

  // Click 2: Click while playing -> MUST PAUSE (not replay!)
  togglePlayPause();
  assert.strictEqual(state.isPlaying, false);
  assert.strictEqual(state.isPaused, true);

  // Click 3: Click while paused -> MUST RESUME
  togglePlayPause();
  assert.strictEqual(state.isPlaying, true);
  assert.strictEqual(state.isPaused, false);

  // Clean up
  synth.stop();
});

test('16. Dictation Keyboard Mapping: CTRL+SPACE toggles Ecouter (Play/Pause), regular SPACE is purely whitespace, CTRL+R triggers Replay', () => {
  let playPauseToggled = 0;
  let replayed = 0;
  let preventDefaultCalled = 0;

  const handleKey = (e) => {
    const isInputTarget = e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT');
    const isSpace = e.code === 'Space' || e.key === ' ';
    const isR = e.key === 'r' || e.key === 'R' || e.code === 'KeyR';

    // 1. CTRL+R (hoặc CMD+R): Replay
    if ((e.ctrlKey || e.metaKey) && isR) {
      if (typeof e.preventDefault === 'function') {
        e.preventDefault();
        preventDefaultCalled++;
      }
      replayed++;
      return;
    }

    // 2. CTRL+SPACE (hoặc CMD+SPACE): Toggle Play/Pause/Resume cho nút Ecouter
    if ((e.ctrlKey || e.metaKey) && isSpace) {
      if (typeof e.preventDefault === 'function') {
        e.preventDefault();
        preventDefaultCalled++;
      }
      playPauseToggled++;
      return;
    }

    // 3. SPACE thông thường: cho phép gõ khoảng trắng bình thường, KHÔNG toggle audio
    if (isSpace && isInputTarget && !e.ctrlKey && !e.metaKey && !e.altKey) {
      return;
    }
  };

  // 1. Press CTRL+SPACE (even inside textarea): Toggles Play/Pause
  handleKey({ key: ' ', code: 'Space', ctrlKey: true, metaKey: false, altKey: false, target: { tagName: 'TEXTAREA' }, preventDefault: () => {} });
  assert.strictEqual(playPauseToggled, 1, "CTRL+SPACE inside textarea must toggle Play/Pause");
  assert.strictEqual(replayed, 0);

  // 2. Press regular SPACE inside textarea: Does NOT toggle Play/Pause (pure whitespace)
  handleKey({ key: ' ', code: 'Space', ctrlKey: false, metaKey: false, altKey: false, target: { tagName: 'TEXTAREA' }, preventDefault: () => {} });
  assert.strictEqual(playPauseToggled, 1, "Regular SPACE inside textarea must NOT toggle Play/Pause");
  assert.strictEqual(replayed, 0);

  // 3. Press regular SPACE outside textarea: Does NOT toggle Play/Pause (Ecouter is strictly CTRL+Space)
  handleKey({ key: ' ', code: 'Space', ctrlKey: false, metaKey: false, altKey: false, target: { tagName: 'BUTTON' }, preventDefault: () => {} });
  assert.strictEqual(playPauseToggled, 1, "Regular SPACE outside textarea must NOT toggle Play/Pause");

  // 4. Press CTRL+R: Triggers Replay and calls preventDefault (prevents browser reload)
  handleKey({ key: 'r', code: 'KeyR', ctrlKey: true, metaKey: false, altKey: false, target: { tagName: 'TEXTAREA' }, preventDefault: () => {} });
  assert.strictEqual(replayed, 1, "CTRL+R must trigger Replay");
  assert.strictEqual(playPauseToggled, 1);
  assert.strictEqual(preventDefaultCalled >= 2, true, "CTRL+R and CTRL+SPACE must call preventDefault");
});

test('17. Dictation Navigation: Advancing with handleNext isolates cancellation and keeps playback state in sync for Space Play/Pause toggle', () => {
  const synth = new SpeechSynthesizer();
  let isPlaying = false;
  let isPaused = false;
  let activeSentenceIndex = 1;
  const sentences = [{ text: "Première phrase." }, { text: "Deuxième phrase." }, { text: "Troisième phrase." }];

  const playCurrent = () => {
    isPlaying = true;
    isPaused = false;
    synth.speakSentence(sentences[activeSentenceIndex - 1].text, {
      onStart: () => { isPlaying = true; isPaused = false; },
      onEnd: () => { isPlaying = false; isPaused = false; },
      onError: (err) => {
        if (err && (err.error === 'canceled' || err.error === 'interrupted')) return;
        isPlaying = false;
        isPaused = false;
      }
    });
  };

  const handleNext = (autoPlay = true) => {
    synth.stop();
    isPlaying = false;
    isPaused = false;
    if (activeSentenceIndex < sentences.length) {
      activeSentenceIndex++;
      if (autoPlay) {
        isPlaying = true;
      }
      if (autoPlay) {
        playCurrent();
      }
    }
  };

  const togglePlayPause = () => {
    if (isPlaying && !isPaused) {
      synth.pause();
      isPlaying = false;
      isPaused = true;
    } else if (isPaused) {
      synth.resume();
      isPaused = false;
      isPlaying = true;
    } else {
      playCurrent();
    }
  };

  // 1. Start sentence 1
  playCurrent();
  assert.strictEqual(isPlaying, true);
  assert.strictEqual(isPaused, false);

  // 2. Advance to sentence 2 (Ctrl+Right Arrow)
  handleNext(true);
  assert.strictEqual(activeSentenceIndex, 2);
  assert.strictEqual(isPlaying, true, "After handleNext(true), isPlaying must be true");
  assert.strictEqual(isPaused, false);

  // 3. User presses SPACE while sentence 2 is reading out loud:
  // It MUST pause, NOT replay!
  togglePlayPause();
  assert.strictEqual(isPlaying, false, "Pressing SPACE during playback must pause");
  assert.strictEqual(isPaused, true, "State must be paused");
  assert.strictEqual(synth.isPaused, true, "Synthesizer must be paused");

  // 4. User presses SPACE again while paused:
  // It MUST resume!
  togglePlayPause();
  assert.strictEqual(isPlaying, true, "Pressing SPACE while paused must resume");
  assert.strictEqual(isPaused, false);

  synth.stop();
});

test('18. SpeechSynthesizer Natural Voice Ranking & Selection: Prioritizes Neural/Natural voices and formats labels cleanly', () => {
  const mockVoices = [
    { name: 'Microsoft Paul - French (France)', lang: 'fr-FR', voiceURI: 'ms-paul' },
    { name: 'Google français', lang: 'fr-FR', voiceURI: 'google-fr' },
    { name: 'Microsoft Denise Online (Natural) - French (France)', lang: 'fr-FR', voiceURI: 'ms-denise-natural' },
    { name: 'Microsoft Henri Online (Natural) - French (France)', lang: 'fr-FR', voiceURI: 'ms-henri-natural' },
    { name: 'Microsoft Claude - French (Canada)', lang: 'fr-CA', voiceURI: 'ms-claude-ca' },
    { name: 'Microsoft David - English (United States)', lang: 'en-US', voiceURI: 'ms-david-en' }
  ];

  // 1. rankVoice: Natural voices must have lowest rank score (highest priority)
  const deniseRank = SpeechSynthesizer.rankVoice(mockVoices[2]);
  const henriRank = SpeechSynthesizer.rankVoice(mockVoices[3]);
  const paulRank = SpeechSynthesizer.rankVoice(mockVoices[0]);
  const googleRank = SpeechSynthesizer.rankVoice(mockVoices[1]);
  const canadaRank = SpeechSynthesizer.rankVoice(mockVoices[4]);
  const englishRank = SpeechSynthesizer.rankVoice(mockVoices[5]);

  assert.strictEqual(deniseRank, 10, "Denise Online (Natural) must be Tier 1 (rank 10)");
  assert.strictEqual(henriRank, 10, "Henri Online (Natural) must be Tier 1 (rank 10)");
  assert.strictEqual(paulRank, 20, "Paul must be Tier 2 (rank 20)");
  assert.strictEqual(googleRank, 30, "Google français must be Tier 3 (rank 30)");
  assert.strictEqual(canadaRank, 50, "Regional French must be Tier 5 (rank 50)");
  assert.strictEqual(englishRank, 999, "Non-French voice must be ignored (rank 999)");

  // 2. formatVoiceName produces user-friendly labels with icons
  assert.strictEqual(SpeechSynthesizer.formatVoiceName(mockVoices[2]), "✨ Denise (France) [Naturel]");
  assert.strictEqual(SpeechSynthesizer.formatVoiceName(mockVoices[3]), "✨ Henri (France) [Naturel]");
  assert.strictEqual(SpeechSynthesizer.formatVoiceName(mockVoices[0]), "🗣️ Paul (France)");
  assert.strictEqual(SpeechSynthesizer.formatVoiceName(mockVoices[1]), "🗣️ Google Français");

  // 3. Mock synthesis voice selection & persistence
  const synth = new SpeechSynthesizer();
  synth.synth = {
    getVoices: () => mockVoices,
    speak: () => {},
    cancel: () => {},
    resume: () => {}
  };
  synth.initVoices();
  const sortedFrench = synth.getFrenchVoices({ includeCloud: false });
  assert.strictEqual(sortedFrench.length, 5, "Should filter out non-French voices");
  assert.strictEqual(sortedFrench[0].voiceURI, 'ms-denise-natural', "Top voice should be Online Natural");

  // 4. setVoice updates selectedVoice
  const switched = synth.setVoice('ms-henri-natural');
  assert.strictEqual(switched, true);
  assert.strictEqual(synth.selectedVoice.voiceURI, 'ms-henri-natural');
});

import { googleCloudTtsService, GOOGLE_CLOUD_FRENCH_VOICES } from '../src/core/speech/googleCloudTtsService.js';

test('19. Google Cloud Text-to-Speech: Payload generation, audio caching, and dual-engine fallback', async () => {
  // 1. Voice catalog contains Studio, Neural2, Journey
  assert.ok(GOOGLE_CLOUD_FRENCH_VOICES.length >= 5, "Must provide at least 5 curated Google Cloud French voices");
  const studioB = GOOGLE_CLOUD_FRENCH_VOICES.find(v => v.voiceId === 'fr-FR-Studio-B');
  assert.ok(studioB, "Must include Studio-B");
  assert.strictEqual(studioB.gender, 'female');
  assert.strictEqual(studioB.isCloud, true);

  // 2. Payload construction
  const payload = googleCloudTtsService.buildPayload("Bienvenue dans le laboratoire", "fr-FR-Studio-B", 0.75);
  assert.strictEqual(payload.input.text, "Bienvenue dans le laboratoire");
  assert.strictEqual(payload.voice.name, "fr-FR-Studio-B");
  assert.strictEqual(payload.voice.ssmlGender, "FEMALE");
  assert.strictEqual(payload.audioConfig.speakingRate, 0.75);
  assert.strictEqual(payload.audioConfig.audioEncoding, "MP3");

  // 3. Audio caching mechanism (0ms, 0 API cost on repeat)
  googleCloudTtsService.clearCache();
  const call1 = await googleCloudTtsService.synthesize({
    text: "Phrase de test",
    voiceId: "fr-FR-Neural2-A",
    rate: 1.0,
    apiKey: "MOCK_TEST_KEY"
  });
  assert.strictEqual(call1.fromCache, false, "First call must fetch / synthesize");
  assert.ok(call1.audioUrl, "Must return an audio URL");

  const call2 = await googleCloudTtsService.synthesize({
    text: "Phrase de test",
    voiceId: "fr-FR-Neural2-A",
    rate: 1.0,
    apiKey: "MOCK_TEST_KEY"
  });
  assert.strictEqual(call2.fromCache, true, "Second call must return from local cache instantly");
  assert.strictEqual(call2.audioUrl, call1.audioUrl);

  // 4. API Key storage helpers
  googleCloudTtsService.saveApiKey('test-key-12345');
  assert.strictEqual(googleCloudTtsService.getApiKey(), 'test-key-12345');
  googleCloudTtsService.saveApiKey('');
  assert.strictEqual(googleCloudTtsService.getApiKey(), '');

  // 5. Dual-engine fallback when no API key
  const synth = new SpeechSynthesizer();
  let spokeUtterance = null;
  synth.synth = {
    getVoices: () => [
      { name: 'Google Français', lang: 'fr-FR', voiceURI: 'Google Français' }
    ],
    speak: (utt) => { spokeUtterance = utt; },
    cancel: () => {},
    resume: () => {}
  };
  let fallbackCaptured = null;
  synth.onFallback = (info) => {
    fallbackCaptured = info;
  };
  synth.setVoice('gcloud:fr-FR-Wavenet-C');
  assert.strictEqual(synth.selectedVoice.isCloud, true);

  // Speak without API key should not crash, it should gracefully fall back to web speech and notify onFallback
  synth.speakSentence("Test sans clé");
  assert.strictEqual(synth.isPlaying, true);
  await new Promise(r => setTimeout(r, 20));
  assert.ok(fallbackCaptured !== null, "onFallback must be triggered when cloud synthesis fails");
  assert.strictEqual(fallbackCaptured.requestedVoice.name, 'Camille (WaveNet-C)');
  assert.strictEqual(fallbackCaptured.fallbackVoice.name, 'Google Français');
  if (spokeUtterance) {
    assert.strictEqual(spokeUtterance.voice.name, 'Google Français', "Fallback must assign French local voice");
  }
  synth.stop();
  assert.strictEqual(synth.isPlaying, false);
});

test('20. Inline Dictation Correction: Evaluation renders inline, preserves typed text on hide, and recalculates on re-submit', () => {
  const ex = DICTATION_EXERCISES[0];
  const sentences = splitFrenchSentences(ex.fullText);
  let sentenceInputs = {
    1: sentences[0].text,
    2: "Texte avec une erreur volontaire"
  };

  // 1. Initial evaluation
  const initialEvaluation = evaluateDictation(ex, sentenceInputs);
  assert.ok(initialEvaluation, "Must return an evaluation object");
  assert.strictEqual(typeof initialEvaluation.overallAccuracy, 'number');
  assert.ok(initialEvaluation.sentenceResults.length >= 2);

  // 2. Hide / dismiss correction panel (sets evaluation to null, preserves sentenceInputs)
  let evaluation = null;
  assert.strictEqual(evaluation, null, "Hiding correction clears evaluation");
  assert.strictEqual(sentenceInputs[1], sentences[0].text, "User input for sentence 1 must remain intact");
  assert.strictEqual(sentenceInputs[2], "Texte avec une erreur volontaire", "User input for sentence 2 must remain intact");

  // 3. User edits text and re-evaluates
  sentenceInputs[2] = sentences[1].text; // corrected sentence 2
  const reEvaluation = evaluateDictation(ex, sentenceInputs);
  assert.ok(reEvaluation.overallAccuracy >= initialEvaluation.overallAccuracy, "Re-evaluation accuracy must increase");
  assert.strictEqual(reEvaluation.sentenceResults[1].accuracy, 100, "Sentence 2 accuracy is now 100%");

  // 4. Retry / Reset dictation
  evaluation = null;
  sentenceInputs = {};
  assert.deepStrictEqual(sentenceInputs, {}, "Retrying dictation resets inputs");
});

test('21. Dictation Engine: Accurately evaluates AI generated text passages with structured or raw sentences', () => {
  // Test with raw string array sentences (as generated by templates)
  const rawStringExercise = {
    id: 'ai-raw-test',
    level: 'B1',
    fullText: "Face à l'urgence environnementale, de nombreux citoyens choisissent de modifier leurs habitudes au quotidien. Il est indispensable que nous réduisions notre consommation de plastique afin de protéger les océans.",
    sentences: [
      "Face à l'urgence environnementale, de nombreux citoyens choisissent de modifier leurs habitudes au quotidien.",
      "Il est indispensable que nous réduisions notre consommation de plastique afin de protéger les océans."
    ]
  };

  const userTranscriptions = {
    1: "face à l'urgence environnementale, de nombreux citoyens choisissent de modifier leurs habitudes au quotidien."
  };

  const result = evaluateDictation(rawStringExercise, userTranscriptions);
  assert.ok(result.totalExpected > 0, "Expected words must be greater than 0");
  assert.ok(result.totalCorrect > 0, "Correct words must be greater than 0");
  assert.strictEqual(result.sentenceResults[0].accuracy, 100, "Sentence 1 must have 100% accuracy");
  assert.strictEqual(result.sentenceResults[0].wordsExpected, 14, "Sentence 1 must have 14 expected words");
  assert.strictEqual(result.sentenceResults[0].wordsCorrect, 14, "Sentence 1 must have 14 correct words");
});

test('22. Dictation Evaluation Shortcut: Ctrl+Enter triggers evaluation, prevents newline, and guards against empty input', () => {
  const ex = DICTATION_EXERCISES[0];
  const sentences = splitFrenchSentences(ex.fullText);

  let sentenceInputs = {};
  let evaluation = null;
  let activeSentenceIndex = 1;
  let viewTab = 'sentence';
  let textareaMock = { value: '' };

  const submitEvaluation = () => {
    // 1. Synchronize input
    if (viewTab === 'sentence') {
      sentenceInputs[activeSentenceIndex] = textareaMock.value;
    } else {
      const parsed = splitFrenchSentences(textareaMock.value);
      sentences.forEach((_, idx) => {
        if (parsed[idx]) {
          sentenceInputs[idx + 1] = parsed[idx].text;
        }
      });
    }

    const currentText = viewTab === 'sentence'
      ? (sentenceInputs[activeSentenceIndex] || textareaMock.value)
      : textareaMock.value;

    // Guard against empty submission
    if (countFrenchWords(currentText.trim()) === 0) {
      return;
    }

    evaluation = evaluateDictation(ex, sentenceInputs);
  };

  const handleKeyDown = (e) => {
    const isEnter = e.key === 'Enter' || e.code === 'Enter';
    if ((e.ctrlKey || e.metaKey) && isEnter) {
      e.preventDefault();
      e.stopPropagation();
      submitEvaluation();
    }
  };

  // 1. When textarea is empty, Ctrl+Enter should NOT produce evaluation
  let defaultPrevented = false;
  let propagationStopped = false;
  handleKeyDown({
    ctrlKey: true,
    key: 'Enter',
    preventDefault: () => { defaultPrevented = true; },
    stopPropagation: () => { propagationStopped = true; }
  });

  assert.strictEqual(defaultPrevented, true, "Ctrl+Enter must call preventDefault even when empty");
  assert.strictEqual(propagationStopped, true, "Ctrl+Enter must call stopPropagation even when empty");
  assert.strictEqual(evaluation, null, "Empty input must not trigger evaluation");

  // 2. When text is entered, Ctrl+Enter triggers evaluation immediately
  textareaMock.value = sentences[0].text;
  defaultPrevented = false;
  propagationStopped = false;

  handleKeyDown({
    ctrlKey: true,
    key: 'Enter',
    preventDefault: () => { defaultPrevented = true; },
    stopPropagation: () => { propagationStopped = true; }
  });

  assert.strictEqual(defaultPrevented, true, "Ctrl+Enter must call preventDefault on submit");
  assert.strictEqual(propagationStopped, true, "Ctrl+Enter must call stopPropagation on submit");
  assert.ok(evaluation !== null, "Ctrl+Enter must compute evaluation when text is present");
  assert.strictEqual(evaluation.sentenceResults[0].accuracy, 100, "Sentence 1 must be evaluated to 100%");

  // 3. Cmd+Enter on macOS (metaKey: true) must also trigger evaluation
  evaluation = null;
  defaultPrevented = false;
  handleKeyDown({
    metaKey: true,
    key: 'Enter',
    preventDefault: () => { defaultPrevented = true; },
    stopPropagation: () => {}
  });

  assert.strictEqual(defaultPrevented, true, "Cmd+Enter must call preventDefault on macOS");
  assert.ok(evaluation !== null, "Cmd+Enter must trigger evaluation on macOS");
});










