import { Order, OrderItem, StockAdjustment } from '../types';
import { applyStockChange, getProductById } from './products-repository';
import { getOrderById, insertOrder, updateOrderById } from './orders-repository';
import { notifyOrderPlaced, notifyOrderUpdated } from './email/notifications';

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
  for (const item of input.items) {
    const product = await getProductById(item.productId);
    if (!product) continue;
    const prev = product.totalStock;
    const updated = await applyStockChange(
      item.productId,
      product.warehouses[0]?.warehouseId,
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

  notifyOrderPlaced(order).catch((err) => {
    console.error('Order placed email failed:', err);
  });

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
    notifyOrderUpdated(updated, previousStatus).catch((err) => {
      console.error('Order update email failed:', err);
    });
  }

  return updated;
}

export function parseContactPayload(body: unknown): {
  name: string;
  email: string;
  subject: string;
  message: string;
} | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body' };
  }
  const payload = body as Record<string, unknown>;
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  const allowedSubjects = ['order', 'product', 'shipping', 'returns', 'gdpr', 'partnership', 'other'];
  if (name.length < 2 || name.length > 120) return { error: 'Please provide your name' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please provide a valid email address' };
  if (!allowedSubjects.includes(subject)) return { error: 'Please select a subject' };
  if (message.length < 10 || message.length > 5000) return { error: 'Please write a message of at least 10 characters' };

  return { name, email, subject, message };
}
