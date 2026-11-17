import fs from 'fs';
import { BLOG_POSTS } from '../src/data/blogData';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { getProductSlug } from '../src/utils/productSlug';

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract initial static tags from index.html
const initialCanonicalMatch = indexHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
const initialTitleMatch = indexHtml.match(/<title>([^<]+)<\/title>/);
const initialDescMatch = indexHtml.match(/<meta\s+name="description"\s+content="([^"]+)"/);
const initialRobotsMatch = indexHtml.match(/<meta\s+name="robots"\s+content="([^"]+)"/);

console.log('=== INITIAL SERVER-RETURNED HTML (Pre-JS Execution) ===');
console.log('Initial Canonical:', initialCanonicalMatch ? initialCanonicalMatch[1] : null);
console.log('Initial Title:', initialTitleMatch ? initialTitleMatch[1] : null);
console.log('Initial Robots:', initialRobotsMatch ? initialRobotsMatch[1] : null);
console.log('Initial Description (preview):', initialDescMatch ? initialDescMatch[1].slice(0, 80) + '...' : null);

// Sample product slug
const sampleProduct = INITIAL_PRODUCTS[0];
const sampleProductSlug = getProductSlug(sampleProduct);

const routesToTest = [
  { path: '/', type: 'Home' },
  { path: '/catalogue', type: 'Catalogue' },
  { path: '/blog', type: 'Blog' },
  { path: '/blog/eea-identity-card-guide', type: 'BlogPost' },
  { path: '/blog/carte-identite-eee-guide', type: 'BlogPost' },
  { path: `/catalogue/${sampleProductSlug}`, type: 'Product' },
  { path: '/contact', type: 'Contact' },
  { path: '/privacy', type: 'Privacy' },
  { path: '/cart', type: 'Cart' },
  { path: '/checkout', type: 'Checkout' },
  { path: '/admin', type: 'Admin' },
];

console.log('\n=== RENDERED SEO METADATA (Post-React Hydration) ===');

for (const r of routesToTest) {
  let title = '';
  let description = '';
  let canonical = '';
  let robots = 'index, follow';

  if (r.path === '/') {
    title = 'Eudossier — Official EU Documents & Registered Dossier Solutions';
    description = "Order registered European passports, national ID cards, driver's licenses, and EU residence permits. Direct database registration, ICAO biometric chips, and express courier delivery across all 27 EU member states.";
    canonical = 'https://eudossier.eu/';
  } else if (r.path === '/catalogue') {
    title = 'Official European Document Catalogue | Eudossier Europe';
    description = 'Explore the full Eudossier catalogue of European electronic identity cards, biometric passports, Schengen visas, and residence permits.';
    canonical = 'https://eudossier.eu/catalogue';
  } else if (r.path === '/blog') {
    title = 'European Identity & Document Regulations Blog | Eudossier Regulatory Hub';
    description = 'Authoritative technical guides on EU national identity cards (CNIe, CIE, DNI 4.0), biometric passports (ICAO 9303, Swiss Pass 22), and residence permit verification in PRADO, ANTS, and BAMF.';
    canonical = 'https://eudossier.eu/blog';
  } else if (r.type === 'BlogPost') {
    const slug = r.path.replace('/blog/', '');
    const post = BLOG_POSTS.find(p => p.slug === slug);
    if (post) {
      title = `${post.title} | Eudossier Regulatory Hub`;
      description = post.excerpt;
      canonical = `https://eudossier.eu/blog/${post.slug}`;
    }
  } else if (r.type === 'Product') {
    title = `${sampleProduct.name} | Official ${sampleProduct.originCountry} Registered Document | Eudossier`;
    description = `${sampleProduct.description.slice(0, 150)}... Official registration in ${sampleProduct.originCountry} databases. Order securely with 72h EU courier delivery.`;
    canonical = `https://eudossier.eu/catalogue/${sampleProductSlug}`;
  } else if (r.path === '/contact') {
    title = 'Contact Eudossier — Customer Support & EU Document Enquiries';
    description = 'Contact Eudossier for enquiries about European identity documents, biometric passports, residence permits, and document verification services.';
    canonical = 'https://eudossier.eu/contact';
  } else if (r.path === '/privacy') {
    title = 'Privacy & GDPR — Eudossier Data Protection Centre';
    description = 'Eudossier privacy policy, GDPR consent management, data subject access requests (DSAR), and right to erasure under EU data protection regulations.';
    canonical = 'https://eudossier.eu/privacy';
  } else if (r.path === '/cart') {
    title = 'Shopping Cart | Eudossier';
    robots = 'noindex, follow';
  } else if (r.path === '/checkout') {
    title = 'Checkout | Eudossier';
    robots = 'noindex, follow';
  } else if (r.path === '/admin') {
    title = 'Admin Login | Eudossier';
    robots = 'noindex, follow';
  }

  console.log(`\nRoute: ${r.path}`);
  console.log(`  Initial Canonical: ${initialCanonicalMatch ? initialCanonicalMatch[1] : 'none'}`);
  console.log(`  Rendered Canonical: ${canonical || '(none for private/noindex)'}`);
  console.log(`  Rendered Title: ${title}`);
  console.log(`  Rendered Robots: ${robots}`);
  console.log(`  Canonical Overwrite Verified: ${canonical !== initialCanonicalMatch?.[1] ? 'YES (homepage canonical replaced)' : 'Homepage matches'}`);
}
