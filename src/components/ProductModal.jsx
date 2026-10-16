import React, { useState } from 'react';
import { X, ShoppingBag, Zap, Check, ShieldCheck, MapPin, Store } from 'lucide-react';
import { branches } from '../data/branches';

export default function ProductModal({ product, isOpen, onClose, lang, t, onAddToCart, onQuickOrder }) {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'L');
  const [activeImage, setActiveImage] = useState(product.images?.[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const formatPrice = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleFastOrder = () => {
    onQuickOrder(product, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl woufx-panel-strong rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in my-8 border border-white/[0.12]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] text-woufx-muted hover:text-white border border-white/[0.08] flex items-center justify-center transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Gallery Showcase with Real Meratto Photo */}
          <div className="p-6 sm:p-8 bg-black/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.08]">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#090b0e] border border-white/[0.08] relative group">
              <img 
                src={activeImage} 
                alt={product.name[lang] || product.name.uz}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-silk group-hover:scale-105"
              />
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                <span className="woufx-badge bg-black/70 backdrop-blur-md border-white/[0.12] text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{product.code || 'MRT-ARCHIVE'}</span>
                </span>
                {product.badge && (
                  <span className="woufx-badge bg-[#E5C378]/20 border-[#E5C378]/40 text-[#E5C378] font-bold">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border transition-all duration-300 ${
                      activeImage === img 
                        ? 'border-white ring-1 ring-white/30 scale-105' 
                        : 'border-white/[0.08] opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Buying controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-woufx-muted">
                  MERATTO &bull; INSTAGRAM ARCHIVE
                </span>
                <span className="text-white/20">&bull;</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-400">
                  INSTOCK
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-outfit font-light text-white leading-tight tracking-[-0.02em]">
                {product.name[lang] || product.name.uz}
              </h2>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                {product.oldPrice && Number(product.oldPrice) > 0 ? (
                  <>
                    <span 
                      style={{ color: '#ef4444' }} 
                      className="text-2xl sm:text-3xl font-mono font-bold price-discount-active"
                    >
                      {formatPrice(product.price)}{' '}
                      <span style={{ color: '#f87171' }} className="text-xs font-mono tracking-wider price-currency-discount">
                        {t.catalog.price}
                      </span>
                    </span>
                    <span className="text-sm font-mono text-[#8f96a0] line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </>
                ) : (
                  <span 
                    style={{ color: '#ffffff' }} 
                    className="text-2xl sm:text-3xl font-mono font-normal text-white price-regular-active"
                  >
                    {formatPrice(product.price)}{' '}
                    <span className="text-xs font-mono tracking-wider text-woufx-muted">
                      {t.catalog.price}
                    </span>
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-woufx-muted leading-relaxed font-sans font-light">
                {product.description[lang] || product.description.uz}
              </p>

              {/* Fabric Specs */}
              {product.fabric && (
                <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-woufx-muted">
                  <ShieldCheck className="w-4 h-4 text-woufx-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-white text-[11px] uppercase tracking-wider">{t.modal.fabric}: </span>
                    <span className="font-sans font-light">{product.fabric[lang] || product.fabric.uz}</span>
                  </div>
                </div>
              )}

              {/* Store Availability */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E5C378]">
                  <Store className="w-4 h-4" />
                  <span className="uppercase tracking-wider font-medium">Ushbu mahsulot mavjud do'konlar:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {branches.map(branch => {
                    const isInStock = !Array.isArray(product.availableBranches) || product.availableBranches.length === 0 || product.availableBranches.includes(branch.id);
                    return (
                      <div 
                        key={branch.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs transition-all ${
                          isInStock
                            ? 'bg-[#E5C378]/10 border-[#E5C378]/40 text-[#E5C378]'
                            : 'bg-white/[0.01] border-white/5 text-[#555a64] opacity-50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isInStock ? 'bg-[#4fc79a] animate-pulse' : 'bg-red-500/50'}`} />
                        <div className="truncate">
                          <div className="text-white font-medium text-[11px] truncate">{branch.name}</div>
                          <div className="text-[9px] text-[#8f96a0]">{isInStock ? 'Mavjud (Bor)' : 'Mavjud emas'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-mono text-woufx-muted mb-2.5 uppercase tracking-wider">
                  <span>{t.modal.sizeSelect}</span>
                  <span className="text-white font-mono">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-full text-xs font-mono border transition-all duration-300 ${
                        selectedSize === sz
                          ? 'bg-white text-black font-semibold border-white shadow-md'
                          : 'bg-white/[0.03] text-woufx-muted border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock in 3 branches note */}
              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-woufx-muted">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.modal.allBranches}</span>
              </div>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-3 pt-5 border-t border-white/[0.08]">
              
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-woufx-muted hover:text-white font-mono text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-woufx-muted hover:text-white font-mono text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-mono uppercase tracking-[0.12em] border transition-all duration-300 ${
                    justAdded 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                      : 'btn-woufx-secondary'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.modal.added}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.modal.btnAddToCart}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant Direct Order Button */}
              <button
                onClick={handleFastOrder}
                className="w-full btn-woufx-primary flex items-center justify-center gap-2 py-3.5 font-mono uppercase tracking-[0.14em]"
              >
                <Zap className="w-3.5 h-3.5 fill-black" />
                <span>{t.modal.btnFastOrder}</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
