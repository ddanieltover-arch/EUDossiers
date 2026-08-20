import { useTranslation } from 'react-i18next';
import type { Product } from '../types';
import { getLocalizedProductDescription } from '../data/productDescriptionTranslations';

export function useLocalizedProductDescription(
  product: Pick<Product, 'id' | 'description' | 'descriptionTranslations'>
): string {
  const { i18n } = useTranslation();
  return getLocalizedProductDescription(product, i18n.language);
}
