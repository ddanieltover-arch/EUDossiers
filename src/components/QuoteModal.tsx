import React, { useState, useEffect } from 'react';
import { X, Mail, Send, CheckCircle2, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_DIGITS } from '../brand';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.139-1.633-.79-1.886-.88-.253-.09-.437-.139-.62.14-.184.279-.713.88-.873 1.061-.16.18-.32.202-.593.07-.274-.139-1.447-.533-2.757-1.7-1.019-.906-1.707-2.028-1.907-2.372-.2-.345-.021-.531.14-.7.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.62-1.493-.85-2.047-.224-.535-.45-.463-.62-.472l-.527-.01c-.187 0-.49.07-.746.35-.256.28-.98.958-.98 2.34 0 1.38 1.003 2.713 1.143 2.9.14.187 1.973 3.01 4.78 4.22.668.287 1.19.458 1.597.586.67.214 1.28.183 1.763.111.538-.08 1.633-.667 1.865-1.312.23-.645.23-1.197.16-1.312-.07-.114-.255-.18-.552-.32zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const QuoteModal: React.FC = () => {
  const { isQuoteModalOpen, closeQuoteModal, quoteProduct } = useStore();
  const { t } = useTranslation('common');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [country, setCountry] = useState('Germany');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuoteModalOpen) {
        closeQuoteModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuoteModalOpen, closeQuoteModal]);

  // Reset state when opening a new product
  useEffect(() => {
    if (isQuoteModalOpen) {
      setSubmitted(false);
      setError(null);
      setSending(false);
    }
  }, [isQuoteModalOpen, quoteProduct]);

  if (!isQuoteModalOpen || !quoteProduct) return null;

  // Build WhatsApp pre-filled message URL
  const buildWhatsAppUrl = () => {
    const lines = [
      `Hello Eudossier,`,
      ``,
      `I would like to request a quotation and dossier information for:`,
      `• Product: ${quoteProduct.name}`,
      `• SKU: ${quoteProduct.sku}`,
      `• Reference Price: €${quoteProduct.priceEUR.toFixed(2)}`,
      `• Desired Quantity: ${quantity}`,
      `• Destination: ${country}`,
      phone ? `• Contact Phone: ${phone}` : null,
      notes ? `• Special Notes: ${notes}` : null,
      ``,
      `Please provide formal quotation and delivery lead times.`,
    ].filter(Boolean);

    const message = lines.join('\n');
    return `https://wa.me/${CONTACT_PHONE_DIGITS}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const composedMessage = [
      `[QUOTE REQUEST FOR ${quoteProduct.name}]`,
      `SKU: ${quoteProduct.sku}`,
      `Reference Price: €${quoteProduct.priceEUR.toFixed(2)}`,
      `Quantity: ${quantity}`,
      `Destination Country: ${country}`,
      phone ? `Contact Phone/WhatsApp: ${phone}` : null,
      ``,
      `Client Message:`,
      notes.trim() || 'Please provide quotation, availability, and processing timeline.',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: 'quote',
          message: composedMessage,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request. Please try WhatsApp or email info@eudossier.eu.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeQuoteModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      <div className="relative w-full max-w-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div>
            <h2 id="quote-modal-title" className="text-lg font-bold text-[var(--color-text-primary)]">
              {t('actions.getQuote', { defaultValue: 'Request a Quote' })}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Official document dossier & compliance verification enquiry
            </p>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="px-6 py-4 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)] flex items-center gap-4">
          <img
            src={quoteProduct.imageUrl}
            alt={quoteProduct.name}
            className="w-16 h-16 object-cover rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/catalogue/default-specimen.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
              SKU: {quoteProduct.sku} · {quoteProduct.originCountry}
            </div>
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] truncate">
              {quoteProduct.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm font-extrabold text-[var(--color-text-primary)]">
                €{quoteProduct.priceEUR.toFixed(2)}
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Ref. Price (VAT included)
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  Quote Request Received!
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
                  Thank you, <strong className="text-[var(--color-text-primary)]">{name}</strong>. Our dossier and compliance team will review your specifications and send a formal quotation to <strong className="text-[var(--color-text-primary)]">{email}</strong> within 2–4 business hours.
                </p>
              </div>

              <div className="p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-left space-y-2 text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Immediate Team Notification Logged</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Express response via verified European logistics desks</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Also Follow Up on WhatsApp</span>
                </a>
                <button
                  onClick={closeQuoteModal}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-semibold text-xs border border-[var(--color-border)] transition-colors cursor-pointer"
                >
                  Back to Catalogue
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Option 1: WhatsApp Quick Quote */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                      <span>Instant Quote via WhatsApp</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      Connect directly with our dossier advisers on WhatsApp ({CONTACT_PHONE_DISPLAY}) for instant availability and formal pricing.
                    </p>
                  </div>
                </div>

                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5 shrink-0" />
                  <span>Chat & Request Quote on WhatsApp</span>
                </a>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[var(--color-border)]"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Or Send Directly to Our Email
                </span>
                <div className="flex-grow border-t border-[var(--color-border)]"></div>
              </div>

              {/* Option 2: Direct Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jean Dupont"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. contact@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Phone / WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 155..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                      Destination Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Germany, France"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                    Special Requirements or Questions
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify any express delivery requirements, document verification parameters, or additional questions..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 px-4 rounded-xl bg-[#04928F] hover:bg-[#037A77] disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#04928F]/25 transition-all cursor-pointer"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Quote Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Quote Request by Email</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
