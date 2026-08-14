import { createProduct, listProducts } from '../src/server/products-repository';

export const config = {
  runtime: 'nodejs',
  maxDuration: 15,
};

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Failed to load catalogue from Neon';
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
      const products = await listProducts();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const product = await createProduct((req.body as object) || {});
      return res.status(201).json(product);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: errorMessage(err) });
  }
}
