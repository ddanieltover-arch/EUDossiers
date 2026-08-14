import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_STOCK_ADJUSTMENTS, 
  INITIAL_ORDERS, 
  INITIAL_GDPR_PREFERENCES, 
  INITIAL_CONSENT_LOGS, 
  SUPPORTED_CURRENCIES, 
  EU_COUNTRIES 
} from './src/data/mockData';
import { Product, StockAdjustment, Order, GDPRPreferences, ConsentLog, DSARPackage } from './src/types';
import { SITE_NAME, EXPORT_PREFIX } from './src/brand';

// In-memory data store for server session persistence
let productsStore: Product[] = [...INITIAL_PRODUCTS];
let stockAdjustmentsStore: StockAdjustment[] = [...INITIAL_STOCK_ADJUSTMENTS];
let ordersStore: Order[] = [...INITIAL_ORDERS];
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

  app.use(express.json());

  // --- API ROUTES ---

  // 1. PRODUCTS & INVENTORY
  app.get('/api/products', (req: Request, res: Response) => {
    res.json(productsStore);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    productsStore.unshift(newProduct);

    // Log initial stock adjustment
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
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = productsStore.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    productsStore[index] = { ...productsStore[index], ...req.body };
    res.json(productsStore[index]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    productsStore = productsStore.filter(p => p.id !== id);
    res.json({ success: true, deletedId: id });
  });

  // 2. STOCK ADJUSTMENTS
  app.get('/api/inventory/adjustments', (req: Request, res: Response) => {
    res.json(stockAdjustmentsStore);
  });

  app.post('/api/inventory/adjust', (req: Request, res: Response) => {
    const { productId, warehouseId, quantityChange, adjustmentType, note, performedBy } = req.body;
    
    const product = productsStore.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const previousStock = product.totalStock;
    const newTotalStock = Math.max(0, previousStock + Number(quantityChange));
    product.totalStock = newTotalStock;

    // Update warehouse stock if found
    let warehouse = product.warehouses.find(w => w.warehouseId === warehouseId);
    if (!warehouse && product.warehouses.length > 0) {
      warehouse = product.warehouses[0];
    }
    if (warehouse) {
      warehouse.quantity = Math.max(0, warehouse.quantity + Number(quantityChange));
    }

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
      newStock: newTotalStock,
      note: note || `${adjustmentType} manual stock adjustment`,
      performedBy: performedBy || 'Inventory Manager',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };

    stockAdjustmentsStore.unshift(newAdjustment);
    res.json({ product, adjustment: newAdjustment });
  });

  app.post('/api/inventory/import', (req: Request, res: Response) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    let updatedCount = 0;
    items.forEach((item: Partial<Product>) => {
      if (!item.sku) return;
      const existing = productsStore.find(p => p.sku === item.sku);
      if (existing) {
        if (typeof item.totalStock === 'number') existing.totalStock = item.totalStock;
        if (typeof item.priceEUR === 'number') existing.priceEUR = item.priceEUR;
        updatedCount++;
      }
    });

    res.json({ success: true, updatedCount });
  });

  // 3. ORDERS & CHECKOUT (TRANSACTIONS IN EURO BY DEFAULT)
  app.get('/api/orders', (req: Request, res: Response) => {
    res.json(ordersStore);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { customerName, customerEmail, destinationCountry, items, subtotalEUR, vatAmountEUR, vatRate, shippingFeeEUR, totalEUR, paidCurrency, paidCurrencySymbol, paidAmountConverted, exchangeRateUsed, gdprConsentRecorded } = req.body;

    // Deduct stock for each item ordered
    items.forEach((item: { productId: string; quantity: number }) => {
      const product = productsStore.find(p => p.id === item.productId);
      if (product) {
        const prev = product.totalStock;
        product.totalStock = Math.max(0, product.totalStock - item.quantity);
        
        // Log sale adjustment
        stockAdjustmentsStore.unshift({
          id: `adj-${Date.now()}-${item.productId}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          warehouseId: product.warehouses[0]?.warehouseId || 'wh-fra',
          warehouseName: product.warehouses[0]?.warehouseName || 'Frankfurt Hub (DE-01)',
          adjustmentType: 'SALE',
          quantityChange: -item.quantity,
          previousStock: prev,
          newStock: product.totalStock,
          note: `Order auto-deduction (Ref: EU-ORD-${Date.now().toString().slice(-5)})`,
          performedBy: 'System Auto Checkout',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        });
      }
    });

    const newOrder: Order = {
      id: `EU-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: customerName || userProfile.name,
      customerEmail: customerEmail || userProfile.email,
      destinationCountry,
      items,
      subtotalEUR,
      vatAmountEUR,
      vatRate,
      shippingFeeEUR,
      totalEUR, // Stored strictly in Euro for accounting
      paidCurrency: paidCurrency || 'EUR',
      paidCurrencySymbol: paidCurrencySymbol || '€',
      paidAmountConverted: paidAmountConverted || totalEUR,
      exchangeRateUsed: exchangeRateUsed || 1.0,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      gdprConsentRecorded: !!gdprConsentRecorded,
    };

    ordersStore.unshift(newOrder);

    // Audit consent log
    consentLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Transaction Executed (EUR Default)',
      ipAddressHash: userProfile.ipHash,
      details: `Order ${newOrder.id} placed for ${newOrder.totalEUR.toFixed(2)} EUR (Display ref: ${newOrder.paidAmountConverted.toFixed(2)} ${newOrder.paidCurrency}). GDPR consent confirmed.`,
    });

    res.status(201).json(newOrder);
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
  app.get('/api/gdpr/export', (req: Request, res: Response) => {
    const dsarBundle: DSARPackage = {
      generatedAt: new Date().toISOString(),
      gdprComplianceNotice: 'This document contains all personal data and processing activity recorded under Regulation (EU) 2016/679 (General Data Protection Regulation). All transaction ledgers are held in Euro (€).',
      userProfile,
      consentPreferences: userConsentPreferences,
      consentAuditTrail: consentLogsStore,
      orderHistory: ordersStore,
      dataStorageLocation: 'Frankfurt, Germany (EU West Primary Server - Cloud Run)',
    };

    consentLogsStore.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'DSAR Export Requested',
      ipAddressHash: userProfile.ipHash,
      details: 'Full JSON data package exported by data subject under GDPR Article 15.',
    });

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="GDPR_Personal_Data_Export_${EXPORT_PREFIX}.json"`);
    res.json(dsarBundle);
  });

  // RIGHT TO BE FORGOTTEN (Data Erasure under Article 17)
  app.post('/api/gdpr/erasure', (req: Request, res: Response) => {
    // Pseudonymize user profile & remove tracking logs
    userProfile = {
      name: 'Anonymized User',
      email: 'anonymized.gdpr@deleted.eu',
      preferredCountry: 'DE',
      preferredCurrency: 'EUR',
      ipHash: '00000***.anonymized',
    };

    // Anonymize personal info on past orders while preserving accounting totals
    ordersStore = ordersStore.map(ord => ({
      ...ord,
      customerName: 'Anonymized Customer (GDPR Art.17)',
      customerEmail: 'anonymized@gdpr.eu',
    }));

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
