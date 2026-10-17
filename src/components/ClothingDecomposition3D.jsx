import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Layers, Sliders, Eye, RotateCw, CheckCircle2, ArrowRight, ShieldCheck, Zap, Scissors } from 'lucide-react';

export default function ClothingDecomposition3D({ lang = 'uz', t, onSelectLook }) {
  // Decomposition Explosion Factor (0: Assembled Look -> 100: Fully Exploded 3D Anatomy)
  const [explosion, setExplosion] = useState(65);
  // 3D Angle Preset: 'iso' (Isometric 3D) | 'front' (Frontal) | 'depth' (Deep Sartorial Profile)
  const [viewAngle, setViewAngle] = useState('iso');
  const [activeLayerId, setActiveLayerId] = useState('layer-jacket');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const stageRef = useRef(null);

  // Mouse tilt tracking over 3D stage
  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseTilt({ x: x * 15, y: -y * 15 });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  // Layers of the 3D Menswear Decomposition
  const layers = [
    {
      id: 'layer-jacket',
      number: '01',
      title: {
        uz: "Italiya Virgin Wool Kurtka / Pidjak",
        ru: "Куртка-Пиджак из Натуральной Шерсти",
        en: "Italian Virgin Wool Tailored Blouson"
      },
      tag: "TASHQI QOBIQ // SHELL LAYER",
      specs: "78% Virgin Wool, 18% Viskoza, 4% Spandeks (Turkiya/Italiya)",
      detail: "Shaklini yo'qotmaydigan zich to'qima. Tirsak va yelka sohasida cho'zilmaydi, yengil yomg'ir va shamolni qaytaradi.",
      image: "/images/products/real_dvoyka_sportchic_navy.jpg",
      price: 750000,
      zMultiplier: 1.8,
      xMultiplier: -0.7,
      yMultiplier: -0.3,
      color: "#E5C378"
    },
    {
      id: 'layer-canvas',
      number: '02',
      title: {
        uz: "Nafas Oluvchi Ipak Astar & Qovurg'a",
        ru: "Дышащий Шелковый Подклад Bemberg",
        en: "Floating Breathable Silk Canvas & Lining"
      },
      tag: "ICHKI STRUKTURA // ANATOMICAL LINING",
      specs: "Bemberg Silk Twill + Yengil Termal Membrana",
      detail: "Badanga mayin tegadi va statik zaryadlanmaydi. Tana haroratini bir me'yorda ushlab, terlashning oldini oladi.",
      image: "/images/products/real_jacket_cucinelli_wool.jpg",
      price: 250000,
      zMultiplier: 0.9,
      xMultiplier: 0.5,
      yMultiplier: -0.15,
      color: "#4fc79a"
    },
    {
      id: 'layer-polo',
      number: '03',
      title: {
        uz: "100% Organik Misr Paxtasi Polo / Baza",
        ru: "Поло из Длинноволокнистого Египетского Хлопка",
        en: "Long-Staple Egyptian Cotton Base Polo"
      },
      tag: "BAZA QATLAMI // BASE LAYER",
      specs: "100% Giza Long-Staple Cotton (220 g/m²)",
      detail: "Dvoyka va kostyum ostidan kiyish uchun maxsus yaratilgan. Yoqasi yillar davomida bukilmaydi va g'ijimlanmaydi.",
      image: "/images/products/real_polo_merino_navy.jpg",
      price: 250000,
      zMultiplier: 0.0,
      xMultiplier: 0.0,
      yMultiplier: 0.0,
      color: "#60a5fa"
    },
    {
      id: 'layer-pants',
      number: '04',
      title: {
        uz: "Ergonomik Bichimli Chinos-Dvoyka Shimi",
        ru: "Зауженные Брюки Спортивного Кроя",
        en: "Precision Tapered Stretch Trousers"
      },
      tag: "QUYI QISM // TAILORED TROUSERS",
      specs: "Elastik belbog' + 4-Way Stretch Texnologiyasi",
      detail: "Avtomobil boshqarishda va piyoda yurganda harakatni cheklamaydi. Tizzada bo'rtib chiqmaydigan maxsus chok.",
      image: "/images/products/real_pants_sportchic_navy.jpg",
      price: 450000,
      zMultiplier: -0.9,
      xMultiplier: -0.4,
      yMultiplier: 0.7,
      color: "#f59e0b"
    },
    {
      id: 'layer-shoes',
      number: '05',
      title: {
        uz: "Italiya Tabiiy Buzoq Terisidan Loferlar",
        ru: "Итальянские Кожаные Лоферы Ручной Работы",
        en: "Hand-Burnished Calfskin Loafers"
      },
      tag: "POYABZAL // FOOTWEAR ARCHITECTURE",
      specs: "100% Tabiiy Charm, Ortopedik Yumshoq Tagcharm",
      detail: "Qo'lda sayqallangan (hand-burnished) tabiiy charm. Kun bo'yi charchoqsiz yurish uchun amortizatsiyali podoshva.",
      image: "/images/products/prod_shoes_leather_loafers.jpg",
      price: 635000,
      zMultiplier: -1.7,
      xMultiplier: 0.6,
      yMultiplier: 1.3,
      color: "#ec4899"
    }
  ];

  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0];
  const totalLookPrice = layers.reduce((acc, l) => acc + l.price, 0);

  // Compute 3D Camera Angles
  let baseRotateX = 14;
  let baseRotateY = -22;

  if (viewAngle === 'front') {
    baseRotateX = 2;
    baseRotateY = 0;
  } else if (viewAngle === 'depth') {
    baseRotateX = 20;
    baseRotateY = -52;
  }

  const rotX = baseRotateX + mouseTilt.y;
  const rotY = baseRotateY + mouseTilt.x;

  const handleOrderEntireLook = () => {
    if (onSelectLook) {
      onSelectLook({
        id: 'p-tayyor-look-complete',
        title: "Meratto 3D Dekompozitsiya To'liq Obrazi (5 ta qism)",
        name: {
          uz: "Meratto 3D Dekompozitsiya To'liq Obrazi (5 ta qism)",
          ru: "Полный 3D Декомпозиционный Образ Meratto (5 элементов)",
          en: "Meratto Complete 3D Deconstructed Outfit (5 pieces)"
        },
        price: totalLookPrice,
        code: 'MRT-3D-DECOMP',
        isLook: true
      });
    }
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="decomposition-3d" data-reveal="scale" className="scene-exit py-20 sm:py-28 relative overflow-hidden bg-[#07080a] border-t border-b border-white/[0.08]">
      
      {/* 3D Depth Spatial Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#E5C378_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-[#E5C378]/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="woufx-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-ping" />
            <span>3D SARTORIAL DECONSTRUCTION // EXPLODED ANATOMY</span>
          </div>

          <h2 className="font-display font-light text-3xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-tight">
            Kiyim Anatomiyasi: <br className="hidden sm:block" />
            <span className="font-normal italic text-[#E5C378]">3D Dekompozitsiya</span>
          </h2>

          <p className="text-sm sm:text-base text-[#8f96a0] font-normal max-w-2xl mx-auto leading-relaxed">
            Har bir Meratto to'plami — bu shunchaki kiyim emas, balki mukammal uyg'unlashgan qatlamlar arxitekturasi. Slayderni surib, to'plamning 3D fazodagi ichki qismlarga ajralishini ko'ring.
          </p>
        </div>

        {/* 3D Interactive Control Dashboard Bar */}
        <div className="woufx-panel-strong rounded-2xl p-4 sm:p-5 mb-10 flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/10 shadow-2xl">
          
          {/* Explosion Slider Control */}
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E5C378] uppercase tracking-wider shrink-0">
              <Sliders className="w-4 h-4" />
              <span>Dekompozitsiya:</span>
              <span className="text-white font-bold text-sm bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {explosion}%
              </span>
            </div>
            
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={explosion}
                onChange={(e) => setExplosion(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E5C378] focus:outline-none"
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-[#8f96a0]">
              <span className={explosion === 0 ? "text-white font-bold" : ""}>0% (Yig'ilgan)</span>
              <span>&bull;</span>
              <span className={explosion === 100 ? "text-[#E5C378] font-bold" : ""}>100% (Ajralgan)</span>
            </div>
          </div>

          {/* 3D Camera Angle Presets */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[11px] text-[#8f96a0] uppercase tracking-wider mr-1 hidden sm:inline">
              Kamera Rakursi:
            </span>
            <button
              onClick={() => setViewAngle('front')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                viewAngle === 'front'
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'bg-white/5 text-[#8f96a0] hover:text-white border border-white/10'
              }`}
            >
              Oldindan
            </button>
            <button
              onClick={() => setViewAngle('iso')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                viewAngle === 'iso'
                  ? 'bg-[#E5C378] text-black font-bold shadow-lg shadow-[#E5C378]/20'
                  : 'bg-white/5 text-[#8f96a0] hover:text-white border border-white/10'
              }`}
            >
              3D Fazoviy (Izometrik)
            </button>
            <button
              onClick={() => setViewAngle('depth')}
              className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                viewAngle === 'depth'
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'bg-white/5 text-[#8f96a0] hover:text-white border border-white/10'
              }`}
            >
              Yon Dekompozitsiya
            </button>
          </div>

        </div>

        {/* Main 3D Stage & Layer Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center: 3D Exploded Perspective Viewport (7 Cols) */}
          <div 
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="lg:col-span-7 h-[460px] sm:h-[580px] rounded-3xl woufx-panel relative overflow-hidden flex items-center justify-center p-6 border border-white/15 shadow-2xl cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: '1300px' }}
          >
            {/* 3D Grid Stage Floor */}
            <div 
              className="absolute w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none transition-transform duration-700 ease-out"
              style={{
                transform: `rotateX(75deg) rotateZ(${rotY * 0.4}deg) translateZ(-160px)`,
                backgroundImage: 'radial-gradient(circle, rgba(229,195,120,0.12) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Exploded Layers Container in 3D Space */}
            <div
              className="relative w-64 sm:w-72 h-[380px] sm:h-[450px] transition-transform duration-500 ease-out will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(0.92)`
              }}
            >
              {layers.map((layer, index) => {
                const isSelected = activeLayerId === layer.id;
                // Calculate dynamic exploded Z, X, Y translation based on slider
                const transZ = (explosion / 100) * 160 * layer.zMultiplier;
                const transX = (explosion / 100) * 85 * layer.xMultiplier;
                const transY = (explosion / 100) * 65 * layer.yMultiplier;
                const rotLayerZ = (explosion / 100) * (layer.xMultiplier * 5);

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`absolute inset-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 group ${
                      isSelected 
                        ? 'ring-2 ring-[#E5C378] shadow-[0_0_35px_rgba(229,195,120,0.35)]' 
                        : 'opacity-85 hover:opacity-100 hover:ring-1 hover:ring-white/40'
                    }`}
                    style={{
                      transform: `translate3d(${transX}px, ${transY}px, ${transZ}px) rotateZ(${rotLayerZ}deg)`,
                      transformStyle: 'preserve-3d',
                      zIndex: Math.round(100 + transZ)
                    }}
                  >
                    {/* Layer Card Backing & Frosted Glass */}
                    <div className="absolute inset-0 bg-[#07080a]/85 backdrop-blur-md border border-white/15" />
                    
                    {/* Clothing Image */}
                    <img
                      src={layer.image}
                      alt={layer.title.uz}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/30 to-transparent opacity-80" />

                    {/* Floating 3D Badge Indicator */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#E5C378]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
                      <span>{layer.number} // {layer.tag.split('//')[0]}</span>
                    </div>

                    {/* Bottom Layer Price & Name Pill */}
                    <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white font-medium truncate max-w-[140px]">
                        {layer.title.uz}
                      </span>
                      <span className="font-mono text-[#E5C378] font-bold">
                        {layer.price.toLocaleString('uz-UZ')} UZS
                      </span>
                    </div>

                    {/* 3D Seam & Vector Connecting Lines (when exploded) */}
                    {explosion > 25 && (
                      <div 
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#E5C378]/80 to-transparent pointer-events-none"
                        style={{
                          boxShadow: '0 0 12px #E5C378'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom 3D Hint */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-[#8f96a0] pointer-events-none">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>Sichqoncha yoki barmoq bilan 3D burish mumkin</span>
              </span>
              <span className="text-white/40">Z-DEPTH DECOMPOSITION</span>
            </div>
          </div>

          {/* Right: Selected Layer Sartorial Specs & Direct Order (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Interactive Layer Selector Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {layers.map(l => {
                const isSelected = activeLayerId === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayerId(l.id)}
                    className={`px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wider transition-all whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#E5C378] text-[#07080a] font-bold shadow-md shadow-[#E5C378]/25'
                        : 'bg-white/5 text-[#8f96a0] hover:text-white border border-white/10'
                    }`}
                  >
                    {l.number} // {l.title.uz.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Active Layer Sartorial Inspector Panel */}
            <div className="woufx-panel-strong rounded-3xl p-6 sm:p-7 space-y-5 border border-[#E5C378]/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E5C378]">
                  {activeLayer.tag}
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-[#E5C378]/10 border border-[#E5C378]/30 font-mono text-[11px] text-[#E5C378] font-bold">
                  LAYER {activeLayer.number} / 05
                </div>
              </div>

              <div>
                <h3 className="font-display font-medium text-xl sm:text-2xl text-white leading-snug">
                  {activeLayer.title.uz}
                </h3>
                <div className="mt-2 text-2xl font-mono font-bold text-[#E5C378]">
                  {activeLayer.price.toLocaleString('uz-UZ')}{' '}
                  <span className="text-xs font-normal text-[#8f96a0]">so'm</span>
                </div>
              </div>

              {/* Technical Specifications Callout */}
              <div className="space-y-3 pt-2 border-t border-white/10 text-xs text-[#8f96a0]">
                <div className="flex items-start gap-2.5">
                  <Scissors className="w-4 h-4 text-[#E5C378] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium mb-0.5">Mato tarkibi:</strong>
                    <span>{activeLayer.specs}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#4fc79a] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium mb-0.5">Bichim afzalligi:</strong>
                    <span>{activeLayer.detail}</span>
                  </div>
                </div>
              </div>

              {/* Order Full Look CTA */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#8f96a0]">Butun to'plam narxi (5 ta qism):</span>
                  <span className="text-white font-bold text-base">
                    {totalLookPrice.toLocaleString('uz-UZ')} UZS
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOrderEntireLook}
                  className="w-full btn-woufx-primary py-3 text-xs flex items-center justify-center gap-2 font-display uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ushbu To'plamga Buyurtma Berish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
