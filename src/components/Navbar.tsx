import React from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Globe, 
  Store, 
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { SITE_NAME, NAV_SUBTITLE } from '../brand';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    selectedCountry, 
    selectedCurrency, 
    setIsLocalizationModalOpen,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isCatalogue = location.pathname.startsWith('/catalogue');
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-b border-[var(--color-border)] text-[var(--color-text-primary)] shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          <div className="flex items-center space-x-3">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-left group transition-all"
            >
              <img src="/logo.png" alt="EUDossier@" className="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform object-contain" />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-500)] transition-colors font-display">
                    {SITE_NAME}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent-800)]/60 text-[var(--color-accent-200)] border border-[var(--color-accent-700)]/50 px-1.5 py-0.5 rounded">
                    EU
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] hidden sm:block">
                  {NAV_SUBTITLE}
                </p>
              </div>
            </Link>
          </div>

          {isCatalogue && (
            <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search registered passports, driver licenses, residence permits, visas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-bg-input)] text-xs text-[var(--color-text-primary)] pl-10 pr-4 py-2 rounded-xl border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-500)] focus:ring-1 focus:ring-[var(--color-accent-500)] placeholder-[var(--color-text-muted)] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2 sm:space-x-3">
            
            <div className="bg-[var(--color-bg-tertiary)] p-1 rounded-xl border border-[var(--color-border)] flex items-center space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isHome
                    ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)]'
                }`}
              >
                <span>Home</span>
              </Link>
              <Link
                to="/catalogue"
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isCatalogue
                    ? 'bg-[var(--color-accent-600)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Catalogue</span>
              </Link>
            </div>

            <button
              onClick={() => setIsLocalizationModalOpen(true)}
              className="flex items-center space-x-1.5 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              title="Change Delivery Country or Display Currency Reference"
            >
              <span className="text-sm">{selectedCountry.flag}</span>
              <span className="hidden lg:inline">{selectedCountry.code}</span>
              <span className="text-[var(--color-text-muted)] hidden lg:inline">•</span>
              <span className="text-[var(--color-accent-500)] font-semibold">{selectedCurrency.code}</span>
              <Globe className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            </button>

            <Link
              to="/privacy"
              className="flex items-center space-x-1.5 bg-[var(--color-bg-tertiary)] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-[var(--color-border)] hover:border-emerald-500/50 text-[var(--color-text-secondary)] hover:text-emerald-600 dark:hover:text-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              title="GDPR Data Privacy Controls & DSAR Export"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="hidden md:inline">GDPR Privacy</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-all"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <Link
              to="/cart"
              className="relative bg-[var(--color-accent-600)] hover:bg-[var(--color-accent-500)] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md hover:shadow-[var(--color-accent-600)]/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-amber-400 text-[var(--color-ink-950)] font-bold px-1.5 py-0.2 rounded-full text-[11px] min-w-[18px] text-center">
                  {totalCartCount}
                </span>
              )}
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
};
