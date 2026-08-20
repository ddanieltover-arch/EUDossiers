import { useTranslation } from 'react-i18next';
import type { Product } from '../types';
import { getLocalizedProductName } from '../data/productNameTranslations';

export function useLocalizedProductName(product: Pick<Product, 'id' | 'name' | 'nameTranslations'>): string {
  const { i18n } = useTranslation();
  return getLocalizedProductName(product, i18n.language);
}
