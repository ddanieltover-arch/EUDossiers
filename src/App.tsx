import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopTicker } from './components/TopTicker';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { LocalizationModal } from './components/LocalizationModal';
import { GDPRBanner } from './components/GDPRBanner';
import { useAdminAuth } from './context/AdminAuthContext';
import { ShieldCheck, Globe, Euro, Warehouse, Heart } from 'lucide-react';
import { SITE_NAME, LEGAL_FOOTER } from './brand';
import { Link } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductPage from './pages/ProductPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPortalPage from './pages/AdminPortalPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const AppContent: React.FC = () => {
  const { setIsLocalizationModalOpen } = useStore();
  const { isAdminAuthenticated } = useAdminAuth();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans selection:bg-[var(--color-accent-600)] selection:text-white transition-colors duration-200">
      
      <ScrollToTop />
      <TopTicker />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/catalogue/:productId" element={<ProductPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/portal" element={<AdminPortalPage />} />
        </Routes>
      </main>

      <CartDrawer />
      <OrderSuccessModal />
      <LocalizationModal />
      <GDPRBanner />

      <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] text-[var(--color-text-muted)] py-12 mt-12 text-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🇪🇺</span>
                <span className="font-extrabold text-lg text-[var(--color-text-primary)] tracking-tight font-display">{SITE_NAME}</span>
              </div>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                European single market e-commerce platform with default Euro (€) settlement, live multi-currency preview, GDPR Article 15/17 compliance, and merchant inventory tools.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px]">EU Regional Standards</h4>
              <ul className="space-y-1.5 text-[var(--color-text-muted)]">
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
              <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px]">GDPR Data Privacy</h4>
              <ul className="space-y-1.5 text-[var(--color-text-muted)]">
                <li>
                  <Link to="/privacy" className="hover:text-emerald-500 transition-colors flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Download Personal Data (DSAR)</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-emerald-500 transition-colors">
                    Right to Be Forgotten (Art. 17)
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-emerald-500 transition-colors">
                    Consent Audit Log Inspector
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-emerald-500 transition-colors flex items-center space-x-1">
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px]">Quick Localization</h4>
              <button
                onClick={() => setIsLocalizationModalOpen(true)}
                className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left flex items-center justify-between"
              >
                <span>Change EU Country / Currency</span>
                <Globe className="w-4 h-4 text-[var(--color-accent-500)]" />
              </button>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Data Hosted in Frankfurt, Germany (EU-West Node).
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--color-text-muted)] text-[11px]">
            <div className="flex items-center space-x-3">
              <span>{LEGAL_FOOTER}</span>
            </div>
            <div className="flex items-center space-x-1 text-[var(--color-text-muted)]">
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
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}
