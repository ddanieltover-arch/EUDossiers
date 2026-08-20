import React from 'react';
import { ShieldCheck, Truck, ArrowRight, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const HeroBanner: React.FC = () => {
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  return (
    <div className="relative text-white overflow-hidden border-b border-[var(--color-ink-700)]">
      <div className="absolute inset-0">
        <img
          src="/hero-eu-regulations.png"
          alt=""
          className="h-full w-full object-cover object-[center_40%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-950)] via-[var(--color-ink-950)]/88 to-[var(--color-ink-950)]/45"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-950)] via-[var(--color-ink-950)]/35 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-800)]/35 via-transparent to-amber-500/15"
          aria-hidden
        />
      </div>
      <div className="absolute -top-24 left-0 w-96 h-96 bg-[var(--color-accent-600)]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[28rem] h-[28rem] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="space-y-5">
            <div className="inline-flex items-center space-x-2 bg-[var(--color-accent-800)]/40 border border-[var(--color-accent-700)]/60 px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-accent-200)]">
              <span>🇪🇺</span>
              <span>{t('hero.badge')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display">
              {t('hero.titleLine1')} <br />
              <span className="bg-gradient-to-r from-[var(--color-accent-500)] via-[var(--color-accent-200)] to-[var(--color-paper-100)] bg-clip-text text-transparent">
                {t('hero.titleLine2')}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/catalogue"
                className="bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-[var(--color-accent-600)]/30 flex items-center space-x-2 transition-all"
              >
                <span>{tc('actions.browseCatalogue')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-950/55 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="p-2 bg-[var(--color-accent-600)]/20 text-[var(--color-accent-500)] rounded-lg shrink-0">
                  <Euro className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('hero.eurStandard')}</h4>
                  <p className="text-[11px] text-slate-400">{t('hero.eurStandardDesc')}</p>
                </div>
              </div>

              <div className="bg-slate-950/55 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('hero.gdpr')}</h4>
                  <p className="text-[11px] text-slate-400">{t('hero.gdprDesc')}</p>
                </div>
              </div>

              <div className="bg-slate-950/55 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-start space-x-2.5">
                <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('hero.logistics')}</h4>
                  <p className="text-[11px] text-slate-400">{t('hero.logisticsDesc')}</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
