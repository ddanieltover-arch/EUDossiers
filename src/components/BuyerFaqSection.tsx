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
    question: 'How to buy registered documents in Netherlands and Europe?',
    answer: 'Buying official registered documents through Eudossier follows a secure 3-step protocol: 1) Select your target document from our catalogue (Dutch ID card, EU driver\'s license, or biometric passport); 2) Submit encrypted personal details, biometric photograph, and signature through our GDPR-compliant intake form; 3) Our legal specialists register the record into national databases (such as BRP Netherlands, KBA Germany, or ANTS France) and produce the physical polycarbonate credential with microchip encoding before insured courier dispatch.',
    countryBadge: '🇳🇱 Netherlands',
    category: 'How to Buy'
  },
  {
    question: 'Where can I buy official EU passports, IDs, and driver\'s licenses in Netherlands, UK, or Germany?',
    answer: 'You can order safely online via Eudossier\'s European single-market portal. All orders are fulfilled through our dedicated European logistics nodes: Amsterdam Logistics Hub (NL-02), Frankfurt Hub (DE-01), and Lyon Fulfillment (FR-03). We deliver directly to your doorstep in Amsterdam, Rotterdam, The Hague, London, Manchester, Berlin, Munich, Rome, Milan, Paris, and all EU member states with discrete, tamper-evident packaging.',
    countryBadge: '🇪🇺 Netherlands / UK / DE',
    category: 'Where to Buy'
  },
  {
    question: 'How much for registered EU documents in Netherlands, UK, Germany, and Italy?',
    answer: 'All pricing is fully transparent with an automatic 5% store discount applied: National ID Cards (such as Dutch Identiteitskaart, French CNIe, Belgian eID) start from €389.50; Registered Driver\'s Licenses (Bulgarian, German EU Führerschein, French Permis de Conduire) start from €427.50; Biometric Passports (Dutch, UK, French, German) range from €750.50 to €779.00; and Schengen EU Residence Permits start from €617.50. Base prices are settled in Euro (€) with zero hidden currency exchange fees, standard VAT included, and insured 72-hour DHL Express delivery.',
    countryBadge: '💶 Pricing Guide',
    category: 'How Much For'
  },
  {
    question: 'How to buy a registered driver\'s license in Germany, France, or Netherlands without test delays?',
    answer: 'If you need an authentic European driving permit quickly, our fast-track service registers your driving profile directly in national transport registries (KBA Flensburg in Germany, ANTS in France, or RDW in Netherlands). The card is manufactured to EU Directive 2006/126/EC specifications with 12 points initial balance, tactile surface features, and laser engraving.',
    countryBadge: '🇩🇪 Germany / FR / NL',
    category: 'How to Buy'
  },
  {
    question: 'Where can I buy a registered UK or European passport with biometric chip verification?',
    answer: 'Original registered passports—including HM Passport Office UK passports, Dutch Nederlands Paspoort, French Passeport Biométrique, and German Reisepass—can be purchased directly on Eudossier. Each passport features ICAO 9303 compliant polycarbonate data pages, embedded contactless RFID/NFC chips with PACE/BAC encryption, and full registration in national citizen registries.',
    countryBadge: '🇬🇧 UK / EU',
    category: 'Where to Buy'
  },
  {
    question: 'How much for express courier delivery to Netherlands, UK, Italy, or Spain?',
    answer: 'Insured 72-hour express courier delivery is included with every registered document order. Shipments are dispatched from our nearest warehouse hub (Amsterdam NL-02 for Benelux & UK; Frankfurt DE-01 for Central Europe; Lyon FR-03 for Southern Europe) with real-time end-to-end tracking and guaranteed discrete customs clearance.',
    countryBadge: '📦 Shipping & Delivery',
    category: 'How Much For'
  },
  {
    question: 'What national databases are documents registered in across European countries?',
    answer: 'Every document ordered through Eudossier receives legitimate database entry: Netherlands records are registered in the Basisregistratie Personen (BRP); German documents in the Kraftfahrt-Bundesamt (KBA) and Einwohnermeldeamt; French credentials in the Agence Nationale des Titres Sécurisés (ANTS); Italian IDs in Ministero dell\'Interno records; and UK passports with HMPO verification.',
    countryBadge: '🏛️ Registry Databases',
    category: 'Verification'
  },
  {
    question: 'Can I inspect high-definition specimen photos and UV scans before dispatch?',
    answer: 'Yes. Before final courier dispatch, you receive high-resolution photographic proofs and video inspection demonstrating holographic optical variable ink (OVI), UV blacklight fluorescence, micro-text printing, and NFC microchip reader response.',
    countryBadge: '🔍 Specimen Proof',
    category: 'Verification'
  }
];

export const BuyerFaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2]);

  const categories = ['All', 'How to Buy', 'Where to Buy', 'How Much For', 'Verification'];

  const filteredFaqs = activeCategory === 'All' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === activeCategory);

  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="buyer-faq" aria-label="European Buyer Guide & FAQ" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border)] pb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>European Purchasing Guide & Buyer Queries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
              How to Buy, Where to Buy & Document Pricing in Europe
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 max-w-2xl leading-relaxed">
              Essential buyer information covering order intake, registration databases (BRP, KBA, ANTS), delivery hubs in Amsterdam and Frankfurt, and transparent Euro (€) pricing across Netherlands, UK, Germany, Italy, France, and Spain.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0 self-start md:self-auto"
          >
            <span>Browse Full Catalogue</span>
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
