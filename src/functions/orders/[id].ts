import { deleteOrderById } from '../../server/orders-repository';
import { patchCheckoutOrder } from '../../server/orders-service';
import { parseJsonBody, readPathId, withApiHandler } from '../../server/http';

export const config = { maxDuration: 15 };

export default async function handler(req: unknown, res: unknown) {
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
}
