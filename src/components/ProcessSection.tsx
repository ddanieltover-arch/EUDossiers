import React from 'react';
import { FileEdit, Database, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ProcessSection: React.FC = () => {
  const { t } = useTranslation('home');
  const steps = [
    {
      number: '01',
      title: t('process.step1Title'),
      subtitle: t('process.step1Subtitle'),
      description: t('process.step1Body'),
      icon: FileEdit,
      badge: t('process.step1Badge')
    },
    {
      number: '02',
      title: t('process.step2Title'),
      subtitle: t('process.step2Subtitle'),
      description: t('process.step2Body'),
      icon: Database,
      badge: t('process.step2Badge')
    },
    {
      number: '03',
      title: t('process.step3Title'),
      subtitle: t('process.step3Subtitle'),
      description: t('process.step3Body'),
      icon: Truck,
      badge: t('process.step3Badge')
    }
  ];

  return (
    <section className="bg-[var(--color-bg-secondary)]/60 border-y border-[var(--color-border)] py-12 my-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700/50 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('process.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
            {t('process.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            {t('process.subtitle')}
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
