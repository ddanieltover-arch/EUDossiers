import React from 'react';
import { CreditCard, FileText, Globe, Award, Shield, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon: React.FC<{ className?: string }>;
  description: string;
  gradient: string;
  borderGlow: string;
}

export const CategoryShowcase: React.FC = () => {
  const { selectedCategory, setSelectedCategory, products } = useStore();

  const categories: CategoryItem[] = [
    {
      id: 'Passports',
      name: 'Passports',
      count: products.filter(p => p.category === 'Passports').length,
      icon: Globe,
      description: 'ICAO 9303 Biometric Passports with e-Chip',
      gradient: 'from-amber-500/20 via-[var(--color-bg-tertiary)] to-[var(--color-bg-card)]',
      borderGlow: 'hover:border-amber-500/50 hover:shadow-amber-500/10'
    },
    {
      id: 'Driver Licenses',
      name: 'Driver Licenses',
      count: products.filter(p => p.category === 'Driver Licenses').length,
      icon: CreditCard,
      description: 'EU & International Credit-Card Permite',
      gradient: 'from-blue-500/20 via-[var(--color-bg-tertiary)] to-[var(--color-bg-card)]',
      borderGlow: 'hover:border-blue-500/50 hover:shadow-blue-500/10'
    },
    {
      id: 'Identity Cards',
      name: 'Identity Cards',
      count: products.filter(p => p.category === 'Identity Cards').length,
      icon: Award,
      description: 'Electronic eID Cards with Contactless Microchip',
      gradient: 'from-emerald-500/20 via-[var(--color-bg-tertiary)] to-[var(--color-bg-card)]',
      borderGlow: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10'
    },
    {
      id: 'Residence Permits',
      name: 'Residence Permits',
      count: products.filter(p => p.category === 'Residence Permits').length,
      icon: Shield,
      description: 'Biometric Schengen Right of Residence Cards',
      gradient: 'from-purple-500/20 via-[var(--color-bg-tertiary)] to-[var(--color-bg-card)]',
      borderGlow: 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    },
    {
      id: 'EU Visas',
      name: 'EU Visas & Financial',
      count: products.filter(p => p.category === 'EU Visas').length,
      icon: FileText,
      description: 'Schengen Multi-Entry Visas & Verified Statements',
      gradient: 'from-cyan-500/20 via-[var(--color-bg-tertiary)] to-[var(--color-bg-card)]',
      borderGlow: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight flex items-center space-x-2">
            <span>Official Catalogue Categories</span>
            <span className="text-xs bg-[var(--color-accent-600)]/20 text-[var(--color-accent-600)] border border-[var(--color-accent-600)]/40 px-2 py-0.5 rounded-full font-normal">
              {products.length} Products Registered
            </span>
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Browse by official document classification for single market fulfillment.
          </p>
        </div>
        
        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs text-blue-500 hover:text-blue-400 font-semibold underline transition-colors"
          >
            Show All ({products.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(isSelected ? 'All' : cat.id);
                const el = document.getElementById(`category-${cat.id.toLowerCase().replace(/\s+/g, '-')}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-left p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                isSelected
                  ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-accent-500)] ring-1 ring-[var(--color-accent-500)] shadow-lg shadow-[var(--color-accent-500)]/10'
                  : `bg-[var(--color-bg-card)] border-[var(--color-border)] ${cat.borderGlow} hover:bg-[var(--color-bg-card-hover)]`
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[var(--color-accent-600)] text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'} transition-colors`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-500)]" />
                  ) : (
                    <span className="text-[11px] font-extrabold text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] px-2 py-0.5 rounded-md border border-[var(--color-border)]">
                      {cat.count}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-600)] transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] leading-tight mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
