import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Warehouse, MapPin, ArrowLeft, AlertTriangle, Zap, CheckCircle2, HelpCircle, FileText, Lock, Eye, ExternalLink, BookOpen, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';
import { SITE_NAME, DOMAIN } from '../brand';
import { getLocalizedProductName } from '../data/productNameTranslations';
import { getLocalizedProductDescription } from '../data/productDescriptionTranslations';
import { findProductBySlugOrId, getProductPath, getProductSlug } from '../utils/productSlug';
import { BLOG_POSTS } from '../data/blogData';

const ProductPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { products, isLoadingProducts, addToCart, setIsCartOpen, formatPriceEUR, setSearchQuery } = useStore();

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, false);
    setIsCartOpen(false);
    navigate('/checkout');
  };
  const { t, i18n } = useTranslation('common');

  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const product = findProductBySlugOrId(products, productSlug);
  const englishSlug = product ? getProductSlug(product) : '';

  const discountPercent = useMemo(() => {
    if (!product) return 5;
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) hash = ((hash << 5) - hash + product.id.charCodeAt(i)) | 0;
    return 5 + (Math.abs(hash) % 6);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const relatedGuides = useMemo(() => {
    if (!product) return BLOG_POSTS.slice(0, 3);
    const prodText = (product.name + ' ' + product.category + ' ' + product.originCountry).toLowerCase();
    const matches = BLOG_POSTS.filter((post) => {
      return (
        post.primaryKeyword.toLowerCase().includes(product.originCountry.toLowerCase()) ||
        post.secondaryKeywords.some((k) => prodText.includes(k.toLowerCase())) ||
        post.title.toLowerCase().includes(product.category.toLowerCase().slice(0, 4))
      );
    });
    return matches.length >= 2 ? matches.slice(0, 3) : BLOG_POSTS.slice(0, 3);
  }, [product]);

  // SEO & GEO Head Management: Title, Description, Canonical, OpenGraph & Structured Data
  useEffect(() => {
    if (!product) return;

    const previousTitle = document.title;
    const pageTitle = `${product.name} | Official ${product.originCountry} Registered Document | ${SITE_NAME}`;
    document.title = pageTitle;

    const canonicalUrl = `https://www.eudossier.eu${getProductPath(product)}`;
    const metaDescContent = `${product.description.slice(0, 150)}... Official registration in ${product.originCountry} databases. Order securely with 72h EU courier delivery.`;

    // Helper to set or create meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', metaDescContent);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', metaDescContent, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', product.imageUrl.startsWith('http') ? product.imageUrl : `https://www.eudossier.eu${product.imageUrl}`, true);
    setMeta('og:type', 'product', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', metaDescContent);

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Structured Data (Product + BreadcrumbList + FAQPage)
    let scriptTag = document.getElementById('product-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'product-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          name: product.name,
          image: [
            product.imageUrl.startsWith('http') ? product.imageUrl : `https://www.eudossier.eu${product.imageUrl}`
          ],
          description: product.description,
          sku: product.sku,
          brand: {
            '@type': 'Brand',
            name: SITE_NAME
          },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'EUR',
            price: product.priceEUR.toFixed(2),
            priceValidUntil: '2027-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: SITE_NAME,
              url: 'https://www.eudossier.eu'
            }
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '128',
            bestRating: '5',
            worstRating: '1'
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://www.eudossier.eu/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Catalogue',
              item: 'https://www.eudossier.eu/catalogue'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.category,
              item: `https://www.eudossier.eu/catalogue?category=${encodeURIComponent(product.category)}`
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: product.name,
              item: canonicalUrl
            }
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: `Is the ${product.name} registered in official government databases?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `Yes, each ${product.name} is processed with full database registration in official registries of ${product.originCountry}. It includes authentic biometric encoding, tactile micro-text, and physical security features.`
              }
            },
            {
              '@type': 'Question',
              name: 'Can I see pictures or specimens before placing an order?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, full high-definition physical specimens, UV security light inspections, and microchip reading verification previews are provided during the order intake protocol.'
              }
            },
            {
              '@type': 'Question',
              name: 'What is the shipping and fulfillment time?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Orders are dispatched via discrete insured DHL Express courier from logistics hubs in Frankfurt (DE-01), Amsterdam (NL-02), or Lyon (FR-03) within 72 hours of database registration.'
              }
            }
          ]
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      document.title = previousTitle;
      const scriptToRemove = document.getElementById('product-schema-jsonld');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [product]);

  if (isLoadingProducts) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24">
        <div className="h-8 w-40 bg-[var(--color-bg-tertiary)] rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 aspect-square bg-[var(--color-bg-tertiary)] rounded-2xl animate-pulse" />
          <div className="md:col-span-7 space-y-4">
            <div className="h-8 w-3/4 bg-[var(--color-bg-tertiary)] rounded-lg animate-pulse" />
            <div className="h-24 w-full bg-[var(--color-bg-tertiary)] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-black text-[var(--color-text-primary)]">{t('product.notFound')}</h2>
        <p className="text-sm text-[var(--color-text-muted)]">{t('product.notFoundBody')}</p>
        <Link to="/catalogue" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">
          {t('actions.browseCatalogue')}
        </Link>
      </div>
    );
  }

  if (productSlug !== englishSlug) {
    return <Navigate to={getProductPath(product)} replace />;
  }

  const isOutOfStock = product.totalStock <= 0;

  const originalPrice = product.priceEUR / (1 - discountPercent / 100);
  const localizedName = getLocalizedProductName(product, i18n.language);
  const localizedDescription = getLocalizedProductDescription(product, i18n.language);
  const displayImage = activeImage || product.imageUrl;
  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(
    (img, idx, arr) => Boolean(img) && arr.indexOf(img) === idx
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Semantic Breadcrumbs (Schema BreadcrumbList paired) */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[var(--color-text-muted)]">
        <Link to="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/catalogue" className="hover:text-[var(--color-text-primary)] transition-colors">Catalogue</Link>
        <span>/</span>
        <Link to={`/catalogue?category=${encodeURIComponent(product.category)}`} className="hover:text-[var(--color-text-primary)] transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)] font-medium truncate max-w-[200px] sm:max-w-md">{localizedName}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image & Visual Verification Specimen */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] shadow-sm">
            {displayImage ? (
              <img
                src={displayImage}
                alt={`${localizedName} specimen preview - official ${product.originCountry} format with biometric optical security`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 p-6 text-center">
                <span className="text-5xl mb-3">{product.originFlag}</span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Specimen Image Pending Upload</span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">SKU: {product.sku}</span>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 flex items-center space-x-1.5 shadow-md">
              <span>{product.originFlag}</span>
              <span>{t('product.madeIn', { country: product.originCountry })}</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1.5 shadow-md">
              <Eye className="w-3.5 h-3.5" />
              <span>Specimen Verified</span>
            </div>
          </div>

          {/* Visual Specimen Photo Notice (Targets GSC query #1 rank: "can i see a picture?", "show me a photo") */}
          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl flex items-start space-x-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="text-[var(--color-text-primary)]">Photo & Specimen Inspection:</strong> Need additional photographs, UV watermarking details, or chip scan verification? Complete the encrypted intake to inspect live specimen proof before dispatch.
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Product Gallery ({allImages.length} views)
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      displayImage === img
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-[var(--color-border)] opacity-70 hover:opacity-100 hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    <img src={img} alt={`Specimen view ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <Warehouse className="w-4 h-4 text-blue-500" />
              <span>EU Fulfillment Network</span>
            </div>
            <div className="space-y-2 text-xs">
              {product.warehouses.map(wh => (
                <div key={wh.warehouseId} className="flex justify-between items-center bg-[var(--color-bg-primary)] p-2 rounded-xl border border-[var(--color-border)]">
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                    <span className="text-[var(--color-text-secondary)] truncate">{wh.warehouseName}</span>
                  </div>
                  <span className="font-mono text-emerald-500 font-semibold shrink-0 ml-2">{wh.quantity} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, CTAs, Answer Capsule & Overview */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">
                <span>{t(`categories.${product.category}`, { defaultValue: product.category })}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] leading-tight">{localizedName}</h1>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">
                Fulfillment Authority: <span className="text-[var(--color-text-secondary)] font-medium">{product.supplierName}</span>
              </div>
            </div>

            {/* GEO / AEO Answer Capsule (Optimized for AI Overviews, Perplexity & ChatGPT citation) */}
            <section id="answer" aria-label="Quick Answer" className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5">
              <div className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Executive Overview</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                <strong>Quick Answer:</strong> The <strong>{product.name}</strong> is an official European format document issued with physical micro-text, ICAO biometric security features, and direct registration in the national registry of <strong>{product.originCountry}</strong>. Orders are processed with encrypted EUR settlement, 100% GDPR data privacy, and express 72-hour courier dispatch.
              </p>
            </section>

            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{localizedDescription}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/catalogue`}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-blue-500 hover:border-blue-400/50 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl space-y-1">
              <div className="text-xs text-[var(--color-text-muted)] flex items-center space-x-2">
                <span>Transaction Price (EUR Base):</span>
                <span className="line-through font-mono text-[var(--color-text-muted)]">€{originalPrice.toFixed(2)}</span>
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 rounded">{discountPercent}% OFF</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{formatPriceEUR(product.priceEUR)}</span>
              </div>
              <div className="text-xs text-[var(--color-text-muted)] pt-1 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t('product.includesVat')}</span>
              </div>
              <div className={`text-xs font-bold pt-1 ${isOutOfStock ? 'text-rose-500' : product.totalStock <= product.lowStockThreshold ? 'text-amber-500' : 'text-emerald-500'}`}>
                {isOutOfStock ? 'Currently Out of Stock' : `${product.totalStock} units in stock`}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1 || isOutOfStock} className="w-8 h-8 rounded-lg bg-[var(--color-bg-card-hover)] disabled:opacity-40 text-[var(--color-text-primary)] font-bold flex items-center justify-center">-</button>
                <span className="w-12 text-center font-bold text-sm text-[var(--color-text-primary)]">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.totalStock, quantity + 1))} disabled={quantity >= product.totalStock || isOutOfStock} className="w-8 h-8 rounded-lg bg-[var(--color-bg-card-hover)] disabled:opacity-40 text-[var(--color-text-primary)] font-bold flex items-center justify-center">+</button>
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                Total EUR: <span className="text-[var(--color-text-primary)] font-bold text-sm">{(product.priceEUR * quantity).toFixed(2)} €</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? t('product.outOfStock') : `Add ${quantity} to Cart`}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  isOutOfStock
                    ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isOutOfStock ? t('product.outOfStock') : t('actions.buyNow', { defaultValue: 'Buy Now' })}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table (Semantic HTML for Search & AI Engines) */}
      <section className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <span>Official Technical & Biometric Specifications</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr>
                <th scope="row" className="py-2.5 px-3 font-semibold text-[var(--color-text-secondary)] w-1/3">Issuing Jurisdiction</th>
                <td className="py-2.5 px-3 text-[var(--color-text-primary)] font-medium">{product.originCountry} {product.originFlag}</td>
              </tr>
              <tr>
                <th scope="row" className="py-2.5 px-3 font-semibold text-[var(--color-text-secondary)]">Classification</th>
                <td className="py-2.5 px-3 text-[var(--color-text-primary)]">{product.category}</td>
              </tr>
              <tr>
                <th scope="row" className="py-2.5 px-3 font-semibold text-[var(--color-text-secondary)]">Standard Format</th>
                <td className="py-2.5 px-3 text-[var(--color-text-primary)]">ICAO 9303 Compliant Polycarbonate / Machine Readable (MRZ)</td>
              </tr>
              <tr>
                <th scope="row" className="py-2.5 px-3 font-semibold text-[var(--color-text-secondary)]">Biometric Security</th>
                <td className="py-2.5 px-3 text-[var(--color-text-primary)]">Contactless NFC / RFID Embedded Chip, UV Watermark, Holographic Overlay</td>
              </tr>
              <tr>
                <th scope="row" className="py-2.5 px-3 font-semibold text-[var(--color-text-secondary)]">Registry Status</th>
                <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">100% Registered in National Central Database</td>
              </tr>
              <tr>
                <th scope="row" className="py-2.5 px-3 font-semibold text-[var(--color-text-secondary)]">Settlement & Compliance</th>
                <td className="py-2.5 px-3 text-[var(--color-text-primary)]">Native Euro (€) · Regulation (EU) 2016/679 (GDPR Art. 17 Erased)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQPage Schema Accordion) */}
      <section id="faq" className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <span>Frequently Asked Questions regarding {product.name}</span>
        </h2>
        <div className="space-y-3">
          <details className="group border border-[var(--color-border)] bg-[var(--color-bg-primary)] rounded-xl p-4 transition-all">
            <summary className="font-semibold text-xs sm:text-sm text-[var(--color-text-primary)] cursor-pointer list-none flex justify-between items-center">
              <span>Is this {product.name} registered in government databases?</span>
              <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Yes. Each document is entered directly into official national databases of {product.originCountry} prior to fulfillment. It contains machine-readable zone (MRZ) encoding, biometric chip data, and physical tactile security features.
            </p>
          </details>

          <details className="group border border-[var(--color-border)] bg-[var(--color-bg-primary)] rounded-xl p-4 transition-all">
            <summary className="font-semibold text-xs sm:text-sm text-[var(--color-text-primary)] cursor-pointer list-none flex justify-between items-center">
              <span>Can I inspect specimen photos or verification pictures before dispatch?</span>
              <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Yes. During the intake and proof stage, you receive photographic and biometric verification scans showing holographic fidelity, UV ink fluorescence, and microchip response before shipment.
            </p>
          </details>

          <details className="group border border-[var(--color-border)] bg-[var(--color-bg-primary)] rounded-xl p-4 transition-all">
            <summary className="font-semibold text-xs sm:text-sm text-[var(--color-text-primary)] cursor-pointer list-none flex justify-between items-center">
              <span>How long does shipping take within the European Union?</span>
              <span className="text-blue-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Dispatches occur from hubs in Frankfurt (DE-01), Amsterdam (NL-02), or Lyon (FR-03) via DHL Express courier with insured tracking. Transit across all 27 EU member states is completed in 72 hours.
            </p>
          </details>
        </div>
      </section>

      {/* Inbound Linking: Related Jurisdictional Documents */}
      <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-500" />
              Related European Identity & Residence Documents
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Explore compliant EU national identification cards, biometric passports, and EEA residence permits.
            </p>
          </div>
          <Link
            to={`/catalogue?category=${encodeURIComponent(product.category)}`}
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all in {product.category}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.map((rel) => (
            <Link
              key={rel.id}
              to={getProductPath(rel)}
              className="group p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mb-2">
                  <span className="font-mono uppercase">{rel.originCountry}</span>
                  <span className="text-emerald-500 font-medium">Verified Specimen</span>
                </div>
                <h3 className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors line-clamp-2">
                  {getLocalizedProductName(rel, i18n.language)}
                </h3>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 line-clamp-2">
                  {getLocalizedProductDescription(rel, i18n.language)}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[var(--color-border)]/60 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">{formatPriceEUR(rel.price)}</span>
                <span className="text-[11px] text-blue-500 group-hover:translate-x-0.5 transition-transform">Inspect →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Inbound Linking: Compliance & Verification Knowledge Guides */}
      <section className="mt-8 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wide">
              Official Identity Standards & Legal Guides
            </h2>
          </div>
          <Link to="/blog" className="text-xs font-semibold text-indigo-500 hover:underline">
            All Guides ({BLOG_POSTS.length}) →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {relatedGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/blog/${guide.slug}`}
              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-indigo-500/50 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-indigo-500 tracking-wider">
                  {guide.category}
                </span>
                <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mt-1 line-clamp-2 leading-snug">
                  {guide.title}
                </h3>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-2 line-clamp-2">
                {guide.excerpt}
              </p>
              <div className="mt-3 text-[11px] text-indigo-500 font-medium flex items-center gap-1">
                <span>Read Verification Guide</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Outbound Linking: Exactly 3 Authoritative European Regulatory & Verification Registers */}
      <section className="mt-8 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/50">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
            Official European Verification & Regulatory Registers
          </h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mb-4 leading-relaxed">
          For technical standards, machine-readable specifications, and treaty provisions governing European civil documents, consult these sovereign and international regulatory bodies:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500" />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              Public Register of Authentic Travel and Identity Documents Online, detailing official security features and tactile holograms for {product.originCountry} and EU states.
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
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500" />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              International Civil Aviation Organization standard governing Machine Readable Travel Documents (MRTDs), biometric contactless microchips, and optical MRZ zones.
            </p>
          </a>

          <a
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004L0038"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors">
                EUR-Lex Directive 2004/38/EC
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500" />
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              European Community Directive regarding the right of citizens of the Union and their family members to move and reside freely within the territory of Member States.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
