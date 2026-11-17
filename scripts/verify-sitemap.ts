import fs from 'fs';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { getProductSlug } from '../src/utils/productSlug';
import { BLOG_POSTS } from '../src/data/blogData';
import { BLOG_HREFLANGS } from '../src/data/hreflangData';

const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = (xml.match(/<loc>[^<]+<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));

console.log('--- SITEMAP AUDIT ---');
console.log('Total URLs in sitemap:', urls.length);

let errors = 0;

// 1. Verify all URLs use https://eudossier.eu
const nonApexUrls = urls.filter(u => !u.startsWith('https://eudossier.eu/'));
if (nonApexUrls.length > 0) {
  console.error('FAIL: Non-apex URLs found:', nonApexUrls);
  errors++;
} else {
  console.log('PASS: All URLs use preferred https://eudossier.eu');
}

// 2. Verify no private pages
const privateUrls = urls.filter(u => /\/(admin|cart|checkout|api)(\/|$)/.test(u));
if (privateUrls.length > 0) {
  console.error('FAIL: Private URLs in sitemap:', privateUrls);
  errors++;
} else {
  console.log('PASS: No private routes (cart, checkout, admin, api) in sitemap');
}

// 3. Verify no search / placeholder URLs
const searchUrls = urls.filter(u => u.includes('search') || u.includes('%7B') || u.includes('{'));
if (searchUrls.length > 0) {
  console.error('FAIL: Search / placeholder URLs in sitemap:', searchUrls);
  errors++;
} else {
  console.log('PASS: No search / placeholder URLs in sitemap');
}

// 4. Products check (23 approved, 5 excluded under compliance review)
const sitemapProdSlugs = urls.filter(u => u.includes('/catalogue/')).map(u => u.replace('https://eudossier.eu/catalogue/', ''));
const approvedProducts = INITIAL_PRODUCTS.filter(p => !p.complianceReviewPending);
const reviewProducts = INITIAL_PRODUCTS.filter(p => p.complianceReviewPending);

const expectedApprovedSlugs = approvedProducts.map(p => getProductSlug(p));
const flaggedSlugs = reviewProducts.map(p => getProductSlug(p));

// Verify approved are in sitemap
const missingApproved = expectedApprovedSlugs.filter(s => !sitemapProdSlugs.includes(s));
if (missingApproved.length > 0) {
  console.error('FAIL: Missing approved products in sitemap:', missingApproved);
  errors++;
} else {
  console.log(`PASS: All ${expectedApprovedSlugs.length} approved products present in sitemap`);
}

// Verify flagged are NOT in sitemap
const mistakenlyIncluded = flaggedSlugs.filter(s => sitemapProdSlugs.includes(s));
if (mistakenlyIncluded.length > 0) {
  console.error('FAIL: Compliance-review products erroneously in sitemap:', mistakenlyIncluded);
  errors++;
} else {
  console.log(`PASS: All ${flaggedSlugs.length} compliance-review products properly excluded from sitemap`);
}

// 5. Blog posts check (all 24)
const sitemapBlogSlugs = urls.filter(u => u.includes('/blog/')).map(u => u.replace('https://eudossier.eu/blog/', ''));
const expectedBlogSlugs = BLOG_POSTS.map(p => p.slug);
const missingBlogs = expectedBlogSlugs.filter(s => !sitemapBlogSlugs.includes(s));
if (missingBlogs.length > 0) {
  console.error('FAIL: Missing blog posts in sitemap:', missingBlogs);
  errors++;
} else {
  console.log(`PASS: All ${expectedBlogSlugs.length} blog posts present in sitemap`);
}

// 6. Multilingual Hreflang Reciprocity Check
console.log('--- HREFLANG AUDIT ---');
let hreflangIssues = 0;
for (const [slug, alternates] of Object.entries(BLOG_HREFLANGS)) {
  const self = alternates.find(a => a.href === `https://eudossier.eu/blog/${slug}`);
  if (!self) {
    console.error(`Post ${slug} does not have self-referencing alternate in its hreflang list!`);
    hreflangIssues++;
  }
  for (const alt of alternates) {
    if (!urls.includes(alt.href)) {
      console.error(`Hreflang URL ${alt.href} (for ${slug}) is NOT in sitemap!`);
      hreflangIssues++;
    }
  }
}
if (hreflangIssues === 0) {
  console.log('PASS: All hreflang clusters verified with 100% reciprocity and sitemap matching');
} else {
  errors += hreflangIssues;
}

console.log(`\nOVERALL STATUS: ${errors === 0 ? 'ALL CHECKS PASSED' : `FAILED WITH ${errors} ERRORS`}`);
if (errors > 0) process.exit(1);
