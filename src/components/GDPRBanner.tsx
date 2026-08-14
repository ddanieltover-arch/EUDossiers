import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Settings, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const GDPRBanner: React.FC = () => {
  const { setIsGDPRModalOpen, updateGDPRPreferences } = useStore();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // Check if user already dismissed banner in current session
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-40 bg-slate-900/95 border border-slate-700/90 text-slate-100 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start space-x-3">
        
        <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <span>EU GDPR Data Protection Notice</span>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded font-normal">EUR Settlement</span>
            </h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
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
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              Essential Only
            </button>

            <button
              onClick={() => {
                setIsGDPRModalOpen(true);
                setIsVisible(false);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 underline ml-auto"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
