import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopTicker } from './components/TopTicker';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { LanguageModal } from './components/LanguageModal';
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
  const { setIsLanguageModalOpen } = useStore();
  const { isAdminAuthenticated } = useAdminAuth();
  const { t, i18n } = useTranslation('common');
  const currentLang = (i18n.language || 'en').split('-')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col font-sans selection:bg-[var(--color-accent-600)] selection:text-white transition-colors duration-200">
      
      <ScrollToTop />
      <TopTicker />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/catalogue/:productSlug" element={<ProductPage />} />
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
      <LanguageModal />
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
                {t('footer.tagline')}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px]">{t('footer.standardsTitle')}</h4>
              <ul className="space-y-1.5 text-[var(--color-text-muted)]">
                <li className="flex items-center space-x-1.5">
                  <Euro className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                  <span>{t('footer.eurSettlement')}</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                  <span>{t('footer.gdprCompliant')}</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Warehouse className="w-3.5 h-3.5 text-[var(--color-accent-500)]" />
                  <span>{t('footer.warehouses')}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
                {t('footer.privacyTitle')}
              <ul className="space-y-1.5 text-[var(--color-text-muted)]">
                <li>
                  <Link to="/privacy" className="hover:text-emerald-500 transition-colors flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('footer.dsar')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-emerald-500 transition-colors">
                    {t('footer.forgotten')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-emerald-500 transition-colors">
                    {t('footer.auditLog')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-emerald-500 transition-colors flex items-center space-x-1">
                    <span>{t('footer.contactUs')}</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px]">{t('language.title')}</h4>
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full text-left flex items-center justify-between"
              >
                <span>{t('nav.changeLanguage')} ({currentLang})</span>
                <Globe className="w-4 h-4 text-[var(--color-accent-500)]" />
              </button>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {t('footer.hosted')}
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--color-text-muted)] text-[11px]">
            <div className="flex items-center space-x-3">
              <span>{LEGAL_FOOTER}</span>
            </div>
            <div className="flex items-center space-x-1 text-[var(--color-text-muted)]">
              <span>{t('footer.madeWith')}</span>
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
