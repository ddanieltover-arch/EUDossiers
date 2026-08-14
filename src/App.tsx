import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopTicker } from './components/TopTicker';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryShowcase } from './components/CategoryShowcase';
import { HomepageFeatured } from './components/HomepageFeatured';
import { ProductGrid } from './components/ProductGrid';
import { ProcessSection } from './components/ProcessSection';
import { TrustSection } from './components/TrustSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { LocalizationModal } from './components/LocalizationModal';
import { GDPRModal } from './components/GDPRModal';
import { GDPRBanner } from './components/GDPRBanner';
import { InventoryPortal } from './components/inventory/InventoryPortal';
import { ShieldCheck, Globe, Euro, Warehouse, Heart } from 'lucide-react';
import { SITE_NAME, LEGAL_FOOTER } from './brand';

const AppContent: React.FC = () => {
  const { viewMode, setIsGDPRModalOpen, setIsLocalizationModalOpen } = useStore();

  return (
    <div className="min-h-screen bg-[var(--color-ink-950)] text-slate-100 flex flex-col font-sans selection:bg-[var(--color-accent-600)] selection:text-white">
      
      {/* Top Announcement Bar */}
      <TopTicker />

      {/* Navigation Header */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        {viewMode === 'home' ? (
          <>
            <HeroBanner />
            <CategoryShowcase />
            <HomepageFeatured />
            <ProcessSection />
            <TrustSection />
          </>
        ) : viewMode === 'storefront' ? (
          <>
            <ProductGrid />
          </>
        ) : (
          <InventoryPortal />
        )}
      </main>

      {/* Global Modals & Overlay Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <OrderSuccessModal />
      <LocalizationModal />
      <GDPRModal />
      <GDPRBanner />

      {/* Footer */}
      <footer className="bg-[var(--color-ink-900)] border-t border-[var(--color-ink-700)] text-slate-400 py-12 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🇪🇺</span>
                <span className="font-extrabold text-lg text-white tracking-tight font-display">{SITE_NAME}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                European single market e-commerce platform with default Euro (€) settlement, live multi-currency preview, GDPR Article 15/17 compliance, and merchant inventory tools.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">EU Regional Standards</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li className="flex items-center space-x-1.5">
                  <Euro className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                  <span>Default Settlement Currency: EUR (€)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                  <span>EU Destination VAT Calculation</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Warehouse className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                  <span>Frankfurt • Amsterdam • Lyon Hubs</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">GDPR Data Privacy</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button onClick={() => setIsGDPRModalOpen(true)} className="hover:text-emerald-400 transition-colors flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Personal Data (DSAR)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsGDPRModalOpen(true)} className="hover:text-emerald-400 transition-colors">
                    Right to Be Forgotten (Art. 17)
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsGDPRModalOpen(true)} className="hover:text-emerald-400 transition-colors">
                    Consent Audit Log Inspector
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Quick Localization</h4>
              <button
                onClick={() => setIsLocalizationModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left flex items-center justify-between"
              >
                <span>Change EU Country / Currency</span>
                <Globe className="w-4 h-4 text-[var(--color-accent-500)]" />
              </button>
              <p className="text-[11px] text-slate-500">
                Data Hosted in Frankfurt, Germany (EU-West Node).
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              {LEGAL_FOOTER}
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <span>Made with precision for European Official Documents &amp; Dossiers</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
