import fs from 'fs';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { getProductSlug } from '../src/utils/productSlug';
import { BLOG_POSTS } from '../src/data/blogData';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
}

const entries: SitemapEntry[] = [];

// 1. Core Pages
entries.push({
  loc: 'https://eudossier.eu/',
  lastmod: '2026-11-17',
  changefreq: 'daily',
  priority: '1.0'
});

entries.push({
  loc: 'https://eudossier.eu/catalogue',
  lastmod: '2026-11-17',
  changefreq: 'daily',
  priority: '0.9'
});

entries.push({
  loc: 'https://eudossier.eu/contact',
  lastmod: '2026-11-10',
  changefreq: 'monthly',
  priority: '0.6'
});

entries.push({
  loc: 'https://eudossier.eu/privacy',
  lastmod: '2026-11-01',
  changefreq: 'monthly',
  priority: '0.5'
});

// 2. Active, Verified Products (Exclude complianceReviewPending: true)
const indexableProducts = INITIAL_PRODUCTS.filter(p => !p.complianceReviewPending);
for (const p of indexableProducts) {
  const slug = getProductSlug(p);
  entries.push({
    loc: `https://eudossier.eu/catalogue/${slug}`,
    lastmod: p.lastRestocked || '2026-11-12',
    changefreq: 'weekly',
    priority: '0.8'
  });
}

// 3. Blog Hub
entries.push({
  loc: 'https://eudossier.eu/blog',
  lastmod: '2026-11-17',
  changefreq: 'daily',
  priority: '0.9'
});

// 4. Blog Articles (All 24 published guides)
for (const post of BLOG_POSTS) {
  entries.push({
    loc: `https://eudossier.eu/blog/${post.slug}`,
    lastmod: post.publishDate || '2026-11-17',
    changefreq: 'weekly',
    priority: '0.8'
  });
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf8');
console.log(`Successfully generated public/sitemap.xml with ${entries.length} URLs.`);
console.log(`Excluded ${INITIAL_PRODUCTS.length - indexableProducts.length} compliance-review products from sitemap.`);
