import React from 'react';
import { X, Globe, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { SUPPORTED_LOCALES, type AppLocale } from '../i18n/languages';
import i18n from '../i18n';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setIsLanguageModalOpen } = useStore();
  const { t } = useTranslation('common');
  const current = (i18n.language || 'en').split('-')[0] as AppLocale;

  if (!isLanguageModalOpen) return null;

  const selectLanguage = async (code: AppLocale) => {
    await i18n.changeLanguage(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg-overlay)] backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{t('language.title')}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{t('language.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50 rounded-xl p-3 mb-5 flex items-start space-x-3 text-xs text-blue-700 dark:text-blue-200">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>{t('language.info')}</div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
            {t('language.subtitle')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {SUPPORTED_LOCALES.map((lang) => {
              const isSelected = lang.code === current;
              return (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-[var(--color-text-primary)] font-semibold'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">{lang.flag}</span>
                    <span className="truncate">{lang.nativeName}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-muted)]">
            {t('language.selected')}:{' '}
            <span className="text-[var(--color-text-secondary)] font-semibold">
              {SUPPORTED_LOCALES.find((l) => l.code === current)?.nativeName || 'English'}
            </span>
          </div>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
          >
            {t('language.save')}
          </button>
        </div>
      </div>
    </div>
  );
};
