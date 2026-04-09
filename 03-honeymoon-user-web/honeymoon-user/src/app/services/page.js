'use client';
import { usePaginated, useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  featuresBg: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1600&q=80",
  howBg: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80",
  venueImg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photoImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  beautyImg: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  featuresPhoto: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  logoIcon: "/logo-icon.png",
  logoText: "/logo-text.png",
  logoArabic: "/logo-arabic.png",
};

const services = [
  { icon: '✦', title: 'AI Vendor Matching', desc: 'Our intelligent algorithm matches you with vendors based on your budget, style, and wedding date — with live availability.', img: imgs.venueImg, price: 'Free' },
  { icon: '📋', title: 'Full Planning Package', desc: 'A dedicated wedding planner coordinates everything from vendor selection to day-of logistics. Pure luxury, zero stress.', img: imgs.photoImg, price: 'From AED 15,000' },
  { icon: '💰', title: 'Budget Management', desc: 'AI-powered budget tracking with real-time spend analysis, automatic categorization, and smart spending recommendations.', img: imgs.beautyImg, price: 'Free with account' },
  { icon: '💬', title: 'Direct Vendor Chat', desc: 'Communicate directly with all your vendors in one secure platform. No more chasing emails or losing track of conversations.', img: imgs.featuresPhoto, price: 'Free with account' },
];

const navLinks = [
  { label: 'Home', href: '/' }, { label: 'About', href: '/about' },
  { label: 'Budget Estimation', href: '/budget-estimation' }, { label: 'Vendors', href: '/vendors' },
  { label: 'Services', href: '/services' }, { label: 'Contact Us', href: '/contact' },
];


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:16,borderTop:'1px solid #f3f4f6'}}>
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { items: services, loading, total, hasMore, nextPage} = usePaginated(UserService.getServices, { search, category });
  const { data: catData } = useApi(UserService.getCategories);
  const categories = catData?.categories || [];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
    <div className="bg-white font-sans overflow-x-hidden">
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[88px] flex items-center px-10 justify-between transition-all duration-300 ${scrolled ? 'bg-[#174a37] shadow-[0_2px_20px_rgba(0,0,0,0.2)]' : 'bg-transparent'}`}>
        <Link href="/" className="flex items-center gap-3">
          <img src={imgs.logoIcon} alt="Logo" className="h-[55px] w-auto" />
          <div><img src={imgs.logoText} alt="honeymoon" className="h-[21px] w-auto" />
            <img src={imgs.logoArabic} alt="" className="h-[16px] w-auto mt-1" /></div>
        </Link>
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href}
              className={`text-[14px] uppercase tracking-wide hover:text-white transition-colors ${l.href === '/services' ? 'text-white font-bold' : 'text-white/80'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/login" className="border border-white/40 text-white text-[14px] uppercase px-5 py-2.5 rounded-[7.5px] hover:bg-white/10 transition-colors">
          Sign Up | Login
        </Link>
      </nav>

      <section className="relative h-[480px] flex items-center overflow-hidden">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-[88px]">
          <p className="text-[#b89b6b] text-[14px] uppercase tracking-[4px] mb-4">What We Offer</p>
          <h1 className="font-baskerville text-[72px] leading-[80px] text-[#fff6e9] capitalize max-w-[720px]">
            Services Built for Luxury Weddings
          </h1>
          <p className="text-[#fff6e9]/70 text-[18px] max-w-[520px] mt-6 leading-7">
            From AI matching to full concierge planning — every service designed for perfection.
          </p>
        </div>
      </section>

      <section className="bg-[#f9f6ef] py-24">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <div key={s.title} className={`rounded-2xl overflow-hidden border ${i < 2 ? 'border-[rgba(23,74,55,0.2)] bg-white' : 'border-[rgba(184,154,105,0.2)] bg-white'} hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow`}>
                <div className="h-52 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#174a37] rounded-xl flex items-center justify-center text-[#b89b6b] text-lg">{s.icon}</div>
                    <span className="text-[#b89b6b] text-sm font-medium bg-[#f4ebd0] px-3 py-1 rounded-full">{s.price}</span>
                  </div>
                  <h3 className="font-baskerville text-[28px] text-[#174a37] mb-3">{s.title}</h3>
                  <p className="text-black/60 text-[15px] leading-7 mb-6">{s.desc}</p>
                  <Link href="/signup" className="inline-flex items-center gap-2 text-[#174a37] text-sm font-medium hover:text-[#b89b6b] transition-colors">
                    Get Started →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-24 overflow-hidden">
        <img src={imgs.featuresBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-5xl mx-auto px-10">
          <div className="text-center mb-16">
            <p className="text-[#b89b6b] text-[14px] uppercase tracking-[4px] mb-4">Pricing</p>
            <h2 className="font-baskerville text-[52px] leading-[60px] text-white capitalize">Simple, Transparent Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plan: 'Free', price: 'AED 0', features: ['AI vendor matching', 'Up to 5 shortlists', 'Basic budget tracker', 'Vendor messaging'], cta: 'Get Started' },
              { plan: 'Premium', price: 'AED 299/mo', features: ['Unlimited AI matches', 'Priority vendor access', 'Full budget management', 'Dedicated chat support', 'Payment processing'], cta: 'Start Free Trial', featured: true },
              { plan: 'Concierge', price: 'AED 999/mo', features: ['Everything in Premium', 'Dedicated wedding planner', 'Venue site visits', 'Day-of coordination', 'White-glove service'], cta: 'Contact Us' },
            ].map(p => (
              <div key={p.plan} className={`rounded-2xl p-8 ${p.featured ? 'bg-[#b89b6b]' : 'bg-white/10 border border-white/20'}`}>
                <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${p.featured ? 'text-white/80' : 'text-white/60'}`}>{p.plan}</p>
                <p className={`font-baskerville text-[40px] mb-6 ${p.featured ? 'text-white' : 'text-[#b89b6b]'}`}>{p.price}</p>
                <div className="flex flex-col gap-3 mb-8">
                  {p.features.map(f => (
                    <p key={f} className={`text-sm flex items-center gap-2 ${p.featured ? 'text-white' : 'text-white/70'}`}>
                      <span>✓</span> {f}
                    </p>
                  ))}
                </div>
                <Link href="/signup" className={`w-full flex items-center justify-center py-3 rounded-[10px] text-sm font-medium transition-colors ${p.featured ? 'bg-white text-[#b89b6b] hover:bg-[#f4ebd0]' : 'border border-white/40 text-white hover:bg-white/10'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Pagination items={services} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
