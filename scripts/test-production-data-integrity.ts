import fs from 'fs';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { getProductSlug } from '../src/utils/productSlug';
import { isProductUnderComplianceReview, COMPLIANCE_REVIEW_PRODUCT_IDS } from '../src/data/compliancePolicy';
import { mapProductRow } from '../src/server/products-repository';

console.log('=== EUDOSSIER PRODUCTION DATA INTEGRITY TEST ===\n');

let allPassed = true;

// Helper to simulate raw Neon DB row
function createMockDbRow(product: any) {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    name_translations: product.nameTranslations || null,
    description_translations: product.descriptionTranslations || null,
    category: product.category,
    description: product.description,
    price_eur: product.priceEUR,
    original_price_eur: product.originalPriceEUR || null,
    origin_country: product.originCountry,
    origin_flag: product.originFlag,
    image_url: product.imageUrl,
    gallery_images: product.galleryImages || null,
    total_stock: product.totalStock,
    low_stock_threshold: product.lowStockThreshold,
    warehouses: product.warehouses || null,
    vat_rate_category: product.vatRateCategory,
    weight_kg: product.weightKg,
    supplier_name: product.supplierName,
    tags: product.tags || null,
    last_restocked: product.lastRestocked,
  };
}

// 1. Check sitemap
const sitemapContent = fs.readFileSync('public/sitemap.xml', 'utf-8');
const sitemapUrlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
const sitemapUrls = sitemapUrlMatches.map(m => m.replace(/<\/?loc>/g, ''));

console.log(`Total URLs in sitemap.xml: ${sitemapUrls.length}`);
if (sitemapUrls.length !== 52) {
  console.error(`FAIL: Expected 52 URLs in sitemap.xml, got ${sitemapUrls.length}`);
  allPassed = false;
} else {
  console.log(`PASS: sitemap.xml contains exactly 52 URLs.`);
}

// 2. Test 5 Compliance Review Products
const FLAGGED_IDS = ['doc-006', 'doc-009', 'doc-013', 'doc-027', 'doc-028'];
console.log('\n--- VERIFYING 5 COMPLIANCE REVIEW PRODUCTS ---');

for (const id of FLAGGED_IDS) {
  const product = INITIAL_PRODUCTS.find(p => p.id === id);
  if (!product) {
    console.error(`FAIL: Product ${id} not found in INITIAL_PRODUCTS`);
    allPassed = false;
    continue;
  }

  // Neon DB Row Mapping Test
  const mockDbRow = createMockDbRow(product);
  const mappedFromDb = mapProductRow(mockDbRow);

  const isFlaggedInPolicy = isProductUnderComplianceReview(product);
  const isFlaggedFromDb = mappedFromDb.complianceReviewPending === true;
  const slug = getProductSlug(product);
  const inSitemap = sitemapUrls.some(u => u.includes(slug));

  // ProductPage logic simulation:
  const isUnderReview = isProductUnderComplianceReview(product);
  const robotsDirective = isUnderReview ? 'noindex, follow' : 'index, follow';
  const structuredDataSuppressed = isUnderReview;

  console.log(`\nProduct: ${id} - "${product.name}"`);
  console.log(`  - Compliance Policy Match: ${isFlaggedInPolicy ? 'YES' : 'NO'}`);
  console.log(`  - Neon DB Row Mapped Flag: ${mappedFromDb.complianceReviewPending}`);
  console.log(`  - Robots Metadata: ${robotsDirective}`);
  console.log(`  - Structured Data (Product/Offer): ${structuredDataSuppressed ? 'SUPPRESSED' : 'PRESENT'}`);
  console.log(`  - In Sitemap.xml: ${inSitemap ? 'YES (FAIL)' : 'EXCLUDED (PASS)'}`);

  if (!isFlaggedInPolicy || !isFlaggedFromDb || inSitemap || !structuredDataSuppressed || robotsDirective !== 'noindex, follow') {
    console.error(`  --> FAIL on product ${id}`);
    allPassed = false;
  } else {
    console.log(`  --> PASS`);
  }
}

// 3. Test 3 Approved Products
const APPROVED_IDS = ['doc-001', 'doc-002', 'doc-003'];
console.log('\n--- VERIFYING 3 APPROVED CONTROL PRODUCTS ---');

for (const id of APPROVED_IDS) {
  const product = INITIAL_PRODUCTS.find(p => p.id === id);
  if (!product) {
    console.error(`FAIL: Product ${id} not found in INITIAL_PRODUCTS`);
    allPassed = false;
    continue;
  }

  const mockDbRow = createMockDbRow(product);
  const mappedFromDb = mapProductRow(mockDbRow);

  const isFlaggedInPolicy = isProductUnderComplianceReview(product);
  const isFlaggedFromDb = mappedFromDb.complianceReviewPending === true;
  const slug = getProductSlug(product);
  const inSitemap = sitemapUrls.some(u => u.includes(slug));

  const isUnderReview = isProductUnderComplianceReview(product);
  const robotsDirective = isUnderReview ? 'noindex, follow' : 'index, follow';
  const structuredDataSuppressed = isUnderReview;

  console.log(`\nProduct: ${id} - "${product.name}"`);
  console.log(`  - Compliance Policy Match: ${isFlaggedInPolicy ? 'YES' : 'NO'}`);
  console.log(`  - Neon DB Row Mapped Flag: ${mappedFromDb.complianceReviewPending}`);
  console.log(`  - Robots Metadata: ${robotsDirective}`);
  console.log(`  - Structured Data (Product/Offer): ${structuredDataSuppressed ? 'SUPPRESSED' : 'PRESENT (ACTIVE)'}`);
  console.log(`  - In Sitemap.xml: ${inSitemap ? 'INCLUDED (PASS)' : 'MISSING (FAIL)'}`);

  if (isFlaggedInPolicy || isFlaggedFromDb || !inSitemap || structuredDataSuppressed || robotsDirective !== 'index, follow') {
    console.error(`  --> FAIL on product ${id}`);
    allPassed = false;
  } else {
    console.log(`  --> PASS`);
  }
}

console.log('\n=======================================');
if (allPassed) {
  console.log('ALL INTEGRITY CHECKS PASSED SUCCESSFULLY.');
} else {
  console.error('INTEGRITY CHECKS COMPLETED WITH FAILURES.');
  process.exit(1);
}
