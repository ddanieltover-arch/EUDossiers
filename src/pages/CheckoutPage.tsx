import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft, ShoppingBag, Truck, CreditCard, Bitcoin, CheckCircle2, Mail, ArrowRight, Copy } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EU_COUNTRIES } from '../data/mockData';
import { EUCountryCode } from '../types';
import { SITE_NAME } from '../brand';

const ADMIN_EMAIL = 'info@eudossier.eu';

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
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'crypto'>('bank');
  const [gdprAgreed, setGdprAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const cryptoDiscount = paymentMethod === 'crypto' ? 0.05 : 0;
  const discountAmountEUR = cartTotalEUR * cryptoDiscount;
  const finalTotalEUR = cartTotalEUR - discountAmountEUR;
  const convertedTotal = finalTotalEUR * selectedCurrency.rateToEUR;

  if (cart.length === 0 && !orderSuccess) {
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
    setCheckoutError(null);
    const created = await placeOrder({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: customerAddress,
      paymentMethod,
    });
    setIsSubmitting(false);
    if (!created) {
      setCheckoutError('We could not place your order. Please check your details and try again.');
      return;
    }
    setOrderSuccess(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ADMIN_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 space-y-6">
        <div className="bg-[var(--color-bg-card)] border border-emerald-300 dark:border-emerald-700/50 rounded-3xl p-8 text-center space-y-5 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-600/20 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Order Confirmed!</h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Thank you for your order. A confirmation has been sent to your email. To complete payment, please follow the instructions in that email or contact our admin team.
            </p>
          </div>

          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-5 space-y-3 text-left">
            <div className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>Contact Admin for Payment Details</span>
            </div>
            <div className="flex items-center justify-between bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl px-4 py-3">
              <span className="text-sm font-bold text-blue-500">{ADMIN_EMAIL}</span>
              <button
                onClick={handleCopyEmail}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] flex items-center space-x-1 transition-colors"
              >
                {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs text-[var(--color-text-muted)] space-y-1">
              <p><strong className="text-[var(--color-text-secondary)]">Payment Method:</strong> {paymentMethod === 'crypto' ? 'Cryptocurrency (5% discount applied)' : 'Bank Transfer'}</p>
              <p><strong className="text-[var(--color-text-secondary)]">Amount Due:</strong> {formatPriceEUR(finalTotalEUR)}</p>
              <p>Please include your name (<strong className="text-[var(--color-text-secondary)]">{customerName}</strong>) in the payment reference.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`mailto:${ADMIN_EMAIL}?subject=Payment%20for%20Eudossier%20Order&body=Hi%2C%0A%0AI%20would%20like%20to%20complete%20payment%20for%20my%20order.%0A%0AName%3A%20${encodeURIComponent(customerName)}%0AEmail%3A%20${encodeURIComponent(customerEmail)}%0APayment%20Method%3A%20${paymentMethod === 'crypto' ? 'Cryptocurrency' : 'Bank%20Transfer'}%0AAmount%3A%20${finalTotalEUR.toFixed(2)}%20EUR%0A%0AThank%20you.`}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <Mail className="w-4 h-4" />
              <span>Email Admin Now</span>
            </a>
            <Link
              to="/catalogue"
              className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Link to="/" className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors block">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

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

          {/* Delivery & VAT */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Delivery &amp; VAT</span>
            </h3>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center justify-between">
                <span>Destination Country (VAT)</span>
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

          {/* Customer Information */}
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
              <div>
                <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+49 123 456 7890"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street, City, Postal Code, Country"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  className="w-full bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 mt-1 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-[var(--color-text-muted)]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span>Payment Method</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`text-left p-4 rounded-2xl border-2 transition-all space-y-2 ${
                  paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-500/30'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-muted)]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${paymentMethod === 'bank' ? 'bg-blue-500 text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'}`}>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">Bank Transfer</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-500' : 'border-[var(--color-border)]'}`}>
                    {paymentMethod === 'bank' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                  SEPA / International wire transfer. Payment details provided after order confirmation.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`text-left p-4 rounded-2xl border-2 transition-all space-y-2 relative overflow-hidden ${
                  paymentMethod === 'crypto'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-500/30'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-muted)]/40'
                }`}
              >
                <div className="absolute top-2 right-2">
                  <span className="text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-1.5 py-0.5 rounded">
                    5% OFF
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${paymentMethod === 'crypto' ? 'bg-amber-500 text-white' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]'}`}>
                      <Bitcoin className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">Cryptocurrency</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'crypto' ? 'border-amber-500 bg-amber-500' : 'border-[var(--color-border)]'}`}>
                    {paymentMethod === 'crypto' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                  BTC, ETH, USDT accepted. <strong className="text-emerald-500">Save 5%</strong> on your total order.
                </p>
              </button>
            </div>
          </div>

          {/* GDPR Consent */}
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

          {checkoutError && (
            <p className="text-sm text-rose-500" role="alert">{checkoutError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !gdprAgreed}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing...' : `Confirm Order · ${formatPriceEUR(finalTotalEUR)}`}</span>
          </button>

        </form>

        {/* Order Summary Sidebar */}
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
                <span>Shipping</span>
                <span className={cartShippingFeeEUR === 0 ? 'text-emerald-500 font-bold' : 'text-[var(--color-text-secondary)] font-medium'}>
                  {cartShippingFeeEUR === 0 ? 'FREE' : formatPriceEUR(cartShippingFeeEUR)}
                </span>
              </div>

              {paymentMethod === 'crypto' && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Crypto Discount (5%)</span>
                  <span>-{formatPriceEUR(discountAmountEUR)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-[var(--color-border)] font-bold">
                <span className="text-[var(--color-text-primary)] text-sm">Total</span>
                <div className="text-right">
                  {paymentMethod === 'crypto' && (
                    <div className="text-[10px] text-[var(--color-text-muted)] line-through">{formatPriceEUR(cartTotalEUR)}</div>
                  )}
                  <div className="text-lg text-[var(--color-text-primary)] font-black">{formatPriceEUR(finalTotalEUR)}</div>
                  {selectedCurrency.code !== 'EUR' && (
                    <div className="text-[10px] text-indigo-500 font-semibold">
                      (~ {selectedCurrency.symbol}{convertedTotal.toFixed(2)} {selectedCurrency.code})
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[var(--color-text-muted)] flex items-center space-x-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Payment details provided after order confirmation</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
