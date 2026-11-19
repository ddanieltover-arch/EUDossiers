import { listOrders, deleteOrderById } from '../../server/orders-repository';
import { createCheckoutOrder, patchCheckoutOrder } from '../../server/orders-service';
import { parseJsonBody, withApiHandler } from '../../server/http';
import { isProductUnderComplianceReview } from '../../data/compliancePolicy';

export const config = { maxDuration: 15 };

export default async function handler(req: unknown, res: unknown) {
  return withApiHandler(req, res, async (method, body, rawReq) => {
    if (method === 'GET') {
      return { status: 200, body: await listOrders() };
    }
    if (method === 'POST') {
      const payload = parseJsonBody(body) as unknown as Parameters<typeof createCheckoutOrder>[0];
      if (!payload.customerName || !payload.customerEmail || !Array.isArray(payload.items) || payload.items.length === 0) {
        return { status: 400, body: { error: 'Customer name, email, and at least one item are required' } };
      }
      const restrictedItem = payload.items.find(item => isProductUnderComplianceReview(item.productId));
      if (restrictedItem) {
        return {
          status: 400,
          body: {
            error: `Product ${restrictedItem.productId} is currently under compliance review and temporarily unavailable for purchase.`
          }
        };
      }
      return { status: 201, body: await createCheckoutOrder(payload) };
    }
    if (method === 'PATCH') {
      const parsed = parseJsonBody(body);
      const queryId = (rawReq as { query?: Record<string, unknown> })?.query?.id;
      const orderId = (typeof queryId === 'string' ? queryId : undefined) || (typeof parsed.id === 'string' ? parsed.id : undefined);
      if (!orderId) return { status: 400, body: { error: 'Order id is required' } };
      const updated = await patchCheckoutOrder(orderId, parsed);
      if (!updated) return { status: 404, body: { error: 'Order not found' } };
      return { status: 200, body: updated };
    }
    if (method === 'DELETE') {
      const parsed = parseJsonBody(body);
      const queryId = (rawReq as { query?: Record<string, unknown> })?.query?.id;
      const orderId = (typeof queryId === 'string' ? queryId : undefined) || (typeof parsed.id === 'string' ? parsed.id : undefined);
      if (!orderId) return { status: 400, body: { error: 'Order id is required' } };
      const deleted = await deleteOrderById(orderId);
      return { status: 200, body: { success: deleted, deletedId: orderId } };
    }
    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST, PATCH, DELETE' } };
  });
}
