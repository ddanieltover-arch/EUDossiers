import React from 'react';
import { Home, Store, Mail, ShoppingBag, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../context/StoreContext';

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  badge?: number;
};

export const MobileBottomNav: React.FC = () => {
  const { cart } = useStore();
  const { t } = useTranslation('common');
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isHome = location.pathname === '/';
  const isCatalogue = location.pathname.startsWith('/catalogue');
  const isContact = location.pathname === '/contact';
  const isCart = location.pathname === '/cart' || location.pathname === '/checkout';

  const items: NavItem[] = [
    {
      to: '/',
      label: t('nav.home'),
      icon: Home,
      active: isHome,
    },
    {
      to: '/catalogue',
      label: t('nav.catalogue'),
      icon: Store,
      active: isCatalogue,
    },
    {
      to: '/contact',
      label: t('nav.contact'),
      icon: Mail,
      active: isContact,
    },
    {
      to: '/cart',
      label: t('nav.cart'),
      icon: ShoppingBag,
      active: isCart,
      badge: totalCartCount,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--color-bg-secondary)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {items.map(({ to, label, icon: Icon, active, badge = 0 }) => (
          <Link
            key={to}
            to={to}
            className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
              active
                ? 'text-[var(--color-accent-500)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <span className="relative">
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.25]' : ''}`} />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[var(--color-bg-secondary)]">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </span>
            <span>{label}</span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--color-accent-500)]" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};
