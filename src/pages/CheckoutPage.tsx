import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EU_COUNTRIES } from '../data/mockData';
import { EUCountryCode } from '../types';
import { SITE_NAME } from '../brand';

const CheckoutPage: React.FC = () => {
  const {
    cart,
    selectedCountry,
    setSelectedCountryByCode,
    selectedCurrency,
    formatPriceEUR,
    cartSubtotalEUR,
    cartVATAmountEUR,
    cartShippingFeeEUR,
    cartTotalEUR,
    placeOrder,
    setIsCartOpen,
  } = useStore();

  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [gdprAgreed, setGdprAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertedTotal = cartTotalEUR * selectedCurrency.rateToEUR;

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 space-y-4">
        <ShoppingBag className="w-16 h-16 text-[var(--color-text-muted)] mx-auto" />
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Nothing to Checkout</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Add items to your cart first.</p>
        <Link to="/catalogue" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">
          Browse Catalogue
        </Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprAgreed) return;
    setIsSubmitting(true);
    const order = await placeOrder({ name: customerName, email: customerEmail });
    setIsSubmitting(false);
    if (order) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Checkout</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Complete your order · Transactions settled in Euro (€)</p>
        </div>
        <Link to="/cart" className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <form onSubmit={handleCheckout} className="lg:col-span-2 space-y-6">

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Delivery &amp; VAT</span>
            </h3>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center justify-between">
                <span>EU Destination Country (VAT)</span>
                <span className="text-blue-500 font-bold normal-case">{(selectedCountry.vatRate * 100).toFixed(0)}% Tax</span>
              </label>
              <select
                value={selectedCountry.code}
                onChange={e => setSelectedCountryByCode(e.target.value as EUCountryCode)}
                className="w-full bg-[var(--color-bg-input)] text-xs text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {EU_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} — {(c.vatRate * 100).toFixed(0)}% VAT
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.eu"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
                />
              </div>
            </div>
          </div>

          <label className="flex items-start space-x-3 text-xs text-[var(--color-text-secondary)] cursor-pointer bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4">
            <input
              type="checkbox"
              required
              checked={gdprAgreed}
              onChange={e => setGdprAgreed(e.target.checked)}
              className="mt-0.5 rounded border-[var(--color-border)] text-blue-600 focus:ring-blue-500 bg-[var(--color-bg-input)]"
            />
            <span className="leading-relaxed text-[var(--color-text-muted)]">
              I agree to {SITE_NAME} terms and consent to essential order processing under <strong className="text-[var(--color-text-secondary)]">GDPR (EU) 2016/679</strong>. My data will be processed in accordance with EU data protection regulations.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !gdprAgreed}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing in EUR...' : `Complete Order · ${formatPriceEUR(cartTotalEUR)}`}</span>
          </button>

        </form>

        <div className="lg:col-span-1">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4 sticky top-24">
            <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Order Summary</h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center space-x-3 text-xs">
                  <img src={item.product.imageUrl} alt={item.product.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-lg bg-[var(--color-bg-tertiary)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[var(--color-text-primary)] truncate">{item.product.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">x{item.quantity}</div>
                  </div>
                  <span className="font-bold text-[var(--color-text-primary)] shrink-0">{formatPriceEUR(item.product.priceEUR * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs border-t border-[var(--color-border)] pt-3">
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>Subtotal</span>
                <span className="text-[var(--color-text-secondary)] font-medium">{formatPriceEUR(cartSubtotalEUR)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>{selectedCountry.name} VAT ({(selectedCountry.vatRate * 100).toFixed(0)}%)</span>
                <span className="text-[var(--color-text-secondary)] font-medium">{formatPriceEUR(cartVATAmountEUR)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-text-muted)]">
                <span>EU Express Shipping</span>
                <span className={cartShippingFeeEUR === 0 ? 'text-emerald-500 font-bold' : 'text-[var(--color-text-secondary)] font-medium'}>
                  {cartShippingFeeEUR === 0 ? 'FREE' : formatPriceEUR(cartShippingFeeEUR)}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[var(--color-border)] font-bold">
                <span className="text-[var(--color-text-primary)] text-sm">Total</span>
                <div className="text-right">
                  <div className="text-lg text-[var(--color-text-primary)] font-black">{formatPriceEUR(cartTotalEUR)}</div>
                  {selectedCurrency.code !== 'EUR' && (
                    <div className="text-[10px] text-indigo-500 font-semibold">
                      (~ {selectedCurrency.symbol}{convertedTotal.toFixed(2)} {selectedCurrency.code})
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
