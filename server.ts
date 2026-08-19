import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_STOCK_ADJUSTMENTS, 
  INITIAL_GDPR_PREFERENCES, 
  INITIAL_CONSENT_LOGS, 
  SUPPORTED_CURRENCIES, 
  EU_COUNTRIES 
} from './src/data/mockData';
import { Product, StockAdjustment, GDPRPreferences, ConsentLog, DSARPackage } from './src/types';
import { SITE_NAME, EXPORT_PREFIX } from './src/brand';
import {
  applyStockChange,
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  seedProductsIfEmpty,
  updateProduct,
} from './src/server/products-repository';
import {
  deleteOrderById,
  listOrders,
  updateOrderById,
} from './src/server/orders-repository';
import {
  createCheckoutOrder,
  parseContactPayload,
  patchCheckoutOrder,
} from './src/server/orders-service';
import { notifyAdminGdpr, notifyContactMessage } from './src/server/email/notifications';

// In-memory data store for server session persistence (non-catalogue)
let stockAdjustmentsStore: StockAdjustment[] = [...INITIAL_STOCK_ADJUSTMENTS];
let userConsentPreferences: GDPRPreferences = { ...INITIAL_GDPR_PREFERENCES };
let consentLogsStore: ConsentLog[] = [...INITIAL_CONSENT_LOGS];

