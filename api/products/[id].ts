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
    const { deleteProduct, getProductById, updateProduct } = await import('../../src/server/products-repository');
    const { parseJsonBody } = await import('../../src/server/parse-json-body');
    return withApiHandler(req, res, async (method, body, rawReq) => {
      const productId = readPathId(rawReq, '/api/products');
      if (!productId) return { status: 400, body: { error: 'Product id is required' } };
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
  } catch (err) {
    console.error('Product item API load error:', err);
    return reply(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}

export const config = { maxDuration: 15 };
