import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  EUCountryCode, 
  EUCountryVAT, 
  Currency, 
  GDPRPreferences, 
  ConsentLog, 
  Order, 
  StockAdjustment 
} from '../types';
import { EU_COUNTRIES, SUPPORTED_CURRENCIES, INITIAL_PRODUCTS } from '../data/mockData';
import { withLocalCatalogueImages } from '../data/catalogueAssets';
import { EXPORT_PREFIX } from '../brand';

interface StoreContextType {
  // Products & Filters
  products: Product[];
  isLoadingProducts: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedOriginCountry: string;
  setSelectedOriginCountry: (country: string) => void;
  showOnlyInStock: boolean;
  setShowOnlyInStock: (val: boolean) => void;
  
  // Localization & Currency (Base EUR)
  selectedCountry: EUCountryVAT;
  setSelectedCountryByCode: (code: EUCountryCode) => void;
  selectedCurrency: Currency;
  setSelectedCurrencyByCode: (code: string) => void;
  formatPriceEUR: (amountEUR: number) => string;
  getConvertedPriceString: (amountEUR: number) => { mainEUR: string; convertedRef?: string };

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Calculations (EUR transaction base)
  cartSubtotalEUR: number;
  cartVATAmountEUR: number;
  cartShippingFeeEUR: number;
  cartTotalEUR: number;

  // GDPR & Privacy
  gdprPreferences: GDPRPreferences;
  updateGDPRPreferences: (newPrefs: Partial<GDPRPreferences>) => Promise<void>;
  consentLogs: ConsentLog[];
  downloadDSARPackage: () => Promise<void>;
  requestRightToBeForgotten: () => Promise<void>;

  // Inventory Management Tools
  stockAdjustments: StockAdjustment[];
  adjustStock: (productId: string, warehouseId: string, quantityChange: number, type: 'RESTOCK' | 'AUDIT_CORRECTION' | 'DAMAGED' | 'RETURN', note: string) => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  importInventoryItems: (items: Partial<Product>[]) => Promise<number>;

