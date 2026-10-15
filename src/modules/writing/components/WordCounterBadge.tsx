import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { getWordCountStatus } from '../domain/frenchWordCounter';
import { AppTranslations } from '../domain/translations';

interface WordCounterBadgeProps {
  wordCount: number;
  targetWordCount?: number;
  translations?: AppTranslations;
}

export const WordCounterBadge: React.FC<WordCounterBadgeProps> = ({
  wordCount,
  targetWordCount = 250,
  translations,
}) => {
  const status = getWordCountStatus(wordCount, targetWordCount);
  const percentage = Math.min(100, Math.round((wordCount / targetWordCount) * 100));
  const isAchieved = status === 'target_achieved';

  const wordsLabel = translations?.editor.wordsLabel || 'mots';
  const achievedLabel = translations?.editor.statusAchieved || 'Objectif atteint !';
  const missingWords = Math.max(0, targetWordCount - wordCount);
  const underLabel = translations?.editor.statusUnder || `Manque ${missingWords}`;

  return (
    <div className="word-counter-badge">
      <div className="progress-bar-container" title={`${percentage}%`}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: isAchieved ? 'var(--counter-success)' : 'var(--counter-under)',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {isAchieved ? (
          <CheckCircle2 size={16} color="var(--counter-success)" />
        ) : (
          <AlertCircle size={16} color="var(--counter-under)" />
        )}
        <span className={`counter-text ${isAchieved ? 'achieved' : 'under'}`}>
          {wordCount} / {targetWordCount} {wordsLabel}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {isAchieved ? `(${achievedLabel})` : `(${underLabel})`}
        </span>
      </div>
    </div>
  );
};
