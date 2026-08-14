import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Globe, 
  Box, 
  Store, 
  Search,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SITE_NAME, NAV_SUBTITLE } from '../brand';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    selectedCountry, 
    selectedCurrency, 
    setIsLocalizationModalOpen, 
    setIsGDPRModalOpen,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    products
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = products.filter(p => p.totalStock <= p.lowStockThreshold).length;

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-ink-900)]/95 backdrop-blur-md border-b border-[var(--color-ink-700)] text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & European Badge */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setViewMode('home')}
              className="flex items-center space-x-2 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent-600)] to-[var(--color-ink-700)] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                <span className="font-display text-sm tracking-tight">Eu</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[var(--color-accent-500)] transition-colors font-display">
                    {SITE_NAME}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent-800)]/60 text-[var(--color-accent-200)] border border-[var(--color-accent-700)]/50 px-1.5 py-0.5 rounded">
                    EU
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {NAV_SUBTITLE}
                </p>
              </div>
            </button>
          </div>

          {/* Search bar (Storefront mode) */}
          {viewMode === 'storefront' && (
            <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered passports, driver licenses, residence permits, visas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-xs text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-[var(--color-accent-500)] focus:ring-1 focus:ring-[var(--color-accent-500)] placeholder-slate-400 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Center/Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* View Mode Switcher Pill */}
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 flex items-center space-x-1">
              <button
                onClick={() => setViewMode('home')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'home'
                    ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>Home</span>
              </button>
              <button
                onClick={() => setViewMode('storefront')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'storefront'
                    ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Catalogue</span>
              </button>
              <button
                onClick={() => setViewMode('inventory')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                  viewMode === 'inventory'
                    ? 'bg-[var(--color-ink-500)] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Inventory</span>
                {lowStockCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5"></span>
                )}
              </button>
            </div>

            {/* Regional Localization Selector Trigger */}
            <button
              onClick={() => setIsLocalizationModalOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              title="Change Delivery Country or Display Currency Reference"
            >
              <span className="text-sm">{selectedCountry.flag}</span>
              <span className="hidden lg:inline">{selectedCountry.code}</span>
              <span className="text-slate-500 hidden lg:inline">•</span>
              <span className="text-[var(--color-accent-200)] font-semibold">{selectedCurrency.code}</span>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* GDPR Privacy Suite Button */}
            <button
              onClick={() => setIsGDPRModalOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-600/50 text-slate-200 hover:text-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              title="GDPR Data Privacy Controls & DSAR Export"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">GDPR Privacy</span>
            </button>

            {/* Cart Drawer Trigger (Storefront mode) */}
            {viewMode === 'storefront' && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md hover:shadow-[var(--color-accent-600)]/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalCartCount > 0 && (
                  <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded-full text-[11px] min-w-[18px] text-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
