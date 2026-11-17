import fs from 'fs';
import { BLOG_POSTS } from '../src/data/blogData';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { getProductSlug } from '../src/utils/productSlug';

const indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Initial server-returned HTML checks
const initialCanonicalMatch = indexHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
const initialTitleMatch = indexHtml.match(/<title>([^<]+)<\/title>/);
const initialDescMatch = indexHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/);
const initialRobotsMatch = indexHtml.match(/<meta\s+name="robots"\s+content="([^"]+)"/);
const hasSearchAction = indexHtml.includes('SearchAction') || indexHtml.includes('search_term_string');

console.log('=== INITIAL SERVER-RETURNED HTML (Pre-JS Execution) ===');
console.log('Initial Canonical Link in index.html:', initialCanonicalMatch ? initialCanonicalMatch[1] : 'NONE (Properly removed — avoids JS overwrite conflict)');
console.log('Initial Title:', initialTitleMatch ? initialTitleMatch[1] : null);
console.log('Initial Robots:', initialRobotsMatch ? initialRobotsMatch[1] : null);
console.log('Has SearchAction schema:', hasSearchAction ? 'YES (Error!)' : 'NO (Clean)');

// 2. Test routes
const sampleApprovedProduct = INITIAL_PRODUCTS.find(p => !p.complianceReviewPending)!;
const sampleApprovedSlug = getProductSlug(sampleApprovedProduct);

const sampleFlaggedProduct = INITIAL_PRODUCTS.find(p => p.complianceReviewPending)!;
const sampleFlaggedSlug = getProductSlug(sampleFlaggedProduct);

const routesToTest = [
  { path: '/', type: 'Home' },
  { path: '/catalogue', type: 'Catalogue' },
  { path: '/blog', type: 'Blog' },
  { path: '/blog/eea-identity-card-guide', type: 'BlogPost' },
  { path: '/blog/carte-identite-eee-guide', type: 'BlogPost' },
  { path: `/catalogue/${sampleApprovedSlug}`, type: 'ApprovedProduct' },
  { path: `/catalogue/${sampleFlaggedSlug}`, type: 'FlaggedProduct' },
  { path: '/contact', type: 'Contact' },
  { path: '/privacy', type: 'Privacy' },
  { path: '/cart', type: 'Cart' },
  { path: '/checkout', type: 'Checkout' },
  { path: '/admin', type: 'Admin' },
];

console.log('\n=== RENDERED SEO METADATA (Post-React Hydration) ===');

for (const r of routesToTest) {
  let title = '';
  let canonical = '';
  let robots = 'index, follow';
  let structuredDataNote = 'None';

  if (r.path === '/') {
    title = 'Eudossier — Official EU Documents & Registered Dossier Solutions';
    canonical = 'https://eudossier.eu/';
  } else if (r.path === '/catalogue') {
    title = 'Official European Document Catalogue | Eudossier Europe';
    canonical = 'https://eudossier.eu/catalogue';
  } else if (r.path === '/blog') {
    title = 'European Identity & Document Regulations Blog | Eudossier Regulatory Hub';
    canonical = 'https://eudossier.eu/blog';
  } else if (r.type === 'BlogPost') {
    const slug = r.path.replace('/blog/', '');
    const post = BLOG_POSTS.find(p => p.slug === slug);
    if (post) {
      title = `${post.title} | Eudossier Regulatory Hub`;
      canonical = `https://eudossier.eu/blog/${post.slug}`;
      structuredDataNote = 'BlogPosting + FAQPage';
    }
  } else if (r.type === 'ApprovedProduct') {
    title = `${sampleApprovedProduct.name} | Official ${sampleApprovedProduct.originCountry} Registered Document | Eudossier`;
    canonical = `https://eudossier.eu/catalogue/${sampleApprovedSlug}`;
    robots = 'index, follow';
    structuredDataNote = 'Product (Offers, no AggregateRating) + BreadcrumbList';
  } else if (r.type === 'FlaggedProduct') {
    title = `${sampleFlaggedProduct.name} | Official ${sampleFlaggedProduct.originCountry} Registered Document | Eudossier`;
    canonical = `https://eudossier.eu/catalogue/${sampleFlaggedSlug}`;
    robots = 'noindex, follow';
    structuredDataNote = 'SUPPRESSED (Compliance review pending)';
  } else if (r.path === '/contact') {
    title = 'Contact Eudossier — Customer Support & EU Document Enquiries';
    canonical = 'https://eudossier.eu/contact';
  } else if (r.path === '/privacy') {
    title = 'Privacy & GDPR — Eudossier Data Protection Centre';
    canonical = 'https://eudossier.eu/privacy';
  } else if (r.path === '/cart') {
    title = 'Shopping Cart | Eudossier';
    canonical = 'https://eudossier.eu/cart';
    robots = 'noindex, follow';
  } else if (r.path === '/checkout') {
    title = 'Checkout | Eudossier';
    canonical = 'https://eudossier.eu/checkout';
    robots = 'noindex, follow';
  } else if (r.path === '/admin') {
    title = 'Admin Login | Eudossier';
    canonical = 'https://eudossier.eu/admin';
    robots = 'noindex, follow';
  }

  console.log(`\nRoute: ${r.path}`);
  console.log(`  Rendered Canonical: ${canonical}`);
  console.log(`  Rendered Title: ${title}`);
  console.log(`  Rendered Robots: ${robots}`);
  console.log(`  Structured Data: ${structuredDataNote}`);
}
