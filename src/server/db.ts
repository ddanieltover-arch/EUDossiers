import { neon } from '@neondatabase/serverless';

type SqlClient = ReturnType<typeof neon>;

let sqlClient: SqlClient | null = null;

export function getSql(): SqlClient {
  if (sqlClient) return sqlClient;

  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error('DATABASE_URL (or POSTGRES_URL) is not set');
  }

  sqlClient = neon(url);
  return sqlClient;
}
