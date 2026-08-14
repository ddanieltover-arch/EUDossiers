import 'dotenv/config';
import { syncLocalCatalogueImageUrls } from '../src/server/products-repository';

async function main() {
  const updated = await syncLocalCatalogueImageUrls();
  console.log(`Updated ${updated} product image URLs to local /catalogue assets.`);
}

main().catch((err) => {
  console.error('Failed to sync catalogue images:', err);
  process.exit(1);
});
