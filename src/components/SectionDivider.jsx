import React from 'react';

export default function SectionDivider({ title = null }) {
  return (
    <div data-reveal="scale" className="relative py-10 flex items-center justify-center overflow-hidden z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Left Hairline */}
      <div className="flex-1 h-px bg-white/[0.08]" />

      {/* WOUFX Center Technical Badge */}
      <div className="mx-4 px-3.5 py-1 rounded-full border border-white/10 bg-[#07080a] backdrop-blur-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f96a0]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
        {title && <span>{title}</span>}
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
      </div>

      {/* Right Hairline */}
      <div className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}
