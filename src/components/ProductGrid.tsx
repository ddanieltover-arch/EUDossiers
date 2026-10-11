import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, RotateCcw, AlertCircle, Search, ShieldCheck, Tag, BookOpen, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { getLocalizedProductName } from '../data/productNameTranslations';
import { getLocalizedProductDescription } from '../data/productDescriptionTranslations';
import { BLOG_POSTS } from '../data/blogData';

const CATEGORIES = [
  'All',
  'Passports',
  'Driver Licenses',
  'Identity Cards',
  'Residence Permits',
  'EU Visas'
];

const CATEGORY_DESCRIPTIONS: Record<string, { title: string; subtitle: string; keywords: string[] }> = {
  'Identity Cards': {
    title: 'European Union & EEA National Identity Cards (CNIe, CIE 3.0, DNI 4.0)',
    subtitle: 'Official polycarbonate national electronic identity cards registered in central state records (ANTS, Ministero dell\'Interno, Policía Nacional, BRP). Equipped with high-security dual microchips, laser-engraved personal data, and full ICAO 9303 compliance for unconditional freedom of movement across 30 EEA Member States.',
    keywords: ['French CNIe', 'Italian CIE 3.0 (EEA ID)', 'Spanish DNI 4.0', 'Dutch Identiteitskaart', 'Belgian eID', 'Cédula de Francia']
  },
  'Passports': {
    title: 'Biometric Passports & ICAO 9303 Compliant e-Passports',
    subtitle: 'Full citizen biometric passports featuring contactless RFID microprocessors, Basic Access Control (BAC/PACE), 36 security-printed pages, and UV fluorescent security fibers. Valid for international travel, visa applications, and automated border control e-Gates globally.',
    keywords: ['Passeport Biométrique', 'Swiss Pass 22 (Fedpol)', 'Canadian e-Passport', 'Dutch Paspoort', 'Spanish Pasaporte', 'US Real-ID Passport']
  },
  'Residence Permits': {
    title: 'European Biometric Residence Permits (eAT & Uppehållstillståndskort)',
    subtitle: 'Contactless electronic residence titles authorized for legal stay and work across the European Union and Schengen Area. Featuring embedded biometric chips and direct indexing in immigration authorities (BAMF, Migrationsverket, Préfecture).',
    keywords: ['German eAT (Elektronischer Aufenthaltstitel)', 'Swedish Uppehållstillståndskort', 'Italian Permesso di Soggiorno UE', 'French Titre de Séjour']
  },
  'Driver Licenses': {
    title: 'Registered European Driver\'s Licenses (EU Führerschein & Permis de Conduire)',
    subtitle: 'Official credit-card format driving permits registered in national transport databases (KBA, ANTS, DGT, RDW). Fully compliant with EU Directive 2006/126/EC with 12 points initial balance and international driving endorsement.',
    keywords: ['Permis de Conduire (ANTS)', 'EU Führerschein (KBA)', 'Carné de Conducir (DGT)', 'Kørekort', 'Vezetői Engedély']
  },
  'EU Visas': {
    title: 'Multi-Entry Schengen EU Visas & Certified Financial Portfolios',
    subtitle: 'Official sticker visas valid across all 29 Schengen member states with verified embassy database registration, alongside certified multi-currency EU banking proof packages.',
    keywords: ['1-5 Year Multi-Entry Schengen Visa', 'Certified EU Bank Statement Package', 'Schengen Area Clearance']
  }
};

const ORIGINS = [
  'All',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Sweden',
  'Netherlands',
  'Switzerland',
  'Bulgaria',
  'Austria',
  'United States',
  'Denmark',
  'Hungary',
  'United Kingdom',
  'Canada',
  'Belgium',
  'Greece'
];

