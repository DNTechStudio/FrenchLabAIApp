import React, { useMemo } from 'react';
import { Copy, Check, Sparkles, FileText, Headphones } from 'lucide-react';
import { ImprovementResult, CEFRLevel } from '../domain/types';
import { CEFR_LEVEL_METADATA } from '../domain/cefrLevels';
import { AppTranslations } from '../domain/translations';
import { countFrenchWords } from '../domain/frenchWordCounter';
import { DiffViewer } from './DiffViewer';
import { PedagogicalNotes } from './PedagogicalNotes';

interface ComparisonWindowProps {
  level: CEFRLevel;
  result: ImprovementResult | null;
  isLoading: boolean;
  onCopy: () => void;
  hasCopied: boolean;
  translations?: AppTranslations;
  onSwitchToDictation?: () => void;
}

export const ComparisonWindow: React.FC<ComparisonWindowProps> = ({
  level,
  result,
  isLoading,
  onCopy,
  hasCopied,
  translations,
  onSwitchToDictation,
}) => {
  const meta = CEFR_LEVEL_METADATA[level];
  const levelTrans = translations?.cefr.levels[level];

  const wordCount = useMemo(() => {
    if (!result?.improvedText) return 0;
    return countFrenchWords(result.improvedText);
  }, [result?.improvedText]);

  return (
    <div
      className="comparison-window-card"
      style={{
        borderTop: `3px solid ${meta.color}`,
      }}
      aria-label={`Comparaison CECRL ${level}`}
    >
      <div className="comparison-window-header">
        <div className="comparison-window-meta">
          <span
            className="cefr-level-badge"
            style={{
              backgroundColor: meta.badgeBg,
              color: meta.badgeText,
              border: `1px solid ${meta.borderActive}`,
            }}
          >
            <Sparkles size={13} />
            <span>{level} — {levelTrans?.name || meta.level}</span>
          </span>

          {result && (
            <span className="comparison-window-wordcount">
              {wordCount} {translations?.editor.wordsLabel || 'mots'}
            </span>
          )}
        </div>

        {result && (
          <button
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
            onClick={onCopy}
            title={translations?.comparison.copyButton || `Copier la version ${level}`}
          >
            {hasCopied ? (
              <>
                <Check size={13} color="var(--counter-success)" />
                <span style={{ color: 'var(--counter-success)' }}>
                  {translations?.comparison.copiedButton || 'Copié !'}
                </span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>{translations?.comparison.copyButton || `Copier ${level}`}</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="comparison-window-body">
        {isLoading ? (
          <div
            style={{
              height: '100%',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: meta.color,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ fontSize: '0.9rem', fontWeight: 500, textAlign: 'center' }}>
              {translations?.comparison.analyzingButton || `Génération de la version ${level}...`}
            </p>
          </div>
        ) : !result ? (
          <div
            style={{
              height: '100%',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-lg)',
                background: meta.badgeBg,
                border: `1px solid ${meta.borderActive}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: meta.badgeText,
              }}
            >
              <FileText size={24} />
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
              }}
            >
              {levelTrans?.name ? `${level} (${levelTrans.name})` : `Niveau ${level}`}
            </h4>
            <p style={{ fontSize: '0.825rem', maxWidth: '300px', lineHeight: 1.5 }}>
              {levelTrans?.desc || translations?.comparison.emptySubtitle}
            </p>
            {onSwitchToDictation && (
              <button
                className="btn-secondary"
                style={{
                  marginTop: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--accent-secondary)',
                  borderColor: 'rgba(6, 182, 212, 0.35)',
                }}
                onClick={onSwitchToDictation}
                title={translations?.dictation?.tabTitle || "Mode Dictée"}
              >
                <Headphones size={14} />
                <span>{translations?.dictation?.tabTitle || "Mode Dictée"}</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            <DiffViewer
              diffTokens={result.diffTokens}
              improvedText={result.improvedText}
              translations={translations}
              level={level}
              initialMode={result.isAutonomous || !result.originalText?.trim() ? 'clean' : 'diff'}
              onSwitchToDictation={onSwitchToDictation}
            />
            <PedagogicalNotes
              notes={result.pedagogicalNotes}
              overallFeedback={result.overallFeedback}
              translations={translations}
              level={level}
            />
          </div>
        )}
      </div>
    </div>
  );
};
