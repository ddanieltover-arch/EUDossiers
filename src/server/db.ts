import { neon } from '@neondatabase/serverless';

type SqlClient = ReturnType<typeof neon>;

let sqlClient: SqlClient | null = null;

function getDatabaseUrl(): string {
  const raw =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!raw) {
    throw new Error('DATABASE_URL is not set. Add it in Vercel Project Settings → Environment Variables.');
  }

  try {
    const parsed = new URL(raw);
    // HTTP neon driver does not use Postgres channel binding; this flag can crash serverless invokes.
    parsed.searchParams.delete('channel_binding');
    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require');
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

export function getSql(): SqlClient {
  if (sqlClient) return sqlClient;
  sqlClient = neon(getDatabaseUrl());
  return sqlClient;
}
