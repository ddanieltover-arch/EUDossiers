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
    const { withApiHandler, readPathId } = await import('../../src/server/vercel-handler');
    const { deleteOrderById } = await import('../../src/server/orders-repository');
    const { patchCheckoutOrder } = await import('../../src/server/orders-service');
    const { parseJsonBody } = await import('../../src/server/parse-json-body');
    return withApiHandler(req, res, async (method, body, rawReq) => {
      const orderId = readPathId(rawReq, '/api/orders');
      if (!orderId) return { status: 400, body: { error: 'Order id is required' } };
      if (method === 'PATCH') {
        const updated = await patchCheckoutOrder(orderId, parseJsonBody(body));
        if (!updated) return { status: 404, body: { error: 'Order not found' } };
        return { status: 200, body: updated };
      }
      if (method === 'DELETE') {
        const deleted = await deleteOrderById(orderId);
        if (!deleted) return { status: 404, body: { error: 'Order not found' } };
        return { status: 200, body: { success: true, deletedId: orderId } };
      }
      return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'PATCH, DELETE' } };
    });
  } catch (err) {
    console.error('Order item API load error:', err);
    return reply(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

export const config = { maxDuration: 15 };