  // Orders & Checkout
  orders: Order[];
  placeOrder: (customerInfo: { name: string; email: string }) => Promise<Order | null>;
  currentCompletedOrder: Order | null;
  setCurrentCompletedOrder: (order: Order | null) => void;
  isLocalizationModalOpen: boolean;
  setIsLocalizationModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOriginCountry, setSelectedOriginCountry] = useState<string>('All');
  const [showOnlyInStock, setShowOnlyInStock] = useState<boolean>(false);

  // Default delivery country: Germany (DE, 19% VAT)
  const [selectedCountry, setSelectedCountry] = useState<EUCountryVAT>(
    EU_COUNTRIES.find(c => c.code === 'DE') || EU_COUNTRIES[0]
  );

  // Display Reference Currency: Defaults strictly to EUR (€)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    SUPPORTED_CURRENCIES.find(c => c.code === 'EUR') || SUPPORTED_CURRENCIES[0]
  );

  // Cart & UI drawers
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLocalizationModalOpen, setIsLocalizationModalOpen] = useState<boolean>(false);

  // GDPR & Audit logs
  const [gdprPreferences, setGdprPreferences] = useState<GDPRPreferences>({
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
    lastUpdated: new Date().toISOString(),
    consentVersion: 'v2.4-EU-GDPR',
  });
  const [consentLogs, setConsentLogs] = useState<ConsentLog[]>([]);

  // Inventory Adjustments & Orders
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentCompletedOrder, setCurrentCompletedOrder] = useState<Order | null>(null);

  // Load initial server data
  useEffect(() => {
    fetchProducts();
    fetchAdjustments();
    fetchOrders();
    fetchConsentLogs();
  }, []);

  const fetchProducts = async () => {
    const localCatalogue = INITIAL_PRODUCTS.map(withLocalCatalogueImages);
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map(withLocalCatalogueImages));
          return;
        }
      }
      setProducts(localCatalogue);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts(localCatalogue);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchAdjustments = async () => {
    try {
      const res = await fetch('/api/inventory/adjustments');
      if (res.ok) {
        const data = await res.json();
        setStockAdjustments(data);
      }
    } catch (err) {
      console.error('Failed to fetch stock adjustments:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const fetchConsentLogs = async () => {
    try {
      const res = await fetch('/api/gdpr/consent-logs');
      if (res.ok) {
        const data = await res.json();
        setConsentLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch consent logs:', err);
    }
  };

  // Country & Currency Switchers
  const setSelectedCountryByCode = (code: EUCountryCode) => {
    const found = EU_COUNTRIES.find(c => c.code === code);
    if (found) setSelectedCountry(found);
  };

  const setSelectedCurrencyByCode = (code: string) => {
    const found = SUPPORTED_CURRENCIES.find(c => c.code === code);
    if (found) setSelectedCurrency(found);
  };

  // Price formatting helper (EUR is ALWAYS primary)
  const formatPriceEUR = (amountEUR: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amountEUR);
  };

  // Multi-currency price renderer helper
  const getConvertedPriceString = (amountEUR: number) => {
    const mainEUR = formatPriceEUR(amountEUR);
    if (selectedCurrency.code === 'EUR') {
      return { mainEUR };
    }
    // Calculate reference estimate
    const convertedVal = amountEUR * selectedCurrency.rateToEUR;
    const formattedRef = `${selectedCurrency.symbol}${convertedVal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${selectedCurrency.code}`;

    return {
      mainEUR,
      convertedRef: `(~ ${formattedRef})`,
    };
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    if (product.totalStock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.totalStock, existing.quantity + quantity);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.totalStock, quantity) }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const validQty = Math.min(item.product.totalStock, quantity);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Cart Calculations (Base EUR)
  const cartSubtotalEUR = cart.reduce(
    (sum, item) => sum + item.product.priceEUR * item.quantity,
    0
  );
  
  // Destination Country VAT
  const vatRate = selectedCountry.vatRate;
  const cartVATAmountEUR = cartSubtotalEUR * vatRate;
  const cartShippingFeeEUR = cartSubtotalEUR > 150 ? 0.0 : 8.5; // Free EU shipping over €150
  const cartTotalEUR = cartSubtotalEUR + cartVATAmountEUR + cartShippingFeeEUR;

  // GDPR Actions
  const updateGDPRPreferences = async (newPrefs: Partial<GDPRPreferences>) => {
    const updated = { ...gdprPreferences, ...newPrefs };
    setGdprPreferences(updated);
    try {
      const res = await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setConsentLogs(prev => [data.log, ...prev]);
      }
    } catch (err) {
      console.error('Failed to record GDPR consent:', err);
    }
  };

  const downloadDSARPackage = async () => {
    try {
      const res = await fetch('/api/gdpr/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GDPR_Personal_Data_Export_${EXPORT_PREFIX}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        fetchConsentLogs(); // Refresh logs
      }
    } catch (err) {
      console.error('Failed to download DSAR bundle:', err);
    }
  };

  const requestRightToBeForgotten = async () => {
    try {
      const res = await fetch('/api/gdpr/erasure', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setConsentLogs([data.erasureLog]);
        setOrders(prev =>
          prev.map(o => ({ ...o, customerName: 'Anonymized User (GDPR Art.17)' }))
        );
      }
    } catch (err) {
      console.error('Failed to execute Right to Be Forgotten:', err);
    }
  };

  // Inventory Actions
  const adjustStock = async (
    productId: string,
    warehouseId: string,
    quantityChange: number,
    adjustmentType: 'RESTOCK' | 'AUDIT_CORRECTION' | 'DAMAGED' | 'RETURN',
    note: string
  ) => {
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          warehouseId,
          quantityChange,
          adjustmentType,
          note,
          performedBy: 'Merchant Admin (Inventory Mgr)',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev =>
          prev.map(p => (p.id === productId ? data.product : p))
        );
        setStockAdjustments(prev => [data.adjustment, ...prev]);
      }
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  const addProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts(prev => [newProduct, ...prev]);
        fetchAdjustments();
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const importInventoryItems = async (items: Partial<Product>[]): Promise<number> => {
    try {
      const res = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        const data = await res.json();
        fetchProducts();
        return data.updatedCount;
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
    return 0;
  };

  // Checkout Placement
  const placeOrder = async (customerInfo: { name: string; email: string }): Promise<Order | null> => {
    if (cart.length === 0) return null;

    const itemsForOrder = cart.map(item => ({
      productId: item.product.id,
      sku: item.product.sku,
      name: item.product.name,
      quantity: item.quantity,
      unitPriceEUR: item.product.priceEUR,
      totalPriceEUR: item.product.priceEUR * item.quantity,
    }));

    const convertedVal = cartTotalEUR * selectedCurrency.rateToEUR;

    const orderPayload = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      destinationCountry: selectedCountry.code,
      items: itemsForOrder,
      subtotalEUR: cartSubtotalEUR,
      vatAmountEUR: cartVATAmountEUR,
      vatRate: selectedCountry.vatRate,
      shippingFeeEUR: cartShippingFeeEUR,
      totalEUR: cartTotalEUR, // Transactions recorded in Euro by default
      paidCurrency: selectedCurrency.code,
      paidCurrencySymbol: selectedCurrency.symbol,
      paidAmountConverted: convertedVal,
      exchangeRateUsed: selectedCurrency.rateToEUR,
      gdprConsentRecorded: true,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        setCurrentCompletedOrder(newOrder);
        clearCart();
        setIsCartOpen(false);
        fetchProducts(); // Refresh deducted stock levels
        fetchConsentLogs(); // Refresh logs
        return newOrder;
      }
    } catch (err) {
      console.error('Failed to place order:', err);
    }
    return null;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedOriginCountry,
        setSelectedOriginCountry,
        showOnlyInStock,
        setShowOnlyInStock,
        selectedCountry,
        setSelectedCountryByCode,
        selectedCurrency,
        setSelectedCurrencyByCode,
        formatPriceEUR,
        getConvertedPriceString,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotalEUR,
        cartVATAmountEUR,
        cartShippingFeeEUR,
        cartTotalEUR,
        gdprPreferences,
        updateGDPRPreferences,
        consentLogs,
        downloadDSARPackage,
        requestRightToBeForgotten,
        stockAdjustments,
        adjustStock,
        addProduct,
        updateProduct,
        deleteProduct,
        importInventoryItems,
        orders,
        placeOrder,
        currentCompletedOrder,
        setCurrentCompletedOrder,
        isLocalizationModalOpen,
        setIsLocalizationModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
