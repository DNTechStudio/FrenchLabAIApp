import React from 'react';
import { Sparkles, Layout } from 'lucide-react';
import { CEFRLevel, MultiLevelResultMap } from '../domain/types';
import { AppTranslations } from '../domain/translations';
import { ComparisonWindow } from './ComparisonWindow';

interface ComparisonPaneProps {
  selectedLevels: CEFRLevel[];
  results: MultiLevelResultMap;
  loadingLevels: Partial<Record<CEFRLevel, boolean>>;
  copiedLevels: Partial<Record<CEFRLevel, boolean>>;
  onCopyLevel: (level: CEFRLevel) => void;
  translations?: AppTranslations;
  onSwitchToDictation?: (level: CEFRLevel) => void;
}

export const ComparisonPane: React.FC<ComparisonPaneProps> = ({
  selectedLevels,
  results,
  loadingLevels,
  copiedLevels,
  onCopyLevel,
  translations,
  onSwitchToDictation,
}) => {
  const windowCount = selectedLevels.length;

  return (
    <section
      className="pane comparison-pane-outer"
      aria-label={translations?.comparison.paneTitle || 'Espace de comparaison'}
    >
      <div className="pane-header">
        <div className="pane-title">
          <Sparkles size={18} color="var(--accent-primary)" />
          <span>{translations?.comparison.paneTitle || '✨ Analyse & Diff Visuel'}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Layout size={13} />
          <span>
            {windowCount} {windowCount === 1 ? 'fenêtre' : 'fenêtres'} ({selectedLevels.join(' + ')})
          </span>
        </div>
      </div>

      <div className="pane-content" style={{ padding: '0.75rem' }}>
        <div
          className={`comparison-windows-wrapper ${
            windowCount === 1 ? 'single-window' : 'dual-window'
          }`}
        >
          {selectedLevels.map((lvl) => (
            <ComparisonWindow
              key={lvl}
              level={lvl}
              result={results[lvl] || null}
              isLoading={!!loadingLevels[lvl]}
              onCopy={() => onCopyLevel(lvl)}
              hasCopied={!!copiedLevels[lvl]}
              translations={translations}
              onSwitchToDictation={onSwitchToDictation ? () => onSwitchToDictation(lvl) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
