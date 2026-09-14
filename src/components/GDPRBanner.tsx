import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useTranslation } from 'react-i18next';

const GDPR_BANNER_KEY = 'eudossier_gdpr_banner_seen_at';
const GDPR_BANNER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function shouldShowGdprBanner(): boolean {
  try {
    const seenAt = localStorage.getItem(GDPR_BANNER_KEY);
    if (!seenAt) return true;
    const timestamp = Number(seenAt);
    if (!Number.isFinite(timestamp)) return true;
    return Date.now() - timestamp >= GDPR_BANNER_TTL_MS;
  } catch {
    return true;
  }
}

function rememberGdprBannerSeen(): void {
  try {
    localStorage.setItem(GDPR_BANNER_KEY, String(Date.now()));
  } catch {
    /* ignore private-mode storage failures */
  }
}

export const GDPRBanner: React.FC = () => {
  const { updateGDPRPreferences } = useStore();
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(shouldShowGdprBanner());
  }, []);

  const dismissBanner = () => {
    rememberGdprBannerSeen();
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    updateGDPRPreferences({
      analytics: true,
      marketing: true,
      functional: true,
    });
    dismissBanner();
  };

  const handleAcceptEssential = () => {
    updateGDPRPreferences({
      analytics: false,
      marketing: false,
      functional: true,
    });
    dismissBanner();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-40 bg-[var(--color-bg-card)]/95 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start space-x-3">
        
        <div className="p-2 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center space-x-1.5">
              <span>{t('gdprBanner.title')}</span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 px-1.5 py-0.2 rounded font-normal">{t('gdprBanner.eurBadge')}</span>
            </h4>
            <button
              onClick={dismissBanner}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {t('gdprBanner.body')}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
            >
              {t('gdprBanner.acceptAll')}
            </button>

            <button
              onClick={handleAcceptEssential}
              className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] transition-all"
            >
              {t('gdprBanner.essentialOnly')}
            </button>

            <Link
              to="/privacy"
              onClick={dismissBanner}
              className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center space-x-1 underline ml-auto"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t('gdprBanner.customize')}</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
