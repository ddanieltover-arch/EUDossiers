import React from 'react';
import { Filter, Check, RotateCcw, AlertCircle, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

const CATEGORIES = [
  'All',
  'Passports',
  'Driver Licenses',
  'Identity Cards',
  'Residence Permits',
  'EU Visas'
];

const ORIGINS = [
  'All',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Sweden',
  'Netherlands',
  'Switzerland',
  'Bulgaria',
  'Austria',
  'United States',
  'Denmark',
  'Hungary',
  'United Kingdom',
  'Canada',
  'Belgium',
  'Greece'
];

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    isLoadingProducts, 
    searchQuery, 
    setSearchQuery,
    selectedCategory, 
    setSelectedCategory,
    selectedOriginCountry,
    setSelectedOriginCountry,
    showOnlyInStock,
    setShowOnlyInStock
  } = useStore();

  const filteredProducts = products.filter(p => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.startsWith('#') ? q.slice(1) : q;
      const matchName = p.name.toLowerCase().includes(cleanQ);
      const matchDesc = p.description.toLowerCase().includes(cleanQ);
      const matchSku = p.sku.toLowerCase().includes(cleanQ);
      const matchSupplier = p.supplierName.toLowerCase().includes(cleanQ);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(cleanQ));
      if (!matchName && !matchDesc && !matchSku && !matchSupplier && !matchTags) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

    // Origin Country filter
    if (selectedOriginCountry !== 'All' && p.originCountry !== selectedOriginCountry) return false;

    // In-Stock filter
    if (showOnlyInStock && p.totalStock <= 0) return false;

    return true;
  });

  const popularTags: string[] = Array.from(new Set<string>(products.flatMap(p => p.tags || []))).slice(0, 8);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedOriginCountry('All');
    setShowOnlyInStock(false);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Pills & Filters */}
      <div className="space-y-4 mb-8">
        
        {/* Top Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center space-x-2">
              <span>European Official Documents &amp; Dossier Catalogue</span>
              <span className="text-xs bg-slate-800 text-slate-300 font-normal px-2.5 py-0.5 rounded-full border border-slate-700">
                {filteredProducts.length} Items
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Registered EU &amp; international passports, driving permits, residence cards, IDs and visa processing with Euro (€) settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Origin Country Dropdown */}
            <select
              value={selectedOriginCountry}
              onChange={e => setSelectedOriginCountry(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="All">All EU Origins</option>
              {ORIGINS.filter(o => o !== 'All').map(country => (
                <option key={country} value={country}>Made in {country}</option>
              ))}
            </select>

            {/* In-Stock Toggle */}
            <button
              onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border font-medium transition-all ${
                showOnlyInStock
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${showOnlyInStock ? 'bg-emerald-500 border-emerald-400 text-slate-900' : 'border-slate-500'}`}>
                {showOnlyInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>In Stock Only</span>
            </button>

            {/* Reset Filters */}
            {(selectedCategory !== 'All' || selectedOriginCountry !== 'All' || showOnlyInStock || searchQuery) && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>
        </div>

        {/* Category Horizontal Scroll Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Popular Tag Quick-Filters */}
        <div className="flex items-center space-x-2 pt-1 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-medium text-slate-500 shrink-0">Popular Tags:</span>
          {popularTags.map(tag => {
            const isTagActive = searchQuery.toLowerCase().includes(tag.toLowerCase());
            return (
              <button
                key={tag}
                onClick={() => setSearchQuery(isTagActive ? '' : tag)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                  isTagActive
                    ? 'bg-blue-900/80 border-blue-500 text-blue-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

      </div>

      {/* Active Search / Filter Banner */}
      {searchQuery && (
        <div className="mb-6 bg-blue-950/40 border border-blue-800/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Filtering by keyword/tag: <strong className="text-white font-bold">&quot;{searchQuery}&quot;</strong> ({filteredProducts.length} {filteredProducts.length === 1 ? 'match' : 'matches'})
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-300 hover:text-white font-medium underline transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Cards Grid */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-80"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching European Products</h3>
          <p className="text-xs text-slate-400">
            Try resetting your search query or selecting a different EU origin country filter.
          </p>
          <button
            onClick={resetFilters}
            className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
};
