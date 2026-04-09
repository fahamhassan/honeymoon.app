'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgRectangle3875 = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
const imgRectangle3876 = "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80";
const imgPhoto = "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?w=800&q=80";
const imgPhoto1 = "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80";
const imgRectangle5 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80";
const imgStar = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

const categories = ['All', 'Venues', 'Photography', 'Beauty', 'Catering', 'Decoration', 'Music', 'Transport'];
const vendors = [
  { id: 1, name: 'Al Habtoor Palace', cat: 'Venues', rating: 4.9, reviews: 128, price: 'AED 45,000–80,000', location: 'Dubai', available: true, img: imgRectangle3883, match: 98 },
  { id: 2, name: 'Studio Lumière', cat: 'Photography', rating: 4.8, reviews: 96, price: 'AED 8,500–15,000', location: 'Abu Dhabi', available: true, img: imgRectangle3875, match: 95 },
  { id: 3, name: 'Glamour Touch', cat: 'Beauty', rating: 4.7, reviews: 215, price: 'AED 3,200–5,000', location: 'Dubai', available: true, img: imgRectangle3876, match: 92 },
  { id: 4, name: 'Bloom & Petal', cat: 'Decoration', rating: 4.6, reviews: 82, price: 'AED 12,000–30,000', location: 'Sharjah', available: false, img: imgPhoto, match: 89 },
  { id: 5, name: 'Saveur Catering', cat: 'Catering', rating: 4.5, reviews: 173, price: 'AED 180–350 pp', location: 'Dubai', available: true, img: imgPhoto1, match: 87 },
  { id: 6, name: 'Frames by Hassan', cat: 'Photography', rating: 4.9, reviews: 64, price: 'AED 10,000–18,000', location: 'Dubai', available: true, img: imgRectangle5, match: 94 },
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

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const { items: vendors, loading, total, hasMore, nextPage} = usePaginated(UserService.getVendors, { search });
  const [activeCategory, setActiveCategory] = useState('All');
  const [shortlisted, setShortlisted] = useState([]);

  const filtered = activeCategory === 'All' ? vendors : vendors.filter(v => v.cat === activeCategory);

  return (
    <>
    <div className="max-w-[1200px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-baskerville text-[36px] text-[#1a1a1a]">Browse Vendors</h1>
          <p className="text-black/40 text-sm mt-1">AI-curated matches based on your wedding preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-[rgba(184,154,105,0.3)] rounded-[10px] px-4 py-2.5 flex items-center gap-2 w-52">
            <span className="text-black/30 text-sm">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." className="bg-transparent text-sm outline-none flex-1 text-black/70 placeholder-black/30" />
          </div>
          <select className="border border-[rgba(184,154,105,0.3)] rounded-[10px] px-4 py-2.5 text-sm bg-white outline-none text-black/60 cursor-pointer">
            <option>Sort: AI Match</option>
            <option>Sort: Rating</option>
            <option>Sort: Price ↑</option>
            <option>Sort: Price ↓</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-[#174a37] text-white shadow-[0_2px_8px_rgba(23,74,55,0.3)]'
                : 'bg-white border border-[rgba(184,154,105,0.3)] text-black/60 hover:border-[#b89b6b] hover:text-[#b89b6b]'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Vendor grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 group">
            <div className="relative h-48 overflow-hidden">
              <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-[#174a37] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                ✦ {v.match}% match
              </div>
              <button
                onClick={() => setShortlisted(prev => prev.includes(v.id) ? prev.filter(x => x !== v.id) : [...prev, v.id])}
                className="absolute top-3 right-3 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors">
                {shortlisted.includes(v.id) ? '❤️' : '🤍'}
              </button>
              {!v.available && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="bg-black/60 text-white text-xs px-4 py-1.5 rounded-full">Unavailable on your date</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[#b89b6b] text-[11px] uppercase tracking-wider font-medium">{v.cat}</span>
                  <h3 className="font-medium text-[#1a1a1a] text-base mt-0.5">{v.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <img src={imgStar} alt="★" className="w-3.5 h-3.5 object-contain" />
                  <span className="text-sm font-medium text-[#1a1a1a]">{v.rating}</span>
                  <span className="text-xs text-black/30">({v.reviews})</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-black/40 text-xs">📍 {v.location}</span>
                <span className="text-black/20">·</span>
                <span className="text-[#174a37] text-xs font-medium">{v.price}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <Link href={`/dashboard/vendors/${v.id}`}
                  className="flex-1 bg-[#174a37] text-white text-xs font-medium py-2.5 rounded-[8px] hover:bg-[#1a5c45] transition-colors text-center">
                  View Profile
                </Link>
                <button className="flex-1 border border-[rgba(184,154,105,0.5)] text-[#b89b6b] text-xs font-medium py-2.5 rounded-[8px] hover:bg-[#f4ebd0] transition-colors">
                  Quick Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shortlisted.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-[#174a37] text-white rounded-2xl px-6 py-4 shadow-[0_8px_30px_rgba(23,74,55,0.4)] flex items-center gap-4">
          <span className="text-sm">❤️ {shortlisted.length} vendor{shortlisted.length > 1 ? 's' : ''} shortlisted</span>
          <button className="bg-[#b89b6b] text-white text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#a08860] transition-colors">
            Compare
          </button>
        </div>
      )}
    </div>
    <Pagination items={vendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
