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
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS store_contact_messages (
      id TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
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
  const sql = getSql();
  await sql.query(
    'INSERT INTO store_contact_messages (id, payload) VALUES ($1, $2::jsonb)',
    [record.id, JSON.stringify(record)]
  );
  return record;
}
