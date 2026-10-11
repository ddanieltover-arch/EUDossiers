import React from 'react';
import { Shield, Lock, Truck, Euro, CheckCircle, Cpu, ExternalLink, BookOpen, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS } from '../data/blogData';

export const TrustSection: React.FC = () => {
  const { t } = useTranslation('home');
  const trustPoints = [
    {
      title: t('trust.chipTitle'),
      description: t('trust.chipBody'),
      icon: Cpu,
      accent: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700/40'
    },
    {
      title: t('trust.gdprTitle'),
      description: t('trust.gdprBody'),
      icon: Lock,
      accent: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700/40'
    },
    {
      title: t('trust.shipTitle'),
      description: t('trust.shipBody'),
      icon: Truck,
      accent: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700/40'
    },
    {
      title: t('trust.eurTitle'),
      description: t('trust.eurBody'),
      icon: Euro,
      accent: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/40'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border)]">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-500 mb-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t('trust.badge')}</span>
            </div>
            <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
              {t('trust.title')}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-xl">
              {t('trust.subtitle')}
            </p>
          </div>

          <Link
            to="/privacy"
            className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all self-start md:self-auto flex items-center space-x-2"
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>{t('trust.gdprPortal')}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustPoints.map((tp, i) => {
            const Icon = tp.icon;

            return (
              <div
                key={i}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)]/30 p-5 rounded-2xl space-y-3 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl ${tp.bg} border flex items-center justify-center ${tp.accent} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors">
                  {tp.title}
                </h3>

                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {tp.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Inbound Linking: Regulatory Knowledge Guides & Sovereign Document Hub */}
        <div className="mt-8 pt-8 border-t border-[var(--color-border)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                European Legal Guides & Document Verification Hub
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Explore comprehensive technical analyses on French national ID cards, biometric passports, and EEA freedom of movement.
              </p>
            </div>
            <Link
              to="/blog"
              className="text-xs font-semibold text-blue-500 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore All Guides ({BLOG_POSTS.length})</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BLOG_POSTS.slice(0, 3).map((guide) => (
              <Link
                key={guide.slug}
                to={`/blog/${guide.slug}`}
                className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all block group"
              >
                <span className="text-[10px] font-mono font-semibold uppercase text-blue-500">
                  {guide.category}
                </span>
                <h4 className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mt-1 line-clamp-2 leading-snug">
                  {guide.title}
                </h4>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 line-clamp-2">
                  {guide.excerpt}
                </p>
              </Link>
            ))}
          </div>

          {/* Inbound Linking: Popular Sovereign Products */}
          <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500" />
              Verified Specimen Collections:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/catalogue/registered-french-id-card-carte-nationale-didentite-cnie"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-emerald-500 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                French ID Card (CNIe)
              </Link>
              <Link
                to="/catalogue/german-eu-residence-permit-elektronischer-aufenthaltstitel-eat"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-emerald-500 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                German eAT Card
              </Link>
              <Link
                to="/catalogue/registered-swiss-biometric-passport-passeport-suisse"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-emerald-500 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Swiss Pass 22
              </Link>
              <Link
                to="/catalogue/italian-electronic-id-card-carta-didentita-cie"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-emerald-500 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Italian CIE 3.0
              </Link>
            </div>
          </div>
        </div>

        {/* Outbound Linking: Exactly 3 Authoritative European Regulatory & Verification Registers */}
        <div className="mt-6 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/50 space-y-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Official European Regulatory & Verification Authorities
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            All registered document specifications, biometric architectures, and data handling standards correspond with European Union statutory registers:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <a
              href="https://www.consilium.europa.eu/prado/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group text-xs"
            >
              <div className="flex items-center justify-between font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500">
                <span>Council of the EU (PRADO)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Public Register of Authentic Travel and Identity Documents Online.
              </p>
            </a>

            <a
              href="https://edpb.europa.eu/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group text-xs"
            >
              <div className="flex items-center justify-between font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500">
                <span>European Data Protection Board</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Independent EU body ensuring GDPR consistency across Member States.
              </p>
            </a>

            <a
              href="https://www.icao.int/publications/pages/publication.aspx?docnum=9303"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group text-xs"
            >
              <div className="flex items-center justify-between font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500">
                <span>ICAO Doc 9303 MRTD Standard</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Global technical standard for biometric machine-readable travel documents.
              </p>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
