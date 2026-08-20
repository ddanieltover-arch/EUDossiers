import 'dotenv/config';
import { syncProductNameTranslations } from '../src/server/products-repository';

const updated = await syncProductNameTranslations();
console.log(`Synced name and description translations for ${updated} products`);
