import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { OFFICIAL_DELF_B2_PROMPTS } from './domain/prompts';
import { Prompt, UserSettings, SupportedLanguage, CEFRLevel, MultiLevelResultMap } from './domain/types';
import { sanitizeSelectedLevels } from './domain/cefrLevels';
import { getTranslation } from './domain/translations';
import { countFrenchWords } from './domain/frenchWordCounter';
import { StorageService } from './services/storageService';
import { MockImprovementService } from './services/mockImprovementService';
import { GeminiImprovementService } from './services/geminiImprovementService';
import { Header } from './components/Header';
import { EditorPane } from './components/EditorPane';
import { ComparisonPane } from './components/ComparisonPane';
import { DictationPane } from './components/DictationPane';
import { SettingsModal } from './components/SettingsModal';
import { getDefaultModelEssay } from './services/mockImprovementService';

export function App() {
  // 1. Initial State from Local Storage
  const initialSession = useMemo(() => StorageService.loadSession(), []);

  const [prompts] = useState<Prompt[]>(OFFICIAL_DELF_B2_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt>(() => {
    const saved = prompts.find((p) => p.id === initialSession.activePromptId);
    return saved || prompts[0];
  });

  const [content, setContent] = useState<string>(() => {
    const draft = initialSession.drafts[selectedPrompt.id];
    return draft ? draft.content : '';
  });

  const [settings, setSettings] = useState<UserSettings>(initialSession.settings);
  const [theme, setTheme] = useState<'dark' | 'light'>(initialSession.settings.theme || 'dark');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialSession.settings.language || 'fr');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = useMemo(() => getTranslation(currentLanguage), [currentLanguage]);

  // CEFR Multi-Comparison States (Feature 004)
  const [selectedLevels, setSelectedLevels] = useState<CEFRLevel[]>(() => {
    return sanitizeSelectedLevels(initialSession.settings.selectedLevels);
  });
  const [multiLevelResults, setMultiLevelResults] = useState<MultiLevelResultMap>({});
  const [loadingLevels, setLoadingLevels] = useState<Partial<Record<CEFRLevel, boolean>>>({});
  const [copiedLevels, setCopiedLevels] = useState<Partial<Record<CEFRLevel, boolean>>>({});
  // Mode state: 'writing' | 'dictation'
  const [activeMode, setActiveMode] = useState<'writing' | 'dictation'>('writing');
  const [customDictationLevel, setCustomDictationLevel] = useState<CEFRLevel | null>(null);

  const dictationTargetLevel = customDictationLevel || selectedLevels[0] || 'B2';
  const dictationReferenceText = useMemo(() => {
    return (
      multiLevelResults[dictationTargetLevel]?.improvedText ||
      getDefaultModelEssay(selectedPrompt.id, dictationTargetLevel)
    );
  }, [multiLevelResults, dictationTargetLevel, selectedPrompt.id]);

  const handleSwitchToDictation = useCallback((level?: CEFRLevel) => {
    if (level) {
      setCustomDictationLevel(level);
    }
    setActiveMode('dictation');
  }, []);

  // 2. Computed Word Count
  const wordCount = useMemo(() => countFrenchWords(content), [content]);

  // 3. Apply Theme to root DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    StorageService.saveSettings({ theme });
  }, [theme]);

  // 4. Debounced Autosave to LocalStorage
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      StorageService.saveDraft(selectedPrompt.id, content, wordCount);
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, wordCount, selectedPrompt.id]);

  // Immediate save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      StorageService.saveDraft(selectedPrompt.id, content, wordCount);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [content, wordCount, selectedPrompt.id]);

  // 5. Handlers for Prompt Switching & Reset
  const handleSelectPrompt = useCallback((prompt: Prompt) => {
    // Save current prompt draft first
    StorageService.saveDraft(selectedPrompt.id, content, wordCount);
    setSelectedPrompt(prompt);
    StorageService.saveActivePromptId(prompt.id);

    // Load new draft or empty
    const nextDraft = StorageService.getDraft(prompt.id);
    setContent(nextDraft ? nextDraft.content : '');
    setMultiLevelResults({});
  }, [content, selectedPrompt.id, wordCount]);

  const handleRandomPrompt = useCallback(() => {
    const remaining = prompts.filter((p) => p.id !== selectedPrompt.id);
    const randomIndex = Math.floor(Math.random() * remaining.length);
    handleSelectPrompt(remaining[randomIndex]);
  }, [handleSelectPrompt, prompts, selectedPrompt.id]);

  const handleResetDraft = useCallback(() => {
    setContent('');
    StorageService.clearDraft(selectedPrompt.id);
    setMultiLevelResults({});
  }, [selectedPrompt.id]);

  // 6. Level Selection Toggle (Preserves active draft text without data loss)
  const handleLevelsChange = useCallback((newLevels: CEFRLevel[]) => {
    const sanitized = sanitizeSelectedLevels(newLevels);
    setSelectedLevels(sanitized);
    const updated = { ...settings, selectedLevels: sanitized };
    setSettings(updated);
    StorageService.saveSettings(updated);
  }, [settings]);

  // 7. Concurrent AI Improvement for all selected levels
  const isAnyLoading = useMemo(() => {
    return Object.values(loadingLevels).some(Boolean);
  }, [loadingLevels]);

  const handleImprove = async () => {
    if (isAnyLoading) return;

    // Set loading indicator for each selected level
    const initialLoading: Partial<Record<CEFRLevel, boolean>> = {};
    selectedLevels.forEach((lvl) => {
      initialLoading[lvl] = true;
    });
    setLoadingLevels(initialLoading);

    const service = settings.provider === 'gemini' && settings.apiKey
      ? new GeminiImprovementService(settings.apiKey)
      : new MockImprovementService();

    try {
      await Promise.all(
        selectedLevels.map(async (lvl) => {
          try {
            const res = await service.improveEssay({
              promptId: selectedPrompt.id,
              promptTitle: selectedPrompt.title,
              promptScenario: selectedPrompt.scenario,
              promptInstructions: selectedPrompt.instructions,
              essayContent: content,
              targetLevel: lvl,
              isAutonomous: !content.trim(),
            });
            setMultiLevelResults((prev) => ({ ...prev, [lvl]: res }));
          } catch (err) {
            console.error(`Improvement error for level ${lvl}:`, err);
          } finally {
            setLoadingLevels((prev) => ({ ...prev, [lvl]: false }));
          }
        })
      );
    } finally {
      setLoadingLevels({});
    }
  };

  // 8. Clipboard Copy per Level Window
  const handleCopyLevel = async (level: CEFRLevel) => {
    const text = multiLevelResults[level]?.improvedText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLevels((prev) => ({ ...prev, [level]: true }));
      setTimeout(() => {
        setCopiedLevels((prev) => ({ ...prev, [level]: false }));
      }, 2000);
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
    }
  };

  // 8. Settings & Language Update
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setCurrentLanguage(newLang);
    const updated = { ...settings, language: newLang };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleSaveSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    if (newSettings.language && newSettings.language !== currentLanguage) {
      setCurrentLanguage(newSettings.language);
    }
    StorageService.saveSettings(updated);
  };

  return (
    <div className="app-container">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeProvider={settings.provider}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        translations={t}
      />

      <main className="workspace-grid">
        {activeMode === 'dictation' ? (
          <DictationPane
            prompt={selectedPrompt}
            referenceText={dictationReferenceText}
            targetLevel={dictationTargetLevel}
            onExitDictation={() => {
              setActiveMode('writing');
              setCustomDictationLevel(null);
            }}
            translations={t}
            ttsConfig={settings.ttsConfig}
            apiKey={settings.apiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <EditorPane
            prompts={prompts}
            selectedPrompt={selectedPrompt}
            onSelectPrompt={handleSelectPrompt}
            onRandomPrompt={handleRandomPrompt}
            content={content}
            onChangeContent={setContent}
            wordCount={wordCount}
            onImprove={handleImprove}
            isLoading={isAnyLoading}
            onResetDraft={handleResetDraft}
            selectedLevels={selectedLevels}
            onSelectLevels={handleLevelsChange}
            translations={t}
          />
        )}

        <ComparisonPane
          selectedLevels={selectedLevels}
          results={multiLevelResults}
          loadingLevels={loadingLevels}
          copiedLevels={copiedLevels}
          onCopyLevel={handleCopyLevel}
          translations={t}
          onSwitchToDictation={handleSwitchToDictation}
        />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        translations={t}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}

export default App;
