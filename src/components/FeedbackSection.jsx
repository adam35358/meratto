import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { testimonials } from '../data/testimonials';

export default function FeedbackSection({ lang, t }) {
  return (
    <section id="reviews" data-reveal="scale" className="scene-exit py-20 sm:py-28 relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#E5C378]/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading in WOUFX Style */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="woufx-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
            <span>CLIENT VERIFIED REPUTATION</span>
          </div>
          <h2 className="font-display font-light text-3xl sm:text-5xl text-white tracking-[-0.03em]">
            {t.reviews.title}
          </h2>
          <p className="text-sm sm:text-base text-[#8f96a0] font-normal">
            {t.reviews.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div 
              key={item.id}
              data-reveal="card"
              style={{ '--delay': idx }}
              className="relative p-6 sm:p-7 rounded-2xl woufx-panel hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 w-6 h-6 text-white/10" />

              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#E5C378] text-[#E5C378]" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-[#eef0f3] leading-relaxed mb-6 font-normal">
                  "{item.comment[lang] || item.comment.uz}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
                />
                <div>
                  <h4 className="font-display font-medium text-sm text-white flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4fc79a]" title={t.reviews.verified} />
                  </h4>
                  <div className="font-mono text-[10px] text-[#8f96a0]">{item.city}</div>
                  <div className="font-mono text-[9px] text-[#E5C378] mt-0.5">{item.outfit}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
