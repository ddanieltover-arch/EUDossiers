import { listOrders } from '../../src/server/orders-repository';
import { createCheckoutOrder } from '../../src/server/orders-service';
import { parseJsonBody, withApiHandler } from '../_lib/http';

export const config = { maxDuration: 15 };

export default async function handler(req: unknown, res: unknown) {
  return withApiHandler(req, res, async (method, body) => {
    if (method === 'GET') {
      return { status: 200, body: await listOrders() };
    }
    if (method === 'POST') {
      const payload = parseJsonBody(body) as unknown as Parameters<typeof createCheckoutOrder>[0];
      if (!payload.customerName || !payload.customerEmail || !Array.isArray(payload.items) || payload.items.length === 0) {
        return { status: 400, body: { error: 'Customer name, email, and at least one item are required' } };
      }
      return { status: 201, body: await createCheckoutOrder(payload) };
    }
    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST' } };
  });
}
