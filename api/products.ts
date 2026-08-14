import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createProduct, listProducts } from '../src/server/products-repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const products = await listProducts();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = await createProduct(req.body || {});
      return res.status(201).json(product);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: 'Failed to load catalogue from Neon' });
  }
}
