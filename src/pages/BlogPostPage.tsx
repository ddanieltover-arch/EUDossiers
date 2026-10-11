import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { useStore } from '../context/StoreContext';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  BookOpen,
  Share2,
  Check
} from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const post: BlogPost | undefined = BLOG_POSTS.find((p) => p.slug === slug);

  // Find target product from store if referenced
  const linkedProduct = post?.targetProductSlug
    ? products.find((p) => {
        const prodSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return prodSlug.includes(post.targetProductSlug) || post.targetProductSlug.includes(p.id);
      }) || products[0]
    : undefined;

  useEffect(() => {
    if (!post) return;

    // Dynamic Metadata
    document.title = `${post.title} | Eudossier Regulatory Hub`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', post.excerpt);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.eudossier.eu/blog/${post.slug}`);

    // Inject BlogPosting and FAQPage JSON-LD Schemas
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'blog-post-schema-jsonld';
    schemaScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          url: `https://www.eudossier.eu/blog/${post.slug}`,
          datePublished: post.publishDate,
          dateModified: post.publishDate,
          image: `https://www.eudossier.eu${post.coverImage}`,
          author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Eudossier Europe',
            url: 'https://www.eudossier.eu',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.eudossier.eu/logo.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.eudossier.eu/blog/${post.slug}`,
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    });

    const prevSchema = document.getElementById('blog-post-schema-jsonld');
    if (prevSchema) prevSchema.remove();
    document.head.appendChild(schemaScript);

    return () => {
      schemaScript.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Guide Publication Not Found</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">The requested regulatory guide does not exist or has been relocated.</p>
        <Link
          to="/blog"
          className="bg-[var(--color-accent-600)] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-[var(--color-accent-500)] transition-colors inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Knowledge Center</span>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] pb-4">
          <Link
            to="/blog"
            className="hover:text-[var(--color-accent-500)] transition-colors flex items-center space-x-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Guides</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 hover:text-[var(--color-text-primary)] transition-colors px-2.5 py-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Guide</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent-600)]/10 text-[var(--color-accent-500)] border border-[var(--color-accent-600)]/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{post.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-[var(--color-text-primary)] leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed italic">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-[var(--color-accent-600)]/20 text-[var(--color-accent-500)] flex items-center justify-center font-bold text-xs">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">{post.author.name}</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{post.author.role}</p>
              </div>
            </div>

            <span className="text-neutral-500">•</span>

            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
              <span>{post.publishDate}</span>
            </div>

            <span className="text-neutral-500">•</span>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="w-full h-72 sm:h-96 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden flex items-center justify-center p-6 relative">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-contain drop-shadow-xl"
          />
          <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full border border-white/10 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Technical Specimen</span>
          </span>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed space-y-6">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .replace(/### (.*)/g, '<h3 class="text-base sm:text-lg font-bold text-[var(--color-text-primary)] font-display mt-8 mb-3">$1</h3>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[var(--color-text-primary)] font-semibold">$1</strong>')
                .replace(/\* (.*)/g, '<li class="ml-4 list-disc text-[var(--color-text-muted)] my-1">$1</li>')
                .replace(/---/g, '<hr class="border-[var(--color-border)] my-6" />')
                .replace(/\n\n/g, '<p class="my-3 text-[var(--color-text-muted)] leading-relaxed"></p>')
            }} 
          />
        </div>

        {/* Product Conversion Bridge Card */}
        {linkedProduct && (
          <div className="bg-gradient-to-r from-[var(--color-bg-secondary)] via-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] border border-[var(--color-accent-500)]/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={linkedProduct.imageUrl}
                  alt={linkedProduct.name}
                  className="w-16 h-16 object-contain rounded-xl bg-[var(--color-bg-primary)] p-1.5 border border-[var(--color-border)] shadow"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent-400)] bg-[var(--color-accent-600)]/20 px-2 py-0.5 rounded">
                    Featured Catalogue Specimen
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] font-display mt-1">
                    {linkedProduct.name}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    In Stock: <span className="font-semibold text-emerald-400">{linkedProduct.totalStock} units</span> • Price: €{linkedProduct.priceEUR.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Link
                  to={`/catalogue/${post.targetProductSlug}`}
                  className="w-full sm:w-auto bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>View Product Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Interactive FAQ Section */}
        {post.faqs.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-[var(--color-border)]">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-display">
              Frequently Asked Questions & Official Compliance
            </h3>
            <div className="space-y-3">
              {post.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-accent-500)] transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[var(--color-accent-500)] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border-subtle)]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Inbound Linking: Dense Internal Navigation Mesh */}
        <section className="space-y-6 pt-8 border-t border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--color-accent-500)]" />
                Related European Legal & Verification Guides
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Deepen your knowledge of European civil documentation, biometric ICAO specifications, and border inspection protocols.
              </p>
            </div>
            <Link
              to="/blog"
              className="text-xs font-semibold text-[var(--color-accent-500)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>All Guides Hub</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3).map((rel) => (
              <Link
                key={rel.slug}
                to={`/blog/${rel.slug}`}
                className="group p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-500)]/60 hover:bg-[var(--color-bg-tertiary)] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-semibold uppercase text-[var(--color-accent-400)]">
                    {rel.category}
                  </span>
                  <h4 className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-500)] transition-colors mt-1 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-2 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-3 pt-2 text-[11px] text-[var(--color-accent-500)] font-medium flex items-center gap-1">
                  <span>Read Guide</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Inbound Linking: Category & Catalogue Cross-Links */}
          <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[var(--color-text-primary)]">
              Explore Registered Document Catalogues:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/catalogue?category=National+ID+Cards"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                National ID Cards
              </Link>
              <Link
                to="/catalogue?category=Passports"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Biometric Passports
              </Link>
              <Link
                to="/catalogue?category=Residence+Permits"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Residence Permits (eAT)
              </Link>
              <Link
                to="/catalogue?category=Driver+Licenses"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Driver Licenses
              </Link>
            </div>
          </div>
        </section>

        {/* Outbound Linking: Exactly 2 to 3 Authoritative Sovereign & European Registers */}
        {post.outboundLinks && post.outboundLinks.length > 0 && (
          <section className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-tertiary)]/40 space-y-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider">
                Official Sovereign & Intergovernmental Reference Registers
              </h3>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Verify statutory frameworks, European technical benchmarks, and sovereign registers cited in this publication:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {post.outboundLinks.slice(0, 3).map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-emerald-500/50 transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-emerald-500 transition-colors">
                      {link.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
};

export default BlogPostPage;
