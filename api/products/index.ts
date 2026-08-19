function reply(res: unknown, status: number, body: unknown, headers?: Record<string, string>) {
  if (res && typeof (res as { status?: unknown }).status === 'function') {
    const nodeRes = res as {
      setHeader?: (name: string, value: string) => void;
      status: (code: number) => { json: (value: unknown) => unknown };
    };
    if (headers) {
      for (const [name, value] of Object.entries(headers)) nodeRes.setHeader?.(name, value);
    }
    return nodeRes.status(status).json(body);
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export default async function handler(req: unknown, res: unknown) {
  try {
    const { withApiHandler } = await import('../../src/server/vercel-handler');
    const { createProduct, listProducts } = await import('../../src/server/products-repository');
    const { parseJsonBody } = await import('../../src/server/parse-json-body');
    return withApiHandler(req, res, async (method, body) => {
      if (method === 'GET') {
        return { status: 200, body: await listProducts() };
      }
      if (method === 'POST') {
        return { status: 201, body: await createProduct(parseJsonBody(body)) };
      }
      return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST' } };
    });
  } catch (err) {
    console.error('Products API load error:', err);
    return reply(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

export const config = { maxDuration: 15 };
