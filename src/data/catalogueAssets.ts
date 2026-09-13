const CATALOGUE_FILES: Record<string, { main: string; gallery?: string[] }> = {
  'doc-001': { main: 'doc-001.webp' },
  'doc-002': { main: 'doc-002.webp' },
  'doc-003': { main: 'doc-003.jpg' },
  'doc-004': { main: 'doc-004.jpg' },
  'doc-005': { main: 'doc-005.jpg' },
  'doc-006': { main: 'doc-006.jpg' },
  'doc-007': { main: 'doc-007.jpg' },
  'doc-008': { main: 'doc-008.png', gallery: ['doc-010.jpg'] },
  'doc-009': { main: 'doc-009.jpg' },
  'doc-011': { main: 'doc-011.webp' },
  'doc-012': { main: 'doc-012.png', gallery: ['doc-012-g1.jpg'] },
  'doc-014': { main: 'doc-014.webp' },
  'doc-015': { main: 'doc-015.webp', gallery: ['doc-013.jpg'] },
  'doc-016': { main: 'doc-016.jpg' },
  'doc-019': { main: 'doc-001-g1.jpg' },
  'doc-026': { main: 'doc-002-g1.jpg', gallery: ['doc-010-g1.jpg'] },
  'doc-028': { main: 'doc-028.jpg', gallery: ['doc-028-g1.jpg'] },
};

export function localCatalogueImages(productId: string): {
  imageUrl: string;
  galleryImages: string[];
} | null {
  const files = CATALOGUE_FILES[productId];
  if (!files) return null;
  const imageUrl = `/catalogue/${files.main}`;
  const gallery = (files.gallery || []).map((g) => `/catalogue/${g}`);
  return {
    imageUrl,
    galleryImages: [imageUrl, ...gallery],
  };
}

export function withLocalCatalogueImages<T extends { id: string; imageUrl: string; galleryImages?: string[] }>(
  product: T
): T {
  const local = localCatalogueImages(product.id);
  if (!local) {
    return {
      ...product,
      imageUrl: '',
      galleryImages: [],
    };
  }
  return {
    ...product,
    imageUrl: local.imageUrl,
    galleryImages: local.galleryImages,
  };
}
