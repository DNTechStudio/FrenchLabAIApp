import React from 'react';
import { PenTool, Moon, Sun, Settings, Sparkles, Coffee } from 'lucide-react';
import { DEFAULT_SUPPORT_CONFIG, SupportConfig } from '../domain/constants';
import { AppTranslations, SupportedLanguage, getTranslation } from '../domain/translations';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  activeProvider: string;
  supportConfig?: SupportConfig;
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  translations?: AppTranslations;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenSettings,
  activeProvider,
  supportConfig = DEFAULT_SUPPORT_CONFIG,
  currentLanguage = 'fr',
  onLanguageChange,
  translations,
}) => {
  const t = translations || getTranslation(currentLanguage);

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <PenTool size={20} />
        </div>
        <div>
          <span className="brand-title">{t.brand.title}</span>
          <span className="brand-badge">{t.brand.badge}</span>
        </div>
      </div>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Sparkles size={14} color="var(--accent-primary)" />
          <span>{t.header.engine}<strong style={{ color: 'var(--text-secondary)' }}>{activeProvider.toUpperCase()}</strong></span>
        </div>

        {onLanguageChange && (
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            ariaLabel={t.header.language}
          />
        )}

        {supportConfig.enabled && (
          <a
            href={supportConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-bmc"
            title={t.header.coffeeTitle || supportConfig.ariaLabel}
            aria-label={t.header.coffeeTitle || supportConfig.ariaLabel}
          >
            <Coffee size={15} className="btn-bmc-icon" />
            <span className="btn-bmc-text">{t.header.coffeeLabel || supportConfig.label}</span>
          </a>
        )}

        <button
          className="btn-icon"
          onClick={onToggleTheme}
          title={theme === 'dark' ? t.header.themeLight : t.header.themeDark}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="btn-icon"
          onClick={onOpenSettings}
          title={t.header.settings}
          aria-label={t.header.settings}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
