import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeFromCart, clearCart, lang, t, onProceedToOrder }) {
  if (!isOpen) return null;

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    onProceedToOrder();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#090b0e] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between animate-fade-in">
          
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-woufx-gold" />
              <h2 className="text-base font-outfit font-light text-white tracking-tight">{t.cart.title}</h2>
              <span className="woufx-badge py-0.5 px-2 text-[10px] text-white">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-woufx-muted hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.08] text-woufx-muted flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 opacity-40" />
                </div>
                <h3 className="font-outfit font-light text-white text-base tracking-tight">{t.cart.empty}</h3>
                <p className="text-xs font-sans text-woufx-muted max-w-xs mx-auto leading-relaxed">{t.cart.emptySub}</p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <img 
                    src={item.image} 
                    alt={item.name[lang] || item.name.uz}
                    className="w-20 h-24 object-cover object-top rounded-xl border border-white/[0.06]"
                  />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-outfit font-normal text-white line-clamp-1 tracking-tight">
                          {item.name[lang] || item.name.uz}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-woufx-subtle hover:text-red-400 p-1 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white">
                          {item.selectedSize}
                        </span>
                        <span className="font-mono text-xs text-woufx-gold">
                          {formatPrice(item.price)} <span className="text-[10px] text-woufx-subtle">{t.catalog.price}</span>
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="w-5 h-5 text-xs text-woufx-muted hover:text-white font-mono"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-normal text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-5 h-5 text-xs text-woufx-muted hover:text-white font-mono"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-mono text-white">
                        {formatPrice(item.price * item.quantity)} <span className="text-[10px] text-woufx-subtle">{t.catalog.price}</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/[0.08] bg-[#07090c] space-y-3.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase tracking-[0.14em] text-woufx-muted">{t.cart.total}</span>
                <span className="text-xl font-mono text-white">
                  {formatPrice(totalPrice)} <span className="text-xs text-woufx-muted">{t.catalog.price}</span>
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full btn-woufx-primary flex items-center justify-center gap-2 py-3.5 font-mono text-xs uppercase tracking-[0.14em]"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[10px] font-mono uppercase tracking-[0.18em] text-woufx-subtle hover:text-woufx-muted py-1 transition-colors"
              >
                {t.cart.clear}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
