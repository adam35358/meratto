import React, { useState } from 'react';
import { MapPin, Phone, Clock, ExternalLink, Navigation } from 'lucide-react';
import { branches } from '../data/branches';

export default function BranchesSection({ lang, t, branchesData = [] }) {
  // Merge dynamic phones from Admin Panel
  const displayBranches = branches.map(b => {
    const override = Array.isArray(branchesData) ? branchesData.find(item => item.id === b.id) : null;
    return {
      ...b,
      phones: override?.phones && override.phones.length > 0 ? override.phones : b.phones
    };
  });

  const [selectedBranch, setSelectedBranch] = useState(displayBranches[0]);
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="branches" data-reveal="scale" className="scene-exit py-20 sm:py-28 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading in WOUFX Style */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="woufx-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse" />
            <span>PHYSICAL INFRASTRUCTURE // TASHKENT</span>
          </div>
          <h2 className="font-display font-light text-3xl sm:text-5xl text-white tracking-[-0.03em]">
            {t.branches.title}
          </h2>
          <p className="text-sm sm:text-base text-[#8f96a0] font-normal">
            {t.branches.subtitle}
          </p>
        </div>

        {/* 3 Branches Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {displayBranches.map((branch, idx) => {
            const isSelected = selectedBranch.id === branch.id;
            return (
              <div 
                key={branch.id}
                data-reveal="card"
                style={{ '--delay': idx }}
                onClick={() => setSelectedBranch(branch)}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected 
                    ? 'woufx-panel-strong border-[#E5C378]/60 shadow-[0_0_30px_rgba(229,195,120,0.12)] -translate-y-1' 
                    : 'woufx-panel hover:border-white/20'
                }`}
              >
                {/* Branch Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                  <img 
                    src={branch.image} 
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#07080a]/80 border border-white/10 backdrop-blur-md font-mono text-[9px] uppercase tracking-wider text-[#E5C378]">
                    NODE 0{idx + 1} // {branch.badge}
                  </div>

                  <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 font-mono text-[9px] text-[#4fc79a] bg-[#07080a]/80 px-2 py-0.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a] animate-pulse" />
                    <span>OCHIQ (10:00 - 22:00)</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display font-medium text-lg text-white mb-2">
                      {branch.name}
                    </h3>
                    
                    {/* Address & Landmark */}
                    <div className="space-y-2 text-xs text-[#8f96a0]">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#E5C378] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white font-normal">{branch.address[lang] || branch.address.uz}</strong>
                          <div className="text-[11px] text-[#8f96a0] mt-0.5">{branch.landmark[lang] || branch.landmark.uz}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-[#8f96a0] font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#E5C378] shrink-0" />
                        <span>{t.branches.workingHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Numbers */}
                  <div className="pt-3 border-t border-white/[0.08] space-y-2">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-[#8f96a0]">{t.branches.tel}:</div>
                    <div className="flex flex-wrap gap-2">
                      {branch.phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-[#E5C378] hover:text-[#07080a] text-[#E5C378] border border-white/10 font-mono text-[10px] tracking-wide transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{phone}</span>
                        </a>
                      ))}
                    </div>

                    {/* Direct Map Link */}
                    <div className="pt-1.5">
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#8f96a0] hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-[#E5C378]" />
                        <span>{t.branches.mapBtn} (Yandex Maps)</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Map Toggle & Interactive View */}
        <div className="text-center">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-woufx-secondary"
          >
            <Navigation className="w-4 h-4 text-[#E5C378]" />
            <span>{showMap ? t.branches.hideMap : t.branches.showMap}</span>
          </button>

          {showMap && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#07080a] h-96 relative animate-fade-in">
              <iframe
                title="Meratto va De Franko Filiallari Xaritasi"
                src={`https://yandex.uz/map-widget/v1/?ll=${selectedBranch.coords.lng}%2C${selectedBranch.coords.lat}&z=14&pt=${selectedBranch.coords.lng}%2C${selectedBranch.coords.lat},pm2rdm`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-125"
              />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
