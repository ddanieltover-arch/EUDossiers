import React from 'react';
import { Shield, Lock, Truck, Euro, CheckCircle, Cpu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrustSection: React.FC = () => {
  const { setIsGDPRModalOpen } = useStore();

  const trustPoints = [
    {
      title: 'Biometric & RFID Microchip Security',
      description: 'Built to full ICAO 9303 specs with contactless poly-carbonate chip encoding, laser photo engraving, tactile surface text, and UV watermark ink.',
      icon: Cpu,
      accent: 'text-blue-400',
      bg: 'bg-blue-900/20 border-blue-700/40'
    },
    {
      title: 'GDPR Article 15/17 Compliance',
      description: 'Your identity and transactional data are protected by strict EU privacy laws. Access instant DSAR data package downloads and immediate right-to-be-forgotten erasure.',
      icon: Lock,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-900/20 border-emerald-700/40'
    },
    {
      title: '72-Hour Express Courier Shipping',
      description: 'Insured dispatch from European logistics nodes in Frankfurt (DE-01), Amsterdam (NL-02), and Lyon (FR-03) with discrete tamper-evident packaging.',
      icon: Truck,
      accent: 'text-indigo-400',
      bg: 'bg-indigo-900/20 border-indigo-700/40'
    },
    {
      title: 'Single Market Euro (€) Settlement',
      description: 'Native Euro transaction processing with zero currency conversion surcharges, automatic destination VAT calculation, and transparent invoicing.',
      icon: Euro,
      accent: 'text-amber-400',
      bg: 'bg-amber-900/20 border-amber-700/40'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>EU Standards Guaranteed</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight font-display">
              Why European Clients Trust Eudossier
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Engineered for absolute legal compliance, biometric accuracy, and seamless single-market distribution.
            </p>
          </div>

          <button
            onClick={() => setIsGDPRModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all self-start md:self-auto flex items-center space-x-2"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Open GDPR Security Portal</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPoints.map((tp, i) => {
            const Icon = tp.icon;

            return (
              <div
                key={i}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-5 rounded-2xl space-y-3 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl ${tp.bg} border flex items-center justify-center ${tp.accent} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {tp.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {tp.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
