import React from 'react';
import { Send, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer({ t, contacts = {} }) {
  const node1Phone = contacts.branches?.[0]?.phones?.[0] || "+998 98 311 33 37";
  const node2Phone = contacts.branches?.[1]?.phones?.[0] || "+998 97 660 66 44";
  const node3Phone = contacts.branches?.[2]?.phones?.[0] || "+998 99 302 11 66";

  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] text-woufx-muted text-xs font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-black font-outfit font-semibold flex items-center justify-center text-sm shadow-md">
                M
              </div>
              <span className="font-outfit font-normal tracking-[-0.02em] text-base text-white">
                MERATTO <span className="font-mono text-xs text-woufx-muted tracking-wider font-light">&bull; DE FRANKO</span>
              </span>
            </div>
            <p className="text-woufx-muted text-xs leading-relaxed font-light">
              {t.footer.desc}
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://www.instagram.com/meratto.uz/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white hover:text-black text-woufx-muted border border-white/[0.08] flex items-center justify-center transition-all duration-300"
                title="Instagram @meratto.uz"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://t.me/meratto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white hover:text-black text-woufx-muted border border-white/[0.08] flex items-center justify-center transition-all duration-300"
                title="Telegram Kanal"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-mono text-white text-[11px] uppercase tracking-[0.18em]">
              01 // {t.footer.quickLinks || "NAVIGATSIYA"}
            </h4>
            <ul className="space-y-2 text-woufx-muted">
              <li><a href="#about" className="hover:text-white transition-colors flex items-center justify-between group"><span>{t.nav.about}</span><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors flex items-center justify-between group"><span>{t.nav.catalog}</span><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
              <li><a href="#fashion-guide" className="hover:text-white transition-colors flex items-center justify-between group"><span>{t.nav.fashionGuide}</span><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
              <li><a href="#branches" className="hover:text-white transition-colors flex items-center justify-between group"><span>{t.nav.branches}</span><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
              <li><a href="#order" className="hover:text-white transition-colors flex items-center justify-between group"><span>{t.nav.contact}</span><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
            </ul>
          </div>

          {/* Filial 1 & 2 Contact */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-mono text-white text-[11px] uppercase tracking-[0.18em]">
              02 // MERATTO NODES
            </h4>
            <div className="space-y-3 text-woufx-muted">
              <div>
                <div className="text-white font-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Node 01: Qoratosh 5B</span>
                </div>
                <a href={`tel:${node1Phone.replace(/\s+/g, '')}`} className="text-woufx-muted hover:text-white transition-colors">
                  {node1Phone}
                </a>
              </div>
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-white font-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Node 02: Chilonzor S-14</span>
                </div>
                <a href={`tel:${node2Phone.replace(/\s+/g, '')}`} className="text-woufx-muted hover:text-white transition-colors">
                  {node2Phone}
                </a>
              </div>
            </div>
          </div>

          {/* Filial 3 De Franko Contact */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-mono text-white text-[11px] uppercase tracking-[0.18em]">
              03 // DE FRANKO BOUTIQUE
            </h4>
            <div className="space-y-2 text-woufx-muted">
              <div>
                <div className="text-white font-normal flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Node 03: Qoratosh 65</span>
                </div>
                <a href={`tel:${node3Phone.replace(/\s+/g, '')}`} className="text-woufx-muted hover:text-white transition-colors">
                  {node3Phone}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-woufx-subtle">
                Ish tartibi: Har kuni 10:00 — 23:00
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-woufx-subtle font-mono text-[11px] tracking-[0.14em]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ALL NODES OPERATIONAL &bull; TASHKENT, UZ</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              &copy; {new Date().getFullYear()} MERATTO &bull; DE FRANKO. {t.footer.copyright}
            </div>
            <a 
              href="#admin"
              className="text-white/20 hover:text-[#E5C378] transition-colors font-mono text-[10px] tracking-wider"
              title="Admin Boshqaruv Paneli"
            >
              [ADMIN]
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
