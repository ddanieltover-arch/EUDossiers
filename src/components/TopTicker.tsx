import React from 'react';
import { ShieldCheck, Zap, Euro, Truck } from 'lucide-react';

const TickerContent: React.FC = () => (
  <div className="flex items-center shrink-0 gap-8 px-4">
    <span className="inline-flex items-center space-x-1.5 text-[var(--color-accent-200)] shrink-0 font-semibold">
      <span>🇪🇺</span>
      <span>European Union Official Document Portal</span>
    </span>

    <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />

    <span className="inline-flex items-center space-x-1.5 text-emerald-400 shrink-0">
      <Zap className="w-3 h-3 text-emerald-400" />
      <span>Automatic 5% Storewide Discount Active</span>
    </span>

    <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />

    <span className="inline-flex items-center space-x-1.5 text-blue-300 shrink-0">
      <ShieldCheck className="w-3 h-3 text-blue-400" />
      <span>100% Database Registration (KBA • ANTS • fedpol • BRP)</span>
    </span>

    <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />

    <span className="inline-flex items-center space-x-1.5 text-amber-300 shrink-0">
      <Truck className="w-3 h-3 text-amber-400" />
      <span>Express 72-Hour Courier Shipping</span>
    </span>

    <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />

    <span className="inline-flex items-center space-x-1 text-slate-400 shrink-0">
      <Euro className="w-3 h-3 text-[var(--color-accent-400)]" />
      <span>Settlement: <strong>EUR (€) Base</strong></span>
    </span>

    <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />

    <span className="text-emerald-400 font-medium shrink-0">Node: DE-West (Frankfurt)</span>
  </div>
);

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
