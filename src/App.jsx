import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import FashionGuide from './components/FashionGuide';
import FeedbackSection from './components/FeedbackSection';
import BranchesSection from './components/BranchesSection';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import MouseFollower from './components/MouseFollower';
import SectionDivider from './components/SectionDivider';
import WorldCanvas3D from './components/WorldCanvas3D';
import ClothingDecomposition3D from './components/ClothingDecomposition3D';

import { translations } from './data/translations';
import initialProducts from './data/products.json';
import initialSettings from './data/siteSettings.json';
import AdminPanel from './components/AdminPanel';
import { ArrowUp, Send, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('uz');
  const t = translations[lang] || translations.uz;

  // Dynamic Products and Admin View Mode State
  const [productsList, setProductsList] = useState(Array.isArray(initialProducts) ? initialProducts : []);
  const [viewMode, setViewMode] = useState(() => {
    return (typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#admin')) ? 'admin' : 'site';
  });

  // Listen to browser URL changes (#admin or /admin)
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setViewMode('admin');
      } else {
        setViewMode('site');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Dynamic Categories and Contacts State
  const [categoriesList, setCategoriesList] = useState(() => {
    const defaultCats = Array.isArray(initialSettings?.categories) && initialSettings.categories.length > 0
      ? initialSettings.categories.map(c => ({ id: c.id, label: c.name }))
      : [
          { id: 'dvoyka', label: 'Dvoykalar' },
          { id: 'costume', label: 'Kostyumlar' },
          { id: 'casual', label: 'Smart Casual' },
          { id: 'accessories', label: 'Aksessuarlar' }
        ];
    return [
      { id: 'all', label: t.catalog.all || 'Barchasi' },
      ...defaultCats
    ];
  });

  const [siteContacts, setSiteContacts] = useState(initialSettings?.contacts || {
    mainPhone: '+998 98 311 33 37',
    branches: []
  });

  // Dynamic Branches & Testimonials State
  const [siteBranches, setSiteBranches] = useState(Array.isArray(initialSettings?.branches) ? initialSettings.branches : []);
  const [siteTestimonials, setSiteTestimonials] = useState(Array.isArray(initialSettings?.testimonials) ? initialSettings.testimonials : []);
  const [siteLooks, setSiteLooks] = useState(Array.isArray(initialSettings?.looks) ? initialSettings.looks : []);
  const [siteHero, setSiteHero] = useState(initialSettings?.hero || {});

  // Fetch live products from backend API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live categories, contacts, branches, testimonials, looks, and hero settings
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            setCategoriesList([
              { id: 'all', label: t.catalog.all || 'Barchasi' },
              ...data.categories.map(c => ({ id: c.id, label: c.name }))
            ]);
          }
          if (data.contacts) {
            setSiteContacts(data.contacts);
          }
          if (Array.isArray(data.branches) && data.branches.length > 0) {
            setSiteBranches(data.branches);
          }
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setSiteTestimonials(data.testimonials);
          }
          if (Array.isArray(data.looks) && data.looks.length > 0) {
            setSiteLooks(data.looks);
          }
          if (data.hero) {
            setSiteHero(data.hero);
          }
        }
      })
      .catch(() => {});
  }, [lang, t]);


  // Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState([]);

  // Modal & Fast Order State
  const [modalProduct, setModalProduct] = useState(null);
  const [prefillProduct, setPrefillProduct] = useState(null);

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Scroll Progress & Dynamic Ambient Color Shift State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ambientTheme, setAmbientTheme] = useState('obsidian'); // obsidian | gold | sapphire | bronze | emerald | amber
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    // 1. Setup IntersectionObserver for WOUFX 3D Reveal elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '100px 0px'
    });

    const observeElements = () => {
      const revealEls = document.querySelectorAll('[data-reveal]');
      revealEls.forEach(el => observer.observe(el));
    };

    observeElements();

    // 2. High-performance RAF scroll controller for WOUFX 3D Camera Depth
    const updateCameraDepth = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const vh = window.innerHeight;

      const progress = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(currentScroll > 400);

      // Background 3D grid tunnel motion
      document.documentElement.style.setProperty('--scroll-depth', `${currentScroll % 600}px`);

      // Section exit 3D sinking calculations
      const sceneEls = document.querySelectorAll('.scene-exit');
      sceneEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 1.5) return;
        const exitProgress = Math.min(1, Math.max(0, (vh * 0.45 - rect.bottom) / (vh * 0.55)));
        el.style.setProperty('--exit', exitProgress.toFixed(3));
      });

      // Section-based Dynamic Ambient Lighting Shifts
      const decompEl = document.getElementById('decomposition-3d');
      const catalogEl = document.getElementById('catalog');
      const fashionEl = document.getElementById('fashion-guide');
      const reviewsEl = document.getElementById('reviews');
      const branchesEl = document.getElementById('branches');
      const orderEl = document.getElementById('order');

      const y = currentScroll + 350;
      if (orderEl && y >= orderEl.offsetTop) {
        setAmbientTheme('amber');
      } else if (branchesEl && y >= branchesEl.offsetTop) {
        setAmbientTheme('emerald');
      } else if (reviewsEl && y >= reviewsEl.offsetTop) {
        setAmbientTheme('bronze');
      } else if (fashionEl && y >= fashionEl.offsetTop) {
        setAmbientTheme('sapphire');
      } else if (catalogEl && y >= catalogEl.offsetTop) {
        setAmbientTheme('gold');
      } else if (decompEl && y >= decompEl.offsetTop) {
        setAmbientTheme('gold');
      } else {
        setAmbientTheme('obsidian');
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateCameraDepth);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateCameraDepth();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [selectedCategory]);

  // Filter Categories
  const categories = [
    { id: 'all', label: t.catalog.all },
    { id: 'dvoyka', label: t.catalog.dvoyka || "Dvoyka (Kostyum)" },
    { id: 'jacket', label: t.catalog.jacket || "Kurtkalar & Jilet" },
    { id: 'pants', label: t.catalog.pants || "Shimlar & Djinsi" },
    { id: 'shirt', label: t.catalog.shirt || "Ko'ylak & Trikotaj" },
    { id: 'polo', label: t.catalog.polo || "Polo" },
    { id: 'shoes', label: t.catalog.shoes || "Lofer & Poyabzal" },
    { id: 'accessories', label: t.catalog.accessories || "Aksessuarlar" }
  ];

  // Exact Category Filtering
  const filteredProducts = selectedCategory === 'all'
    ? productsList
    : productsList.filter(p => p.category === selectedCategory);

  // Cart actions
  const handleAddToCart = (product, size = null, qty = 1) => {
    const chosenSize = size || product.sizes[0] || 'L (50)';
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prevCart, { ...product, selectedSize: chosenSize, quantity: qty }];
      }
    });

    setAddedItemIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter(id => id !== product.id));
    }, 1800);
  };

  const handleUpdateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Quick Order action
  const handleQuickOrder = (product, size = null) => {
    const chosenSize = size || product.sizes[0] || 'L (50)';
    setPrefillProduct({ ...product, selectedSize: chosenSize });
    
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedToOrderFromCart = () => {
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ambient Aura Theme classes
  const getAmbientStyles = () => {
    switch (ambientTheme) {
      case 'gold':
        return 'from-[#C5A059]/25 via-[#D4AF37]/10 to-transparent';
      case 'sapphire':
        return 'from-[#1E3A8A]/30 via-[#3B82F6]/10 to-transparent';
      case 'bronze':
        return 'from-[#92400E]/25 via-[#B45309]/10 to-transparent';
      case 'emerald':
        return 'from-[#065F46]/25 via-[#0F766E]/10 to-transparent';
      case 'amber':
        return 'from-[#D97706]/25 via-[#B45309]/15 to-transparent';
      default:
        return 'from-[#C5A059]/15 via-[#1E3A8A]/10 to-transparent';
    }
  };

  // Render Admin Panel View if URL has #admin or /admin
  if (viewMode === 'admin') {
    return (
      <AdminPanel 
        onBackToSite={() => {
          setViewMode('site');
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
          if (window.location.pathname === '/admin') {
            window.history.pushState(null, '', '/');
          }
        }}
        onProductsUpdated={(newProducts) => setProductsList(newProducts)}
        onSettingsUpdated={(newSettings) => {
          if (Array.isArray(newSettings.categories)) {
            setCategoriesList([
              { id: 'all', label: t.catalog.all || 'Barchasi' },
              ...newSettings.categories.map(c => ({ id: c.id, label: c.name }))
            ]);
          }
          if (newSettings.contacts) {
            setSiteContacts(newSettings.contacts);
          }
          if (Array.isArray(newSettings.branches)) {
            setSiteBranches(newSettings.branches);
          }
          if (Array.isArray(newSettings.testimonials)) {
            setSiteTestimonials(newSettings.testimonials);
          }
          if (Array.isArray(newSettings.looks)) {
            setSiteLooks(newSettings.looks);
          }
          if (newSettings.hero) {
            setSiteHero(newSettings.hero);
          }
        }}
      />

    );
  }

  return (
    <div className="min-h-screen bg-[#07080a] text-[#eef0f3] flex flex-col font-sans selection:bg-[#E5C378] selection:text-black relative transition-colors duration-1000 overflow-x-hidden">
      
      {/* Interactive Mouse Follower & Floating Luxury Micro-Particles */}
      <MouseFollower />

      {/* 1. Global High-End Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/[0.04] z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-[#E5C378] to-white transition-all duration-150 ease-out shadow-[0_0_8px_rgba(229,195,120,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. WOUFX 3D Infinite Tunnel Grid Stage & Dynamic Floating Ambient Aura */}
      <div className="world-stage-3d">
        <WorldCanvas3D scrollProgress={scrollProgress} />
        <div className="world-grid-tunnel" />
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[750px] rounded-full blur-[220px] pointer-events-none transition-all duration-1000 bg-gradient-to-b ${getAmbientStyles()} opacity-45`}
        />
      </div>


      {/* Header */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        phone={siteContacts.mainPhone}
        announcement={siteHero.announcementActive !== false ? siteHero.announcement : ''}
      />

      <main className="flex-1 relative z-10">
        
        {/* 1. Hero Section */}
        <Hero t={t} heroData={siteHero} />

        {/* Transition Divider 1: 3D Clothing Decomposition */}
        <SectionDivider variant="glow-line" title="02 // 3D KIYIM DEKOMPOZITSIYASI & ANATOMIYASI" />

        {/* 2. 3D Sartorial Decomposition & Exploded View Architecture */}
        <ClothingDecomposition3D
          lang={lang}
          t={t}
          onSelectLook={(look) => setPrefillProduct(look)}
        />

        {/* Transition Divider 2: Archive Catalog */}
        <SectionDivider variant="glow-line" title="03 // MERATTO EKSKLYUZIV ASSORTIMENTI" />

        {/* 3. Products Catalog Section with WOUFX 3D Camera Depth */}
        <section id="catalog" data-reveal="scale" className="scene-exit py-20 sm:py-28 relative overflow-hidden">
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Catalog Heading */}
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
              <div className="woufx-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>02 // ARCHIVE CATALOG</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-outfit font-light text-white tracking-[-0.03em]">
                {t.catalog.title}
              </h2>
              <p className="text-sm sm:text-base text-woufx-muted font-normal max-w-2xl mx-auto leading-relaxed">
                {t.catalog.subtitle}
              </p>
            </div>

            {/* Category Filter Pills (WOUFX Segmented Capsule Bar) */}
            <div className="flex items-center justify-center mb-12">
              <div className="inline-flex items-center p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md max-w-full overflow-x-auto scrollbar-none gap-1.5 shadow-2xl">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 shrink-0 ${
                        isSelected
                          ? 'bg-white text-black font-semibold shadow-lg shadow-white/10'
                          : 'text-woufx-muted hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Count & Instagram Authenticity Indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-woufx-subtle mb-10 pb-4 border-b border-white/[0.08] gap-3 tracking-[0.14em]">
              <span className="text-woufx-muted">
                {lang === 'ru' ? "В КАТАЛОГЕ: " : lang === 'en' ? "ARCHIVE MODELS: " : "KATALOG HOZIRDA: "}
                <strong className="text-white font-mono text-xs font-normal">
                  {filteredProducts.length} {lang === 'ru' ? "МОДЕЛЕЙ" : lang === 'en' ? "ITEMS" : "TA MODEL"}
                </strong>
              </span>
              <div className="flex items-center gap-2 text-woufx-gold text-[11px] bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/[0.08]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {lang === 'ru' 
                    ? "100% реальные фотографии из Instagram @meratto.uz" 
                    : lang === 'en' 
                    ? "100% authentic photography from Instagram @meratto.uz" 
                    : "@meratto.uz Instagramdan olingan 100% asl fotosuratlar"}
                </span>
              </div>
            </div>

            {/* Products Grid with Staggered Entrance Animation */}
            <div 
              key={selectedCategory} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  lang={lang}
                  t={t}
                  onQuickView={(p) => setModalProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onQuickOrder={(p) => handleQuickOrder(p)}
                  isAdded={addedItemIds.includes(product.id)}
                  branches={siteBranches}
                />
              ))}
            </div>

          </div>
        </section>

        {/* Transition Divider 2 */}
        <SectionDivider variant="glow-line" title="03 // EDITORIAL VA USLUB QOIDALARI" />

        {/* 3. Fashion Editorial & Style Rules Section */}
        <FashionGuide 
          lang={lang} 
          t={t} 
          looksData={siteLooks} 
          onSelectLook={(look) => setPrefillProduct(look)} 
        />

        {/* Transition Divider 3 */}
        <SectionDivider variant="glow-line" title="04 // MIJOZLAR TAASSUROTIDAN" />

        {/* 4. Customer Feedback / Testimonials */}
        <FeedbackSection lang={lang} t={t} testimonialsData={siteTestimonials} />

        {/* Transition Divider 4 */}
        <SectionDivider variant="glow-line" title="05 // TOSHKENTNING 3 TA FILIALI" />

        {/* 5. 3 Branches & Interactive Map */}
        <BranchesSection lang={lang} t={t} branchesData={siteBranches} />

        {/* Transition Divider 5 */}
        <SectionDivider variant="glow-line" title="06 // TEZKOR BUYURTMA VA KONSULTATSIYA" />

        {/* 6. Order & Inquiry Form */}
        <OrderForm
          prefillProduct={prefillProduct}
          cart={cart}
          clearCart={handleClearCart}
          lang={lang}
          t={t}
        />

      </main>

      {/* Footer */}
      <Footer t={t} contacts={siteContacts} />

      {/* Floating Action Controls (WOUFX Minimal Glass Controls) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Telegram Direct Floating Pill */}
        <a
          href="https://t.me/meratto"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full woufx-panel-strong border border-white/[0.12] text-white flex items-center justify-center shadow-2xl hover:border-woufx-gold/50 hover:text-woufx-gold transition-all duration-300 group"
          title="Telegram: @meratto"
        >
          <Send className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform" />
        </a>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full woufx-panel-strong border border-white/[0.12] text-woufx-muted hover:text-white hover:border-white/30 flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95"
            title="Tepaga qaytish"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={modalProduct}
        isOpen={!!modalProduct}
        onClose={() => setModalProduct(null)}
        lang={lang}
        t={t}
        onAddToCart={handleAddToCart}
        onQuickOrder={handleQuickOrder}
      />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        clearCart={handleClearCart}
        lang={lang}
        t={t}
        onProceedToOrder={handleProceedToOrderFromCart}
      />

    </div>
  );
}
