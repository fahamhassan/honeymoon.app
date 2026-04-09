'use client';
import { usePaginated } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMGS=[IMG1,IMG2,IMG1,IMG2,IMG1,IMG2];

const CATEGORIES={
  venue:{name:'Venues',icon:'🏛'},photography:{name:'Photography',icon:'📸'},
  beauty:{name:'Beauty & Makeup',icon:'💄'},catering:{name:'Catering',icon:'🍽'},
  decoration:{name:'Decoration',icon:'🌸'},music:{name:'Music & Entertainment',icon:'🎵'},
};

const VENDORS=Array.from({length:12},(_,i)=>({
  id:i+1,name:`${['Royal','Golden','Luxe','Elite','Premium','Grand'][i%6]} ${['Gardens','Studio','Events','Venue','Hall','Palace'][i%6]}`,
  location:'Dubai, UAE',rating:(4.5+Math.random()*0.5).toFixed(1),
  reviews:Math.floor(50+Math.random()*200),
  price:`AED ${(5000+i*1000).toLocaleString()}`,verified:i%3!==2,
}));


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

export default function VendorCategoryPage({ params }) {
  const slug = params?.slug || '';
  const { items: vendors, loading, total, hasMore, nextPage} = usePaginated(UserService.getVendors, { category: slug });
  const [sort,setSort]=useState('rating');
  const [priceRange,setPriceRange]=useState('all');
  const cat=CATEGORIES[params.slug]||{name:params.slug,icon:'🌟'};

  return(
    <>
    <div className="min-h-screen bg-[#f4ebd0]">
      <LoggedInNav/>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link href="/vendors" className="hover:text-[#174a37]">Vendors</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{cat.name}</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-baskerville text-3xl text-[#1a1a1a]">{cat.icon} {cat.name}</h1>
          <div className="flex items-center gap-3">
            <select value={sort} onChange={e=>setSort(e.target.value)}
              className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b]">
              <option value="rating">Top Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="reviews">Most Reviewed</option>
            </select>
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200">
              {['all','budget','mid','luxury'].map(p=>(
                <button key={p} onClick={()=>setPriceRange(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${priceRange===p?'bg-[#174a37] text-white':'text-gray-500 hover:text-gray-700'}`}>
                  {p==='all'?'All':p==='budget'?'< 5k':p==='mid'?'5-15k':'> 15k'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-5">{VENDORS.length} vendors found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(vendors.length ? vendors : VENDORS).map((v,i)=>(
            <Link key={v.id} href={`/vendors/${v.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all group">
              <div className="h-44 overflow-hidden relative">
                <img src={IMGS[i%6]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                {v.verified&&(
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#174a37] text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-1">{v.name}</h3>
                <p className="text-gray-400 text-sm mb-3">📍 {v.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex">{[1,2,3,4,5].map(s=><span key={s} className={`text-xs ${s<=Math.round(parseFloat(v.rating))?'text-amber-400':'text-gray-200'}`}>★</span>)}</div>
                    <span className="text-gray-600 text-xs font-medium">{v.rating}</span>
                    <span className="text-gray-400 text-xs">({v.reviews})</span>
                  </div>
                  <p className="text-[#174a37] font-semibold text-sm">From {v.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
    <Pagination items={vendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