export const ProductGrid: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    products, 
    isLoadingProducts, 
    searchQuery, 
    setSearchQuery,
    selectedCategory, 
    setSelectedCategory,
    selectedOriginCountry,
    setSelectedOriginCountry,
    showOnlyInStock,
    setShowOnlyInStock
  } = useStore();

  // URL Sync with Category param
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam && CATEGORIES.includes(catParam) && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  // Update URL and Title when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All') {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', selectedCategory);
      setSearchParams(newParams, { replace: true });
      document.title = `${selectedCategory} Catalogue | Eudossier Europe`;
    } else if (searchParams.has('category')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams, { replace: true });
      document.title = 'Official European Document Catalogue | Eudossier Europe';
    }
  }, [selectedCategory]);

  const filteredProducts = products.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.startsWith('#') ? q.slice(1) : q;
      const localizedName = getLocalizedProductName(p, i18n.language).toLowerCase();
      const localizedDesc = getLocalizedProductDescription(p, i18n.language).toLowerCase();
      const matchName = p.name.toLowerCase().includes(cleanQ) || localizedName.includes(cleanQ);
      const matchDesc = p.description.toLowerCase().includes(cleanQ) || localizedDesc.includes(cleanQ);
      const matchSku = p.sku.toLowerCase().includes(cleanQ);
      const matchSupplier = p.supplierName.toLowerCase().includes(cleanQ);
      const matchTags = p.tags.some(tag => tag.toLowerCase().includes(cleanQ));
      const matchAliases = p.searchAliases?.some(alias => alias.toLowerCase().includes(cleanQ)) || false;

      // Multimodal visual query handler (GSC #1 queries)
      const isVisualQuery = ['picture', 'photo', 'có hình ảnh ko', 'ekta chobi dekhao', 'show me a photo', 'can i see a picture', 'specimen', 'sample', 'image'].some(vq => cleanQ.includes(vq));
      const matchVisual = isVisualQuery && Boolean(p.galleryImages && p.galleryImages.length > 0);

      if (!matchName && !matchDesc && !matchSku && !matchSupplier && !matchTags && !matchAliases && !matchVisual) return false;
    }
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedOriginCountry !== 'All' && p.originCountry !== selectedOriginCountry) return false;
    if (showOnlyInStock && p.totalStock <= 0) return false;
    return true;
  });

  const popularTags: string[] = Array.from(new Set<string>(products.flatMap(p => p.tags || []))).slice(0, 8);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedOriginCountry('All');
    setShowOnlyInStock(false);
  };

  const activeCategoryDesc = selectedCategory !== 'All' ? CATEGORY_DESCRIPTIONS[selectedCategory] : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Rich SEO Banner if filtered */}
      {activeCategoryDesc && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[var(--color-bg-secondary)] via-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] border border-[var(--color-accent-500)]/30 shadow-lg space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--color-accent-400)] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official EU & EEA Jurisdictional Category</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] font-display tracking-tight">
            {activeCategoryDesc.title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
            {activeCategoryDesc.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--color-border-subtle)]">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center space-x-1 mr-1">
              <Tag className="w-3 h-3" />
              <span>Target Series:</span>
            </span>
            {activeCategoryDesc.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[10px] bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] px-2.5 py-0.5 rounded-full font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div>
            <h2 className="text-xl font-black text-[var(--color-text-primary)] flex items-center space-x-2">
              <span>{activeCategoryDesc ? activeCategoryDesc.title.split('(')[0] : t('catalogue:title')}</span>
              <span className="text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-normal px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
                {t('catalogue:items', { count: filteredProducts.length })}
              </span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {activeCategoryDesc ? 'Browsing authentic specimens registered with issuing state registries.' : t('catalogue:subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            <select
              value={selectedOriginCountry}
              onChange={e => setSelectedOriginCountry(e.target.value)}
              className="bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="All">{t('catalogue:allOrigins')}</option>
              {ORIGINS.filter(o => o !== 'All').map(country => (
                <option key={country} value={country}>{t('product.madeIn', { country })}</option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border font-medium transition-all ${
                showOnlyInStock
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-[var(--color-bg-input)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${showOnlyInStock ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[var(--color-text-muted)]'}`}>
                {showOnlyInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>{t('catalogue:inStockOnly')}</span>
            </button>

            {(selectedCategory !== 'All' || selectedOriginCountry !== 'All' || showOnlyInStock || searchQuery) && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 bg-[var(--color-bg-input)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-3 py-2 rounded-xl border border-[var(--color-border)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('catalogue:reset')}</span>
              </button>
            )}

          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]'
                }`}
              >
                {t(`categories.${cat}`, { defaultValue: cat })}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 pt-1 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] shrink-0">{t('catalogue:popularTags')}</span>
          {popularTags.map(tag => {
            const isTagActive = searchQuery.toLowerCase().includes(tag.toLowerCase());
            return (
              <button
                key={tag}
                onClick={() => setSearchQuery(isTagActive ? '' : tag)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                  isTagActive
                    ? 'bg-blue-100 dark:bg-blue-900/80 border-blue-500 text-blue-700 dark:text-blue-200'
                    : 'bg-[var(--color-bg-secondary)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border)]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

      </div>

      {searchQuery && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-700 dark:text-blue-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              {t('catalogue:filtering', { query: searchQuery, count: filteredProducts.length })}
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-500 hover:text-blue-700 dark:hover:text-white font-medium underline transition-colors"
          >
            {t('catalogue:clearSearch')}
          </button>
        </div>
      )}

      {isLoadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl h-80"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{t('catalogue:emptyTitle')}</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            {t('catalogue:emptyBody')}
          </p>
          <button
            onClick={resetFilters}
            className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            {t('catalogue:clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Inbound Linking: Regulatory Knowledge Guides */}
      <section className="mt-14 pt-10 border-t border-[var(--color-border)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] font-display flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Document Compliance & Verification Guides
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Read technical specifications on French CNIe registration, ICAO 9303 biometric chip security, and European residence cards.
            </p>
          </div>
          <Link
            to="/blog"
            className="text-xs font-semibold text-indigo-500 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>All Articles ({BLOG_POSTS.length})</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLOG_POSTS.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              to={`/blog/${guide.slug}`}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-indigo-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-indigo-500">
                  {guide.category}
                </span>
                <h4 className="text-xs font-semibold text-[var(--color-text-primary)] mt-1 line-clamp-2 leading-snug">
                  {guide.title}
                </h4>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-2 line-clamp-2">
                  {guide.excerpt}
                </p>
              </div>
              <div className="mt-3 text-[11px] text-indigo-500 font-medium flex items-center gap-1">
                <span>Read Verification Guide</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Outbound Linking: Exactly 3 Authoritative European Regulatory & Verification Registers */}
      <section className="mt-8 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/40 space-y-3">
        <div className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
            Official European Regulatory & Verification Registers
          </h3>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          For technical standards, machine-readable specifications, and treaty provisions governing European civil documents, consult these sovereign and international regulatory bodies:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <a
            href="https://www.consilium.europa.eu/prado/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors">
                Council of the European Union (PRADO)
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              Public Register of Authentic Travel and Identity Documents Online, detailing official security features and tactile holograms across all 27 EU member states.
            </p>
          </a>

          <a
            href="https://www.icao.int/publications/pages/publication.aspx?docnum=9303"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors">
                ICAO Doc 9303 Standards
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              International Civil Aviation Organization standard governing Machine Readable Travel Documents (MRTDs), biometric contactless microchips, and optical MRZ zones.
            </p>
          </a>

          <a
            href="https://home-affairs.ec.europa.eu/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors">
                European Commission - Migration and Home Affairs
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              European Commission department responsible for EU policies on border management, Schengen Area travel rights, and document security.
            </p>
          </a>
        </div>
      </section>

    </section>
  );
};
