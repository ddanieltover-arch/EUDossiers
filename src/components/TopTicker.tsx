import React from 'react';
import { ShieldCheck, Zap, Euro, Truck } from 'lucide-react';

export const TopTicker: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--color-ink-950)] via-[var(--color-accent-950)]/80 to-[var(--color-ink-950)] border-b border-[var(--color-accent-800)]/40 text-[11px] font-medium text-slate-300 py-1.5 px-4 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Highlight Badges */}
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-0.5">
          <span className="inline-flex items-center space-x-1.5 text-[var(--color-accent-300)] shrink-0 font-semibold">
            <span>🇪🇺</span>
            <span>European Union Official Document Portal</span>
          </span>

          <span className="hidden sm:inline-flex items-center space-x-1.5 text-emerald-400 shrink-0">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Automatic 5% Storewide Discount Active</span>
          </span>

          <span className="hidden md:inline-flex items-center space-x-1.5 text-blue-300 shrink-0">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>100% Database Registration (KBA • ANTS • fedpol • BRP)</span>
          </span>

          <span className="hidden lg:inline-flex items-center space-x-1.5 text-amber-300 shrink-0">
            <Truck className="w-3 h-3 text-amber-400" />
            <span>Express 72-Hour Courier Shipping</span>
          </span>
        </div>

        {/* Right Info */}
        <div className="hidden sm:flex items-center space-x-4 text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center space-x-1">
            <Euro className="w-3 h-3 text-[var(--color-accent-400)]" />
            <span>Settlement: <strong>EUR (€) Base</strong></span>
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
          <span className="text-emerald-400 font-medium">Node: DE-West (Frankfurt)</span>
        </div>

      </div>
    </div>
  );
};
