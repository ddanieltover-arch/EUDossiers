import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Compass, MapPin, Euro, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
  countryBadge: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What administrative documentation services does Eudossier provide?',
    answer: 'Eudossier provides European administrative guidance, dossier preparation assistance, regulatory compliance research, and logistical support for international documentation across EU member states. We help clients navigate European document formats and administrative requirements.',
    countryBadge: '🇪🇺 European Union',
    category: 'Services'
  },
  {
    question: 'How are document dossier requests processed?',
    answer: 'Clients submit their administrative requirements and specifications through our secure intake form. Our specialists examine the statutory criteria, formatting guidelines, and required attachments to assemble a structured, compliant administrative dossier.',
    countryBadge: '📋 Process',
    category: 'How It Works'
  },
  {
    question: 'Are commercial catalogue listings currently available for purchase?',
    answer: 'Commercial document listings are currently undergoing rigorous compliance and regulatory review to ensure complete accuracy and statutory substantiation. During this review period, online purchasing is temporarily suspended, while technical specifications and regulatory guides remain fully accessible.',
    countryBadge: '⚖️ Compliance Notice',
    category: 'Compliance'
  },
  {
    question: 'What standards govern European identity documents and biometric passports?',
    answer: 'European civil documents adhere to strict international standards including ICAO Document 9303 specifications, European Union Regulation (EU) 2019/1157 for national identity cards, and EU Directive 2006/126/EC for driving licenses.',
    countryBadge: '🏛️ Standards',
    category: 'Standards'
  },
  {
    question: 'How does Eudossier protect client personal data?',
    answer: 'All data processing is governed by strict adherence to the General Data Protection Regulation (GDPR Articles 15 & 17). Data is securely handled with end-to-end encryption, and clients can access immediate Data Subject Access Request (DSAR) downloads and right-to-be-forgotten erasure at any time.',
    countryBadge: '🔒 Data Privacy',
    category: 'Privacy'
  },
  {
    question: 'Where can I find detailed guides on European document verification and specifications?',
    answer: 'Eudossier maintains a comprehensive library of 30 educational and technical guides authored by regulatory specialists. Explore our Regulatory Hub to review biometric security features, optical variable ink, and European civil document standards.',
    countryBadge: '📚 Regulatory Hub',
    category: 'Guides'
  }
];

export const BuyerFaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2]);

  const categories = ['All', 'Services', 'How It Works', 'Compliance', 'Standards', 'Privacy', 'Guides'];

  const filteredFaqs = activeCategory === 'All' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="buyer-faq" aria-label="European Documentation FAQ" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border)] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>European Administrative Guidance &amp; FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
              European Document Services &amp; Administrative FAQ
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 max-w-2xl leading-relaxed">
              Essential guidance covering administrative dossier preparation, European document standards, compliance policies, and data privacy rights across the European Union.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0 self-start md:self-auto"
          >
            <span>Browse Document Specifications</span>
            <span>→</span>
          </Link>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-6 pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-blue-400/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="border border-[var(--color-border)] bg-[var(--color-bg-primary)] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {faq.countryBadge}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[var(--color-border)]/60 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Hub Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center space-x-3 p-3 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)]">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[var(--color-text-primary)] block">Amsterdam Logistics (NL-02)</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">Serving Netherlands, UK & Benelux</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)]">
            <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[var(--color-text-primary)] block">Frankfurt Central Hub (DE-01)</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">Serving Germany, Austria & Nordics</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)]">
            <Euro className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[var(--color-text-primary)] block">Lyon Fulfillment Hub (FR-03)</span>
              <span className="text-[11px] text-[var(--color-text-muted)]">Serving France, Italy & Spain</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
