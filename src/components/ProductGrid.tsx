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
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedOriginCountry !== 'All' && p.originCountry !== selectedOriginCountry) return false;
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
      
      <div className="space-y-4 mb-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div>
            <h2 className="text-xl font-black text-[var(--color-text-primary)] flex items-center space-x-2">
              <span>European Official Documents &amp; Dossier Catalogue</span>
              <span className="text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] font-normal px-2.5 py-0.5 rounded-full border border-[var(--color-border)]">
                {filteredProducts.length} Items
              </span>
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Registered EU &amp; international passports, driving permits, residence cards, IDs and visa processing with Euro (€) settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            <select
              value={selectedOriginCountry}
              onChange={e => setSelectedOriginCountry(e.target.value)}
              className="bg-[var(--color-bg-input)] text-[var(--color-text-primary)] border border-[var(--color-border)] px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="All">All EU Origins</option>
              {ORIGINS.filter(o => o !== 'All').map(country => (
                <option key={country} value={country}>Made in {country}</option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border font-medium transition-all ${
                showOnlyInStock
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-[var(--color-bg-input)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${showOnlyInStock ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[var(--color-text-muted)]'}`}>
                {showOnlyInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>In Stock Only</span>
            </button>

            {(selectedCategory !== 'All' || selectedOriginCountry !== 'All' || showOnlyInStock || searchQuery) && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 bg-[var(--color-bg-input)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-3 py-2 rounded-xl border border-[var(--color-border)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>
        </div>

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
                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 pt-1 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] shrink-0">Popular Tags:</span>
          {popularTags.map(tag => {
            const isTagActive = searchQuery.toLowerCase().includes(tag.toLowerCase());
            return (
              <button
                key={tag}
                onClick={() => setSearchQuery(isTagActive ? '' : tag)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                  isTagActive
                    ? 'bg-blue-100 dark:bg-blue-900/80 border-blue-500 text-blue-700 dark:text-blue-200'
                    : 'bg-[var(--color-bg-secondary)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border)]'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

      </div>

      {searchQuery && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-blue-700 dark:text-blue-200">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              Filtering by keyword/tag: <strong className="text-[var(--color-text-primary)] font-bold">&quot;{searchQuery}&quot;</strong> ({filteredProducts.length} {filteredProducts.length === 1 ? 'match' : 'matches'})
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-500 hover:text-blue-700 dark:hover:text-white font-medium underline transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {isLoadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl h-80"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">No Matching European Products</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
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
