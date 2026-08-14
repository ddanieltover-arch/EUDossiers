import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Warehouse, MapPin, Tag, Truck, Check, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, 
    setSelectedProductForDetail, 
    addToCart, 
    getConvertedPriceString,
    selectedCountry 
  } = useStore();

  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const isOutOfStock = product.totalStock <= 0;
  const { mainEUR, convertedRef } = getConvertedPriceString(product.priceEUR);

  const displayImage = activeImage || product.imageUrl;
  const allImages = [product.imageUrl, ...(product.galleryImages || [])].filter(
    (img, idx, arr) => arr.indexOf(img) === idx
  );

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 lg:p-8 shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Warehouse Stock Breakdown */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
              <img
                src={displayImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-950/90 text-white text-xs font-semibold px-3 py-1 rounded-lg border border-slate-700 flex items-center space-x-1.5">
                <span>{product.originFlag}</span>
                <span>Made in {product.originCountry}</span>
              </div>
            </div>

            {/* Gallery Thumbnails Strip */}
            {allImages.length > 1 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                          : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} gallery view ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warehouse Distribution */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Warehouse className="w-4 h-4 text-blue-400" />
                <span>EU Fulfillment Network</span>
              </div>
              
              <div className="space-y-2 text-xs">
                {product.warehouses.map(wh => (
                  <div key={wh.warehouseId} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-200 truncate">{wh.warehouseName}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-semibold shrink-0 ml-2">
                      {wh.quantity} units
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Specs, Price, GDPR & Purchase Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              <div>
                <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>SKU: {product.sku}</span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">
                  {product.name}
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  Supplier: <span className="text-slate-200 font-medium">{product.supplierName}</span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="bg-slate-800 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Price & Local VAT Note */}
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-1">
                <div className="text-xs text-slate-400">Transaction Price (EUR Base):</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-white">
                    {mainEUR}
                  </span>
                  {convertedRef && (
                    <span className="text-sm font-semibold text-indigo-300">
                      {convertedRef}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 pt-1 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Price includes {(selectedCountry.vatRate * 100).toFixed(0)}% {selectedCountry.name} VAT. Duty-free EU delivery.
                  </span>
                </div>
              </div>

            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.totalStock, quantity + 1))}
                    disabled={quantity >= product.totalStock || isOutOfStock}
                    className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-slate-400">
                  Total EUR: <span className="text-white font-bold text-sm">{(product.priceEUR * quantity).toFixed(2)} €</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
    </div>
  );
};
