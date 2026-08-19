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
    <section className="bg-[var(--color-bg-secondary)]/60 border-y border-[var(--color-border)] py-12 my-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700/50 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fulfillment Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
            How Official Document Processing Works
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            A transparent 3-step pipeline ensuring complete database registration and secure single-market delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-border-subtle)] rounded-2xl p-6 relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[var(--color-accent-600)] bg-[var(--color-accent-50)] dark:bg-[var(--color-accent-800)]/20 border border-[var(--color-accent-500)]/30 px-2.5 py-1 rounded-lg">
                    {step.badge}
                  </span>
                  <span className="text-3xl font-black text-[var(--color-border)] group-hover:text-[var(--color-text-muted)] transition-colors font-display">
                    {step.number}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-600)]/20 to-[var(--color-bg-tertiary)] text-[var(--color-accent-600)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-600)] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-medium text-[var(--color-accent-600)] mt-0.5 mb-2">
                  {step.subtitle}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {step.description}
                </p>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[var(--color-border)]">
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
