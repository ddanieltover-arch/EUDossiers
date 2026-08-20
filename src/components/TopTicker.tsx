import React from 'react';
import { ShieldCheck, Zap, Euro, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TickerContent: React.FC = () => {
  const { t } = useTranslation('home');
  return (
    <div className="flex items-center shrink-0 gap-8 px-4">
      <span className="inline-flex items-center space-x-1.5 text-[var(--color-accent-200)] shrink-0 font-semibold">
        <span>🇪🇺</span>
        <span>{t('ticker.portal')}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
      <span className="inline-flex items-center space-x-1.5 text-emerald-400 shrink-0">
        <Zap className="w-3 h-3 text-emerald-400" />
        <span>{t('ticker.discount')}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
      <span className="inline-flex items-center space-x-1.5 text-blue-300 shrink-0">
        <ShieldCheck className="w-3 h-3 text-blue-400" />
        <span>{t('ticker.registry')}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
      <span className="inline-flex items-center space-x-1.5 text-amber-300 shrink-0">
        <Truck className="w-3 h-3 text-amber-400" />
        <span>{t('ticker.shipping')}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
      <span className="inline-flex items-center space-x-1 text-slate-400 shrink-0">
        <Euro className="w-3 h-3 text-[var(--color-accent-400)]" />
        <span>{t('ticker.settlement')}</span>
      </span>
      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
      <span className="text-emerald-400 font-medium shrink-0">{t('ticker.node')}</span>
    </div>
  );
};

export const TopTicker: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-ink-950)] via-[var(--color-accent-800)]/80 to-[var(--color-ink-950)] border-b border-[var(--color-accent-800)]/40 text-[11px] font-medium text-slate-300 py-1.5 overflow-hidden shadow-inner">
      <div className="flex animate-ticker whitespace-nowrap hover:[animation-play-state:paused]">
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
};
