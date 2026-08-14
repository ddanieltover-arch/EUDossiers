import React from 'react';
import { ShieldCheck, Truck, Sparkles, ArrowRight, Euro } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { selectedCountry, setIsLocalizationModalOpen, setIsGDPRModalOpen, setViewMode } = useStore();

  return (
    <div className="relative bg-gradient-to-br from-[var(--color-ink-950)] via-[var(--color-ink-900)] to-[var(--color-ink-700)] text-white overflow-hidden border-b border-[var(--color-ink-700)]">
      
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-accent-600)]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--color-ink-500)]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Headline & Value Props */}
          <div className="lg:col-span-8 space-y-5">
            
            <div className="inline-flex items-center space-x-2 bg-[var(--color-accent-800)]/40 border border-[var(--color-accent-700)]/60 px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-accent-200)]">
              <span>🇪🇺</span>
              <span>Based in Europe • Single Market Logistics</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display">
              Official EU Documents &amp; <br />
              <span className="bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-200)] to-[var(--color-paper-100)] bg-clip-text text-transparent">
                Registered Dossier Solutions.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Order registered European passports, driver's licenses, national ID cards, Schengen visas, and EU residence permits. All orders are settled in <strong>Euro (€)</strong> with biometric database registration and express 72-hour courier delivery across all 27 EU member states.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setViewMode('storefront')}
                className="bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-[var(--color-accent-600)]/30 flex items-center space-x-2 transition-all"
              >
                <span>Browse Full Product Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              
              <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="p-2 bg-[var(--color-accent-600)]/20 text-[var(--color-accent-500)] rounded-lg shrink-0">
                  <Euro className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Euro (€) Standard</h4>
                  <p className="text-[11px] text-slate-400">Zero currency markups or hidden forex fees.</p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">GDPR Compliant</h4>
                  <p className="text-[11px] text-slate-400">Instant DSAR data exports & erasure tools.</p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">EU Green Logistics</h4>
                  <p className="text-[11px] text-slate-400">Frankfurt, Amsterdam & Lyon warehouse hubs.</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Info Card: Localized EU Summary */}
          <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/90 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your EU Delivery Profile</span>
              <button 
                onClick={() => setIsLocalizationModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline"
              >
                Change
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Destination:</span>
                <span className="font-semibold text-white flex items-center space-x-1">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Destination VAT Rate:</span>
                <span className="font-bold text-blue-300">
                  {(selectedCountry.vatRate * 100).toFixed(1)}% (Included)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Standard EU Express:</span>
                <span className="text-emerald-400 font-semibold">Free on orders &gt; €150</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-700/60">
                <span className="text-slate-400">Privacy Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>EU Protected</span>
                </span>
              </div>

            </div>

            <button
              onClick={() => setIsGDPRModalOpen(true)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Inspect GDPR Rights &amp; Data Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
