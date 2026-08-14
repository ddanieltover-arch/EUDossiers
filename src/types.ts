export type Category = 'Passports' | 'Driver Licenses' | 'Identity Cards' | 'Residence Permits' | 'EU Visas';

export type EUCountryCode = 'DE' | 'FR' | 'IT' | 'ES' | 'NL' | 'BE' | 'SE' | 'AT' | 'IE' | 'PL' | 'DK' | 'FI' | 'PT' | 'GR' | 'CZ' | 'CH';

export interface EUCountryVAT {
  code: EUCountryCode;
  name: string;
  flag: string;
  vatRate: number; // e.g. 0.19 for 19%
  standardCurrency: string;
  language: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateToEUR: number; // 1 EUR = X Foreign Currency
  flag: string;
}

export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string; // e.g. "Frankfurt Hub (DE-01)", "Amsterdam Logistics (NL-02)"
  location: string;
  quantity: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  description: string;
  priceEUR: number; // All base prices stored strictly in EUR (5% discount applied)
  originalPriceEUR?: number; // Pre-discount original price in EUR
  originCountry: string; // e.g. "Germany", "France", "Italy"
  originFlag: string;
  imageUrl: string;
  galleryImages?: string[]; // High-resolution product gallery images from reference sources
  totalStock: number;
  lowStockThreshold: number;
  warehouses: WarehouseStock[];
  vatRateCategory: 'standard' | 'reduced';
  weightKg: number;
  supplierName: string;
  tags: string[];
  lastRestocked: string;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  adjustmentType: 'RESTOCK' | 'AUDIT_CORRECTION' | 'DAMAGED' | 'RETURN' | 'SALE';
  quantityChange: number; // +10 or -5
  previousStock: number;
  newStock: number;
  note: string;
  performedBy: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GDPRPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  lastUpdated: string;
  consentVersion: string;
}

export interface ConsentLog {
  id: string;
  timestamp: string;
  action: string; // e.g., "Updated Cookie Preferences", "Downloaded Personal Data (DSAR)", "Requested Data Erasure"
  ipAddressHash: string; // Pseudonymized IP address (GDPR requirement)
  details: string;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPriceEUR: number;
  totalPriceEUR: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  destinationCountry: EUCountryCode;
  items: OrderItem[];
  subtotalEUR: number;
  vatAmountEUR: number;
  vatRate: number;
  shippingFeeEUR: number;
  totalEUR: number;
  // Multi-currency display info
  paidCurrency: string;
  paidCurrencySymbol: string;
  paidAmountConverted: number;
  exchangeRateUsed: number;
  status: 'COMPLETED' | 'PROCESSING' | 'CANCELLED';
  createdAt: string;
  gdprConsentRecorded: boolean;
}

export interface DSARPackage {
  generatedAt: string;
  gdprComplianceNotice: string;
  userProfile: {
    name: string;
    email: string;
    preferredCountry: string;
    preferredCurrency: string;
    ipHash: string;
  };
  consentPreferences: GDPRPreferences;
  consentAuditTrail: ConsentLog[];
  orderHistory: Order[];
  dataStorageLocation: string; // e.g., "Frankfurt, EU (AWS/Cloud Run Server)"
}
