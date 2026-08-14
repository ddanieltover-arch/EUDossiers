import React from 'react';
import { ShoppingBag, Eye, AlertTriangle, CheckCircle, MapPin, Warehouse } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    getConvertedPriceString, 
    setSelectedProductForDetail,
    setSearchQuery
  } = useStore();

  const isLowStock = product.totalStock > 0 && product.totalStock <= product.lowStockThreshold;
  const isOutOfStock = product.totalStock <= 0;

  const { mainEUR, convertedRef } = getConvertedPriceString(product.priceEUR);

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-slate-700 transition-all flex flex-col h-full">
      
      {/* Image & Badges */}
      <div 
        className="relative aspect-4/3 bg-slate-800 overflow-hidden cursor-pointer"
        onClick={() => setSelectedProductForDetail(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Origin Country & 5% OFF Discount Tag */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <div className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center space-x-1.5 shadow-sm">
            <span>{product.originFlag}</span>
            <span>Made in {product.originCountry}</span>
          </div>
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
            5% OFF
          </span>
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-rose-950/90 text-rose-300 border border-rose-800/80 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-800/80 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>Only {product.totalStock} left</span>
            </span>
          ) : (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-sm">
              In Stock ({product.totalStock})
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-slate-900 font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-lg">
            <Eye className="w-4 h-4" />
            <span>Quick Inspect Specs</span>
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-blue-400 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span className="font-mono text-slate-500 text-[10px]">
              SKU: {product.sku}
            </span>
          </div>

          <h3 
            onClick={() => setSelectedProductForDetail(product)}
            className="font-bold text-base text-white group-hover:text-blue-300 transition-colors line-clamp-2 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Product Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags.map(tag => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery(tag);
                  }}
                  className="text-[10px] font-medium bg-slate-800 hover:bg-blue-900/60 text-slate-400 hover:text-blue-300 border border-slate-700/80 hover:border-blue-600/50 px-1.5 py-0.5 rounded transition-colors"
                  title={`Filter products by #${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-slate-800 flex items-end justify-between">
          
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <span>Discounted Price:</span>
              {product.originalPriceEUR && (
                <span className="line-through text-slate-500 font-mono text-[11px]">
                  €{product.originalPriceEUR.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-emerald-400">
                {mainEUR}
              </span>
              {convertedRef && (
                <span className="text-xs font-semibold text-indigo-300">
                  {convertedRef}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500">
              Includes {product.vatRateCategory === 'standard' ? 'Standard' : 'Reduced'} EU VAT
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
