import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from '../brand';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.139-1.633-.79-1.886-.88-.253-.09-.437-.139-.62.14-.184.279-.713.88-.873 1.061-.16.18-.32.202-.593.07-.274-.139-1.447-.533-2.757-1.7-1.019-.906-1.707-2.028-1.907-2.372-.2-.345-.021-.531.14-.7.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.62-1.493-.85-2.047-.224-.535-.45-.463-.62-.472l-.527-.01c-.187 0-.49.07-.746.35-.256.28-.98.958-.98 2.34 0 1.38 1.003 2.713 1.143 2.9.14.187 1.973 3.01 4.78 4.22.668.287 1.19.458 1.597.586.67.214 1.28.183 1.763.111.538-.08 1.633-.667 1.865-1.312.23-.645.23-1.197.16-1.312-.07-.114-.255-.18-.552-.32zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const FloatingActions: React.FC = () => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed right-4 z-50 flex flex-col items-end gap-3 bottom-24 md:bottom-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-lg hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-accent-500)]/50 transition-all flex items-center justify-center"
          aria-label={t('floating.backToTop', { defaultValue: 'Back to top' })}
          title={t('floating.backToTop', { defaultValue: 'Back to top' })}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 hover:bg-[#1ebe57] hover:scale-105 transition-all flex items-center justify-center"
        aria-label={t('floating.whatsapp', { defaultValue: 'Chat on WhatsApp' })}
        title={`${t('floating.whatsapp', { defaultValue: 'Chat on WhatsApp' })} · ${CONTACT_PHONE_DISPLAY}`}
      >
        <WhatsAppIcon className="w-6 h-6" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-2.5 py-1.5 text-[11px] font-semibold opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-md">
          {CONTACT_PHONE_DISPLAY}
        </span>
      </a>
    </div>
  );
};
