import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    formatPriceEUR,
    cartSubtotalEUR,
    cartVATAmountEUR,
    cartShippingFeeEUR,
    cartTotalEUR,
    selectedCountry,
  } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 space-y-4">
        <ShoppingBag className="w-16 h-16 text-[var(--color-text-muted)] mx-auto" />
        <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Your Cart is Empty</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Browse our catalogue and add items to begin your order.</p>
        <Link to="/catalogue" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md">
          <span>Browse Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Your Cart</h1>
          <p className="text-xs text-[var(--color-text-muted)]">{cart.length} {cart.length === 1 ? 'item' : 'items'} · Transactions processed in Euro (€)</p>
        </div>
        <Link to="/catalogue" className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.product.id} className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center space-x-4">
              <Link to={`/catalogue/${item.product.id}`} className="shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} referrerPolicy="no-referrer" className="w-20 h-20 object-cover rounded-xl bg-[var(--color-bg-tertiary)]" />
              </Link>

              <div className="flex-1 min-w-0 space-y-1.5">
                <Link to={`/catalogue/${item.product.id}`} className="font-bold text-sm text-[var(--color-text-primary)] hover:text-blue-500 transition-colors block truncate">
                  {item.product.name}
                </Link>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {item.product.originFlag} {item.product.originCountry} · SKU: {item.product.sku}
                </div>
                <div className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {formatPriceEUR(item.product.priceEUR)} each
                </div>
              </div>

              <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-xl border border-[var(--color-border)] p-1">
                <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-[var(--color-bg-card-hover)] text-[var(--color-text-primary)] font-bold flex items-center justify-center text-sm">-</button>
                <span className="w-8 text-center font-bold text-sm text-[var(--color-text-primary)]">{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.totalStock} className="w-7 h-7 rounded-lg bg-[var(--color-bg-card-hover)] disabled:opacity-40 text-[var(--color-text-primary)] font-bold flex items-center justify-center text-sm">+</button>
              </div>

              <div className="text-right shrink-0">
                <div className="font-extrabold text-sm text-[var(--color-text-primary)]">{formatPriceEUR(item.product.priceEUR * item.quantity)}</div>
              </div>

              <button onClick={() => removeFromCart(item.product.id)} className="text-[var(--color-text-muted)] hover:text-rose-500 p-1.5 rounded-lg transition-colors shrink-0" title="Remove">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4 sticky top-24">
            <h3 className="font-bold text-sm text-[var(--color-text-primary)]">Order Summary</h3>

            <div className="space-y-2 text-xs">
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
                <span className="text-lg text-[var(--color-text-primary)] font-black">{formatPriceEUR(cartTotalEUR)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] text-[var(--color-text-muted)] text-center">Free EU shipping on orders over €150</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
