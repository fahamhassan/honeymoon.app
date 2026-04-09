'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useUserAuth } from '../../../context/auth';
import { useState } from 'react';
import Link from 'next/link';

const HERO="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const AVATAR="https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";

export default function VendorProfilePage({ params }) {
  const { isLoggedIn } = useUserAuth();
  const vendorId = params?.id || '';
  const { data, loading } = useApi(UserService.getVendor, vendorId);
  const vendor = data?.vendor || {};
  const services = data?.services || [];
  const reviews = data?.reviews || [];
  const [tab, setTab] = useState('services');
  const [wishlisted, setWishlisted] = useState(false);
  const [showBooking, setShowBooking] = useState(false);



  return (
    <div className="min-h-screen bg-[#f4ebd0]">
      {/* Hero */}
      <div className="h-64 bg-[#174a37] relative overflow-hidden">
        <img src={HERO} alt="" className="w-full h-full object-cover opacity-40"/>
        <div className="absolute inset-0 flex items-end p-8">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              <img src={vendor.avatar || AVATAR} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="pb-2">
              <h1 className="font-baskerville text-3xl text-white">{vendor.companyName || "Vendor Profile"}</h1>
              <p className="text-white/70 text-sm">📍 {vendor.location || vendor.address || "UAE"} · ⭐ {vendor.rating || "—"} ({vendor.reviewCount || 0} reviews)</p>
            </div>
          </div>
          <div className="ml-auto pb-2 flex gap-3">
            <button onClick={()=>setWishlisted(!wishlisted)} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white transition-colors ${wishlisted?'bg-red-500 border-red-500 text-white':'bg-white/20 text-white'}`}>
              {wishlisted?'❤️':'🤍'}
            </button>
            <Link href={`/services?vendor=${params.id}`} className="bg-[#b89b6b] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#a08860] transition-colors">
              View Services
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[rgba(184,154,105,0.2)]">
          {['services','about','reviews'].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${tab===t?'border-[#174a37] text-[#174a37]':'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab==='services'&&(
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map(s=>(
              <Link key={s.name} href={`/services/${encodeURIComponent(s.name.toLowerCase().replace(/ /g,'-'))}`}
                className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-36 bg-[#174a37]"><img src={HERO} alt="" className="w-full h-full object-cover opacity-60"/></div>
                <div className="p-4">
                  <h3 className="font-medium text-[#1a1a1a] text-sm mb-1">{s.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#174a37] font-semibold text-sm">{s.price}</span>
                    <span className="text-xs text-gray-400">⭐ {s.rating} ({s.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab==='about'&&(
          <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-4">About Us</h2>
            <p className="text-gray-600 leading-7">Elegant Events UAE is a premier wedding planning and venue company based in Dubai. With over 10 years of experience, we specialize in creating unforgettable luxury weddings that blend traditional Emirati elegance with contemporary aesthetics.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[['10+','Years Experience'],['500+','Weddings Planned'],['4.9','Average Rating']].map(([v,l])=>(
                <div key={l} className="text-center bg-[#f4ebd0] rounded-xl p-4">
                  <p className="font-baskerville text-2xl text-[#174a37]">{v}</p>
                  <p className="text-gray-500 text-xs">{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='reviews'&&(
          <div className="space-y-4">
            {[{name:'Sarah A.',rating:5,date:'Jan 2025',text:'Absolutely stunning venue! The team was incredibly professional and made our wedding day perfect.'},{name:'Mohammed K.',rating:5,date:'Dec 2024',text:'Best wedding experience we could have asked for. Every detail was handled with care.'}].map((r,i)=>(
              <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f4ebd0] flex items-center justify-center font-medium text-[#174a37]">{r.name[0]}</div>
                    <div><p className="font-medium text-sm text-gray-800">{r.name}</p><p className="text-xs text-gray-400">{r.date}</p></div>
                  </div>
                  <div className="flex">{[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=r.rating?'text-amber-400':'text-gray-200'}`}>★</span>)}</div>
                </div>
                <p className="text-gray-600 text-sm leading-6">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
