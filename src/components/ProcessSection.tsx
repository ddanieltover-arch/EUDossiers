import React from 'react';
import { FileEdit, Database, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Data & Photo Submission',
      subtitle: 'Biographical & Biometric Entry',
      description: 'Select your target document state and provide basic encrypted personal details, biometric passport photo, and signature sample via secure GDPR form.',
      icon: FileEdit,
      badge: 'Step 1 • Intake'
    },
    {
      number: '02',
      title: 'Database Registration',
      subtitle: 'Official Registry Insertion',
      description: 'Your document record is registered in national databases (KBA Flensburg, ANTS France, fedpol Switzerland, or BRP Netherlands) with ICAO microchip encoding.',
      icon: Database,
      badge: 'Step 2 • Registration'
    },
    {
      number: '03',
      title: 'Insured 72h Express Shipping',
      subtitle: 'Discrete Courier Delivery',
      description: 'Dispatched in discreet, tamper-evident packaging with real-time DHL Express tracking from our logistics hubs in Frankfurt, Amsterdam, or Lyon.',
      icon: Truck,
      badge: 'Step 3 • Fulfillment'
    }
  ];

  return (
    <section className="bg-slate-900/60 border-y border-slate-800/80 py-12 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-blue-900/30 text-blue-400 border border-blue-700/50 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fulfillment Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            How Official Document Processing Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A transparent 3-step pipeline ensuring complete database registration and secure single-market delivery.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[var(--color-accent-400)] bg-[var(--color-accent-950)] border border-[var(--color-accent-800)] px-2.5 py-1 rounded-lg">
                    {step.badge}
                  </span>
                  <span className="text-3xl font-black text-slate-800 group-hover:text-slate-700 transition-colors font-display">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-600)]/20 to-slate-800 text-[var(--color-accent-400)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-white group-hover:text-[var(--color-accent-300)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-medium text-[var(--color-accent-400)] mt-0.5 mb-2">
                  {step.subtitle}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow indicator between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
