import React, { useState } from 'react';
import { Mail, MapPin, Clock, Phone, Send, CheckCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_NAME, CONTACT_EMAIL, PRIVACY_EMAIL, ADDRESS_LINE, DOMAIN, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164, WHATSAPP_URL } from '../brand';

const ContactPage: React.FC = () => {
  const { t } = useTranslation('contact');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || t('error'));
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] font-display">
          {t('title')}
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <div className="flex-1 flex flex-col bg-[#04928F] rounded-2xl p-6 space-y-5 text-white shadow-lg shadow-[#04928F]/25">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{t('general')}</h3>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-white hover:underline">{CONTACT_EMAIL}</a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{t('privacyTitle')}</h3>
                <a href={`mailto:${PRIVACY_EMAIL}`} className="text-sm text-white hover:underline">{PRIVACY_EMAIL}</a>
                <p className="text-xs text-white/75 mt-0.5">{t('privacyHint')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{t('phone')}</h3>
                <a href={`tel:${CONTACT_PHONE_E164}`} className="text-sm text-white hover:underline">
                  {CONTACT_PHONE_DISPLAY}
                </a>
                <p className="text-xs text-white/75 mt-0.5">{t('phoneHours')}</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/25 rounded-lg px-2.5 py-1.5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.139-1.633-.79-1.886-.88-.253-.09-.437-.139-.62.14-.184.279-.713.88-.873 1.061-.16.18-.32.202-.593.07-.274-.139-1.447-.533-2.757-1.7-1.019-.906-1.707-2.028-1.907-2.372-.2-.345-.021-.531.14-.7.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.62-1.493-.85-2.047-.224-.535-.45-.463-.62-.472l-.527-.01c-.187 0-.49.07-.746.35-.256.28-.98.958-.98 2.34 0 1.38 1.003 2.713 1.143 2.9.14.187 1.973 3.01 4.78 4.22.668.287 1.19.458 1.597.586.67.214 1.28.183 1.763.111.538-.08 1.633-.667 1.865-1.312.23-.645.23-1.197.16-1.312-.07-.114-.255-.18-.552-.32zm-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{t('office')}</h3>
                <p className="text-sm text-white/95">
                  {SITE_NAME} GmbH<br />
                  Friedrichstraße 123<br />
                  10117 Berlin, {ADDRESS_LINE}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{t('website')}</h3>
                <p className="text-sm text-white/95">{DOMAIN}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-white/90 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm">{t('hours')}</h3>
                <p className="text-sm text-white/95">{t('hoursValue')}</p>
                <p className="text-xs text-white/75 mt-0.5">{t('hoursHint')}</p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/20 space-y-2">
              <h3 className="font-bold text-sm">🇪🇺 {t('euTitle')}</h3>
              <p className="text-xs text-white/80 leading-relaxed">{t('euBody')}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 h-full">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center bg-[var(--color-bg-secondary)] border border-emerald-500/30 rounded-2xl p-10 text-center space-y-4">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{t('success')}</h2>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">{t('successBody')}</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-4 px-5 py-2 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {t('sendAnother')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="h-full flex flex-col bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{t('formTitle')}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('name')} *</label>
                  <input
                    id="name" name="name" required value={form.name} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition"
                    placeholder={t('placeholderName')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('email')} *</label>
                  <input
                    id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition"
                    placeholder="you@example.eu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('subject')} *</label>
                <select
                  id="subject" name="subject" required value={form.subject} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition"
                >
                  <option value="">{t('selectTopic')}</option>
                  <option value="order">{t('subjects.order')}</option>
                  <option value="product">{t('subjects.product')}</option>
                  <option value="shipping">{t('subjects.shipping')}</option>
                  <option value="returns">{t('subjects.returns')}</option>
                  <option value="gdpr">{t('subjects.gdpr')}</option>
                  <option value="partnership">{t('subjects.partnership')}</option>
                  <option value="other">{t('subjects.other')}</option>
                </select>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <label htmlFor="message" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">{t('message')} *</label>
                <textarea
                  id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
                  className="w-full flex-1 min-h-[8rem] px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition resize-none"
                  placeholder={t('placeholderMessage')}
                />
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)]">{t('consent')}</p>

              {error && (
                <p className="text-sm text-rose-500" role="alert">{error}</p>
              )}

              <button
                type="submit" disabled={sending}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center space-x-2"
              >
                {sending ? (
                  <span>{t('sending')}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('send')}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
