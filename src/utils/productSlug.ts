import type { Product } from '../types';

/** English-only URL slug from the catalogue name. Language UI never changes this. */
export function slugifyEnglishName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function getProductSlug(product: Pick<Product, 'id' | 'name' | 'sku'> & { slug?: string }): string {
  if (product.slug) return product.slug;
  return slugifyEnglishName(product.name) || slugifyEnglishName(product.sku) || product.id;
}

export function getProductPath(product: Pick<Product, 'id' | 'name' | 'sku'> & { slug?: string }): string {
  return `/catalogue/${getProductSlug(product)}`;
}

export function findProductBySlugOrId(
  products: Product[],
  param: string | undefined
): Product | undefined {
  if (!param) return undefined;
  let decoded = param;
  try {
    decoded = decodeURIComponent(param).toLowerCase().trim();
  } catch {
    decoded = param.toLowerCase().trim();
  }

  // 1. Exact match by slug
  const bySlug = products.find((product) => getProductSlug(product).toLowerCase() === decoded);
  if (bySlug) return bySlug;

  // 1b. Exact match by explicit product.slug
  const byExplicitSlug = products.find((product) => product.slug && product.slug.toLowerCase() === decoded);
  if (byExplicitSlug) return byExplicitSlug;

  // 2. Exact match by id
  const byId = products.find((product) => product.id.toLowerCase() === decoded);
  if (byId) return byId;

  // 3. Fallback: match by prefix or truncated slug (e.g. from previous sitemap crawl: 'registered-french-id-card-carte-nationale-d')
  if (decoded.length >= 8) {
    const byPrefix = products.find((product) => {
      const slug = getProductSlug(product).toLowerCase();
      return slug.startsWith(decoded) || decoded.startsWith(slug);
    });
    if (byPrefix) return byPrefix;
  }

  // 4. Fallback: match by SKU or SKU-slugified
  const bySku = products.find(
    (product) =>
      product.sku.toLowerCase() === decoded ||
      slugifyEnglishName(product.sku) === decoded
  );
  if (bySku) return bySku;

  return undefined;
}