// Current simulated user profile
let userProfile = {
  name: 'Alexandre Laurent',
  email: 'alexandre.laurent@example.eu',
  preferredCountry: 'DE',
  preferredCurrency: 'EUR',
  ipHash: 'e710b***.fra.de (Pseudonymized EU IPv4)',
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  await seedProductsIfEmpty(INITIAL_PRODUCTS);

  app.use(express.json());

  // --- API ROUTES ---

  // 1. PRODUCTS & INVENTORY (Neon)
  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      res.json(await listProducts());
    } catch (err) {
      console.error('Failed to load products from Neon:', err);
      res.status(500).json({ error: 'Failed to load catalogue from Neon' });
    }
  });

  app.post('/api/products', async (req: Request, res: Response) => {
    try {
      const newProduct = await createProduct(req.body || {});

      const initialAdjustment: StockAdjustment = {
        id: `adj-${Date.now()}`,
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        warehouseId: newProduct.warehouses[0]?.warehouseId || 'wh-fra',
        warehouseName: newProduct.warehouses[0]?.warehouseName || 'Frankfurt Hub (DE-01)',
        adjustmentType: 'RESTOCK',
        quantityChange: newProduct.totalStock,
        previousStock: 0,
        newStock: newProduct.totalStock,
        note: 'Initial catalog creation',
        performedBy: 'Merchant Admin',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      };
      stockAdjustmentsStore.unshift(initialAdjustment);

      res.status(201).json(newProduct);
    } catch (err) {
      console.error('Failed to create product in Neon:', err);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  app.put('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await updateProduct(id, req.body || {});
      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updated);
    } catch (err) {
      console.error('Failed to update product in Neon:', err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ success: true, deletedId: id });
    } catch (err) {
      console.error('Failed to delete product in Neon:', err);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  // 2. STOCK ADJUSTMENTS
  app.get('/api/inventory/adjustments', (_req: Request, res: Response) => {
    res.json(stockAdjustmentsStore);
  });

  app.post('/api/inventory/adjust', async (req: Request, res: Response) => {
    const { productId, warehouseId, quantityChange, adjustmentType, note, performedBy } = req.body;

    const existing = await getProductById(productId);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const previousStock = existing.totalStock;
    const product = await applyStockChange(productId, warehouseId, Number(quantityChange));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const warehouse =
      product.warehouses.find((w) => w.warehouseId === warehouseId) || product.warehouses[0];

    const newAdjustment: StockAdjustment = {
      id: `adj-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      warehouseId: warehouse?.warehouseId || 'wh-fra',
      warehouseName: warehouse?.warehouseName || 'Frankfurt Hub (DE-01)',
      adjustmentType,
      quantityChange: Number(quantityChange),
      previousStock,
      newStock: product.totalStock,
      note: note || `${adjustmentType} manual stock adjustment`,
      performedBy: performedBy || 'Inventory Manager',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };

    stockAdjustmentsStore.unshift(newAdjustment);
    res.json({ product, adjustment: newAdjustment });
  });

  app.post('/api/inventory/import', async (req: Request, res: Response) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    let updatedCount = 0;
    for (const item of items as Partial<Product>[]) {
      if (!item.sku) continue;
      const catalogue = await listProducts();
      const existing = catalogue.find((p) => p.sku === item.sku);
      if (!existing) continue;
      await updateProduct(existing.id, {
        totalStock: typeof item.totalStock === 'number' ? item.totalStock : existing.totalStock,
        priceEUR: typeof item.priceEUR === 'number' ? item.priceEUR : existing.priceEUR,
      });
      updatedCount += 1;
    }

    res.json({ success: true, updatedCount });
  });

  // 3. ORDERS & CHECKOUT (TRANSACTIONS IN EURO BY DEFAULT)
  app.get('/api/orders', async (_req: Request, res: Response) => {
    try {
      res.json(await listOrders());
    } catch (err) {
      console.error('Failed to load orders:', err);
      res.status(500).json({ error: 'Failed to load orders' });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        destinationCountry,
        paymentMethod,
        items,
        subtotalEUR,
        vatAmountEUR,
        vatRate,
        shippingFeeEUR,
        cryptoDiscountEUR,
        totalEUR,
        paidCurrency,
        paidCurrencySymbol,
        paidAmountConverted,
        exchangeRateUsed,
        gdprConsentRecorded,
      } = req.body;

      if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Customer name, email, and at least one item are required' });
      }

      const newOrder = await createCheckoutOrder(
        {
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          destinationCountry,
          paymentMethod,
          items,
          subtotalEUR,
          vatAmountEUR,
          vatRate,
          shippingFeeEUR,
          cryptoDiscountEUR,
          totalEUR,
          paidCurrency,
          paidCurrencySymbol,
          paidAmountConverted,
          exchangeRateUsed,
          gdprConsentRecorded,
        },
        (adjustment) => stockAdjustmentsStore.unshift(adjustment)
      );

      consentLogsStore.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Transaction Executed (EUR Default)',
        ipAddressHash: userProfile.ipHash,
        details: `Order ${newOrder.id} placed for ${newOrder.totalEUR.toFixed(2)} EUR (Display ref: ${newOrder.paidAmountConverted.toFixed(2)} ${newOrder.paidCurrency}). GDPR consent confirmed.`,
      });

      res.status(201).json(newOrder);
    } catch (err) {
      console.error('Failed to create order:', err);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.patch('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const updated = await patchCheckoutOrder(req.params.id, req.body || {});
      if (!updated) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(updated);
    } catch (err) {
      console.error('Failed to update order:', err);
      res.status(500).json({ error: 'Failed to update order' });
    }
  });

  app.delete('/api/orders/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await deleteOrderById(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ success: true, deletedId: req.params.id });
    } catch (err) {
      console.error('Failed to delete order:', err);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const parsed = parseContactPayload(req.body);
    if ('error' in parsed) {
      return res.status(400).json({ error: parsed.error });
    }
    try {
      await notifyContactMessage(parsed);
      res.json({ success: true });
    } catch (err) {
      console.error('Failed to send contact emails:', err);
      res.status(500).json({ error: 'Failed to send your message. Please try again or email us directly.' });
    }
  });

  // 4. GDPR DATA PRIVACY ENDPOINTS
  app.get('/api/gdpr/consent-logs', (req: Request, res: Response) => {
    res.json(consentLogsStore);
  });

  app.post('/api/gdpr/consent', (req: Request, res: Response) => {
    const preferences: GDPRPreferences = req.body;
    userConsentPreferences = {
      ...preferences,
      lastUpdated: new Date().toISOString(),
    };

    const newLog: ConsentLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Updated Privacy Preferences',
      ipAddressHash: userProfile.ipHash,
      details: `Essential: Active | Analytics: ${preferences.analytics ? 'Yes' : 'No'} | Marketing: ${preferences.marketing ? 'Yes' : 'No'} | Functional: ${preferences.functional ? 'Yes' : 'No'}`,
    };

    consentLogsStore.unshift(newLog);
    res.json({ success: true, preferences: userConsentPreferences, log: newLog });
  });

  // DSAR: Data Subject Access Request (Download full personal data)
  app.get('/api/gdpr/export', async (_req: Request, res: Response) => {
    const orderHistory = await listOrders();
    const dsarBundle: DSARPackage = {
      generatedAt: new Date().toISOString(),
      gdprComplianceNotice: 'This document contains all personal data and processing activity recorded under Regulation (EU) 2016/679 (General Data Protection Regulation). All transaction ledgers are held in Euro (€).',
      userProfile,
      consentPreferences: userConsentPreferences,
      consentAuditTrail: consentLogsStore,
      orderHistory,
      dataStorageLocation: 'Frankfurt, Germany (EU West Primary Server - Cloud Run)',
    };

    consentLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'DSAR Export Requested',
      ipAddressHash: userProfile.ipHash,
      details: 'Full JSON data package exported by data subject under GDPR Article 15.',
    });

    notifyAdminGdpr(
      'DSAR export requested',
      `A data subject access request was fulfilled. ${orderHistory.length} order record(s) were included in the export package.`
    ).catch((err) => console.error('GDPR DSAR email failed:', err));

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="GDPR_Personal_Data_Export_${EXPORT_PREFIX}.json"`);
    res.json(dsarBundle);
  });

  app.post('/api/gdpr/erasure', async (_req: Request, res: Response) => {
    userProfile = {
      name: 'Anonymized User',
      email: 'anonymized.gdpr@deleted.eu',
      preferredCountry: 'DE',
      preferredCurrency: 'EUR',
      ipHash: '00000***.anonymized',
    };

    const existingOrders = await listOrders();
    await Promise.all(
      existingOrders.map((ord) =>
        updateOrderById(ord.id, {
          customerName: 'Anonymized Customer (GDPR Art.17)',
          customerEmail: 'anonymized@gdpr.eu',
          customerPhone: '',
          customerAddress: '',
        })
      )
    );

    userConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      lastUpdated: new Date().toISOString(),
      consentVersion: 'v2.4-EU-GDPR-ERASED',
    };

    const erasureLog: ConsentLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Right to Be Forgotten Exercised (GDPR Art. 17)',
      ipAddressHash: '00000***.anonymized',
      details: 'All identifiable customer records pseudonymized/purged. Essential transaction totals retained in EUR for tax compliance.',
    };

    consentLogsStore = [erasureLog];

    notifyAdminGdpr(
      'Right to be forgotten exercised',
      'Identifiable customer records were pseudonymized under GDPR Article 17. Essential transaction totals were retained in EUR for tax compliance.'
    ).catch((err) => console.error('GDPR erasure email failed:', err));

    res.json({
      success: true,
      message: 'Your personal data has been erased in accordance with GDPR Article 17.',
      erasureLog,
    });
  });

  // 5. RATES & VAT METADATA
  app.get('/api/rates', (req: Request, res: Response) => {
    res.json({
      baseCurrency: 'EUR',
      supportedCurrencies: SUPPORTED_CURRENCIES,
      lastUpdated: new Date().toISOString(),
    });
  });

  app.get('/api/vat', (req: Request, res: Response) => {
    res.json(EU_COUNTRIES);
  });

  // --- VITE MIDDLEWARE / PRODUCTION SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`${SITE_NAME} Express Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
