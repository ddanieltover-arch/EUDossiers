import 'dotenv/config';
import { INITIAL_PRODUCTS } from '../src/data/mockData';
import { countProducts, seedProductsIfEmpty } from '../src/server/products-repository';

async function main() {
  const inserted = await seedProductsIfEmpty(INITIAL_PRODUCTS);
  const total = await countProducts();
  console.log(`Seeded ${inserted} catalogue items. Total products in Neon: ${total}`);
}

main().catch((err) => {
  console.error('Failed to seed products:', err);
  process.exit(1);
});
