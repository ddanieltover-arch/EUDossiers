import { listOrders } from '../../src/server/orders-repository';
import { parseJsonBody } from '../../src/server/parse-json-body';

export const config = {
  maxDuration: 15,
};

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Failed to process orders';
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => unknown };
    setHeader: (name: string, value: string) => void;
  }
) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await listOrders());
    }

    if (req.method === 'POST') {
      const { createCheckoutOrder } = await import('../../src/server/orders-service');
      const body = parseJsonBody(req.body) as unknown as Parameters<typeof createCheckoutOrder>[0];
      if (!body.customerName || !body.customerEmail || !Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ error: 'Customer name, email, and at least one item are required' });
      }
      const order = await createCheckoutOrder(body);
      return res.status(201).json(order);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Orders API error:', err);
    return res.status(500).json({ error: errorMessage(err) });
  }
}
