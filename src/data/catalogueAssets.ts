const CATALOGUE_FILES: Record<string, { main: string; gallery: string }> = {
  'doc-001': { main: 'doc-001.webp', gallery: 'doc-001-g1.jpg' },
  'doc-002': { main: 'doc-002.webp', gallery: 'doc-002-g1.jpg' },
  'doc-003': { main: 'doc-003.jpg', gallery: 'doc-003-g1.jpg' },
  'doc-004': { main: 'doc-004.jpg', gallery: 'doc-004-g1.jpg' },
  'doc-005': { main: 'doc-005.jpg', gallery: 'doc-005-g1.jpg' },
  'doc-006': { main: 'doc-006.jpg', gallery: 'doc-006-g1.jpg' },
  'doc-007': { main: 'doc-007.jpg', gallery: 'doc-007-g1.jpg' },
  'doc-008': { main: 'doc-008.png', gallery: 'doc-008-g1.jpg' },
  'doc-009': { main: 'doc-009.jpg', gallery: 'doc-009-g1.jpg' },
  'doc-010': { main: 'doc-010.jpg', gallery: 'doc-010-g1.jpg' },
  'doc-011': { main: 'doc-011.webp', gallery: 'doc-011-g1.jpg' },
  'doc-012': { main: 'doc-012.png', gallery: 'doc-012-g1.jpg' },
  'doc-013': { main: 'doc-013.jpg', gallery: 'doc-013-g1.png' },
  'doc-014': { main: 'doc-014.webp', gallery: 'doc-014-g1.png' },
  'doc-015': { main: 'doc-015.webp', gallery: 'doc-015-g1.jpg' },
  'doc-016': { main: 'doc-016.jpg', gallery: 'doc-016-g1.jpg' },
  'doc-017': { main: 'doc-017.png', gallery: 'doc-017-g1.jpg' },
  'doc-018': { main: 'doc-018.jpg', gallery: 'doc-018-g1.jpg' },
  'doc-019': { main: 'doc-019.jpg', gallery: 'doc-019-g1.jpg' },
  'doc-020': { main: 'doc-020.jpg', gallery: 'doc-020-g1.jpg' },
  'doc-021': { main: 'doc-021.jpg', gallery: 'doc-021-g1.jpg' },
  'doc-022': { main: 'doc-022.jpg', gallery: 'doc-022-g1.png' },
  'doc-023': { main: 'doc-023.jpg', gallery: 'doc-023-g1.jpg' },
  'doc-024': { main: 'doc-024.jpg', gallery: 'doc-024-g1.jpg' },
  'doc-025': { main: 'doc-025.jpg', gallery: 'doc-025-g1.webp' },
  'doc-026': { main: 'doc-026.jpg', gallery: 'doc-026-g1.webp' },
  'doc-027': { main: 'doc-027.png', gallery: 'doc-027-g1.jpg' },
  'doc-028': { main: 'doc-028.jpg', gallery: 'doc-028-g1.png' },
};

export function localCatalogueImages(productId: string): {
  imageUrl: string;
  galleryImages: string[];
} | null {
  const files = CATALOGUE_FILES[productId];
  if (!files) return null;
  const imageUrl = `/catalogue/${files.main}`;
  return {
    imageUrl,
    galleryImages: [imageUrl, `/catalogue/${files.gallery}`],
  };
}

export function withLocalCatalogueImages<T extends { id: string; imageUrl: string; galleryImages?: string[] }>(
  product: T
): T {
  const local = localCatalogueImages(product.id);
  if (!local) return product;
  return {
    ...product,
    imageUrl: local.imageUrl,
    galleryImages: local.galleryImages,
  };
}
