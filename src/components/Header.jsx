import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Menu, X, Globe, ChevronDown, Sparkles } from 'lucide-react';

export default function Header({ lang, setLang, t, cartCount, openCart, phone = "+998 98 311 33 37" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: "UZ" },
    { code: 'ru', label: "Русский", flag: "RU" },
    { code: 'en', label: "English", flag: "EN" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Technical Announcement Ticker (WOUFX Style) */}
      <div className="bg-[#07090c]/95 backdrop-blur-md border-b border-white/[0.06] text-[#8f96a0] text-[10.5px] font-mono tracking-[0.14em] uppercase py-1.5 px-4 hidden sm:flex items-center justify-between lg:justify-center gap-4 select-none">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse shrink-0" />
          <span className="whitespace-nowrap">
            {lang === 'ru' ? "Экспресс-доставка по Ташкенту" : lang === 'en' ? "Express delivery across Tashkent" : "Toshkent bo'yicha tezkor yetkazish"}
          </span>
        </div>
        <span className="text-white/20 shrink-0">&bull;</span>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="whitespace-nowrap">
            {lang === 'ru' ? "Примерка в 3 филиалах" : lang === 'en' ? "Fitting available at 3 boutiques" : "3 ta filialda kiyib ko'rish imkoni"}
          </span>
        </div>
        <span className="hidden md:inline text-white/20 shrink-0">&bull;</span>
        <div className="hidden lg:flex items-center gap-1.5 text-[#E5C378] shrink-0">
          <Sparkles className="w-3 h-3 text-[#E5C378] shrink-0" />
          <span className="whitespace-nowrap">
            {lang === 'ru' ? "100% подлинные фото из Instagram @meratto.uz" : lang === 'en' ? "100% authentic photos from Instagram @meratto.uz" : "@meratto.uz Instagramdan 100% Asl Fotosuratlar"}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#07080a]/95 backdrop-blur-2xl py-3 border-b border-white/[0.1] shadow-[0_20px_40px_rgba(0,0,0,0.9)]' 
          : 'bg-[#07080a]/80 backdrop-blur-xl py-3.5 border-b border-white/[0.06]'
      }`}>
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-6">
            
            {/* Brand Monogram & Technical Identity */}
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-[#E5C378]/30 group-hover:border-[#E5C378] p-0.5 shadow-lg transition-all flex items-center justify-center shrink-0">
                <span className="font-display text-[#E5C378] font-bold text-base tracking-wider">M</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display tracking-[0.16em] text-sm sm:text-base font-semibold text-white group-hover:text-[#E5C378] transition-colors uppercase whitespace-nowrap">
                    MERATTO &amp; DE FRANKO
                  </span>
                  <span className="hidden sm:inline font-mono text-[9px] text-[#8f96a0] border border-white/10 px-1.5 py-0.5 rounded uppercase shrink-0">
                    2026
                  </span>
                </div>
                <span className="hidden sm:block font-mono text-[8.5px] tracking-[0.2em] text-[#8f96a0] uppercase whitespace-nowrap">
                  DIRECT ACCESS // TASHKENT BOUTIQUE
                </span>
              </div>
            </a>

            {/* Desktop Navigation - WOUFX Clean Institutional Style */}
            <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 font-display text-[13px] tracking-[0.06em] text-[#8f96a0] shrink-0">
              <a href="#about" className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-mono text-[10px] text-white/30">01</span>
                <span>{t.nav.about}</span>
              </a>
              <a href="#catalog" className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-mono text-[10px] text-white/30">02</span>
                <span>{t.nav.catalog}</span>
              </a>
              <a href="#fashion-guide" className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-mono text-[10px] text-white/30">03</span>
                <span>{t.nav.fashionGuide}</span>
              </a>
              <a href="#reviews" className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-mono text-[10px] text-white/30">04</span>
                <span>{t.nav.reviews}</span>
              </a>
              <a href="#branches" className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-mono text-[10px] text-white/30">05</span>
                <span>{t.nav.branches}</span>
              </a>
              <a href="#order" className="text-[#E5C378] hover:text-white transition-colors font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="font-mono text-[10px] text-[#E5C378]/60">06</span>
                <span>{t.nav.contact}</span>
              </a>
            </nav>

            {/* Right Action Center */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* WOUFX Live Status Indicator */}
              <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] text-[#8f96a0] tracking-wider whitespace-nowrap shrink-0 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse shrink-0" />
                <span className="whitespace-nowrap">3 STORES LIVE</span>
              </div>

              {/* Language Switcher Dropdown */}
              <div className="relative shrink-0">
                <button 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-[#eef0f3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Tilni tanlash"
                >
                  <Globe className="w-3.5 h-3.5 text-[#E5C378] shrink-0" />
                  <span className="uppercase text-[10px] tracking-wider font-semibold whitespace-nowrap">{lang}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#0d0f13] border border-white/15 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in backdrop-blur-xl">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-mono flex items-center justify-between hover:bg-white/10 transition-colors ${
                          lang === l.code ? 'text-[#E5C378] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-[10px] text-[#8f96a0]">{l.flag}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Call Button (Pill) */}
              <a 
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#E5C378]/50 hover:bg-white/[0.06] font-mono text-[11px] text-[#eef0f3] tracking-wide transition-all whitespace-nowrap shrink-0"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5C378] shrink-0" />
                <span className="whitespace-nowrap font-mono">{phone}</span>
              </a>

              {/* Shopping Cart Pill Button with Count */}
              <button 
                onClick={openCart}
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E5C378] text-[#07080a] hover:bg-white font-display font-medium text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(229,195,120,0.25)] active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                aria-label="Xarid savati"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline uppercase text-[11px] font-mono font-bold whitespace-nowrap">{t.nav.cart || "Savat"}</span>
                {cartCount > 0 && (
                  <span className="font-mono text-[10px] font-bold bg-[#07080a] text-[#E5C378] px-1.5 py-0.5 rounded-full shrink-0">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile / Tablet Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 border border-white/10 shrink-0 cursor-pointer"
                aria-label="Menyu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#07080a]/98 border-b border-white/10 px-6 pt-4 pb-7 space-y-3 animate-fade-in backdrop-blur-2xl shadow-2xl">
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-sm tracking-wide text-neutral-200 hover:text-[#E5C378] py-2 border-b border-white/5"
          >
            01 // {t.nav.about}
          </a>
          <a 
            href="#catalog" 
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-sm tracking-wide text-neutral-200 hover:text-[#E5C378] py-2 border-b border-white/5"
          >
            02 // {t.nav.catalog}
          </a>
          <a 
            href="#fashion-guide" 
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-sm tracking-wide text-neutral-200 hover:text-[#E5C378] py-2 border-b border-white/5"
          >
            03 // {t.nav.fashionGuide}
          </a>
          <a 
            href="#reviews" 
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-sm tracking-wide text-neutral-200 hover:text-[#E5C378] py-2 border-b border-white/5"
          >
            04 // {t.nav.reviews}
          </a>
          <a 
            href="#branches" 
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-sm tracking-wide text-neutral-200 hover:text-[#E5C378] py-2 border-b border-white/5"
          >
            05 // {t.nav.branches}
          </a>
          <a 
            href="#order" 
            onClick={() => setMobileMenuOpen(false)}
            className="block font-display text-sm tracking-wide text-[#E5C378] font-bold py-2 border-b border-white/5"
          >
            06 // {t.nav.contact}
          </a>

          {/* Quick Call in Drawer */}
          <div className="pt-2 flex flex-col gap-2">
            <a 
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.05] font-mono text-xs text-[#eef0f3]"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>{phone}</span>
            </a>
            <div className="flex items-center justify-center gap-2 py-1 text-neutral-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse" />
              <span>3 TA FILIAL OCHIQ: 10:00 - 22:00</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
