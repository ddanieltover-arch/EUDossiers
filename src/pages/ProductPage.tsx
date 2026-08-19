import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Warehouse, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart, getConvertedPriceString, selectedCountry, setSearchQuery } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-black text-[var(--color-text-primary)]">Product Not Found</h2>
        <p className="text-sm text-[var(--color-text-muted)]">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/catalogue" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">
          Browse Catalogue
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.totalStock <= 0;

  const discountPercent = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) hash = ((hash << 5) - hash + product.id.charCodeAt(i)) | 0;
    return 5 + (Math.abs(hash) % 6);
  }, [product.id]);

  const originalPrice = product.priceEUR / (1 - discountPercent / 100);
  const { mainEUR, convertedRef } = getConvertedPriceString(product.priceEUR);
  const displayImage = activeImage || product.imageUrl;
  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(
    (img, idx, arr) => arr.indexOf(img) === idx
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <button onClick={() => navigate(-1)} className="flex items-center space-x-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]">
            <img src={displayImage} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg border border-white/20 flex items-center space-x-1.5">
              <span>{product.originFlag}</span>
              <span>Made in {product.originCountry}</span>
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Product Gallery ({allImages.length} views)
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      displayImage === img
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-[var(--color-border)] opacity-70 hover:opacity-100 hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
              <Warehouse className="w-4 h-4 text-blue-500" />
              <span>EU Fulfillment Network</span>
            </div>
            <div className="space-y-2 text-xs">
              {product.warehouses.map(wh => (
                <div key={wh.warehouseId} className="flex justify-between items-center bg-[var(--color-bg-primary)] p-2 rounded-xl border border-[var(--color-border)]">
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                    <span className="text-[var(--color-text-secondary)] truncate">{wh.warehouseName}</span>
                  </div>
                  <span className="font-mono text-emerald-500 font-semibold shrink-0 ml-2">{wh.quantity} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] leading-tight">{product.name}</h1>
              <div className="text-xs text-[var(--color-text-muted)] mt-1">
                Supplier: <span className="text-[var(--color-text-secondary)] font-medium">{product.supplierName}</span>
              </div>
            </div>

            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/catalogue`}
                  onClick={() => setSearchQuery(tag)}
                  className="bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-blue-500 hover:border-blue-400/50 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-4 rounded-2xl space-y-1">
              <div className="text-xs text-[var(--color-text-muted)] flex items-center space-x-2">
                <span>Transaction Price (EUR Base):</span>
                <span className="line-through font-mono text-[var(--color-text-muted)]">€{originalPrice.toFixed(2)}</span>
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 rounded">{discountPercent}% OFF</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">{mainEUR}</span>
                {convertedRef && <span className="text-sm font-semibold text-indigo-500">{convertedRef}</span>}
              </div>
              <div className="text-xs text-[var(--color-text-muted)] pt-1 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Price includes {(selectedCountry.vatRate * 100).toFixed(0)}% {selectedCountry.name} VAT. Duty-free EU delivery.</span>
              </div>
              <div className={`text-xs font-bold pt-1 ${isOutOfStock ? 'text-rose-500' : product.totalStock <= product.lowStockThreshold ? 'text-amber-500' : 'text-emerald-500'}`}>
                {isOutOfStock ? 'Currently Out of Stock' : `${product.totalStock} units in stock`}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1 || isOutOfStock} className="w-8 h-8 rounded-lg bg-[var(--color-bg-card-hover)] disabled:opacity-40 text-[var(--color-text-primary)] font-bold flex items-center justify-center">-</button>
                <span className="w-12 text-center font-bold text-sm text-[var(--color-text-primary)]">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.totalStock, quantity + 1))} disabled={quantity >= product.totalStock || isOutOfStock} className="w-8 h-8 rounded-lg bg-[var(--color-bg-card-hover)] disabled:opacity-40 text-[var(--color-text-primary)] font-bold flex items-center justify-center">+</button>
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                Total EUR: <span className="text-[var(--color-text-primary)] font-bold text-sm">{(product.priceEUR * quantity).toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
                isOutOfStock
                  ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Currently Out of Stock' : `Add ${quantity} to Cart`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
