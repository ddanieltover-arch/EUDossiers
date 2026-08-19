import { Order } from '../types';
import { getSql } from './db';

type OrderRow = {
  id: string;
  payload: Order | string;
};

function asJson(value: Order): string {
  return JSON.stringify(value);
}

function mapRow(row: OrderRow): Order | null {
  try {
    const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
    const order = payload as Order;
    if (!order.id) return null;
    return {
      ...order,
      items: Array.isArray(order.items) ? order.items : [],
    };
  } catch {
    return null;
  }
}

export async function ensureOrdersTable(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS store_orders (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function listOrders(): Promise<Order[]> {
  await ensureOrdersTable();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, payload
    FROM store_orders
    ORDER BY created_at DESC
  `) as OrderRow[];
  return rows
    .map(mapRow)
    .filter((order): order is Order => Boolean(order))
    .sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || ''));
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ensureOrdersTable();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, payload FROM store_orders WHERE id = ${id} LIMIT 1
  `) as OrderRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function insertOrder(order: Order): Promise<Order> {
  await ensureOrdersTable();
  const sql = getSql();
  await sql`
    INSERT INTO store_orders (id, payload)
    VALUES (${order.id}, ${asJson(order)}::jsonb)
  `;
  return order;
}

export async function updateOrderById(
  id: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const existing = await getOrderById(id);
  if (!existing) return null;
  const updated: Order = { ...existing, ...patch, id: existing.id };
  const sql = getSql();
  await sql`
    UPDATE store_orders
    SET payload = ${asJson(updated)}::jsonb, updated_at = NOW()
    WHERE id = ${id}
  `;
  return updated;
}

export async function deleteOrderById(id: string): Promise<boolean> {
  await ensureOrdersTable();
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM store_orders WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}
