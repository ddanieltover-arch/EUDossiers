import React, { useState } from 'react';
import { Mail, MapPin, Clock, Phone, Send, CheckCircle, Globe } from 'lucide-react';
import { SITE_NAME, CONTACT_EMAIL, PRIVACY_EMAIL, ADDRESS_LINE, DOMAIN } from '../brand';

const ContactPage: React.FC = () => {
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
        throw new Error(data.error || 'Failed to send your message. Please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] font-display">
          Contact Us
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Have a question about your order, our documents catalogue, or GDPR data requests? Our EU-based team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-[var(--color-accent-500)] mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">General Enquiries</h3>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-[var(--color-accent-500)] hover:underline">{CONTACT_EMAIL}</a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Privacy & GDPR (DSAR)</h3>
                <a href={`mailto:${PRIVACY_EMAIL}`} className="text-sm text-emerald-500 hover:underline">{PRIVACY_EMAIL}</a>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">For data access, erasure, or portability requests under GDPR Art. 15–20.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[var(--color-accent-500)] mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Phone</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">+49 30 123 456 78</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Mon–Fri, 09:00–17:00 CET</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[var(--color-accent-500)] mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Office Address</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {SITE_NAME} GmbH<br />
                  Friedrichstraße 123<br />
                  10117 Berlin, {ADDRESS_LINE}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-[var(--color-accent-500)] mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Website</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{DOMAIN}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[var(--color-accent-500)] mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-[var(--color-text-primary)]">Business Hours</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Monday – Friday: 09:00 – 17:00 CET</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Responses within 1–2 business days.</p>
              </div>
            </div>

          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
            <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">🇪🇺 EU Data Protection</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              All data submitted through this form is processed in accordance with Regulation (EU) 2016/679 (GDPR). Your personal data is stored on EU-based servers in Frankfurt, Germany and will only be used to respond to your enquiry. You may request deletion at any time.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-[var(--color-bg-secondary)] border border-emerald-500/30 rounded-2xl p-10 text-center space-y-4">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Message Sent Successfully</h2>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto">
                Thank you for reaching out. Our team will review your message and respond within 1–2 business days via the email address you provided.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="mt-4 px-5 py-2 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Full Name *</label>
                  <input
                    id="name" name="name" required value={form.name} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition"
                    placeholder="e.g. Max Mustermann"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Email Address *</label>
                  <input
                    id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition"
                    placeholder="you@example.eu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Subject *</label>
                <select
                  id="subject" name="subject" required value={form.subject} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition"
                >
                  <option value="">Select a topic…</option>
                  <option value="order">Order Enquiry</option>
                  <option value="product">Product Information</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="gdpr">GDPR / Data Privacy Request</option>
                  <option value="partnership">Business & Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Message *</label>
                <textarea
                  id="message" name="message" required rows={5} value={form.message} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)] transition resize-none"
                  placeholder="Tell us how we can help…"
                />
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)]">
                By submitting this form you agree to our processing of the data you provide solely for the purpose of responding to your enquiry, in accordance with our Privacy Policy and GDPR Art. 6(1)(b).
              </p>

              {error && (
                <p className="text-sm text-rose-500" role="alert">{error}</p>
              )}

              <button
                type="submit" disabled={sending}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--color-accent-500)] hover:bg-[var(--color-accent-600)] disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center space-x-2"
              >
                {sending ? (
                  <span>Sending…</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
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
