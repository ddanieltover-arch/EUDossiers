import { deleteProduct, getProductById, updateProduct } from '../../src/server/products-repository';

export const config = {
  maxDuration: 15,
};

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return 'Failed to update catalogue in Neon';
}

export default async function handler(
  req: { method?: string; body?: unknown; query?: { id?: string | string[] } },
  res: {
    status: (code: number) => { json: (body: unknown) => unknown };
    setHeader: (name: string, value: string) => void;
  }
) {
  const id = req.query?.id;
  const productId = Array.isArray(id) ? id[0] : id;
  if (!productId) {
    return res.status(400).json({ error: 'Product id is required' });
  }

  try {
    if (req.method === 'GET') {
      const product = await getProductById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    }

    if (req.method === 'PUT') {
      const updated = await updateProduct(productId, (req.body as object) || {});
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const deleted = await deleteProduct(productId);
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true, deletedId: productId });
    }

    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Product item API error:', err);
    return res.status(500).json({ error: errorMessage(err) });
  }
}
