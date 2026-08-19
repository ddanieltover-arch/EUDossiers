let sqlClient: SqlFn | null = null;

type SqlFn = ((strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>) & {
  query?: (text: string, params?: unknown[]) => Promise<unknown>;
};

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
    parsed.searchParams.delete('channel_binding');
    if (!parsed.searchParams.has('sslmode')) {
      parsed.searchParams.set('sslmode', 'require');
    }
    return parsed.toString();
  } catch {
    return raw;
  }
}

export async function getSql(): Promise<SqlFn> {
  if (sqlClient) return sqlClient;
  const { neon } = await import('@neondatabase/serverless');
  sqlClient = neon(getDatabaseUrl()) as unknown as SqlFn;
  return sqlClient;
}
