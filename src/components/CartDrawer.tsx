import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, Globe, Truck, ArrowRight, Lock, Check, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { EU_COUNTRIES } from '../data/mockData';
import { EUCountryCode } from '../types';
import { SITE_NAME } from '../brand';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    selectedCountry, 
    setSelectedCountryByCode, 
    selectedCurrency, 
    formatPriceEUR, 
    cartSubtotalEUR, 
    cartVATAmountEUR, 
    cartShippingFeeEUR, 
    cartTotalEUR, 
    placeOrder 
  } = useStore();

  const [customerName, setCustomerName] = useState('Alexandre Laurent');
  const [customerEmail, setCustomerEmail] = useState('alexandre.laurent@example.eu');
  const [gdprAgreed, setGdprAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprAgreed) return;
    setIsSubmitting(true);
    await placeOrder({ name: customerName, email: customerEmail });
    setIsSubmitting(false);
  };

  const convertedTotal = cartTotalEUR * selectedCurrency.rateToEUR;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Your Cart (EU Checkout)</h3>
                <p className="text-xs text-slate-400">Transactions processed in Euro (€)</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="font-bold text-slate-300 text-base">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse our European craftsman catalogue and add items to begin your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div 
                    key={item.product.id}
                    className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl bg-slate-700 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.product.originFlag} {item.product.originCountry} • {formatPriceEUR(item.product.priceEUR)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 px-1">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-5 h-5 text-xs text-slate-300 hover:text-white flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.totalStock}
                            className="w-5 h-5 text-xs text-slate-300 hover:text-white disabled:opacity-30 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-white">
                          {formatPriceEUR(item.product.priceEUR * item.quantity)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Footer & VAT Breakdown */}
          {cart.length > 0 && (
            <form onSubmit={handleCheckout} className="p-5 border-t border-slate-800 bg-slate-900/95 space-y-4">
              
              {/* Destination Country Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>EU Destination Country (VAT):</span>
                  <span className="text-blue-400 font-bold">{(selectedCountry.vatRate * 100).toFixed(0)}% Tax</span>
                </label>
                <select
                  value={selectedCountry.code}
                  onChange={e => setSelectedCountryByCode(e.target.code as EUCountryCode)}
                  className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  {EU_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} — {(c.vatRate * 100).toFixed(0)}% VAT
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info Input */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">EU Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Price Calculation Ledger */}
              <div className="bg-slate-800/80 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-slate-200 font-medium">{formatPriceEUR(cartSubtotalEUR)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>{selectedCountry.name} VAT ({(selectedCountry.vatRate * 100).toFixed(0)}%):</span>
                  <span className="text-slate-200 font-medium">{formatPriceEUR(cartVATAmountEUR)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>EU Express Freight:</span>
                  <span className={cartShippingFeeEUR === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200 font-medium'}>
                    {cartShippingFeeEUR === 0 ? 'FREE (&gt; €150)' : formatPriceEUR(cartShippingFeeEUR)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-700/80 font-bold">
                  <span className="text-white text-sm">Transaction Total:</span>
                  <div className="text-right">
                    <div className="text-base text-white font-black">{formatPriceEUR(cartTotalEUR)}</div>
                    {selectedCurrency.code !== 'EUR' && (
                      <div className="text-[10px] text-indigo-300 font-semibold">
                        (~ {selectedCurrency.symbol}{convertedTotal.toFixed(2)} {selectedCurrency.code} ref)
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* GDPR Privacy Checkbox */}
              <label className="flex items-start space-x-2 text-[11px] text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={gdprAgreed}
                  onChange={e => setGdprAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
                />
                <span className="leading-tight text-slate-400">
                  I agree to {SITE_NAME} terms and consent to essential order processing under <strong>GDPR (EU) 2016/679</strong>.
                </span>
              </label>

              {/* Checkout Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !gdprAgreed}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Processing in EUR...' : `Complete Order • ${formatPriceEUR(cartTotalEUR)}`}</span>
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
