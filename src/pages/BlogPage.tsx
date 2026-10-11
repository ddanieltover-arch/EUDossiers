import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { BookOpen, Calendar, Clock, User, ArrowRight, Search, ShieldCheck, ExternalLink, Compass } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Identity Cards',
  'Passports',
  'Residence Permits',
  'Compliance & Security',
  'Inspection & FAQs',
] as const;

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Dynamic Head Metadata
    document.title = 'European Identity & Document Regulations Blog | Eudossier Regulatory Hub';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Authoritative technical guides on EU national identity cards (CNIe, CIE, DNI 4.0), biometric passports (ICAO 9303, Swiss Pass 22), and residence permit verification in PRADO, ANTS, and BAMF.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://www.eudossier.eu/blog');

    // JSON-LD Schema for Blog
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'blog-schema-jsonld';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Eudossier Regulatory & Identity Knowledge Hub',
      description: 'Technical analyses and European regulatory guides on biometric travel documents and national ID verification.',
      url: 'https://www.eudossier.eu/blog',
      publisher: {
        '@type': 'Organization',
        name: 'Eudossier Europe',
        url: 'https://www.eudossier.eu',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.eudossier.eu/logo.png',
        },
      },
      blogPost: BLOG_POSTS.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `https://www.eudossier.eu/blog/${post.slug}`,
        datePublished: post.publishDate,
        author: {
          '@type': 'Person',
          name: post.author.name,
        },
      })),
    });

    const prevSchema = document.getElementById('blog-schema-jsonld');
    if (prevSchema) prevSchema.remove();
    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, []);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.secondaryKeywords.some((k) =>
        k.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent-600)]/10 text-[var(--color-accent-500)] border border-[var(--color-accent-600)]/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>EU Regulatory Knowledge Hub & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-[var(--color-text-primary)]">
            European Identity & Document Regulations
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
            In-depth technical guides, ICAO 9303 compliance breakdowns, and official database registration analysis covering European national ID cards, biometric passports, and Schengen residence permits.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search regulations, ICAO 9303, CNIe, eAT..."
                className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]"
              />
            </div>

            {/* Total Count Badge */}
            <div className="text-xs text-[var(--color-text-muted)] self-end sm:self-center">
              Showing <span className="font-bold text-[var(--color-text-primary)]">{filteredPosts.length}</span> verified technical publications
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[var(--color-accent-600)] text-white shadow-md'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post: BlogPost) => (
            <article
              key={post.id}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)]/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Cover Image Container */}
              <div className="relative h-48 bg-[var(--color-bg-tertiary)] overflow-hidden flex items-center justify-center p-4">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center space-x-1 backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-[11px] text-[var(--color-text-muted)]">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.publishDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-500)] transition-colors leading-snug font-display line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[11px] text-[var(--color-text-muted)]">
                    <User className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                    <span>{post.author.name}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-[var(--color-accent-500)] group-hover:translate-x-1 transition-transform flex items-center space-x-1"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Inbound Linking: Cross-links to Catalogue Categories & Featured Documents */}
        <section className="pt-8 border-t border-[var(--color-border)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] font-display flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-500" />
                Featured Sovereign Document Catalogues & Specimen Archives
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Direct access to registered French identity cards, biometric Swiss passports, German eAT permits, and Italian CIE cards.
              </p>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-semibold text-blue-500 hover:text-blue-400 inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore Complete Catalogue</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <Link
              to="/catalogue/registered-french-id-card-carte-nationale-didentite-cnie"
              className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all block group"
            >
              <span className="text-[10px] text-blue-500 font-mono font-semibold uppercase">France</span>
              <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mt-0.5 line-clamp-1">French ID Card (CNIe)</p>
            </Link>
            <Link
              to="/catalogue/german-eu-residence-permit-elektronischer-aufenthaltstitel-eat"
              className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all block group"
            >
              <span className="text-[10px] text-blue-500 font-mono font-semibold uppercase">Germany</span>
              <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mt-0.5 line-clamp-1">eAT Residence Permit</p>
            </Link>
            <Link
              to="/catalogue/italian-electronic-id-card-carta-didentita-cie"
              className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all block group"
            >
              <span className="text-[10px] text-blue-500 font-mono font-semibold uppercase">Italy</span>
              <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mt-0.5 line-clamp-1">Italian CIE 3.0 Card</p>
            </Link>
            <Link
              to="/catalogue/registered-swiss-biometric-passport-passeport-suisse"
              className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all block group"
            >
              <span className="text-[10px] text-blue-500 font-mono font-semibold uppercase">Switzerland</span>
              <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mt-0.5 line-clamp-1">Swiss Pass 22 Fedpol</p>
            </Link>
            <Link
              to="/catalogue/registered-spanish-id-card-documento-nacional-de-identidad-dni"
              className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:border-blue-500/50 hover:bg-[var(--color-bg-tertiary)] transition-all block group"
            >
              <span className="text-[10px] text-blue-500 font-mono font-semibold uppercase">Spain</span>
              <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors mt-0.5 line-clamp-1">Spanish DNI 4.0 Card</p>
            </Link>
          </div>
        </section>

        {/* Outbound Linking: Exactly 3 Authoritative European Regulatory & Verification Registers */}
        <section className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/40 space-y-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
              Official European Regulatory & Verification Authorities
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            All analytical content across our Knowledge Center adheres to European Union legislative directives and ICAO global standards. Reference official documentation directly:
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
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32004L0038"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors">
                  EUR-Lex Directive 2004/38/EC
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                European Community Directive regarding the right of citizens of the Union and their family members to move and reside freely within the territory of Member States.
              </p>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BlogPage;
