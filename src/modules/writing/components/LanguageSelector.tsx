import React from 'react';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../domain/translations';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  ariaLabel?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  ariaLabel = 'Select Language',
}) => {
  return (
    <div className="language-selector-wrapper" title={ariaLabel}>
      <Globe size={15} className="language-selector-icon" />
      <select
        className="language-select"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        aria-label={ariaLabel}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name} ({lang.shortLabel})
          </option>
        ))}
      </select>
    </div>
  );
};
