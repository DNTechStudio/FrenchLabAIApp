import React from 'react';
import { Shuffle, BookOpen } from 'lucide-react';
import { Prompt, PromptCategory } from '../domain/types';
import { AppTranslations } from '../domain/translations';

interface PromptSelectorProps {
  prompts: Prompt[];
  selectedPrompt: Prompt;
  onSelectPrompt: (prompt: Prompt) => void;
  onRandomPrompt: () => void;
  translations?: AppTranslations;
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({
  prompts,
  selectedPrompt,
  onSelectPrompt,
  onRandomPrompt,
  translations,
}) => {
  const categories: PromptCategory[] = ['lettre_formelle', 'essai_argumentatif', 'article_forum'];

  const getCategoryLabel = (cat: PromptCategory): string => {
    if (!translations) {
      if (cat === 'lettre_formelle') return 'Lettre Formelle';
      if (cat === 'essai_argumentatif') return 'Essai Argumentatif';
      return 'Article & Forum';
    }
    return translations.categories[cat];
  };

  return (
    <div className="prompt-box">
      <div className="prompt-controls">
        <select
          className="prompt-select"
          value={selectedPrompt.id}
          onChange={(e) => {
            const found = prompts.find((p) => p.id === e.target.value);
            if (found) onSelectPrompt(found);
          }}
          aria-label={translations?.editor.selectPromptPrompt || "Sélectionnez un sujet DELF B2"}
        >
          {categories.map((cat) => (
            <optgroup key={cat} label={getCategoryLabel(cat)}>
              {prompts
                .filter((p) => p.category === cat)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        <button
          className="btn-secondary"
          onClick={onRandomPrompt}
          title={translations?.editor.randomTopicButton || "Tirer un sujet officiel au sort"}
        >
          <Shuffle size={15} />
          <span>{translations?.editor.randomTopicButton || "Sujet aléatoire"}</span>
        </button>
      </div>

      <div className="prompt-details">
        <p className="prompt-scenario">{selectedPrompt.scenario}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
          <BookOpen size={14} color="var(--accent-secondary)" />
          <span className="prompt-instructions">{selectedPrompt.instructions}</span>
        </div>
      </div>
    </div>
  );
};
