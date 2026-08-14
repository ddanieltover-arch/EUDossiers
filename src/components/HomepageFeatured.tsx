import React from 'react';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, Globe, CreditCard, Award, Shield, FileText } from 'lucide-react';

export const HomepageFeatured: React.FC = () => {
  const { products, setSelectedCategory, setViewMode } = useStore();

  const categories = [
    { id: 'Passports', name: 'Passports', icon: Globe, color: 'text-amber-400', badgeBg: 'bg-amber-950/60 border-amber-800/80 text-amber-300' },
    { id: 'Driver Licenses', name: 'Driver Licenses', icon: CreditCard, color: 'text-blue-400', badgeBg: 'bg-blue-950/60 border-blue-800/80 text-blue-300' },
    { id: 'Identity Cards', name: 'Identity Cards', icon: Award, color: 'text-emerald-400', badgeBg: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300' },
    { id: 'Residence Permits', name: 'Residence Permits', icon: Shield, color: 'text-purple-400', badgeBg: 'bg-purple-950/60 border-purple-800/80 text-purple-300' },
    { id: 'EU Visas', name: 'EU Visas & Financial Proof', icon: FileText, color: 'text-cyan-400', badgeBg: 'bg-cyan-950/60 border-cyan-800/80 text-cyan-300' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setViewMode('storefront');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Section Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-950/60 text-blue-400 border border-blue-800/60 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Document Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Curated Document Highlights
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Explore a selection of registered passports, driving permits, residence cards, and visas from our official single-market catalogue.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('All');
            setViewMode('storefront');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-2 shrink-0 self-start md:self-auto"
        >
          <span>View Full Catalogue ({products.length} Items)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Sections with 2-3 products each */}
      <div className="space-y-12">
        {categories.map(cat => {
          const categoryProducts = products.filter(p => p.category === cat.id).slice(0, 3);
          const Icon = cat.icon;

          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-5">
              
              {/* Category Sub-Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Top registered {cat.name.toLowerCase()} available for single market delivery.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 group transition-colors"
                >
                  <span>Explore all {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Products Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/50 rounded-3xl p-8 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
            Need a Specific EU Member State Document?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our catalogue includes 28+ registered documents across Germany, France, Italy, Spain, Netherlands, Sweden, Switzerland, Belgium, Denmark, and more.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('All');
            setViewMode('storefront');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-all inline-flex items-center space-x-2"
        >
          <span>Open Full Catalogue &amp; Filter Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
