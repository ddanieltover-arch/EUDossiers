import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Settings, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const GDPRBanner: React.FC = () => {
  const { updateGDPRPreferences } = useStore();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('gdpr_banner_dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleAcceptAll = () => {
    updateGDPRPreferences({
      analytics: true,
      marketing: true,
      functional: true,
    });
    sessionStorage.setItem('gdpr_banner_dismissed', 'true');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    updateGDPRPreferences({
      analytics: false,
      marketing: false,
      functional: true,
    });
    sessionStorage.setItem('gdpr_banner_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-40 bg-[var(--color-bg-card)]/95 border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start space-x-3">
        
        <div className="p-2 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center space-x-1.5">
              <span>EU GDPR Data Protection Notice</span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 px-1.5 py-0.2 rounded font-normal">EUR Settlement</span>
            </h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            We process your personal data under <strong>Regulation (EU) 2016/679</strong>. All prices are displayed in <strong>Euro (€)</strong> by default. You can customize cookie preferences or export your data anytime.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
            >
              Accept All Cookies
            </button>

            <button
              onClick={handleAcceptEssential}
              className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] transition-all"
            >
              Essential Only
            </button>

            <Link
              to="/privacy"
              onClick={() => setIsVisible(false)}
              className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center space-x-1 underline ml-auto"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
