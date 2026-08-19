import { createProduct, listProducts } from '../../src/server/products-repository';
import { parseJsonBody } from '../../src/server/parse-json-body';
import { withApiHandler } from '../../src/server/vercel-handler';

export const config = {
  maxDuration: 15,
};

export default async function handler(req: unknown, res: unknown) {
  return withApiHandler(req, res, async (method, body) => {
    if (method === 'GET') {
      return { status: 200, body: await listProducts() };
    }
    if (method === 'POST') {
      return { status: 201, body: await createProduct(parseJsonBody(body)) };
    }
    return { status: 405, body: { error: 'Method not allowed' }, headers: { Allow: 'GET, POST' } };
  });
}
