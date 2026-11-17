import fs from 'fs';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { getProductSlug } from '../src/utils/productSlug';
import { BLOG_POSTS } from '../src/data/blogData';
import { BLOG_HREFLANGS } from '../src/data/hreflangData';

const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = (xml.match(/<loc>[^<]+<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));

console.log('--- SITEMAP AUDIT ---');
console.log('Total URLs in sitemap:', urls.length);

// 1. Verify all URLs use https://eudossier.eu
const nonApexUrls = urls.filter(u => !u.startsWith('https://eudossier.eu/'));
console.log('Non-apex URLs:', nonApexUrls);

// 2. Verify no private pages
const privateUrls = urls.filter(u => /\/(admin|cart|checkout|api)(\/|$)/.test(u));
console.log('Private URLs in sitemap:', privateUrls);

// 3. Verify no search / placeholder URLs
const searchUrls = urls.filter(u => u.includes('search') || u.includes('%7B') || u.includes('{'));
console.log('Search / placeholder URLs in sitemap:', searchUrls);

// 4. Products check
const sitemapProdSlugs = urls.filter(u => u.includes('/catalogue/')).map(u => u.replace('https://eudossier.eu/catalogue/', ''));
const expectedProdSlugs = INITIAL_PRODUCTS.map(p => getProductSlug(p));
const missingProds = expectedProdSlugs.filter(s => !sitemapProdSlugs.includes(s));
const extraProds = sitemapProdSlugs.filter(s => !expectedProdSlugs.includes(s));
console.log(`Products: ${sitemapProdSlugs.length} in sitemap, ${expectedProdSlugs.length} in data. Missing: ${missingProds.length}, Extra: ${extraProds.length}`);

// 5. Blog posts check
const sitemapBlogSlugs = urls.filter(u => u.includes('/blog/')).map(u => u.replace('https://eudossier.eu/blog/', ''));
const expectedBlogSlugs = BLOG_POSTS.map(p => p.slug);
const missingBlogs = expectedBlogSlugs.filter(s => !sitemapBlogSlugs.includes(s));
const extraBlogs = sitemapBlogSlugs.filter(s => !expectedBlogSlugs.includes(s));
console.log(`Blog Posts: ${sitemapBlogSlugs.length} in sitemap, ${expectedBlogSlugs.length} in data. Missing: ${missingBlogs.length}, Extra: ${extraBlogs.length}`);

// 6. Multilingual Hreflang Reciprocity Check
console.log('--- HREFLANG AUDIT ---');
let hreflangIssues = 0;
for (const [slug, alternates] of Object.entries(BLOG_HREFLANGS)) {
  // Check self-reference
  const self = alternates.find(a => a.href === `https://eudossier.eu/blog/${slug}`);
  if (!self) {
    console.error(`Post ${slug} does not have self-referencing alternate in its hreflang list!`);
    hreflangIssues++;
  }
  // Check that all alternates exist in sitemap
  for (const alt of alternates) {
    if (!urls.includes(alt.href)) {
      console.error(`Hreflang URL ${alt.href} (for ${slug}) is NOT in sitemap!`);
      hreflangIssues++;
    }
  }
}
console.log(`Hreflang validation completed with ${hreflangIssues} issues.`);
