import React, { useState } from 'react';
import { Mail, MapPin, Clock, Phone, Send, CheckCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SITE_NAME, CONTACT_EMAIL, PRIVACY_EMAIL, ADDRESS_LINE, DOMAIN } from '../brand';

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
                <p className="text-sm text-white/95">+49 30 123 456 78</p>
                <p className="text-xs text-white/75 mt-0.5">{t('phoneHours')}</p>
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
