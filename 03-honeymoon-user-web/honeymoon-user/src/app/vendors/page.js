'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  vendorBg: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&q=80",
  venueImg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  photoImg: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  beautyImg: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  featuresPhoto: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
  photo: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?w=800&q=80",
  photo1: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
  star: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png",
  logoIcon: "/logo-icon.png",
  logoText: "/logo-text.png",
  logoArabic: "/logo-arabic.png",
};

const categories = ['All', 'Venues', 'Photography', 'Beauty', 'Catering', 'Decoration', 'Music', 'Transport'];
const vendors = [
  { id: 1, name: 'Al Habtoor Palace', cat: 'Venues', rating: 4.9, reviews: 128, price: 'AED 45,000–80,000', location: 'Dubai', img: imgs.venueImg, tags: ['Luxury', 'Palace', '500+ guests'] },
  { id: 2, name: 'Studio Lumière', cat: 'Photography', rating: 4.8, reviews: 96, price: 'AED 8,500–15,000', location: 'Abu Dhabi', img: imgs.photoImg, tags: ['Portrait', 'Editorial', 'Drone'] },
  { id: 3, name: 'Glamour Touch', cat: 'Beauty', rating: 4.7, reviews: 215, price: 'AED 3,200–5,000', location: 'Dubai', img: imgs.beautyImg, tags: ['Bridal', 'Traditional', 'Team'] },
  { id: 4, name: 'Emirates Floral', cat: 'Decoration', rating: 4.6, reviews: 82, price: 'AED 12,000–30,000', location: 'Sharjah', img: imgs.featuresPhoto, tags: ['Luxury', 'Floral', 'Custom'] },
  { id: 5, name: 'Saveur Catering', cat: 'Catering', rating: 4.5, reviews: 173, price: 'AED 180–350 pp', location: 'Dubai', img: imgs.photo, tags: ['Arabic', 'International', 'Buffet'] },
  { id: 6, name: 'Frames by Hassan', cat: 'Photography', rating: 4.9, reviews: 64, price: 'AED 10,000–18,000', location: 'Dubai', img: imgs.photo1, tags: ['Fine Art', 'Cinematic', 'Emirati'] },
];
const navLinks = [
  { label: 'Home', href: '/' }, { label: 'About', href: '/about' },
  { label: 'Budget Estimation', href: '/budget-estimation' }, { label: 'Vendors', href: '/vendors' },
  { label: 'Services', href: '/services' }, { label: 'Contact Us', href: '/contact' },
];


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:16,borderTop:'1px solid #e5e7eb'}}>
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-xl hover:bg-[#1a5c45] transition-colors disabled:opacity-50">
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

export default function PublicVendorsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { items: vendors, loading, nextPage, hasMore, refresh, total } = usePaginated(UserService.getVendors, { search, category });
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const filtered = vendors.filter(v =>
    (activeCategory === 'All' || v.cat === activeCategory) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );

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
              className={`text-[14px] uppercase tracking-wide hover:text-white transition-colors ${l.href === '/vendors' ? 'text-white font-bold' : 'text-white/80'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/login" className="border border-white/40 text-white text-[14px] uppercase px-5 py-2.5 rounded-[7.5px] hover:bg-white/10 transition-colors">
          Sign Up | Login
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative h-[480px] flex items-center overflow-hidden">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-[88px] w-full">
          <p className="text-[#b89b6b] text-[14px] uppercase tracking-[4px] mb-4">Discover</p>
          <h1 className="font-baskerville text-[72px] leading-[80px] text-[#fff6e9] capitalize max-w-[720px] mb-6">
            UAE's Finest Wedding Vendors
          </h1>
          <div className="flex gap-4 items-center max-w-[600px]">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-5 py-3 flex items-center gap-3">
              <span className="text-white/50">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search vendors by name or category..."
                className="bg-transparent text-white text-[15px] outline-none flex-1 placeholder-white/40" />
            </div>
            <Link href="/signup" className="bg-[#b89b6b] text-white text-[15px] font-medium px-6 py-3 rounded-xl hover:bg-[#a08860] transition-colors whitespace-nowrap">
              ✦ AI Match Me
            </Link>
          </div>
        </div>
      </section>

      {/* Vendor listing */}
      <section className="bg-[#f9f6ef] py-16">
        <div className="max-w-7xl mx-auto px-10">
          {/* Category pills */}
          <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-[#174a37] text-white' : 'bg-white border border-[rgba(184,154,105,0.3)] text-black/60 hover:border-[#b89b6b]'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => (
              <div key={v.id} className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 group">
                <div className="relative h-52 overflow-hidden">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-[#b89b6b] text-[11px] uppercase tracking-wider font-medium">{v.cat}</span>
                  <h3 className="font-medium text-[#1a1a1a] text-lg mt-0.5">{v.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <img src={v.img && imgs.star} alt="★" className="w-3.5 h-3.5 object-contain" />
                      <span className="text-sm font-medium">{v.rating}</span>
                      <span className="text-xs text-black/30">({v.reviews})</span>
                    </div>
                    <span className="text-black/20">·</span>
                    <span className="text-black/40 text-xs">📍 {v.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {v.tags.map(t => <span key={t} className="text-[11px] text-[#174a37] bg-[#f4ebd0] px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[#174a37] text-sm font-medium">{v.price}</span>
                    <Link href={`/vendors/${v.id}`} className="bg-[#174a37] text-white text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#1a5c45] transition-colors">
                      View & Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-black/40 text-lg">No vendors found. <Link href="/signup" className="text-[#b89b6b] hover:underline">Let AI find them for you →</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* AI CTA */}
      <section className="bg-[#174a37] py-20 text-center">
        <div className="max-w-2xl mx-auto px-10">
          <div className="w-16 h-16 bg-[#b89b6b] rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6">✦</div>
          <h2 className="font-baskerville text-[48px] leading-[56px] text-[#b89b6b] capitalize mb-4">Let AI Find Your Perfect Match</h2>
          <p className="text-white/70 text-[17px] leading-7 mb-8">Answer a few questions and our AI will shortlist the best vendors for your specific vision, date, and budget.</p>
          <Link href="/signup" className="bg-[#b89b6b] text-white text-[16px] font-medium px-10 py-4 rounded-[10px] hover:bg-[#a08860] transition-colors">
            Start AI Planning — It's Free
          </Link>
        </div>
      </section>
    </div>
    <Pagination items={vendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
