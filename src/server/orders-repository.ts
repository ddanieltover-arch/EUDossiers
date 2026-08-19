import { INITIAL_ORDERS } from '../data/mockData';
import { Order } from '../types';
import { getSql } from './db';

type OrderRow = {
  id: string;
  payload: Order | string;
};

function mapRow(row: OrderRow): Order {
  const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
  return payload as Order;
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

export async function seedOrdersIfEmpty(): Promise<void> {
  await ensureOrdersTable();
  const sql = getSql();
  const existing = await sql`SELECT COUNT(*)::int AS count FROM store_orders`;
  const count = Number((existing[0] as { count: number } | undefined)?.count || 0);
  if (count > 0) return;

  for (const order of INITIAL_ORDERS) {
    await sql`
      INSERT INTO store_orders (id, payload)
      VALUES (${order.id}, ${JSON.stringify(order)}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function listOrders(): Promise<Order[]> {
  await seedOrdersIfEmpty();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, payload
    FROM store_orders
    ORDER BY created_at DESC
  `) as OrderRow[];
  return rows.map(mapRow);
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
    VALUES (${order.id}, ${JSON.stringify(order)}::jsonb)
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
    SET payload = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
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
