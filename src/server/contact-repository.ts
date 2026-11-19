import { getSql } from './db';

export type QuotationStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'CLOSED';

export type StoredContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  phone?: string;
  productName?: string;
  sku?: string;
  referencePriceEUR?: number;
  quantity?: number;
  country?: string;
  channel?: 'email' | 'whatsapp';
  status?: QuotationStatus;
};

export function enrichMessage(msg: StoredContactMessage): StoredContactMessage {
  const enriched = { ...msg };
  const text = enriched.message || '';

  if (enriched.subject === 'quote' || text.includes('[QUOTE REQUEST')) {
    const prodMatch = text.match(/\[QUOTE REQUEST FOR (.*?)\]/i) || text.match(/Product:\s*(.*?)(?:\n|$)/i);
    const skuMatch = text.match(/SKU:\s*(.*?)(?:\n|$)/i);
    const priceMatch = text.match(/Reference Price:\s*€?([\d.,]+)/i);
    const qtyMatch = text.match(/Quantity:\s*(\d+)/i);
    const countryMatch = text.match(/Destination Country:\s*(.*?)(?:\n|$)/i);
    const phoneMatch = text.match(/Contact Phone\/WhatsApp:\s*(.*?)(?:\n|$)/i);

    if (prodMatch && !enriched.productName) enriched.productName = prodMatch[1].trim();
    if (skuMatch && !enriched.sku) enriched.sku = skuMatch[1].trim();
    if (priceMatch && !enriched.referencePriceEUR) enriched.referencePriceEUR = parseFloat(priceMatch[1].replace(',', '.'));
    if (qtyMatch && !enriched.quantity) enriched.quantity = parseInt(qtyMatch[1], 10);
    if (countryMatch && !enriched.country) enriched.country = countryMatch[1].trim();
    if (phoneMatch && !enriched.phone) enriched.phone = phoneMatch[1].trim();
  }

  if (!enriched.status) enriched.status = 'NEW';
  if (!enriched.channel) enriched.channel = enriched.phone ? 'whatsapp' : 'email';
  return enriched;
}

let memoryContactStore: StoredContactMessage[] = [
  {
    id: 'QUO-2026-001',
    name: 'Marc Lefebvre',
    email: 'm.lefebvre@pro-logistics.fr',
    phone: '+33 6 12 34 56 78',
    subject: 'quote',
    productName: 'French National Identity Card (CNI)',
    sku: 'SKU-002',
    referencePriceEUR: 441.75,
    quantity: 2,
    country: 'France',
    channel: 'whatsapp',
    status: 'NEW',
    message: '[QUOTE REQUEST FOR French National Identity Card (CNI)]\nSKU: SKU-002\nReference Price: €441.75\nQuantity: 2\nDestination Country: France\nContact Phone/WhatsApp: +33 6 12 34 56 78\n\nClient Message:\nRequesting formal quotation for 2 units with express verification for our compliance team in Paris.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'QUO-2026-002',
    name: 'Klaus Schneider',
    email: 'schneider.consulting@berlin-law.de',
    phone: '+49 171 9876543',
    subject: 'quote',
    productName: 'German Electronic Residence Permit (eAT)',
    sku: 'SKU-004',
    referencePriceEUR: 475.00,
    quantity: 1,
    country: 'Germany',
    channel: 'email',
    status: 'CONTACTED',
    message: '[QUOTE REQUEST FOR German Electronic Residence Permit (eAT)]\nSKU: SKU-004\nReference Price: €475.00\nQuantity: 1\nDestination Country: Germany\n\nClient Message:\nNeed formal quotation and turnaround timeline for official document specimen reference.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'QUO-2026-003',
    name: 'Elena Rossi',
    email: 'elena.rossi@milano-legal.it',
    phone: '+39 340 5551234',
    subject: 'quote',
    productName: 'Carta d\'Identità Elettronica (CIE)',
    sku: 'SKU-003',
    referencePriceEUR: 432.50,
    quantity: 3,
    country: 'Italy',
    channel: 'email',
    status: 'QUOTED',
    message: '[QUOTE REQUEST FOR Carta d\'Identità Elettronica (CIE)]\nSKU: SKU-003\nReference Price: €432.50\nQuantity: 3\nDestination Country: Italy\n\nClient Message:\nInquiring about bulk reference specimens for documentation training in Milan.',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
  }
];

export async function ensureContactTable(): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS store_contact_messages (
        id TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
  } catch (err) {
    // Non-fatal fallback to in-memory store
    console.warn('DB ensureContactTable fallback to memory:', err);
  }
}

export async function listContactMessages(): Promise<StoredContactMessage[]> {
  try {
    await ensureContactTable();
    const sql = getSql();
    const rows = (await sql`
      SELECT id, payload
      FROM store_contact_messages
      ORDER BY created_at DESC
    `) as { id: string; payload: StoredContactMessage | string }[];
    
    const dbItems = rows
      .map((row) => {
        try {
          const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
          if (!payload || typeof payload !== 'object') return null;
          return enrichMessage(payload as StoredContactMessage);
        } catch {
          return null;
        }
      })
      .filter((item): item is StoredContactMessage => Boolean(item));

    if (dbItems.length > 0) {
      return dbItems;
    }
  } catch (err) {
    console.warn('DB listContactMessages fallback to memory store:', err);
  }

  return memoryContactStore.map(enrichMessage);
}

export async function insertContactMessage(
  input: Omit<StoredContactMessage, 'id' | 'createdAt'>
): Promise<StoredContactMessage> {
  const isQuote = input.subject === 'quote';
  const record: StoredContactMessage = enrichMessage({
    id: isQuote ? `QUO-${Date.now().toString(36).toUpperCase()}` : `MSG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: 'NEW',
    ...input,
  });

  memoryContactStore.unshift(record);

  try {
    await ensureContactTable();
    const sql = getSql();
    const payload = JSON.parse(JSON.stringify(record));
    await sql`INSERT INTO store_contact_messages (id, payload) VALUES (${record.id}, ${payload})`;
  } catch (err) {
    console.warn('DB insertContactMessage fallback to memory store:', err);
  }

  return record;
}

export async function updateContactMessageStatus(
  id: string,
  status: QuotationStatus
): Promise<StoredContactMessage | null> {
  const memItem = memoryContactStore.find((m) => m.id === id);
  if (memItem) {
    memItem.status = status;
  }

  try {
    await ensureContactTable();
    const sql = getSql();
    const rows = (await sql`
      SELECT id, payload FROM store_contact_messages WHERE id = ${id} LIMIT 1
    `) as { id: string; payload: any }[];

    if (rows[0]) {
      const payload = typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
      payload.status = status;
      await sql`UPDATE store_contact_messages SET payload = ${JSON.stringify(payload)} WHERE id = ${id}`;
      return enrichMessage(payload);
    }
  } catch (err) {
    console.warn('DB updateContactMessageStatus fallback to memory store:', err);
  }

  return memItem ? enrichMessage(memItem) : null;
}

export async function deleteContactMessageById(id: string): Promise<boolean> {
  memoryContactStore = memoryContactStore.filter((m) => m.id !== id);

  try {
    await ensureContactTable();
    const sql = getSql();
    await sql`DELETE FROM store_contact_messages WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.warn('DB deleteContactMessageById fallback to memory store:', err);
    return true;
  }
}
