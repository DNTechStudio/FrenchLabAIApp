import React, { useState } from 'react';
import { DiffToken, CEFRLevel } from '../domain/types';
import { Columns, Eye, Headphones } from 'lucide-react';
import { AppTranslations } from '../domain/translations';

interface DiffViewerProps {
  diffTokens: DiffToken[];
  improvedText: string;
  translations?: AppTranslations;
  level?: CEFRLevel;
  initialMode?: 'diff' | 'clean';
  onSwitchToDictation?: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  diffTokens,
  improvedText,
  translations,
  level,
  initialMode = 'diff',
  onSwitchToDictation,
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'clean'>(initialMode);

  React.useEffect(() => {
    setViewMode(initialMode);
  }, [initialMode, improvedText]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {translations?.comparison.tabUnified || "Comparaison Visuelle"}
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            className={`btn-secondary ${viewMode === 'diff' ? 'active' : ''}`}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              borderColor: viewMode === 'diff' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: viewMode === 'diff' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
            }}
            onClick={() => setViewMode('diff')}
          >
            <Columns size={13} />
            <span>{translations?.comparison.tabUnified || "Diff Rouge / Vert"}</span>
          </button>
          <button
            className={`btn-secondary ${viewMode === 'clean' ? 'active' : ''}`}
            style={{
              padding: '0.3rem 0.6rem',
              fontSize: '0.75rem',
              borderColor: viewMode === 'clean' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              background: viewMode === 'clean' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
            }}
            onClick={() => setViewMode('clean')}
          >
            <Eye size={13} />
            <span>
              {level
                ? (translations?.comparison.tabImproved || 'Version améliorée B2').replace(/B2/g, level)
                : (translations?.comparison.tabImproved || "Texte B2 Définitif")}
            </span>
          </button>
          {onSwitchToDictation && (
            <button
              className="btn-secondary"
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                color: 'var(--accent-secondary)',
                borderColor: 'rgba(6, 182, 212, 0.35)',
              }}
              onClick={onSwitchToDictation}
              title={translations?.dictation?.tabTitle || "Mode Dictée"}
            >
              <Headphones size={13} />
              <span>{translations?.dictation?.tabTitle || "Mode Dictée"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="diff-container" role="region" aria-label="Visualisation des corrections">
        {viewMode === 'clean' ? (
          <div>{improvedText}</div>
        ) : (
          <div>
            {diffTokens.map((token, index) => {
              if (token.type === 'removed') {
                return (
                  <del key={index} className="diff-token diff-removed" title="Supprimé ou reformulé">
                    {token.value}
                  </del>
                );
              }
              if (token.type === 'added') {
                return (
                  <ins key={index} className="diff-token diff-added" title="Amélioration B2 ajoutée">
                    {token.value}
                  </ins>
                );
              }
              return <span key={index}>{token.value}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
