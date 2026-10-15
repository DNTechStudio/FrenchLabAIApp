import React, { useState } from 'react';
import { Sparkles, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { Prompt, CEFRLevel } from '../domain/types';
import { AppTranslations } from '../domain/translations';
import { PromptSelector } from './PromptSelector';
import { WordCounterBadge } from './WordCounterBadge';
import { CEFRLevelSelector } from './CEFRLevelSelector';

interface EditorPaneProps {
  prompts: Prompt[];
  selectedPrompt: Prompt;
  onSelectPrompt: (prompt: Prompt) => void;
  onRandomPrompt: () => void;
  content: string;
  onChangeContent: (text: string) => void;
  wordCount: number;
  onImprove: () => void;
  isLoading: boolean;
  onResetDraft: () => void;
  selectedLevels: CEFRLevel[];
  onSelectLevels: (levels: CEFRLevel[]) => void;
  translations?: AppTranslations;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  prompts,
  selectedPrompt,
  onSelectPrompt,
  onRandomPrompt,
  content,
  onChangeContent,
  wordCount,
  onImprove,
  isLoading,
  onResetDraft,
  selectedLevels,
  onSelectLevels,
  translations,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleConfirmReset = () => {
    onResetDraft();
    setShowConfirmReset(false);
  };

  return (
    <section className="pane" aria-label={translations?.editor.paneTitle || "Espace de rédaction"}>
      <div className="pane-header">
        <div className="pane-title">
          <Edit3 size={18} color="var(--accent-primary)" />
          <span>{translations?.editor.paneTitle || "Rédaction Thématique DELF B2"}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
            onClick={() => setShowConfirmReset(true)}
            title={translations?.editor.clearButton || "Effacer"}
            disabled={!content.trim()}
          >
            <Trash2 size={14} />
            <span>{translations?.editor.clearButton || "Effacer"}</span>
          </button>
        </div>
      </div>

      <div className="pane-content">
        <PromptSelector
          prompts={prompts}
          selectedPrompt={selectedPrompt}
          onSelectPrompt={onSelectPrompt}
          onRandomPrompt={onRandomPrompt}
          translations={translations}
        />

        <div className="editor-wrapper">
          <textarea
            className="essay-textarea"
            placeholder={translations?.editor.inputPlaceholder || "Rédigez votre production écrite ici en français..."}
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            spellCheck="true"
            lang="fr"
            aria-label={translations?.editor.paneTitle || "Zone de saisie de l'essai"}
          />
        </div>

        <CEFRLevelSelector
          selectedLevels={selectedLevels}
          onChange={onSelectLevels}
          disabled={isLoading}
          translations={translations}
        />

        <div className="editor-footer">
          <WordCounterBadge
            wordCount={wordCount}
            targetWordCount={selectedPrompt.targetWordCount}
            translations={translations}
          />

          <button
            className="btn-primary"
            onClick={onImprove}
            disabled={isLoading}
            title={
              wordCount === 0
                ? `${translations?.comparison.improveButton || "Améliorer avec l'IA"} (Rédiger un exemple)`
                : (translations?.comparison.improveButton || "Améliorer avec l'IA")
            }
          >
            <Sparkles size={16} />
            <span>{isLoading ? (translations?.comparison.analyzingButton || "Analyse en cours...") : (translations?.comparison.improveButton || "Améliorer avec l'IA")}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <AlertTriangle size={22} color="#f59e0b" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                {translations?.editor.clearButton || "Effacer"}
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {translations?.editor.clearConfirm || "Êtes-vous sûr de vouloir effacer votre essai actuel ?"}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowConfirmReset(false)}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                style={{ background: '#ef4444' }}
                onClick={handleConfirmReset}
              >
                {translations?.editor.clearButton || "Effacer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
