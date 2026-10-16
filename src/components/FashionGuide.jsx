import React, { useState } from 'react';
import { Sparkles, Compass, ShieldCheck, TrendingUp, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FashionGuide({ lang = 'uz', t }) {
  const [activeTab, setActiveTab] = useState('rules');
  const [activeLook, setActiveLook] = useState('business');

  const guides = {
    uz: {
      badge: "MERATTO STYLE ACADEMY",
      title: "Erkaklar Modasi & Smart Casual San'ati",
      subtitle: "Zamonaviy erkakning tashqi ko'rinishi — uning tashrif qog'ozi. Didli kiyinish, ranglar uyg'unligi va kiyim tanlash bo'yicha ekspert maslahatlari.",
      tabs: [
        { id: 'rules', label: "Smart Casual Qoidalari", icon: Compass },
        { id: 'shoes', label: "Kostyum & Poyabzal", icon: Layers },
        { id: 'fabrics', label: "Mato & Parvarish", icon: ShieldCheck },
        { id: 'trends', label: "2026 Trendlari", icon: TrendingUp }
      ],
      rulesContent: {
        title: "Smart Casual nima va uni qanday kiyish kerak?",
        desc: "Smart Casual — bu qat'iy klassika bilan erkin shahar uslubining eng oliy darajadagi uyg'unligidir. U sizga bir vaqtning o'zida ham salobatli, ham o'ta qulay ko'rinish imkonini beradi.",
        tips: [
          {
            title: "3 Qavat Qoidasi (Layering)",
            text: "Klassik kiyinishning asosi — qavatlar. Ko'ylak ustidan yupqa jun kardigan, uning ustidan esa yengil bomber yoki dvoyka kurtkasini kiying. Bu uslub qomatni boy va bejirim ko'rsatadi."
          },
          {
            title: "Kostyum ostidan Futbolka yoki Polo",
            text: "Qat'iy galstukli ko'ylak o'rniga Meratto 100% paxta polo yoki oq sifatli t-shirt kiying. Bu obraz yoshingizni yoshartiradi va dinamik tadbirkor qiyofasini yaratadi."
          },
          {
            title: "To'g'ri O'lcham (No Slouch)",
            text: "Kiyim qomatga juda tor bo'lmasligi, lekin osilib ham turmasligi kerak. Yelkada chok aynan suyagingiz ustiga tushishi, shim pastki qismi poyabzal ustiga nozik sinish bilan tushishi shart."
          }
        ]
      },
      shoesContent: {
        title: "Kostyum, Shim va Poyabzal uyg'unligi",
        desc: "Erkak kishining maqomi eng birinchi uning poyabzaliga qarab baholanadi. Smart casual uslubida poyabzal butun obrazni belgilab beradi.",
        tips: [
          {
            title: "Loferlar (Loafers) — Yengil Elegansiya",
            text: "Turkiya tabiiy buzoq terisidan tikilgan loferlar — Dvoyka va chinos shimlarning eng yaqin do'stidir. Bahor-kuz mavsumida ularni ko'rinmas paypoq (invisible socks) bilan kiyish zamonaviy shahar urfidir."
          },
          {
            title: "Oq tagcharmli charm krossovkalar",
            text: "To'q ko'k yoki kulrang dvoyka bilan toza charm past profilli krossovka kiyish — 2026-yilning eng nufuzli biznes-look tendensiyasidir."
          },
          {
            title: "Kamar va Poyabzal rangi",
            text: "Asosiy qoida: Agar jigarrang lofer tanlasangiz, kamaringiz ham jigarrang charm bo'lishi lozim. Qora poyabzal bilan esa qora charm kamar kiyiladi."
          }
        ]
      },
      fabricsContent: {
        title: "Mato siri: Nega Meratto liboslari uzoq xizmat qiladi?",
        desc: "Kiyimning qadri uning matosi sifatiga bog'liq. Meratto do'konlarida faqat nafas oluvchi va shaklini yo'qotmaydigan Turkiya hamda Italiya matolari ishlatiladi.",
        tips: [
          {
            title: "Merino Jun va Viskoza",
            text: "Dvoykalarimizdagi tabiiy jun issiqlikni saqlaydi, viskoza esa matoni yumshoq va ipaksimon qiladi. 5% spandeks qo'shilishi tufayli kiyim tizzada va tirsakda cho'zilib ketmaydi."
          },
          {
            title: "Misr Paxtasi (Oxford Cotton)",
            text: "Ko'ylak va pololarimiz 100% uzun tolali paxtadan tayyorlanadi. Mato g'ijimlanishga chidamli bo'lib, kun bo'yi tanaga havo o'tkazadi va terlatmaydi."
          },
          {
            title: "Parvarish Sirlari",
            text: "Jun kostyum va kurtkalarni kir yuvish mashinasida yuvmaslik tavsiya etiladi. Bug'li dazmol va mavsumiy quruq tozalash (dry clean) kiyimning yillar davomida yangidek turishini ta'minlaydi."
          }
        ]
      },
      trendsContent: {
        title: "2026 Erkaklar Modasi: Obsidian & Earth Tones",
        desc: "Bu yil erkin siluetlar, boy qorong'u monoxrom ohanglar va tabiiy to'qimalar yiliga aylandi.",
        tips: [
          {
            title: "Obsidian & Deep Earth Palitrasi",
            text: "To'q ko'k (Midnight Navy), shokolad kofe, grafit va iliq bej ranglar kombinatsiyasi eng dolzarb trend hisoblanadi."
          },
          {
            title: "Toza To'q Djinsilar (Raw Indigo)",
            text: "Yirtiq va sun'iy oqartirilgan djinsilar o'rniga, to'g'ri bichimli, to'q ko'k toza yapon va turk denimlari modaga qaytdi. Ular kostyum bilan ham mukammal turadi."
          },
          {
            title: "Yumshoq Yelkali Pidjaklar",
            text: "Og'ir yelka yostiqchalari (shoulder pads) o'rniga erkin tushuvchi, italiyaliklar kabi 'Spalla Camicia' bichimidagi yengil kurtka-dvoykalar eng ko'p tanlanmoqda."
          }
        ]
      },
      lookbookTitle: "Meratto Stil Maslahatchisi: Vaziyatga mos obrazlar",
      looks: {
        business: {
          label: "Ofis & Biznes Uchrashuv",
          outfit: "To'q Ko'k Dvoyka + Oq Oxford Ko'ylak + Tabiiy Charm Loferlar",
          desc: "Hamkorlar bilan muzokaralar va nufuzli tadbirlar uchun. Salobatli, jiddiy va ortiqcha dabdabasiz."
        },
        evening: {
          label: "Kechki Bazm & Restoran",
          outfit: "Shokolad Melanj Dvoyka + Qora Sviter + Bordo Ipak Galstuk/Ro'molcha",
          desc: "Kechki uchrashuv va shinam restorandagi kechki ovqat uchun hashamatli iliq ranglar uyg'unligi."
        },
        weekend: {
          label: "Dam Olish & Sayohat",
          outfit: "Aviator Mo'ynali Kurtka + Dark Indigo Djinsi + Oq Tagcharmli Poyabzal",
          desc: "Avtomobilda harakatlanish, oilaviy sayr va sayohatlarda maksimal erkinlik va zamonaviy uslub."
        }
      }
    },
    ru: {
      badge: "АКАДЕМИЯ СТИЛЯ MERATTO",
      title: "Мужская Мода и Искусство Smart Casual",
      subtitle: "Внешний вид современного мужчины — это его статус. Экспертные советы по стилю, цветовым сочетаниям и правильной посадке.",
      tabs: [
        { id: 'rules', label: "Правила Smart Casual", icon: Compass },
        { id: 'shoes', label: "Костюм и Обувь", icon: Layers },
        { id: 'fabrics', label: "Ткани и Уход", icon: ShieldCheck },
        { id: 'trends', label: "Тренды 2026", icon: TrendingUp }
      ],
      rulesContent: {
        title: "Что такое Smart Casual и как его носить?",
        desc: "Smart Casual — это гармония строгой классики и городского комфорта, придающая мужчине непринужденный авторитетный статус.",
        tips: [
          {
            title: "Правило трех слоев",
            text: "Рубашка, тонкий трикотажный кардиган и стильный бомбер поверх создают респектабельный и богатый фактурный силуэт."
          },
          {
            title: "Костюм с футболкой или поло",
            text: "Плотное поло из хлопка-пике под костюм-двойку освежает образ и подчеркивает динамичный ритм успешного мужчины."
          },
          {
            title: "Идеальная длина",
            text: "Брюки должны иметь легкий залом над обувью, а рукава куртки или пиджака — доходить ровно до запястья."
          }
        ]
      },
      shoesContent: {
        title: "Сочетание костюма, брюк и обуви",
        desc: "Статус мужчины оценивается по обуви. В стиле Smart Casual правильная пара решает всё.",
        tips: [
          {
            title: "Лоферы — основа европейского стиля",
            text: "Лоферы из натуральной кожи отлично смотрятся с укороченными брюками и костюмами-двойками."
          },
          {
            title: "Кожаные кеды под костюм",
            text: "Минималистичные кеды с белой подошвой — эталон современного делового гардероба."
          },
          {
            title: "Цвет ремня и обуви",
            text: "Классическое правило: тон ремня должен совпадать с оттенком вашей обуви."
          }
        ]
      },
      fabricsContent: {
        title: "Секрет тканей Meratto",
        desc: "Мы используем дышащие шерстяные и хлопковые полотна из Турции и Италии, которые не деформируются.",
        tips: [
          {
            title: "Мериносовая шерсть с вискозой",
            text: "Шерсть сохраняет микроклимат, вискоза дарит шелковистость, а эластан сохраняет форму коленей."
          },
          {
            title: "Египетский хлопок",
            text: "Длинноволокнистый хлопок для рубашек и поло устойчив к сминанию и обеспечивает комфорт."
          },
          {
            title: "Советы по уходу",
            text: "Используйте отпариватель вместо утюга и сезонную химчистку для долговечности тканей."
          }
        ]
      },
      trendsContent: {
        title: "Тренды 2026: Монохром и Глубокие Земляные Тона",
        desc: "В фокусе — глубокий темно-синий, шоколадный, графитовый цвета и прямой чистый деним.",
        tips: [
          {
            title: "Оттенки Obsidian & Espresso",
            text: "Монохромные глубокие цвета выглядят дорого и визуально стройнят фигуру."
          },
          {
            title: "Чистый деним (Dark Indigo)",
            text: "Прямые темно-синие джинсы без потертостей вновь на пике популярности."
          },
          {
            title: "Мягкая линия плеча",
            text: "Отказ от жестких подплечников в пользу естественного неаполитанского кроя."
          }
        ]
      },
      lookbookTitle: "Гид по образам Meratto",
      looks: {
        business: {
          label: "Офис и Переговоры",
          outfit: "Синий костюм-двойка + Белая рубашка Oxford + Кожаные лоферы",
          desc: "Идеально для переговоров с инвесторами и ключевыми партнерами."
        },
        evening: {
          label: "Вечерний Ресторан",
          outfit: "Шоколадный костюм + Черный джемпер + Шелковый платок",
          desc: "Изысканный теплый образ для приятного вечера и делового ужина."
        },
        weekend: {
          label: "Поездки и Выходные",
          outfit: "Куртка Авиатор + Джинсы Dark Indigo + Кеды",
          desc: "Комфортный стильный комплект для перелетов и загородного отдыха."
        }
      }
    },
    en: {
      badge: "MERATTO STYLE ACADEMY",
      title: "The Art of Modern Smart Casual",
      subtitle: "Elevate your personal presence. Expert guidance on tailoring proportions, color coordination, and seasonal fabrics.",
      tabs: [
        { id: 'rules', label: "Smart Casual Rules", icon: Compass },
        { id: 'shoes', label: "Suit & Footwear", icon: Layers },
        { id: 'fabrics', label: "Fabrics & Care", icon: ShieldCheck },
        { id: 'trends', label: "2026 Trends", icon: TrendingUp }
      ],
      rulesContent: {
        title: "Mastering the Smart Casual Code",
        desc: "Smart Casual bridges formal authority with urban comfort, allowing effortless command of every room.",
        tips: [
          {
            title: "The Three-Layer Rule",
            text: "Layering a crisp base, fine-gauge knitwear, and structured outerwear creates undeniable depth and stature."
          },
          {
            title: "Polo Over Dress Shirt",
            text: "Substituting a rigid tie with a structured pique polo instantly modernizes your executive aesthetic."
          },
          {
            title: "Proportional Tailoring",
            text: "Shoulder seams must align precisely with your bone structure, while trouser cuffs should feature a clean half-break."
          }
        ]
      },
      shoesContent: {
        title: "Pairing Trousers & Footwear",
        desc: "A man's footwear establishes the tone for his entire presence.",
        tips: [
          {
            title: "Handcrafted Loafers",
            text: "Turkish calfskin penny loafers pair impeccably with cropped suits and tapered chinos."
          },
          {
            title: "Minimalist Leather Sneakers",
            text: "Clean low-top sneakers featuring contrasting soles represent the gold standard of contemporary commerce."
          },
          {
            title: "Belt & Leather Matching",
            text: "Ensure leather accessories harmonize in undertone and sheen."
          }
        ]
      },
      fabricsContent: {
        title: "Artisanal Mill Standards",
        desc: "Meratto garments are sourced from historic Turkish and Italian mills specializing in natural resilience.",
        tips: [
          {
            title: "Merino Wool Blends",
            text: "Breathable thermo-regulating wool enriched with 5% technical stretch ensures recovery after hours of wear."
          },
          {
            title: "Long-Staple Cotton",
            text: "Pure Oxford cotton delivers crisp tactile structure with all-day breathability."
          },
          {
            title: "Care & Longevity",
            text: "Steam refresh between wears and utilize seasonal dry-cleaning to maintain pristine drape."
          }
        ]
      },
      trendsContent: {
        title: "2026 Direction: Monochromatic Earth & Obsidian",
        desc: "The current era celebrates fluid silhouettes, unconstructed tailoring, and clean raw denim.",
        tips: [
          {
            title: "Deep Mineral Tones",
            text: "Midnight navy, espresso brown, and warm oatmeal tones dominate contemporary high-fashion runways."
          },
          {
            title: "Raw Indigo Denim",
            text: "Clean, non-distressed straight-leg jeans with subtle selvedge accents transition effortlessly under blazers."
          },
          {
            title: "Unconstructed Shoulders",
            text: "Lightweight Neapolitan-style shoulders replace heavy padding for natural motion."
          }
        ]
      },
      lookbookTitle: "Meratto Curated Outfits",
      looks: {
        business: {
          label: "Executive Meetings",
          outfit: "Navy Two-Piece Suit + Crisp Oxford Shirt + Hand-Waxed Loafers",
          desc: "Commanding authority designed for high-stakes business negotiations."
        },
        evening: {
          label: "Evening Socials",
          outfit: "Chocolate Melange Suit + Black Merino Knit + Bordeaux Silk Accent",
          desc: "Warm tonal depth tailored for fine dining and evening galas."
        },
        weekend: {
          label: "Travel & Leisure",
          outfit: "Shearling Aviator Jacket + Dark Indigo Denim + Leather Sneakers",
          desc: "Luxurious mobility engineered for flights, drives, and weekend leisure."
        }
      }
    }
  };

  const currentGuide = guides[lang] || guides.uz;

  const getContent = () => {
    switch (activeTab) {
      case 'rules':
        return currentGuide.rulesContent;
      case 'shoes':
        return currentGuide.shoesContent;
      case 'fabrics':
        return currentGuide.fabricsContent;
      case 'trends':
        return currentGuide.trendsContent;
      default:
        return currentGuide.rulesContent;
    }
  };

  const content = getContent();

  const handleSelectLook = (outfitText) => {
    const orderSection = document.getElementById('order');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="fashion-guide" data-reveal="scale" className="scene-exit py-20 sm:py-28 relative overflow-hidden border-t border-b border-white/[0.08]">
      
      {/* Background Dynamic Ambient Radial Lights */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#E5C378]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="woufx-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
            <span>{currentGuide.badge}</span>
          </div>
          <h2 className="font-display font-light text-3xl sm:text-5xl text-white tracking-[-0.03em] leading-tight">
            {currentGuide.title}
          </h2>
          <p className="text-sm sm:text-base text-[#8f96a0] font-normal leading-relaxed">
            {currentGuide.subtitle}
          </p>
        </div>

        {/* WOUFX Capsule Segmented Control Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl max-w-fit mx-auto">
          {currentGuide.tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-display text-xs tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-[#E5C378] text-[#07080a] font-medium shadow-lg shadow-[#E5C378]/20'
                    : 'text-[#8f96a0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#07080a]' : 'text-[#E5C378]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Editorial Article Card in WOUFX Panel Style */}
        <div className="woufx-panel rounded-3xl p-6 sm:p-10 mb-12 relative overflow-hidden">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="font-mono text-[10px] text-[#E5C378] uppercase tracking-[0.18em]">
              SPECIFICATION // PROTOCOL OVERVIEW
            </span>
            <h3 className="font-display font-normal text-2xl sm:text-3xl text-white">
              {content.title}
            </h3>
            <p className="text-sm sm:text-base text-[#8f96a0] font-normal leading-relaxed">
              {content.desc}
            </p>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {content.tips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-[#07080a]/80 border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="font-mono text-[10px] text-[#E5C378] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] w-fit">
                    0{idx + 1} // RULE
                  </div>
                  <h4 className="font-display font-medium text-base text-white group-hover:text-[#E5C378] transition-colors">
                    {tip.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#8f96a0] leading-relaxed font-normal">
                    {tip.text}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center gap-1.5 font-mono text-[10px] text-[#4fc79a]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED MERATTO STANDARD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Lookbook Recommender */}
        <div className="woufx-panel-strong rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#E5C378] mb-1">
                RECOMMENDATION TERMINAL
              </div>
              <h3 className="font-display font-medium text-xl sm:text-2xl text-white">
                {currentGuide.lookbookTitle}
              </h3>
            </div>
            
            {/* Scenario selector buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {['business', 'evening', 'weekend'].map((lookKey) => {
                const lookData = currentGuide.looks[lookKey];
                const isSelected = activeLook === lookKey;
                return (
                  <button
                    key={lookKey}
                    onClick={() => setActiveLook(lookKey)}
                    className={`px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all ${
                      isSelected
                        ? 'bg-[#E5C378] text-[#07080a] font-bold shadow-md'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] text-[#8f96a0] border border-white/10'
                    }`}
                  >
                    {lookData.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Look Highlight Box */}
          <div className="bg-[#07080a]/90 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/[0.06] text-[#E5C378] border border-white/10 inline-block">
                {currentGuide.looks[activeLook].label}
              </span>
              <h4 className="font-display font-medium text-lg text-white">
                {currentGuide.looks[activeLook].outfit}
              </h4>
              <p className="text-xs sm:text-sm text-[#8f96a0] font-normal">
                {currentGuide.looks[activeLook].desc}
              </p>
            </div>
            
            <button
              onClick={() => handleSelectLook(currentGuide.looks[activeLook].outfit)}
              className="btn-woufx-primary whitespace-nowrap self-start md:self-auto text-xs"
            >
              <span>{lang === 'ru' ? "Заказать этот образ" : lang === 'en' ? "Order This Look" : "Ushbu obrazga buyurtma"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
