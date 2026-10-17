import React, { useRef, useState } from 'react';
import { Eye, ShoppingBag, Zap, Check, Sparkles, Store } from 'lucide-react';

export default function ProductCard({ product, lang, t, onQuickView, onAddToCart, onQuickOrder, isAdded, index = 0, branches = [] }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (num) => {
    if (num === undefined || num === null || isNaN(Number(num))) return '0';
    return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getBranchNames = (branchIds) => {
    if (!Array.isArray(branchIds) || branchIds.length === 0) {
      return "3 la do'konda";
    }
    const branchNameMap = {
      'meratto-qoratosh': 'Meratto Qoratosh',
      'meratto-chilonzor': 'Meratto Chilonzor',
      'de-franko-qoratosh': 'De Franko'
    };
    if (Array.isArray(branches) && branches.length > 0) {
      branches.forEach(b => {
        if (b && b.id && b.name) branchNameMap[b.id] = b.name;
      });
    }
    const totalCount = Array.isArray(branches) && branches.length > 0 ? branches.length : 3;
    if (branchIds.length >= totalCount) {
      return "3 la do'konda";
    }
    const names = branchIds.map(id => branchNameMap[id] || id);
    return names.join(', ');
  };

  const productName = typeof product?.name === 'object' && product.name !== null
    ? (product.name[lang] || product.name.uz || Object.values(product.name)[0] || '')
    : (product?.name || product?.nameUz || '');

  const productDesc = typeof product?.description === 'object' && product.description !== null
    ? (product.description[lang] || product.description.uz || Object.values(product.description)[0] || '')
    : (product?.description || '');

  const productSizes = Array.isArray(product?.sizes) ? product.sizes : [];

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // subtle 6 deg tilt
    const rotateY = ((x - centerX) / centerX) * 6;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlareStyle({ opacity: 1, x: glareX.toFixed(1), y: glareY.toFixed(1) });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div 
      data-reveal="card"
      className="card-perspective h-full"
      style={{
        '--delay': index % 8,
        animationDelay: `${Math.min(index * 45, 450)}ms`
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transformStyle,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(.22, 1, .36, 1)'
        }}
        className="group relative h-full rounded-2xl woufx-panel hover:border-white/25 overflow-hidden flex flex-col will-change-transform transition-colors duration-300"
      >
        
        {/* Subtle Specular Glare */}
        <div
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle 260px at ${glareStyle.x}% ${glareStyle.y}%, rgba(229, 195, 120, 0.12) 0%, transparent 75%)`
          }}
        />

        {/* Product Image Frame */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#07080a]">
          <img 
            src={product.image} 
            alt={productName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              objectPosition: `${(product.imagePositions?.[0]?.x ?? product.imagePosition?.x ?? 50)}% ${(product.imagePositions?.[0]?.y ?? product.imagePosition?.y ?? 50)}%`
            }}
            loading={index < 8 ? "eager" : "lazy"}
            decoding="async"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent opacity-70 pointer-events-none" />

          {/* Top WOUFX Technical Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-[#07080a]/85 border border-white/10 text-[#E5C378] backdrop-blur-md">
              {product.modelCode || product.code || "MERATTO"}
            </span>

            <div className="flex items-center gap-1.5">
              {(product.isLook || (Array.isArray(product.lookItems) && product.lookItems.length > 0)) && (
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E5C378]/25 text-[#E5C378] backdrop-blur-md border border-[#E5C378]/40 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#E5C378]" />
                  <span>LOOK</span>
                </span>
              )}
              {product.badge && (
                <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#07080a]/80 backdrop-blur-md text-neutral-300 hover:text-black hover:bg-[#E5C378] border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl hover:scale-105 z-20"
            title={t.catalog.quickView}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Sizes Bar in WOUFX Minimalist Style */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#07080a]/85 backdrop-blur-md border border-white/10 text-[11px] z-10">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8f96a0]">{t.catalog.sizes || "O'lchamlar"}:</span>
            <div className="flex gap-1 flex-wrap">
              {productSizes.slice(0, 4).map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded bg-white/[0.06] font-mono text-[9px] text-[#eef0f3]">
                  {String(s).replace(/ \(.+\)/, '')}
                </span>
              ))}
              {productSizes.length > 4 && (
                <span className="px-1 py-0.5 rounded bg-white/[0.04] font-mono text-[9px] text-[#8f96a0]">
                  +{productSizes.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content Information */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 relative z-10">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8f96a0] mb-1">
              <span className="uppercase tracking-[0.14em]">MERATTO &bull; 2026</span>
              <span className="flex items-center gap-1.5 text-[#4fc79a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse" />
                <span>{t.catalog.inStock || "MAVJUD"}</span>
              </span>
            </div>

            <h3 className="font-display font-medium text-base text-white group-hover:text-[#E5C378] transition-colors line-clamp-1 leading-snug">
              {productName}
            </h3>

            <p className="text-xs text-[#8f96a0] mt-1 line-clamp-2 leading-relaxed font-normal">
              {productDesc}
            </p>

            {/* Model code & Available branches */}
            <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#E5C378] font-medium">{product.code || product.modelCode || ''}</span>
              <span className="text-[#E5C378] flex items-center gap-1 truncate max-w-[200px]" title={`Mavjud do'konlar: ${getBranchNames(product.availableBranches)}`}>
                <Store className="w-3 h-3 text-[#E5C378] shrink-0" />
                <span className="truncate font-sans font-medium">
                  {getBranchNames(product.availableBranches)}
                </span>
              </span>
            </div>

            {/* Look Items Summary Pill */}
            {Array.isArray(product.lookItems) && product.lookItems.length > 0 && (
              <div className="mt-2 p-2 rounded-xl bg-[#E5C378]/5 border border-[#E5C378]/20 text-[10px] space-y-1">
                <div className="font-mono text-[#E5C378] font-medium flex items-center gap-1 text-[9px] uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Komplekt tarkibi ({product.lookItems.length} ta):</span>
                </div>
                <div className="text-[#eef0f3] text-[10px] truncate font-sans">
                  {product.lookItems.map(i => `${(typeof i === 'object' && i ? i.name : i) || ''} (${formatPrice(typeof i === 'object' && i ? i.price : 0)} so'm)`).join(' • ')}
                </div>
              </div>
            )}
          </div>

          {/* Price & Action Row */}
          <div className="pt-3 border-t border-white/[0.08] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                {product.oldPrice && Number(product.oldPrice) > 0 ? (
                  <>
                    <div 
                      style={{ color: '#ef4444' }} 
                      className="font-display text-xl sm:text-2xl font-bold tracking-tight price-discount-active"
                    >
                      {formatPrice(product.price)}{' '}
                      <span style={{ color: '#f87171' }} className="font-mono text-xs font-normal price-currency-discount">
                        {t.catalog.price || "UZS"}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#8f96a0] line-through -mt-0.5">
                      {formatPrice(product.oldPrice)} {t.catalog.price || "UZS"}
                    </div>
                  </>
                ) : (
                  <div 
                    style={{ color: '#ffffff' }} 
                    className="font-display text-xl sm:text-2xl font-light text-white tracking-tight price-regular-active"
                  >
                    {formatPrice(product.price)}{' '}
                    <span className="font-mono text-xs text-[#8f96a0] font-normal">
                      {t.catalog.price || "UZS"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons in WOUFX Pill Format */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onAddToCart(product)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
                  isAdded 
                    ? 'bg-[#4fc79a]/20 border-[#4fc79a] text-[#4fc79a]' 
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-[#eef0f3]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.modal.added || "QO'SHILDI"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span className="truncate">{t.catalog.addToCart || "SAVATGA"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onQuickOrder(product)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-display font-medium tracking-wide uppercase bg-[#E5C378] hover:bg-white text-[#07080a] transition-all duration-300 shadow-lg shadow-[#E5C378]/15 hover:shadow-white/20 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="truncate">{t.catalog.quickOrder || "BUYURTMA"}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
