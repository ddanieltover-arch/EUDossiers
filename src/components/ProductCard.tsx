import React from 'react';
import { ShoppingBag, Eye, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLocalizedProductName } from '../hooks/useLocalizedProductName';
import { useLocalizedProductDescription } from '../hooks/useLocalizedProductDescription';
import { getProductPath } from '../utils/productSlug';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, formatPriceEUR, setSearchQuery } = useStore();
  const { t } = useTranslation('common');
  const localizedName = useLocalizedProductName(product);
  const localizedDescription = useLocalizedProductDescription(product);

  const isLowStock = product.totalStock > 0 && product.totalStock <= product.lowStockThreshold;
  const isOutOfStock = product.totalStock <= 0;

  const discountPercent = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) hash = ((hash << 5) - hash + product.id.charCodeAt(i)) | 0;
    return 5 + (Math.abs(hash) % 6);
  }, [product.id]);

  const originalPrice = product.priceEUR / (1 - discountPercent / 100);
  const priceLabel = formatPriceEUR(product.priceEUR);

  return (
    <div className="group bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[var(--color-border-subtle)] transition-all flex flex-col h-full">
      <Link 
        to={getProductPath(product)}
        className="relative aspect-4/3 bg-[var(--color-bg-tertiary)] overflow-hidden cursor-pointer block"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={localizedName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 text-slate-400 p-4 text-center group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
            <span className="text-3xl mb-1.5">{product.originFlag}</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Image Pending Upload</span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{product.sku}</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <div className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/20 flex items-center space-x-1.5 shadow-sm">
            <span>{product.originFlag}</span>
            <span>{t('product.madeIn', { country: product.originCountry })}</span>
          </div>
        </div>

        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {t('product.outOfStock')}
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-800/80 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{t('product.lowStock', { count: product.totalStock })}</span>
            </span>
          ) : (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
              {t('product.inStock', { count: product.totalStock })}
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-[var(--color-ink-950)] font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg">
            <Eye className="w-4 h-4" />
            <span>{t('product.quickInspect')}</span>
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1">
            <span className="font-semibold text-blue-500 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span className="font-mono text-[var(--color-text-muted)] text-[10px]">
              SKU: {product.sku}
            </span>
          </div>

          <Link 
            to={getProductPath(product)}
            className="font-bold text-base text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors line-clamp-2 cursor-pointer block"
          >
            {localizedName}
          </Link>

          <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
            {localizedDescription}
          </p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.map(tag => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery(tag);
                  }}
                  className="text-[10px] font-medium bg-[var(--color-bg-tertiary)] hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[var(--color-text-muted)] hover:text-blue-600 dark:hover:text-blue-300 border border-[var(--color-border)] hover:border-blue-400/50 px-1.5 py-0.5 rounded transition-colors"
                  title={`Filter products by #${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--color-border)] flex items-end justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-[var(--color-text-muted)]">
              <span className="line-through text-[var(--color-text-muted)] font-mono text-[11px]">
                {formatPriceEUR(originalPrice)}
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-emerald-500">{priceLabel}</span>
              <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{t('product.includesVat')}</div>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md ${
              isOutOfStock
                ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? t('product.outOfStock') : t('actions.addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
