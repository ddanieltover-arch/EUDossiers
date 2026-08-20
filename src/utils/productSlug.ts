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

export function getProductSlug(product: Pick<Product, 'id' | 'name' | 'sku'>): string {
  return slugifyEnglishName(product.name) || slugifyEnglishName(product.sku) || product.id;
}

export function getProductPath(product: Pick<Product, 'id' | 'name' | 'sku'>): string {
  return `/catalogue/${getProductSlug(product)}`;
}

export function findProductBySlugOrId(
  products: Product[],
  param: string | undefined
): Product | undefined {
  if (!param) return undefined;
  let decoded = param;
  try {
    decoded = decodeURIComponent(param);
  } catch {
    decoded = param;
  }
  const bySlug = products.find((product) => getProductSlug(product) === decoded);
  if (bySlug) return bySlug;
  return products.find((product) => product.id === decoded);
}
