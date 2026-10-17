import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Sparkles, ShieldCheck, Users, Flame, ExternalLink } from 'lucide-react';

export default function Hero({ t, heroData = {} }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const eyebrow = heroData.eyebrow || "DIRECT ACCESS // 2026 SMART CASUAL COLLECTION";
  const titleLine1 = heroData.titleLine1 || "O'z uslubingizni";
  const titleHighlight = heroData.titleHighlight || "mukammallikka";
  const titleLine2 = heroData.titleLine2 || "yetkazing.";
  const subtitle = heroData.subtitle || "Meratto & De Franko — Toshkentdagi 3 ta zamonaviy premium filiallar tarmog'i. Yuqori italyancha did va qomatga mukammal o'tiruvchi Smart Casual kiyimlar, dvoykalar va eksklyuziv aksessuarlar.";
  const badgeText = heroData.badgeText || "MRT-DV-01 // READY IN STORE";
  const showcaseTitle = heroData.showcaseTitle || "Sport-Chic Dvoyka To'plami";
  const showcasePrice = heroData.showcasePrice || 980000;
  const showcaseImage = heroData.showcaseImage || "/images/products/real_dvoyka_sportchic_navy.jpg";

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section id="about" className="relative min-h-[92vh] flex items-center pt-36 sm:pt-40 pb-16 overflow-hidden bg-[#07080a] bg-tech-grid">
      
      {/* WOUFX Ambient Lighting Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-[#E5C378]/10 via-[#E5C378]/3 to-transparent rounded-full blur-[160px] will-change-transform transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ transform: `translate3d(calc(-50% + ${mouseOffset.x * 0.4}px), ${mouseOffset.y * 0.4}px, 0)` }}
        />
        <div 
          className="absolute top-1/4 -left-20 w-80 h-80 bg-white/[0.02] rounded-full blur-[120px] will-change-transform transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ transform: `translate3d(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px, 0)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07080a]/60 to-[#07080a]" />
      </div>

      <div className="scene-exit relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* WOUFX Signature Live Status Eyebrow */}
            <div className="woufx-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse" />
              <span>{eyebrow}</span>
            </div>

            {/* Main Headline in Outfit Display Typography */}
            <h1 className="font-display font-light text-4xl sm:text-6xl lg:text-7xl text-white tracking-[-0.03em] leading-[1.06]">
              {titleLine1} <br />
              {titleHighlight && (
                <span className="font-normal italic text-[#E5C378] mr-2">
                  {titleHighlight}
                </span>
              )}
              {titleLine2}
            </h1>

            {/* Subtitle / Narrative in Manrope */}
            <p className="text-sm sm:text-base text-[#8f96a0] max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* Action Buttons in WOUFX Silk Style */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start pt-2">
              <a 
                href="#catalog"
                className="btn-woufx-primary w-full sm:w-auto"
              >
                <span>{t.hero.ctaCatalog}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="#branches"
                className="btn-woufx-secondary w-full sm:w-auto"
              >
                <MapPin className="w-4 h-4 text-[#E5C378]" />
                <span>{t.hero.ctaBranches}</span>
              </a>
            </div>

            {/* WOUFX Institutional Metrics Cards */}
            <div className="pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-4 text-left">
              <div className="woufx-panel rounded-2xl p-4">
                <div className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight">
                  3 <span className="font-mono text-xs text-[#E5C378] font-normal">FILIAL</span>
                </div>
                <div className="font-mono text-[10px] text-[#8f96a0] uppercase tracking-wider mt-1">
                  {t.hero.statBranchesSub || "Toshkent filiallari"}
                </div>
              </div>

              <div className="woufx-panel rounded-2xl p-4">
                <div className="font-display text-2xl sm:text-3xl font-light text-white tracking-tight">
                  15K<span className="font-mono text-xs text-[#E5C378] font-normal">+</span>
                </div>
                <div className="font-mono text-[10px] text-[#8f96a0] uppercase tracking-wider mt-1">
                  {t.hero.statClientsSub || "Doimiy mijozlar"}
                </div>
              </div>

              <div className="woufx-panel rounded-2xl p-4">
                <div className="font-display text-2xl sm:text-3xl font-light text-[#E5C378] tracking-tight">
                  100%
                </div>
                <div className="font-mono text-[10px] text-[#8f96a0] uppercase tracking-wider mt-1">
                  {t.hero.statQualitySub || "Instagram Asl Surat"}
                </div>
              </div>
            </div>

          </div>

          {/* Right Showcase Card in WOUFX Terminal Style */}
          <div className="lg:col-span-5 relative">
            <div 
              className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none will-change-transform transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)` }}
            >
              
              {/* Main Look Card Frame */}
              <div className="woufx-panel-strong rounded-3xl p-3 relative overflow-hidden group">
                
                {/* WOUFX Corner Accent Brackets */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/20 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/20 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />

                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/80">
                  <img 
                    src={showcaseImage} 
                    alt={showcaseTitle} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Status Badge */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1 rounded-full bg-[#07080a]/80 border border-white/10 backdrop-blur-md font-mono text-[10px] text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse" />
                    <span>{badgeText}</span>
                  </div>

                  {/* Outfit Info Bar */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-[#07080a]/85 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#E5C378]">
                        FLAGSHIP MODEL
                      </div>
                      <div className="font-display font-medium text-sm text-white mt-0.5">
                        {showcaseTitle}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[9px] text-[#8f96a0] uppercase">NARX</div>
                      <div className="font-display font-medium text-sm text-[#E5C378]">
                        {Number(showcasePrice).toLocaleString('uz-UZ')} <span className="font-mono text-[10px] text-[#8f96a0]">UZS</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Secondary Floating Card (Cucinelli Wool Bomber) */}
              <div 
                className="hidden sm:block absolute -bottom-5 -left-6 w-44 rounded-2xl p-2 woufx-panel-strong animate-float-slow will-change-transform shadow-2xl"
                style={{ transform: `translate3d(${mouseOffset.x * -0.4}px, ${mouseOffset.y * -0.4}px, 0)` }}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black/60">
                  <img 
                    src="/images/products/real_jacket_cucinelli_wool.jpg" 
                    alt="Brunello Cucinelli Wool Bomber" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-2 px-1 text-center">
                  <div className="font-mono text-[9px] text-[#8f96a0] uppercase truncate">MRT-JK-01 // CUCINELLI</div>
                  <div className="font-display text-xs font-medium text-[#E5C378]">1 390 000 UZS</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
