import { Order, OrderItem, StockAdjustment } from '../types';
import { applyStockChange, getProductById } from './products-repository';
import { getOrderById, insertOrder, updateOrderById } from './orders-repository';
import { notifyOrderPlaced, notifyOrderUpdated } from './email/notifications';
import { isProductUnderComplianceReview } from '../data/compliancePolicy';

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  destinationCountry: Order['destinationCountry'];
  paymentMethod?: Order['paymentMethod'];
  items: OrderItem[];
  subtotalEUR: number;
  vatAmountEUR: number;
  vatRate: number;
  shippingFeeEUR: number;
  cryptoDiscountEUR?: number;
  totalEUR: number;
  paidCurrency?: string;
  paidCurrencySymbol?: string;
  paidAmountConverted?: number;
  exchangeRateUsed?: number;
  gdprConsentRecorded?: boolean;
};

export type StockAdjustmentRecorder = (adjustment: StockAdjustment) => void;

export async function createCheckoutOrder(
  input: CreateOrderInput,
  recordAdjustment?: StockAdjustmentRecorder
): Promise<Order> {
  // Reject orders containing items currently under compliance review
  for (const item of input.items) {
    if (isProductUnderComplianceReview(item.productId)) {
      throw new Error(`Product ${item.productId} is temporarily unavailable for purchase under compliance review.`);
    }
  }

  for (const item of input.items) {
    try {
      const product = await getProductById(item.productId);
      if (!product) continue;
      const prev = product.totalStock;
      const updated = await applyStockChange(
        item.productId,
        product.warehouses?.[0]?.warehouseId,
        -item.quantity
      );
      if (!updated) continue;

      recordAdjustment?.({
        id: `adj-${Date.now()}-${item.productId}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        warehouseId: product.warehouses[0]?.warehouseId || 'wh-fra',
        warehouseName: product.warehouses[0]?.warehouseName || 'Frankfurt Hub (DE-01)',
        adjustmentType: 'SALE',
        quantityChange: -item.quantity,
        previousStock: prev,
        newStock: updated.totalStock,
        note: `Order auto-deduction (Ref: ${item.sku})`,
        performedBy: 'System Auto Checkout',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      });
    } catch (err) {
      console.error(`Stock deduction failed for ${item.productId}:`, err);
    }
  }

  const order: Order = {
    id: `EU-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone || '',
    customerAddress: input.customerAddress || '',
    destinationCountry: input.destinationCountry,
    paymentMethod: input.paymentMethod === 'crypto' ? 'crypto' : 'bank',
    items: input.items,
    subtotalEUR: input.subtotalEUR,
    vatAmountEUR: input.vatAmountEUR,
    vatRate: input.vatRate,
    shippingFeeEUR: input.shippingFeeEUR,
    cryptoDiscountEUR: typeof input.cryptoDiscountEUR === 'number' ? input.cryptoDiscountEUR : 0,
    totalEUR: input.totalEUR,
    paidCurrency: input.paidCurrency || 'EUR',
    paidCurrencySymbol: input.paidCurrencySymbol || '€',
    paidAmountConverted: input.paidAmountConverted || input.totalEUR,
    exchangeRateUsed: input.exchangeRateUsed || 1.0,
    status: 'PROCESSING',
    createdAt: new Date().toISOString(),
    gdprConsentRecorded: !!input.gdprConsentRecorded,
  };

  await insertOrder(order);

  try {
    await notifyOrderPlaced(order);
  } catch (err) {
    console.error('Order placed email failed:', err);
  }

  return order;
}

export async function patchCheckoutOrder(
  id: string,
  patch: Partial<Pick<Order, 'customerName' | 'customerEmail' | 'status'>>
): Promise<Order | null> {
  const allowed: Partial<Order> = {};
  if (typeof patch.customerName === 'string') allowed.customerName = patch.customerName.trim();
  if (typeof patch.customerEmail === 'string') allowed.customerEmail = patch.customerEmail.trim();
  if (patch.status === 'COMPLETED' || patch.status === 'PROCESSING' || patch.status === 'CANCELLED') {
    allowed.status = patch.status;
  }

  const existing = await getOrderById(id);
  if (!existing) return null;

  if (Object.keys(allowed).length === 0) return existing;

  const previousStatus = existing.status;
  const updated = await updateOrderById(id, allowed);
  if (!updated) return null;

  const statusChanged = previousStatus !== updated.status;
  const detailsChanged =
    (allowed.customerName && allowed.customerName !== existing.customerName) ||
    (allowed.customerEmail && allowed.customerEmail !== existing.customerEmail);

  if (statusChanged || detailsChanged) {
    try {
      await notifyOrderUpdated(updated, previousStatus);
    } catch (err) {
      console.error('Order update email failed:', err);
    }
  }

  return updated;
}

export function parseContactPayload(body: unknown): {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  productName?: string;
  sku?: string;
  referencePriceEUR?: number;
  quantity?: number;
  country?: string;
  channel?: 'email' | 'whatsapp';
  status?: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED';
} | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body' };
  }
  const payload = body as Record<string, unknown>;
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const phone = typeof payload.phone === 'string' && payload.phone.trim() ? payload.phone.trim() : undefined;
  const productName = typeof payload.productName === 'string' && payload.productName.trim() ? payload.productName.trim() : undefined;
  const sku = typeof payload.sku === 'string' && payload.sku.trim() ? payload.sku.trim() : undefined;
  const referencePriceEUR = typeof payload.referencePriceEUR === 'number' ? payload.referencePriceEUR : (typeof payload.referencePriceEUR === 'string' ? parseFloat(payload.referencePriceEUR) : undefined);
  const quantity = typeof payload.quantity === 'number' ? payload.quantity : (typeof payload.quantity === 'string' ? parseInt(payload.quantity, 10) : undefined);
  const country = typeof payload.country === 'string' && payload.country.trim() ? payload.country.trim() : undefined;
  const channel = payload.channel === 'whatsapp' ? 'whatsapp' : 'email';
  const status = (payload.status === 'CONTACTED' || payload.status === 'QUOTED' || payload.status === 'CLOSED') ? payload.status : 'NEW';

  const allowedSubjects = ['order', 'product', 'quote', 'shipping', 'returns', 'gdpr', 'partnership', 'other'];
  if (name.length < 2 || name.length > 120) return { error: 'Please provide your name' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please provide a valid email address' };
  if (!allowedSubjects.includes(subject)) return { error: 'Please select a subject' };
  if (message.length < 5 || message.length > 5000) return { error: 'Please write a message of at least 5 characters' };

  return { name, email, subject, message, phone, productName, sku, referencePriceEUR, quantity, country, channel, status };
}
