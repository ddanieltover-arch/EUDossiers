import { deleteProduct, getProductById, updateProduct } from '../../src/server/products-repository';
import { parseJsonBody } from '../../src/server/parse-json-body';
import { readPathId, withApiHandler } from '../../src/server/vercel-handler';

export const config = {
  maxDuration: 15,
};

export default async function handler(req: unknown, res: unknown) {
  return withApiHandler(req, res, async (method, body, rawReq) => {
    const productId = readPathId(rawReq, '/api/products');
    if (!productId) {
      return { status: 400, body: { error: 'Product id is required' } };
    }

    if (method === 'GET') {
      const product = await getProductById(productId);
      if (!product) return { status: 404, body: { error: 'Product not found' } };
      return { status: 200, body: product };
    }

    if (method === 'PUT') {
      const updated = await updateProduct(productId, parseJsonBody(body));
      if (!updated) return { status: 404, body: { error: 'Product not found' } };
      return { status: 200, body: updated };
    }

    if (method === 'DELETE') {
      const deleted = await deleteProduct(productId);
      if (!deleted) return { status: 404, body: { error: 'Product not found' } };
      return { status: 200, body: { success: true, deletedId: productId } };
    }

    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, PUT, DELETE' } };
  });
}
