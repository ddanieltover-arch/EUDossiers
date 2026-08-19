import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    formatPriceEUR, 
    cartTotalEUR, 
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[var(--color-bg-overlay)] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-[var(--color-bg-card)] border-l border-[var(--color-border)] text-[var(--color-text-primary)] shadow-2xl flex flex-col">
          
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-sm">Item Added to Cart</h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <ShoppingBag className="w-10 h-10 text-[var(--color-text-muted)] mx-auto" />
                <p className="text-xs text-[var(--color-text-muted)]">Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-3 flex items-center space-x-3">
                  <img src={item.product.imageUrl} alt={item.product.name} referrerPolicy="no-referrer" className="w-14 h-14 object-cover rounded-lg bg-[var(--color-bg-tertiary)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--color-text-primary)] truncate">{item.product.name}</div>
                    <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{item.product.originFlag} · {formatPriceEUR(item.product.priceEUR)}</div>
                    <div className="flex items-center mt-1.5">
                      <div className="flex items-center bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border)] px-0.5">
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="w-5 h-5 text-xs font-bold text-[var(--color-text-secondary)]">-</button>
                        <span className="w-5 text-center text-[10px] font-bold text-[var(--color-text-primary)]">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.totalStock} className="w-5 h-5 text-xs font-bold text-[var(--color-text-secondary)] disabled:opacity-30">+</button>
                      </div>
                      <span className="text-xs font-extrabold text-[var(--color-text-primary)] ml-auto">{formatPriceEUR(item.product.priceEUR * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-[var(--color-text-muted)] hover:text-rose-500 p-1 transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-[var(--color-border)] space-y-3">
              <div className="flex justify-between items-baseline text-sm">
                <span className="text-[var(--color-text-muted)] text-xs">Estimated Total</span>
                <span className="font-black text-[var(--color-text-primary)]">{formatPriceEUR(cartTotalEUR)}</span>
              </div>
              <div className="flex space-x-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-card-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)] font-bold py-2.5 rounded-xl text-xs text-center transition-all"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
