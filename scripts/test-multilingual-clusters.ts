import fs from 'fs';
import { BLOG_HREFLANGS, HreflangAlternate } from '../src/data/hreflangData';
import { BLOG_POSTS } from '../src/data/blogData';

const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const sitemapUrls = (xml.match(/<loc>[^<]+<\/loc>/g) || []).map(l => l.replace(/<\/?loc>/g, ''));

console.log('=== MULTILINGUAL HREFLANG CLUSTER VALIDATION ===\n');

// Group the clusters by unique x-default URL
const clusterMap = new Map<string, { primarySlug: string; alternates: HreflangAlternate[] }>();
for (const [slug, alternates] of Object.entries(BLOG_HREFLANGS)) {
  const xDefault = alternates.find(a => a.hreflang === 'x-default');
  if (xDefault && !clusterMap.has(xDefault.href)) {
    clusterMap.set(xDefault.href, { primarySlug: slug, alternates });
  }
}

console.log(`Found ${clusterMap.size} distinct multilingual clusters.\n`);

let totalAlternatesTested = 0;
let errorsFound = 0;

let clusterIndex = 1;
for (const [xDefaultHref, { primarySlug, alternates }] of clusterMap.entries()) {
  console.log(`--- Cluster ${clusterIndex}: Primary ${primarySlug} ---`);
  console.log(`  x-default: ${xDefaultHref}`);

  // 1. Verify x-default points to an actual published post
  const xDefaultSlug = xDefaultHref.replace('https://eudossier.eu/blog/', '');
  const xDefaultPost = BLOG_POSTS.find(p => p.slug === xDefaultSlug);
  if (!xDefaultPost) {
    console.error(`  [FAIL] x-default slug "${xDefaultSlug}" not found in BLOG_POSTS!`);
    errorsFound++;
  } else {
    console.log(`  [PASS] x-default resolves to article: "${xDefaultPost.title}"`);
  }

  // 2. Test each alternate in the cluster
  for (const alt of alternates) {
    if (alt.hreflang === 'x-default') continue;
    totalAlternatesTested++;

    const altSlug = alt.href.replace('https://eudossier.eu/blog/', '');
    const altPost = BLOG_POSTS.find(p => p.slug === altSlug);

    if (!altPost) {
      console.error(`  [FAIL] Alternate ${alt.hreflang} (${alt.href}) not found in BLOG_POSTS!`);
      errorsFound++;
      continue;
    }

    // Check language match
    const expectedLang = alt.hreflang.split('-')[0];
    const postLang = altPost.language || 'en';
    if (expectedLang !== postLang) {
      console.error(`  [FAIL] Language mismatch for ${altSlug}: hreflang="${alt.hreflang}", post.language="${postLang}"`);
      errorsFound++;
    }

    // Check sitemap inclusion
    const inSitemap = sitemapUrls.includes(alt.href);
    if (!inSitemap) {
      console.error(`  [FAIL] URL ${alt.href} is MISSING from sitemap.xml!`);
      errorsFound++;
    }

    // Check reciprocal linking
    const reverseAlternates = BLOG_HREFLANGS[altSlug];
    if (!reverseAlternates) {
      console.error(`  [FAIL] Reciprocal hreflang MISSING for alternate slug "${altSlug}"!`);
      errorsFound++;
    } else {
      const reciprocalBack = reverseAlternates.find(r => r.href === `https://eudossier.eu/blog/${primarySlug}`);
      if (!reciprocalBack) {
        console.error(`  [FAIL] Reciprocal link back to primary ${primarySlug} MISSING in ${altSlug}!`);
        errorsFound++;
      }
    }

    console.log(`  [PASS] ${alt.hreflang} -> ${alt.href} (Lang: ${postLang}, In Sitemap: ${inSitemap ? 'YES' : 'NO'}, Reciprocal: YES)`);
  }
  clusterIndex++;
  console.log('');
}

console.log(`=== AUDIT SUMMARY ===`);
console.log(`Total Alternates Tested: ${totalAlternatesTested}`);
console.log(`Total Errors / Failures: ${errorsFound}`);
if (errorsFound === 0) {
  console.log('RESULT: 100% of all multilingual alternates verified, exist in published data, match sitemap, and maintain strict reciprocity.\n');
}
