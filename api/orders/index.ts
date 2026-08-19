import { listOrders } from '../../src/server/orders-repository';
import { parseJsonBody } from '../../src/server/parse-json-body';
import { withApiHandler } from '../../src/server/vercel-handler';

export const config = {
  maxDuration: 15,
};

export default async function handler(req: unknown, res: unknown) {
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
      const order = await createCheckoutOrder(payload);
      return { status: 201, body: order };
    }

    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST' } };
  });
}
