import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  EUCountryCode, 
  EUCountryVAT, 
  GDPRPreferences, 
  ConsentLog, 
  Order, 
  StockAdjustment 
} from '../types';
import { EU_COUNTRIES, INITIAL_PRODUCTS } from '../data/mockData';
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
  
  // Delivery destination (checkout only)
  selectedCountry: EUCountryVAT;
  setSelectedCountryByCode: (code: EUCountryCode) => void;
  formatPriceEUR: (amountEUR: number) => string;

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
  fetchOrders: () => Promise<void>;
  placeOrder: (customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: 'bank' | 'crypto';
  }) => Promise<{ order: Order | null; error?: string }>;
  updateOrder: (
    id: string,
    patch: Partial<Pick<Order, 'customerName' | 'customerEmail' | 'status'>>
  ) => Promise<Order | null>;
  deleteOrder: (id: string) => Promise<boolean>;
  currentCompletedOrder: Order | null;
  setCurrentCompletedOrder: (order: Order | null) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
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

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

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

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        console.error('Failed to fetch orders:', res.status, await res.text().catch(() => ''));
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  }, []);

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

  const formatPriceEUR = (amountEUR: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amountEUR);
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
  const cartTotalEUR = cartSubtotalEUR;

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
  const placeOrder = async (customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: 'bank' | 'crypto';
  }): Promise<{ order: Order | null; error?: string }> => {
    if (cart.length === 0) return { order: null, error: 'Your cart is empty' };

    const itemsForOrder = cart.map(item => ({
      productId: item.product.id,
      sku: item.product.sku,
      name: item.product.name,
      quantity: item.quantity,
      unitPriceEUR: item.product.priceEUR,
      totalPriceEUR: item.product.priceEUR * item.quantity,
    }));

    const cryptoDiscountEUR = customerInfo.paymentMethod === 'crypto' ? cartTotalEUR * 0.05 : 0;
    const settledTotalEUR = cartTotalEUR - cryptoDiscountEUR;

    const orderPayload = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      destinationCountry: selectedCountry.code,
      paymentMethod: customerInfo.paymentMethod,
      items: itemsForOrder,
      subtotalEUR: cartSubtotalEUR,
      vatAmountEUR: 0,
      vatRate: 0,
      shippingFeeEUR: 0,
      cryptoDiscountEUR,
      totalEUR: settledTotalEUR,
      paidCurrency: 'EUR',
      paidCurrencySymbol: '€',
      paidAmountConverted: settledTotalEUR,
      exchangeRateUsed: 1.0,
      gdprConsentRecorded: true,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          return { order: null, error: 'Checkout API did not respond correctly. Please try again.' };
        }
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        setCurrentCompletedOrder(newOrder);
        clearCart();
        setIsCartOpen(false);
        fetchProducts(); // Refresh deducted stock levels
        fetchConsentLogs(); // Refresh logs
        return { order: newOrder };
      }

      const data = await res.json().catch(() => ({} as { error?: string }));
      console.error('Failed to place order:', res.status, data);
      return { order: null, error: data.error || 'We could not place your order. Please try again.' };
    } catch (err) {
      console.error('Failed to place order:', err);
      return { order: null, error: 'We could not place your order. Please try again.' };
    }
  };

  const updateOrder = async (
    id: string,
    patch: Partial<Pick<Order, 'customerName' | 'customerEmail' | 'status'>>
  ): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated: Order = await res.json();
        setOrders(prev => prev.map(order => (order.id === id ? updated : order)));
        return updated;
      }
    } catch (err) {
      console.error('Failed to update order:', err);
    }
    return null;
  };

  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(order => order.id !== id));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
    return false;
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
        formatPriceEUR,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotalEUR,
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
        fetchOrders,
        placeOrder,
        updateOrder,
        deleteOrder,
        currentCompletedOrder,
        setCurrentCompletedOrder,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
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
