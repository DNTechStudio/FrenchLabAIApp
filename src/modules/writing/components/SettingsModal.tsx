import React, { useState } from 'react';
import { X, Key, ShieldCheck, Cpu, Globe, Volume2, Sparkles, Play } from 'lucide-react';
import { UserSettings, AiProvider, TtsConfig, TtsEngine } from '../domain/types.ts';
import { AppTranslations, SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../domain/translations.ts';
import { FRENCH_VOICE_CATALOG, DEFAULT_TTS_CONFIG } from '../domain/constants.ts';
import { speechSynthesisService } from '../services/speechSynthesisService.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (newSettings: Partial<UserSettings>) => void;
  translations?: AppTranslations;
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  translations,
  currentLanguage = 'fr',
  onLanguageChange,
}) => {
  const [provider, setProvider] = useState<AiProvider>(settings.provider);
  const [apiKey, setApiKey] = useState<string>(settings.apiKey || '');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(settings.language || currentLanguage);
  
  // TTS Voice Configuration State
  const [ttsConfig, setTtsConfig] = useState<TtsConfig>(settings.ttsConfig || DEFAULT_TTS_CONFIG);
  const [ttsApiKey, setTtsApiKey] = useState<string>(ttsConfig.googleApiKey || ttsConfig.openaiApiKey || '');
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  if (!isOpen) return null;

  const t = translations || getTranslation(selectedLanguage);

  const availableVoices = FRENCH_VOICE_CATALOG.filter((v) => {
    if (ttsConfig.engine === 'webspeech') return v.provider === 'webspeech';
    if (ttsConfig.engine === 'google-cloud') return v.provider === 'google-cloud';
    if (ttsConfig.engine === 'openai') return v.provider === 'openai';
    return true;
  });

  const handleEngineChange = (engine: TtsEngine) => {
    const firstVoice = FRENCH_VOICE_CATALOG.find((v) => v.provider === engine) || FRENCH_VOICE_CATALOG[0];
    setTtsConfig((prev) => ({
      ...prev,
      engine,
      voiceId: firstVoice.id,
    }));
  };

  const handleTestVoice = async () => {
    if (isTestingVoice) return;
    setIsTestingVoice(true);
    try {
      const activeConfig: TtsConfig = {
        ...ttsConfig,
        googleApiKey: ttsConfig.engine === 'google-cloud' ? (ttsApiKey.trim() || apiKey.trim()) : undefined,
        openaiApiKey: ttsConfig.engine === 'openai' ? ttsApiKey.trim() : undefined,
      };
      await speechSynthesisService.testVoiceSample(activeConfig, apiKey.trim());
    } catch (err) {
      console.warn('Voice preview error:', err);
    } finally {
      setIsTestingVoice(false);
    }
  };

  const handleSave = () => {
    const finalTtsConfig: TtsConfig = {
      ...ttsConfig,
      googleApiKey: ttsConfig.engine === 'google-cloud' ? (ttsApiKey.trim() || undefined) : undefined,
      openaiApiKey: ttsConfig.engine === 'openai' ? (ttsApiKey.trim() || undefined) : undefined,
    };

    onSaveSettings({
      provider,
      apiKey: apiKey.trim(),
      language: selectedLanguage,
      ttsConfig: finalTtsConfig,
    });
    if (onLanguageChange && selectedLanguage !== currentLanguage) {
      onLanguageChange(selectedLanguage);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={20} color="var(--accent-primary)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
              {t.settings.title}
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label={t.settings.closeButton}>
            <X size={18} />
          </button>
        </div>

        {/* 1. Language Selection Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            <Globe size={15} color="var(--accent-primary)" />
            <span>{t.settings.languageLabel}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`btn-secondary ${selectedLanguage === lang.code ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  justifyContent: 'flex-start',
                  borderColor: selectedLanguage === lang.code ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: selectedLanguage === lang.code ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                }}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  if (onLanguageChange) onLanguageChange(lang.code);
                }}
              >
                <span>{lang.flag}</span>
                <span style={{ fontWeight: selectedLanguage === lang.code ? 600 : 400 }}>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. AI Improvement Provider Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            {t.settings.providerLabel}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: provider === 'mock' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: provider === 'mock' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-secondary)',
              cursor: 'pointer',
            }}>
              <input
                type="radio"
                name="ai-provider"
                value="mock"
                checked={provider === 'mock'}
                onChange={() => setProvider('mock')}
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {t.settings.mockOption}
                </div>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: provider === 'gemini' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: provider === 'gemini' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-secondary)',
              cursor: 'pointer',
            }}>
              <input
                type="radio"
                name="ai-provider"
                value="gemini"
                checked={provider === 'gemini'}
                onChange={() => setProvider('gemini')}
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {t.settings.geminiOption}
                </div>
              </div>
            </label>
          </div>
        </div>

        {provider === 'gemini' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              <Key size={14} />
              <span>{t.settings.apiKeyLabel}</span>
            </label>
            <input
              type="password"
              placeholder={t.settings.apiKeyPlaceholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              <ShieldCheck size={14} color="var(--counter-success)" />
              {t.settings.apiKeyHelp}
            </span>
          </div>
        )}

        {/* 3. Dictation Voice Engine Section (Feature 008) */}
        <div style={{ marginBottom: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--accent-secondary)' }}>
            <Volume2 size={16} />
            <span>{t.tts?.sectionTitle || 'Voix de la Dictée (Synthèse Vocale)'}</span>
          </label>

          {/* Engine Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)', border: '1px solid',
              borderColor: ttsConfig.engine === 'webspeech' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: ttsConfig.engine === 'webspeech' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
              cursor: 'pointer', fontSize: '0.85rem'
            }}>
              <input
                type="radio"
                name="tts-engine"
                checked={ttsConfig.engine === 'webspeech'}
                onChange={() => handleEngineChange('webspeech')}
              />
              <span style={{ fontWeight: ttsConfig.engine === 'webspeech' ? 600 : 400 }}>
                {t.tts?.engines?.webspeech || 'Navigateur Web Speech (Gratuit & Hors-ligne)'}
              </span>
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)', border: '1px solid',
              borderColor: ttsConfig.engine === 'google-cloud' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: ttsConfig.engine === 'google-cloud' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
              cursor: 'pointer', fontSize: '0.85rem'
            }}>
              <input
                type="radio"
                name="tts-engine"
                checked={ttsConfig.engine === 'google-cloud'}
                onChange={() => handleEngineChange('google-cloud')}
              />
              <span style={{ fontWeight: ttsConfig.engine === 'google-cloud' ? 600 : 400 }}>
                {t.tts?.engines?.googleCloud || 'Google Cloud TTS Neural2 / Studio (Haute Fidélité)'}
              </span>
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)', border: '1px solid',
              borderColor: ttsConfig.engine === 'openai' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: ttsConfig.engine === 'openai' ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
              cursor: 'pointer', fontSize: '0.85rem'
            }}>
              <input
                type="radio"
                name="tts-engine"
                checked={ttsConfig.engine === 'openai'}
                onChange={() => handleEngineChange('openai')}
              />
              <span style={{ fontWeight: ttsConfig.engine === 'openai' ? 600 : 400 }}>
                {t.tts?.engines?.openai || 'OpenAI TTS (Voix Expressive)'}
              </span>
            </label>
          </div>

          {/* Voice Timbre Selector & Audition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                {t.tts?.voiceLabel || 'Timbre & Modèle de voix :'}
              </label>
              <select
                className="prompt-select"
                value={ttsConfig.voiceId}
                onChange={(e) => setTtsConfig({ ...ttsConfig, voiceId: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
              >
                {availableVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    [{v.styleBadge}] {v.name} — {v.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom TTS API key input if separate */}
            {ttsConfig.engine !== 'webspeech' && (
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                  <Key size={13} />
                  <span>
                    {ttsConfig.engine === 'google-cloud' ? 'Clé API Google Cloud / Gemini (Optionnel si renseignée plus haut) :' : 'Clé API OpenAI :'}
                  </span>
                </label>
                <input
                  type="password"
                  placeholder={ttsConfig.engine === 'google-cloud' ? 'Laissez vide pour réutiliser la clé Gemini ci-dessus...' : 'sk-...'}
                  value={ttsApiKey}
                  onChange={(e) => setTtsApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Voice Preview Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.3rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleTestVoice}
                disabled={isTestingVoice}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
              >
                <Play size={14} />
                <span>{isTestingVoice ? (t.tts?.testingLabel || 'Génération audio...') : (t.tts?.testButton || '🔊 Tester la voix')}</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button className="btn-secondary" onClick={onClose}>
            {t.settings.closeButton}
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {t.settings.saveButton}
          </button>
        </div>
      </div>
    </div>
  );
};
