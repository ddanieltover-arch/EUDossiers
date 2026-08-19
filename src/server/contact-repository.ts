import { getSql } from './db';

export type StoredContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export async function ensureContactTable(): Promise<void> {
  const sql = await getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS store_contact_messages (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function listContactMessages(): Promise<StoredContactMessage[]> {
  await ensureContactTable();
  const sql = await getSql();
  const rows = (await sql`
    SELECT id, payload
    FROM store_contact_messages
    ORDER BY created_at DESC
  `) as { id: string; payload: StoredContactMessage | string }[];
  return rows
    .map((row) => {
      try {
        const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
        if (!payload || typeof payload !== 'object') return null;
        return payload as StoredContactMessage;
      } catch {
        return null;
      }
    })
    .filter((item): item is StoredContactMessage => Boolean(item));
}

export async function insertContactMessage(
  input: Omit<StoredContactMessage, 'id' | 'createdAt'>
): Promise<StoredContactMessage> {
  await ensureContactTable();
  const record: StoredContactMessage = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
  const sql = await getSql();
  const payload = JSON.parse(JSON.stringify(record));
  await sql`INSERT INTO store_contact_messages (id, payload) VALUES (${record.id}, ${payload})`;
  return record;
}
