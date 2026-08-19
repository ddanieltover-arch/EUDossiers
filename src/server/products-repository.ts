import { Product, WarehouseStock } from '../types';
import { localCatalogueImages, withLocalCatalogueImages } from '../data/catalogueAssets';
import { getSql } from './db';

type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category: Product['category'];
  description: string;
  price_eur: string | number;
  original_price_eur: string | number | null;
  origin_country: string;
  origin_flag: string;
  image_url: string;
  gallery_images: string[] | null;
  total_stock: number;
  low_stock_threshold: number;
  warehouses: WarehouseStock[] | null;
  vat_rate_category: Product['vatRateCategory'];
  weight_kg: string | number;
  supplier_name: string;
  tags: string[] | null;
  last_restocked: string;
};

export function mapProductRow(row: ProductRow): Product {
  return withLocalCatalogueImages({
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    description: row.description,
    priceEUR: Number(row.price_eur),
    originalPriceEUR:
      row.original_price_eur == null ? undefined : Number(row.original_price_eur),
    originCountry: row.origin_country,
    originFlag: row.origin_flag,
    imageUrl: row.image_url,
    galleryImages: row.gallery_images ?? [],
    totalStock: Number(row.total_stock),
    lowStockThreshold: Number(row.low_stock_threshold),
    warehouses: row.warehouses ?? [],
    vatRateCategory: row.vat_rate_category,
    weightKg: Number(row.weight_kg),
    supplierName: row.supplier_name,
    tags: row.tags ?? [],
    lastRestocked: row.last_restocked,
  });
}

