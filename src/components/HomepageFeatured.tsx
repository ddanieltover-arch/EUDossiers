import React from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Globe, CreditCard, Award, Shield, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const HomepageFeatured: React.FC = () => {
  const { products, setSelectedCategory } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    { id: 'Passports', name: t('categories.Passports'), icon: Globe, color: 'text-amber-500', badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800/80 text-amber-700 dark:text-amber-300' },
    { id: 'Driver Licenses', name: t('categories.Driver Licenses'), icon: CreditCard, color: 'text-blue-500', badgeBg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800/80 text-blue-700 dark:text-blue-300' },
    { id: 'Identity Cards', name: t('categories.Identity Cards'), icon: Award, color: 'text-emerald-500', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300' },
    { id: 'Residence Permits', name: t('categories.Residence Permits'), icon: Shield, color: 'text-purple-500', badgeBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800/80 text-purple-700 dark:text-purple-300' },
    { id: 'EU Visas', name: t('home:categories.visasName'), icon: FileText, color: 'text-cyan-500', badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate('/catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border)] pb-5 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('home:featured.badge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
            {t('home:featured.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 max-w-xl">
            {t('home:featured.subtitle')}
          </p>
        </div>

        <Link
          to="/catalogue"
          onClick={() => setSelectedCategory('All')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-2 shrink-0 self-start md:self-auto"
        >
          <span>{t('home:featured.viewFull', { count: products.length })}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-12">
        {categories.map(cat => {
          const categoryProducts = products.filter(p => p.category === cat.id).slice(0, 3);
          const Icon = cat.icon;

          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat.id} id={`category-${cat.id.toLowerCase().replace(/\s+/g, '-')}`} className="space-y-5 scroll-mt-24">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {t('home:featured.topRegistered', { category: cat.name })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center space-x-1 group transition-colors"
                >
                  <span>{t('home:featured.exploreAll', { category: cat.name })}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-100 dark:from-blue-950/80 via-[var(--color-bg-secondary)] to-indigo-100 dark:to-indigo-950/80 border border-blue-300 dark:border-blue-800/50 rounded-3xl p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] tracking-tight font-display">
            {t('home:featured.ctaTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {t('home:featured.ctaBody')}
          </p>
        </div>

        <Link
          to="/catalogue"
          onClick={() => setSelectedCategory('All')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-all inline-flex items-center space-x-2"
        >
          <span>{t('home:featured.ctaButton')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </section>
  );
};
