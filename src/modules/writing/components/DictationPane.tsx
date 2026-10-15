import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { Prompt, CEFRLevel, DictationEvaluation, DictationSentence, TtsConfig } from '../domain/types.ts';
import { AppTranslations } from '../domain/translations.ts';
import { splitFrenchSentences, evaluateDictation } from '../domain/dictationEngine.ts';
import { speechSynthesisService } from '../services/speechSynthesisService.ts';
import { countFrenchWords } from '../domain/frenchWordCounter.ts';

interface DictationPaneProps {
  prompt: Prompt;
  referenceText: string;
  targetLevel: CEFRLevel;
  onExitDictation: () => void;
  translations?: AppTranslations;
  ttsConfig?: TtsConfig;
  apiKey?: string;
  onOpenSettings?: () => void;
}

export const DictationPane: React.FC<DictationPaneProps> = ({
  prompt,
  referenceText,
  targetLevel,
  onExitDictation,
  translations,
  ttsConfig,
  apiKey,
  onOpenSettings,
}) => {
  // 1. Tokenize French sentences from reference text
  const sentences: DictationSentence[] = useMemo(() => {
    return splitFrenchSentences(referenceText);
  }, [referenceText]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0.85); // 0.75x or 1.0x (default calibrated 0.85 for clarity)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  // Per-sentence candidate transcription inputs
  const [sentenceInputs, setSentenceInputs] = useState<Record<number, string>>({});
  const [evaluation, setEvaluation] = useState<DictationEvaluation | null>(null);
  const [activeTab, setActiveTab] = useState<'sentence' | 'full'>('sentence');
  const [fullTextInput, setFullTextInput] = useState<string>('');

  const currentSentence = sentences[currentIndex] || { index: 1, text: '', wordCount: 0 };
  const currentSentenceInput = sentenceInputs[currentIndex] || '';

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Check speech synthesis support on mount
  useEffect(() => {
    setSpeechSupported(speechSynthesisService.isSupported());
    return () => {
      speechSynthesisService.cancel();
    };
  }, []);

  // Sync full text when sentence inputs change
  useEffect(() => {
    if (activeTab === 'sentence') {
      const combined = sentences.map((_, idx) => sentenceInputs[idx] || '').filter(Boolean).join(' ');
      setFullTextInput(combined);
    }
  }, [sentenceInputs, sentences, activeTab]);

  // Audio Playback Handler
  const handlePlaySentence = useCallback(async (indexToPlay?: number) => {
    const idx = indexToPlay !== undefined ? indexToPlay : currentIndex;
    const target = sentences[idx];
    if (!target || !target.text) return;

    try {
      setIsPlaying(true);
      await speechSynthesisService.speak(target.text, speed, ttsConfig, apiKey);
    } catch (err) {
      console.warn('Speech synthesis playback error:', err);
    } finally {
      setIsPlaying(false);
    }
  }, [currentIndex, sentences, speed, ttsConfig, apiKey]);

  const handlePause = useCallback(() => {
    speechSynthesisService.pause();
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    speechSynthesisService.cancel();
    setIsPlaying(false);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      handleStop();
      setCurrentIndex((prev) => prev - 1);
      setEvaluation(null);
    }
  }, [currentIndex, handleStop]);

  const handleNext = useCallback(() => {
    if (currentIndex < sentences.length - 1) {
      handleStop();
      setCurrentIndex((prev) => prev + 1);
      setEvaluation(null);
    }
  }, [currentIndex, handleStop, sentences.length]);

  // Global keyboard shortcut listener (Ctrl + R: replay, Ctrl + Left: prev, Ctrl + Right: next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R' || e.code === 'KeyR')) {
        e.preventDefault();
        handlePlaySentence();
      } else if (e.ctrlKey && (e.key === 'ArrowLeft' || e.code === 'ArrowLeft')) {
        e.preventDefault();
        handlePrev();
      } else if (e.ctrlKey && (e.key === 'ArrowRight' || e.code === 'ArrowRight')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlaySentence, handlePrev, handleNext]);

  // Handle current sentence input change
  const handleCurrentInputChange = (val: string) => {
    setSentenceInputs((prev) => ({
      ...prev,
      [currentIndex]: val,
    }));
  };

  // Evaluation: Either evaluate active sentence or full text
  const handleEvaluate = () => {
    const userText = activeTab === 'sentence' ? currentSentenceInput : fullTextInput;
    const expected = activeTab === 'sentence' ? currentSentence.text : referenceText;
    const result = evaluateDictation(expected, userText);
    setEvaluation(result);
  };

  const handleResetCurrent = () => {
    if (activeTab === 'sentence') {
      setSentenceInputs((prev) => ({ ...prev, [currentIndex]: '' }));
    } else {
      setFullTextInput('');
      setSentenceInputs({});
    }
    setEvaluation(null);
  };

  // Word count calculation
  const typedWordCount = useMemo(() => {
    const text = activeTab === 'sentence' ? currentSentenceInput : fullTextInput;
    return countFrenchWords(text);
  }, [activeTab, currentSentenceInput, fullTextInput]);

  const dt = translations?.dictation;

  // Mistake category stats
  const mistakesBreakdown = useMemo(() => {
    if (!evaluation) return { accords: 0, accents: 0, homophones: 0, lexique: 0 };
    return evaluation.mistakes.reduce(
      (acc, m) => {
        acc[m.category] = (acc[m.category] || 0) + 1;
        return acc;
      },
      { accords: 0, accents: 0, homophones: 0, lexique: 0 } as Record<string, number>
    );
  }, [evaluation]);

  return (
    <section className="pane dictation-pane" aria-label={dt?.tabTitle || "Mode Dictée"}>
      {/* 1. Header Toolbar */}
      <div className="pane-header dictation-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            className="btn-secondary"
            onClick={onExitDictation}
            title="Retourner à la rédaction"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={15} />
            <span>{translations?.editor.paneTitle ? "Rédaction" : "Retour"}</span>
          </button>
          <div className="pane-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={18} color="var(--accent-secondary)" />
            <span>{dt?.tabTitle || "Mode Dictée DELF B2"}</span>
          </div>
          <span
            className="cefr-level-badge"
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-glow)',
            }}
          >
            {targetLevel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Active Voice Badge */}
          {onOpenSettings && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onOpenSettings}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.55rem',
                height: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                background: ttsConfig?.engine && ttsConfig.engine !== 'webspeech' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                borderColor: ttsConfig?.engine && ttsConfig.engine !== 'webspeech' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color: ttsConfig?.engine && ttsConfig.engine !== 'webspeech' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
              title="Paramètres de voix TTS"
            >
              <span>🎙️</span>
              <span>
                {ttsConfig?.engine === 'google-cloud'
                  ? `IA (${ttsConfig.voiceId.replace('fr-FR-', '')})`
                  : ttsConfig?.engine === 'openai'
                  ? `OpenAI (${ttsConfig.voiceId})`
                  : 'Web Speech'}
              </span>
            </button>
          )}

          {/* Speed Selector */}
          <div className="dictation-speed-selector" title={dt?.speedLabel || "Vitesse de lecture"}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>
              {dt?.speedLabel || "Vitesse :"}
            </span>
            <button
              className={`btn-speed ${speed <= 0.8 ? 'active' : ''}`}
              onClick={() => setSpeed(0.75)}
              title="Vitesse lente (0.75x)"
            >
              0.75x
            </button>
            <button
              className={`btn-speed ${speed > 0.8 ? 'active' : ''}`}
              onClick={() => setSpeed(1.0)}
              title="Vitesse normale (1.0x)"
            >
              1.0x
            </button>
          </div>
        </div>
      </div>

      <div className="pane-content dictation-content">
        {/* Unsupported Browser Warning */}
        {!speechSupported && (
          <div className="dictation-alert-warning">
            <VolumeX size={18} color="#ef4444" />
            <span>
              La synthèse vocale n'est pas prise en charge sur ce navigateur. Veuillez utiliser Chrome, Edge ou Safari.
            </span>
          </div>
        )}

        {/* 2. Audio Control Deck & Stepper */}
        <div className="dictation-deck-card">
          <div className="dictation-deck-top">
            <div className="dictation-stepper-info">
              <span className="dictation-stepper-label">
                {dt?.sentenceCounter
                  ? dt.sentenceCounter
                      .replace('{current}', String(currentIndex + 1))
                      .replace('{total}', String(sentences.length || 1))
                  : `Phrase ${currentIndex + 1} sur ${sentences.length || 1}`}
              </span>
              <div className="dictation-progress-bar">
                <div
                  className="dictation-progress-fill"
                  style={{
                    width: `${((currentIndex + 1) / Math.max(1, sentences.length)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Audio Wave Indicator */}
            {isPlaying && (
              <div className="dictation-sound-wave" title="Audio en cours de lecture...">
                <span className="wave-bar bar-1"></span>
                <span className="wave-bar bar-2"></span>
                <span className="wave-bar bar-3"></span>
                <span className="wave-bar bar-4"></span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', marginLeft: '0.35rem' }}>
                  Écoute en cours...
                </span>
              </div>
            )}
          </div>

          {/* Stepper Buttons & Audio Triggers */}
          <div className="dictation-audio-controls">
            <button
              className="btn-secondary"
              onClick={handlePrev}
              disabled={currentIndex === 0 || isPlaying}
              title={`${dt?.prevSentence || "Phrase précédente"} (Ctrl + ←)`}
            >
              <ChevronLeft size={16} />
              <span>{dt?.prevSentence || "Précédent"}</span>
              <kbd className="shortcut-kbd">Ctrl+←</kbd>
            </button>

            {isPlaying ? (
              <button
                className="btn-primary btn-dictation-play playing"
                onClick={handlePause}
                title={dt?.pauseButton || "Pause"}
              >
                <Pause size={18} />
                <span>{dt?.pauseButton || "Pause"}</span>
              </button>
            ) : (
              <button
                className="btn-primary btn-dictation-play"
                onClick={() => handlePlaySentence()}
                title={dt?.listenButton || "Écouter la phrase"}
              >
                <Play size={18} />
                <span>{dt?.listenButton || "Écouter"}</span>
              </button>
            )}

            <button
              className="btn-secondary btn-dictation-replay"
              onClick={() => handlePlaySentence()}
              title={dt?.replayButton || "Réécouter (Ctrl + R)"}
            >
              <RotateCcw size={15} />
              <span>{dt?.replayButton || "Réécouter"}</span>
              <kbd className="shortcut-kbd">Ctrl+R</kbd>
            </button>

            <button
              className="btn-secondary"
              onClick={handleNext}
              disabled={currentIndex >= sentences.length - 1 || isPlaying}
              title={`${dt?.nextSentence || "Phrase suivante"} (Ctrl + →)`}
            >
              <span>{dt?.nextSentence || "Suivant"}</span>
              <ChevronRight size={16} />
              <kbd className="shortcut-kbd">Ctrl+→</kbd>
            </button>
          </div>
        </div>

        {/* 3. Transcription Input Area */}
        <div className="dictation-input-container">
          <div className="dictation-input-tabs">
            <button
              className={`dictation-tab ${activeTab === 'sentence' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('sentence');
                setEvaluation(null);
              }}
            >
              Phrase {currentIndex + 1}
            </button>
            <button
              className={`dictation-tab ${activeTab === 'full' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('full');
                setEvaluation(null);
              }}
            >
              <Layers size={13} style={{ marginRight: '0.3rem' }} />
              Texte intégral ({sentences.length} phrases)
            </button>
          </div>

          <div className="editor-wrapper dictation-editor-wrapper">
            <textarea
              ref={textareaRef}
              className="essay-textarea dictation-textarea"
              placeholder={
                activeTab === 'sentence'
                  ? `Écoutez la phrase ${currentIndex + 1} et tapez ce que vous entendez en français... (Ctrl+Espace pour réécouter)`
                  : "Tapez la transcription intégrale de la dictée ici..."
              }
              value={activeTab === 'sentence' ? currentSentenceInput : fullTextInput}
              onChange={(e) => {
                if (activeTab === 'sentence') {
                  handleCurrentInputChange(e.target.value);
                } else {
                  setFullTextInput(e.target.value);
                }
              }}
              spellCheck="false"
              lang="fr"
              aria-label="Zone de transcription de la dictée"
            />
          </div>

          {/* Action Bar */}
          <div className="dictation-action-bar">
            <div className="dictation-word-count">
              <span>Mots transcrits : <strong>{typedWordCount}</strong></span>
              {activeTab === 'sentence' && (
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  (Attendu : ~{currentSentence.wordCount} mots)
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                className="btn-secondary"
                onClick={handleResetCurrent}
                disabled={!typedWordCount}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              >
                Effacer
              </button>

              <button
                className="btn-primary btn-dictation-submit"
                onClick={handleEvaluate}
                disabled={!typedWordCount}
                title={dt?.evaluateButton || "Corriger ma dictée"}
              >
                <Sparkles size={16} />
                <span>{dt?.evaluateButton || "Corriger ma dictée"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Pedagogical Evaluation & Diagnostic Card */}
        {evaluation && (
          <div className="dictation-report-card">
            <div className="dictation-report-header">
              <div className="accuracy-gauge-container">
                <div
                  className={`accuracy-score-circle ${
                    evaluation.accuracy >= 90
                      ? 'score-excellent'
                      : evaluation.accuracy >= 75
                      ? 'score-good'
                      : 'score-needs-work'
                  }`}
                >
                  <span className="score-number">{evaluation.accuracy}%</span>
                  <span className="score-subtext">Exactitude</span>
                </div>

                <div className="accuracy-details">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                    {evaluation.accuracy >= 90
                      ? "🌟 Excellent réflexe orthographique !"
                      : evaluation.accuracy >= 75
                      ? "👍 Bon travail ! Quelques accords à ajuster."
                      : "⚠️ Attention aux accords et aux homophones."}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {evaluation.correctWordsCount} / {evaluation.totalExpectedWords} mots corrects
                    {evaluation.mistakesCount > 0 && ` • ${evaluation.mistakesCount} erreur(s) détectée(s)`}
                  </p>
                </div>
              </div>

              {/* Category Breakdown Badges */}
              <div className="mistake-category-pills">
                <div className="mistake-pill pill-accords">
                  <span className="pill-dot dot-accords" />
                  <span className="pill-label">{dt?.categories.accords || "Accords"}</span>
                  <span className="pill-count">{mistakesBreakdown.accords}</span>
                </div>
                <div className="mistake-pill pill-accents">
                  <span className="pill-dot dot-accents" />
                  <span className="pill-label">{dt?.categories.accents || "Accents"}</span>
                  <span className="pill-count">{mistakesBreakdown.accents}</span>
                </div>
                <div className="mistake-pill pill-homophones">
                  <span className="pill-dot dot-homophones" />
                  <span className="pill-label">{dt?.categories.homophones || "Homophones"}</span>
                  <span className="pill-count">{mistakesBreakdown.homophones}</span>
                </div>
                <div className="mistake-pill pill-lexique">
                  <span className="pill-dot dot-lexique" />
                  <span className="pill-label">{dt?.categories.lexique || "Lexique"}</span>
                  <span className="pill-count">{mistakesBreakdown.lexique}</span>
                </div>
              </div>
            </div>

            {/* Word-by-word visual diff */}
            <div className="dictation-diff-section">
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Comparaison visuelle (Attendu vs Votre transcription)
              </h5>
              <div className="dictation-diff-tokens">
                {evaluation.diffTokens.map((token, idx) => {
                  if (token.type === 'unchanged') {
                    return (
                      <span key={idx} className="diff-token unchanged">
                        {token.value}
                      </span>
                    );
                  }
                  if (token.type === 'removed') {
                    return (
                      <span key={idx} className="diff-token removed" title="Mot attendu">
                        {token.value}
                      </span>
                    );
                  }
                  if (token.type === 'added') {
                    return (
                      <span key={idx} className="diff-token added" title="Votre saisie">
                        {token.value}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Itemized Mistakes Diagnostic */}
            {evaluation.mistakes.length > 0 ? (
              <div className="dictation-mistakes-list">
                <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Détail pédagogique des erreurs ({evaluation.mistakes.length})
                </h5>
                <div className="mistakes-grid">
                  {evaluation.mistakes.map((m) => (
                    <div key={m.id} className={`mistake-item-card card-${m.category}`}>
                      <div className="mistake-words">
                        <span className="user-mistake-word">{m.userWord}</span>
                        <span className="mistake-arrow">➔</span>
                        <span className="expected-correct-word">{m.expectedWord}</span>
                      </div>
                      <span className={`mistake-category-tag tag-${m.category}`}>
                        {dt?.categories[m.category] || m.category}
                      </span>
                      <p className="mistake-explanation">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="dictation-perfect-badge">
                <CheckCircle2 size={22} color="#10b981" />
                <span>Zéro faute ! Félicitations pour cette transcription impeccable.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
