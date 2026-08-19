import { deleteOrderById } from '../../src/server/orders-repository';
import { patchCheckoutOrder } from '../../src/server/orders-service';

export const config = {
  runtime: 'nodejs',
  maxDuration: 15,
};

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Failed to update order';
}

export default async function handler(
  req: { method?: string; body?: unknown; query?: { id?: string | string[] } },
  res: {
    status: (code: number) => { json: (body: unknown) => unknown };
    setHeader: (name: string, value: string) => void;
  }
) {
  const id = req.query?.id;
  const orderId = Array.isArray(id) ? id[0] : id;
  if (!orderId) {
    return res.status(400).json({ error: 'Order id is required' });
  }

  try {
    if (req.method === 'PATCH') {
      const updated = await patchCheckoutOrder(orderId, (req.body as object) || {});
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await deleteOrderById(orderId);
      if (!deleted) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json({ success: true, deletedId: orderId });
    }

    res.setHeader('Allow', 'PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Order item API error:', err);
    return res.status(500).json({ error: errorMessage(err) });
  }
}
