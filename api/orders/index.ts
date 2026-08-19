function reply(res: unknown, status: number, body: unknown) {
  if (res && typeof (res as { status?: unknown }).status === 'function') {
    return (res as { status: (code: number) => { json: (value: unknown) => unknown } }).status(status).json(body);
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: unknown, res: unknown) {
  try {
    const { withApiHandler } = await import('../../src/server/vercel-handler');
    const { listOrders } = await import('../../src/server/orders-repository');
    const { parseJsonBody } = await import('../../src/server/parse-json-body');
    return withApiHandler(req, res, async (method, body) => {
      if (method === 'GET') {
        return { status: 200, body: await listOrders() };
      }
      if (method === 'POST') {
        const { createCheckoutOrder } = await import('../../src/server/orders-service');
        const payload = parseJsonBody(body) as unknown as Parameters<typeof createCheckoutOrder>[0];
        if (!payload.customerName || !payload.customerEmail || !Array.isArray(payload.items) || payload.items.length === 0) {
          return { status: 400, body: { error: 'Customer name, email, and at least one item are required' } };
        }
        return { status: 201, body: await createCheckoutOrder(payload) };
      }
      return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST' } };
    });
  } catch (err) {
    console.error('Orders API load error:', err);
    return reply(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

export const config = { maxDuration: 15 };
