import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { CEFRLevel, ALL_CEFR_LEVELS, CEFR_LEVEL_METADATA } from '../domain/cefrLevels';
import { AppTranslations } from '../domain/translations';

interface CEFRLevelSelectorProps {
  selectedLevels: CEFRLevel[];
  onChange: (levels: CEFRLevel[]) => void;
  disabled?: boolean;
  translations?: AppTranslations;
}

export const CEFRLevelSelector: React.FC<CEFRLevelSelectorProps> = ({
  selectedLevels,
  onChange,
  disabled = false,
  translations,
}) => {
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => {
      setFeedbackNotice((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleToggle = (level: CEFRLevel) => {
    if (disabled) return;

    const isSelected = selectedLevels.includes(level);

    if (isSelected) {
      if (selectedLevels.length <= 1) {
        showNotice(translations?.cefr.minNotice || 'Au moins 1 niveau requis');
        return;
      }
      const updated = selectedLevels.filter((l) => l !== level);
      onChange(updated);
    } else {
      if (selectedLevels.length >= 2) {
        showNotice(translations?.cefr.maxNotice || 'Maximum 2 niveaux sélectionnés pour la comparaison');
        return;
      }
      // Add and keep canonical CEFR order
      const updated = ALL_CEFR_LEVELS.filter((l) => l === level || selectedLevels.includes(l));
      onChange(updated);
    }
  };

  return (
    <div className="cefr-selector-container" role="group" aria-label={translations?.cefr.selectorTitle || 'Niveaux CECRL à comparer'}>
      <div className="cefr-selector-header">
        <div className="cefr-selector-label">
          <Layers size={15} color="var(--accent-primary)" />
          <span className="cefr-selector-title">
            {translations?.cefr.selectorTitle || 'Niveaux CECRL à comparer :'}
          </span>
          <span className="cefr-selector-hint">
            ({translations?.cefr.selectorHint || 'Sélectionnez 1 ou 2 niveaux'})
          </span>
        </div>
        {feedbackNotice && (
          <span className="cefr-selector-notice" role="alert">
            {feedbackNotice}
          </span>
        )}
      </div>

      <div className="cefr-pills-grid">
        {ALL_CEFR_LEVELS.map((level) => {
          const isSelected = selectedLevels.includes(level);
          const meta = CEFR_LEVEL_METADATA[level];
          const levelTrans = translations?.cefr.levels[level];
          const isMaxDisabled = !isSelected && selectedLevels.length >= 2;

          return (
            <label
              key={level}
              className={`cefr-pill ${isSelected ? 'active' : ''} ${isMaxDisabled ? 'disabled-max' : ''}`}
              style={{
                '--level-color': meta.color,
                '--level-bg': meta.badgeBg,
                '--level-border': meta.borderActive,
              } as React.CSSProperties}
              title={`${level} — ${levelTrans?.name || meta.level}: ${levelTrans?.desc || ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(level)}
                disabled={disabled}
                aria-label={`CEFR Level ${level} (${levelTrans?.name || ''})`}
                className="cefr-checkbox-input"
              />
              <span className="cefr-pill-code">{level}</span>
              <span className="cefr-pill-name">{levelTrans?.name || level}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