export async function ensureProductsTable(): Promise<void> {
  const sql = await getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price_eur NUMERIC(12,2) NOT NULL,
      original_price_eur NUMERIC(12,2),
      origin_country TEXT NOT NULL,
      origin_flag TEXT NOT NULL,
      image_url TEXT NOT NULL,
      gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
      total_stock INTEGER NOT NULL DEFAULT 0,
      low_stock_threshold INTEGER NOT NULL DEFAULT 0,
      warehouses JSONB NOT NULL DEFAULT '[]'::jsonb,
      vat_rate_category TEXT NOT NULL DEFAULT 'standard',
      weight_kg NUMERIC(8,3) NOT NULL DEFAULT 0,
      supplier_name TEXT NOT NULL DEFAULT '',
      tags JSONB NOT NULL DEFAULT '[]'::jsonb,
      last_restocked TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function listProducts(): Promise<Product[]> {
  const sql = await getSql();
  const rows = await sql`
    SELECT *
    FROM products
    ORDER BY created_at DESC, name ASC
  `;
  return (rows as ProductRow[]).map(mapProductRow);
}

export async function countProducts(): Promise<number> {
  await ensureProductsTable();
  const sql = await getSql();
  const rows = await sql`SELECT COUNT(*)::int AS count FROM products`;
  return Number(rows[0]?.count ?? 0);
}

export async function getProductById(id: string): Promise<Product | null> {
  const sql = await getSql();
  const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
  const row = (rows as ProductRow[])[0];
  return row ? mapProductRow(row) : null;
}

async function insertProduct(product: Product): Promise<Product> {
  const localProduct = withLocalCatalogueImages(product);
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO products (
      id, sku, name, category, description,
      price_eur, original_price_eur, origin_country, origin_flag,
      image_url, gallery_images, total_stock, low_stock_threshold,
      warehouses, vat_rate_category, weight_kg, supplier_name, tags, last_restocked
    ) VALUES (
      ${localProduct.id},
      ${localProduct.sku},
      ${localProduct.name},
      ${localProduct.category},
      ${localProduct.description},
      ${localProduct.priceEUR},
      ${localProduct.originalPriceEUR ?? null},
      ${localProduct.originCountry},
      ${localProduct.originFlag},
      ${localProduct.imageUrl},
      ${JSON.stringify(localProduct.galleryImages ?? [])}::jsonb,
      ${localProduct.totalStock},
      ${localProduct.lowStockThreshold},
      ${JSON.stringify(localProduct.warehouses ?? [])}::jsonb,
      ${localProduct.vatRateCategory},
      ${localProduct.weightKg},
      ${localProduct.supplierName},
      ${JSON.stringify(localProduct.tags ?? [])}::jsonb,
      ${localProduct.lastRestocked}
    )
    RETURNING *
  `;
  return mapProductRow((rows as ProductRow[])[0]);
}

export async function seedProductsIfEmpty(catalogue: Product[]): Promise<number> {
  await ensureProductsTable();
  const existing = await countProducts();
  if (existing > 0) return 0;

  let inserted = 0;
  for (const product of catalogue) {
    await insertProduct(product);
    inserted += 1;
  }
  return inserted;
}

export async function createProduct(input: Partial<Product>): Promise<Product> {
  await ensureProductsTable();
  const product: Product = {
    id: input.id || `prod-${Date.now()}`,
    sku: input.sku || `SKU-${Date.now()}`,
    name: input.name || 'Untitled document',
    category: (input.category as Product['category']) || 'Passports',
    description: input.description || '',
    priceEUR: Number(input.priceEUR ?? 0),
    originalPriceEUR: input.originalPriceEUR,
    originCountry: input.originCountry || 'Germany',
    originFlag: input.originFlag || '🇩🇪',
    imageUrl: input.imageUrl || '',
    galleryImages: input.galleryImages ?? [],
    totalStock: Number(input.totalStock ?? 0),
    lowStockThreshold: Number(input.lowStockThreshold ?? 5),
    warehouses: input.warehouses ?? [],
    vatRateCategory: input.vatRateCategory || 'standard',
    weightKg: Number(input.weightKg ?? 0.05),
    supplierName: input.supplierName || '',
    tags: input.tags ?? [],
    lastRestocked: input.lastRestocked || new Date().toISOString().split('T')[0],
  };
  return insertProduct(product);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  const next: Product = {
    ...existing,
    ...updates,
    id: existing.id,
    galleryImages: updates.galleryImages ?? existing.galleryImages,
    warehouses: updates.warehouses ?? existing.warehouses,
    tags: updates.tags ?? existing.tags,
  };

  const sql = await getSql();
  const rows = await sql`
    UPDATE products SET
      sku = ${next.sku},
      name = ${next.name},
      category = ${next.category},
      description = ${next.description},
      price_eur = ${next.priceEUR},
      original_price_eur = ${next.originalPriceEUR ?? null},
      origin_country = ${next.originCountry},
      origin_flag = ${next.originFlag},
      image_url = ${next.imageUrl},
      gallery_images = ${JSON.stringify(next.galleryImages ?? [])}::jsonb,
      total_stock = ${next.totalStock},
      low_stock_threshold = ${next.lowStockThreshold},
      warehouses = ${JSON.stringify(next.warehouses ?? [])}::jsonb,
      vat_rate_category = ${next.vatRateCategory},
      weight_kg = ${next.weightKg},
      supplier_name = ${next.supplierName},
      tags = ${JSON.stringify(next.tags ?? [])}::jsonb,
      last_restocked = ${next.lastRestocked},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  const row = (rows as ProductRow[])[0];
  return row ? mapProductRow(row) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const sql = await getSql();
  const rows = (await sql`DELETE FROM products WHERE id = ${id} RETURNING id`) as { id: string }[];
  return rows.length > 0;
}

export async function syncLocalCatalogueImageUrls(): Promise<number> {
  const sql = await getSql();
  const rows = (await sql`SELECT id FROM products`) as { id: string }[];
  let updated = 0;

  for (const row of rows) {
    const local = localCatalogueImages(row.id);
    if (!local) continue;
    await sql`
      UPDATE products SET
        image_url = ${local.imageUrl},
        gallery_images = ${JSON.stringify(local.galleryImages)}::jsonb,
        updated_at = NOW()
      WHERE id = ${row.id}
    `;
    updated += 1;
  }

  return updated;
}

export async function applyStockChange(
  productId: string,
  warehouseId: string | undefined,
  quantityChange: number
): Promise<Product | null> {
  const product = await getProductById(productId);
  if (!product) return null;

  const change = Number(quantityChange);
  const nextTotal = Math.max(0, product.totalStock + change);
  const warehouses = [...(product.warehouses || [])];
  let warehouse = warehouses.find((w) => w.warehouseId === warehouseId);
  if (!warehouse && warehouses.length > 0) {
    warehouse = warehouses[0];
  }
  if (warehouse) {
    warehouse.quantity = Math.max(0, warehouse.quantity + change);
  }

  return updateProduct(productId, {
    totalStock: nextTotal,
    warehouses,
  });
}
