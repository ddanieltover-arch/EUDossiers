import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { BLOG_HREFLANGS } from '../data/hreflangData';
import { renderMarkdown } from '../utils/markdownRenderer';
import { useStore } from '../context/StoreContext';
import { setCanonical, setMetaDescription, setRobots } from '../utils/seo';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  ExternalLink,
  BookOpen,
  Share2,
  Check,
  Globe2
} from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const post: BlogPost | undefined = BLOG_POSTS.find((p) => p.slug === slug);

  // Calculate dynamic related articles based on:
  // 1. Same Country + Same Category (highest priority)
  // 2. Same Country
  // 3. Same Category + Same Language
  // 4. Same Language
  const relatedArticles: BlogPost[] = (() => {
    if (!post) return [];
    const candidates = BLOG_POSTS.filter((p) => p.slug !== post.slug);
    const scored = candidates.map((p) => {
      let score = 0;
      if (p.country && post.country && p.country === post.country) score += 40;
      if (p.category === post.category) score += 30;
      if ((p.language || 'en') === (post.language || 'en')) score += 20;
      return { post: p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map((s) => s.post);
  })();

  // Calculate chronological previous and next articles
  const currentPostIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentPostIndex > 0 ? BLOG_POSTS[currentPostIndex - 1] : null;
  const nextPost = currentPostIndex >= 0 && currentPostIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentPostIndex + 1] : null;

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
    setMetaDescription(post.excerpt);
    setCanonical(`https://eudossier.eu/blog/${post.slug}`);
    setRobots('index, follow');

    // Inject hreflang alternate links
    const currentAlternates = BLOG_HREFLANGS[post.slug] || [];
    // Remove previous hreflang tags injected by this component
    document.querySelectorAll('link[rel="alternate"][data-blog-hreflang]').forEach(el => el.remove());
    currentAlternates.forEach(alt => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.hreflang);
      link.setAttribute('href', alt.href);
      link.setAttribute('data-blog-hreflang', 'true');
      document.head.appendChild(link);
    });

    // Inject BlogPosting, BreadcrumbList and FAQPage JSON-LD Schemas
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
          url: `https://eudossier.eu/blog/${post.slug}`,
          datePublished: post.publishDate,
          dateModified: post.lastReviewed || post.publishDate,
          image: `https://eudossier.eu${post.coverImage}`,
          author: {
            '@type': 'Person',
            name: post.author.name,
            jobTitle: post.author.role,
          },
          publisher: {
            '@type': 'Organization',
            name: 'Eudossier Europe',
            url: 'https://eudossier.eu',
            logo: {
              '@type': 'ImageObject',
              url: 'https://eudossier.eu/logo.png',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://eudossier.eu/blog/${post.slug}`,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://eudossier.eu/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Knowledge Hub',
              item: 'https://eudossier.eu/blog',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.country || 'International',
              item: `https://eudossier.eu/blog`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: post.title,
              item: `https://eudossier.eu/blog/${post.slug}`,
            },
          ],
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
      document.querySelectorAll('link[rel="alternate"][data-blog-hreflang]').forEach(el => el.remove());
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
        
        {/* Navigation Breadcrumb Trail */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 flex-wrap">
            <Link to="/" className="hover:text-[var(--color-accent-500)] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <Link to="/blog" className="hover:text-[var(--color-accent-500)] transition-colors">
              Knowledge Hub
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="font-semibold text-[var(--color-text-secondary)]">
              {post.country || 'International'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="text-[var(--color-text-primary)] font-medium truncate max-w-[200px] sm:max-w-xs" title={post.title}>
              {post.title}
            </span>
          </nav>

          <div className="flex items-center space-x-3 self-end sm:self-center">
            <Link
              to="/blog"
              className="hover:text-[var(--color-accent-500)] transition-colors flex items-center space-x-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Guides</span>
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
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
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
              <span>Published: {post.publishDate}</span>
            </div>

            {post.lastReviewed && (
              <>
                <span className="text-neutral-500">•</span>
                <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Reviewed: {post.lastReviewed}</span>
                </div>
              </>
            )}

            <span className="text-neutral-500">•</span>

            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
              <span>{post.readTime}</span>
            </div>

            {/* Language Switcher if alternates exist */}
            {(() => {
              const alts = BLOG_HREFLANGS[post.slug]?.filter(a => a.hreflang !== 'x-default') || [];
              if (alts.length <= 1) return null;
              const langLabels: Record<string, string> = {
                'en': 'English',
                'fr-FR': 'Français',
                'de-DE': 'Deutsch',
                'nl-NL': 'Nederlands',
                'es-ES': 'Español',
                'it-IT': 'Italiano',
              };
              return (
                <>
                  <span className="text-neutral-500">•</span>
                  <div className="flex items-center space-x-1 text-xs">
                    <span className="text-[var(--color-text-muted)]">Read in:</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {alts.map(alt => {
                        const m = alt.href.match(/https:\/\/eudossier\.eu(?:\/[a-z]{2})?\/blog\/([a-z0-9-]+)/);
                        const targetSlug = m ? m[1] : '';
                        const isCurrent = targetSlug === post.slug;
                        const label = langLabels[alt.hreflang] || alt.hreflang;
                        if (isCurrent) {
                          return (
                            <span key={alt.hreflang} className="px-2 py-0.5 rounded text-[11px] font-bold bg-[var(--color-accent-600)] text-white">
                              {label}
                            </span>
                          );
                        }
                        return (
                          <Link
                            key={alt.hreflang}
                            to={`/blog/${targetSlug}`}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent-500)] hover:border-[var(--color-accent-500)]/40 transition-colors"
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
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
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <div 
            className="prose-article space-y-4"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(post.content)
            }} 
          />
        </div>

        {/* Product Conversion Bridge Card */}
        {linkedProduct && post.targetProductSlug && (
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
                    European Document Reference
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] font-display mt-1">
                    {linkedProduct.name}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Specification: <span className="font-semibold text-blue-400">{linkedProduct.category}</span> • Status: <span className="text-amber-400 font-medium">Compliance Review · Informational Reference</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Link
                  to={`/catalogue/${post.targetProductSlug}`}
                  className="w-full sm:w-auto bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>View Document Specifications</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Interactive FAQ Section (rendered only if not already embedded in article HTML) */}
        {post.faqs.length > 0 && !post.content.includes('id="faq"') && !post.content.includes('aria-labelledby="faq"') && !post.content.includes('id="faq"') && (
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

        {/* Previous / Next Article Navigation */}
        <nav aria-label="Article Pagination" className="pt-8 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-500)]/60 hover:bg-[var(--color-bg-tertiary)] transition-all flex flex-col items-start group"
            >
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1 group-hover:text-[var(--color-accent-500)] transition-colors">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                <span>Previous Publication</span>
              </span>
              <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-1 line-clamp-2 leading-snug">
                {prevPost.title}
              </p>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextPost && (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-500)]/60 hover:bg-[var(--color-bg-tertiary)] transition-all flex flex-col items-end text-right group sm:col-start-2"
            >
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1 group-hover:text-[var(--color-accent-500)] transition-colors">
                <span>Next Publication</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-1 line-clamp-2 leading-snug">
                {nextPost.title}
              </p>
            </Link>
          )}
        </nav>

        {/* Dynamic Contextual Related Articles */}
        <section className="space-y-6 pt-4 border-t border-[var(--color-border)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--color-accent-500)]" />
                Related European Legal & Verification Guides
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Contextual publications prioritised by jurisdiction ({post.country || 'International'}) and regulatory category ({post.category}).
              </p>
            </div>
            <Link
              to="/blog"
              className="text-xs font-semibold text-[var(--color-accent-500)] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Return to Knowledge Hub</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                to={`/blog/${rel.slug}`}
                className="group p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-500)]/60 hover:bg-[var(--color-bg-tertiary)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[9px] font-mono font-semibold uppercase text-[var(--color-accent-400)] truncate">
                      {rel.category}
                    </span>
                    {rel.country && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-600/20 text-blue-400 font-semibold shrink-0">
                        {rel.country}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-500)] transition-colors line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-2 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="mt-3 pt-2 text-[11px] text-[var(--color-accent-500)] font-medium flex items-center gap-1 border-t border-[var(--color-border-subtle)]">
                  <span>Read Guide</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Inbound Linking: Category & Blog Guides Cross-Links */}
          <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[var(--color-text-primary)]">
              Explore European Document Guides &amp; Specifications:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/blog/carte-nationale-identite-cni-guide"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                National ID Cards
              </Link>
              <Link
                to="/blog/passeport-biometrique-guide"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Biometric Passports
              </Link>
              <Link
                to="/blog/german-eat-vs-eu-residence-permit"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Residence Permits (eAT)
              </Link>
              <Link
                to="/blog/carte-identite-eee-guide"
                className="px-2.5 py-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-500)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                EEA Travel Rules
              </Link>
            </div>
          </div>
        </section>

        {/* Outbound Linking: Exactly 2 to 3 Authoritative Sovereign & European Registers (rendered only if not already embedded in article HTML) */}
        {post.outboundLinks && post.outboundLinks.length > 0 && !post.content.includes('id="sources"') && !post.content.includes('aria-labelledby="sources"') && !post.content.includes('Sources officielles') && !post.content.includes('Offizielle Quellen') && !post.content.includes('Officiële bronnen') && !post.content.includes('Fuentes oficiales') && !post.content.includes('Fonti ufficiali') && (
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
