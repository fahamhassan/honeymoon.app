'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const logoIcon = "/logo-icon.png";
const logoText = "/logo-text.png";
const logoArabic = "/logo-arabic.png";
const globe = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23174a37"><circle cx="12" cy="12" r="10" stroke="%23174a37" stroke-width="2" fill="none"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="%23174a37" stroke-width="2" fill="none"/></svg>`;

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Budget Estimation', href: '/budget-estimation' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
];

export default function PublicNav({ activeHref = '/' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[88px] flex items-center px-6 lg:px-10 justify-between transition-all duration-300 ${
        scrolled || mobileOpen ? 'bg-[#174a37] shadow-[0_2px_20px_rgba(0,0,0,0.2)]' : 'bg-transparent'
      }`}>
        <Link href="/" className="flex items-center gap-3">
          <img src={logoIcon} alt="Logo" className="h-[48px] lg:h-[55px] w-auto" />
          <div className="hidden sm:flex flex-col">
            <img src={logoText} alt="honeymoon" className="h-[18px] lg:h-[21px] w-auto" />
            <img src={logoArabic} alt="" className="h-[14px] lg:h-[16px] w-auto mt-1" />
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href}
              className={`text-[13px] xl:text-[14px] uppercase tracking-wide transition-colors hover:text-white ${
                l.href === activeHref ? 'text-white font-bold' : 'text-white/75 font-normal'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <button className="hidden md:flex items-center gap-2 text-white text-[13px] uppercase">
            <img src={globe} alt="" className="w-[16px]" /> Eng
          </button>
          <Link href="/login"
            className="border border-white/40 text-white text-[13px] uppercase px-4 py-2 rounded-[7.5px] hover:bg-white/10 transition-colors whitespace-nowrap">
            Sign Up | Login
          </Link>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-1">
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed top-[88px] left-0 right-0 bg-[#174a37] z-40 py-4 shadow-lg lg:hidden">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3.5 text-[14px] uppercase tracking-wide transition-colors hover:bg-white/10 ${
                l.href === activeHref ? 'text-[#b89b6b] font-bold' : 'text-white/80'
              }`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
