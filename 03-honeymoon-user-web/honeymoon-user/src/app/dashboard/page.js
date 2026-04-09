'use client';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';

// Fresh Figma assets
const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";
const imgVenueImg = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgPhotoImg = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgBeautyImg = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const stats = [
  { label: 'Active Bookings', value: '3', change: '+1 this week', icon: '📋', color: '#174a37' },
  { label: 'Vendors Shortlisted', value: '12', change: '4 new matches', icon: '🏛', color: '#b89b6b' },
  { label: 'Budget Used', value: '42%', change: 'AED 84K / 200K', icon: '💰', color: '#1a1a1a' },
  { label: 'Days to Wedding', value: '187', change: 'June 15, 2026', icon: '💍', color: '#174a37' },
];

const bookings = [
  { vendor: 'Al Habtoor Palace', type: 'Venue', date: 'Jun 15, 2026', status: 'Confirmed', amount: 'AED 45,000', img: imgVenueImg },
  { vendor: 'Studio Lumière', type: 'Photography', date: 'Jun 15, 2026', status: 'Pending', amount: 'AED 8,500', img: imgPhotoImg },
  { vendor: 'Glamour Touch', type: 'Beauty', date: 'Jun 14, 2026', status: 'Confirmed', amount: 'AED 3,200', img: imgBeautyImg },
];

const aiMatches = [
  { name: 'Emirates Palace Ballroom', cat: 'Venue', rating: 4.9, match: 98, img: imgVenueImg },
  { name: 'Capture by Nadia', cat: 'Photography', rating: 4.8, match: 95, img: imgPhotoImg },
  { name: 'Floral Emirates', cat: 'Decoration', rating: 4.7, match: 92, img: imgBeautyImg },
];

const budgetCats = [
  { cat: 'Venue', budgeted: 80000, spent: 45000 },
  { cat: 'Photography', budgeted: 15000, spent: 8500 },
  { cat: 'Beauty', budgeted: 8000, spent: 3200 },
  { cat: 'Catering', budgeted: 60000, spent: 0 },
];

function StatusBadge({ status }) {
  const c = { Confirmed: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Cancelled: 'bg-red-100 text-red-700' };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c[status] || ''}`}>{status}</span>;
}

export default function DashboardHome() {
  const { user } = useUserAuth();
  const { data, loading } = useApi(UserService.getHome);
  const featuredVendors = data?.featuredVendors || [];
  const categories = data?.categories || [];
  return (
    <div className="max-w-[1200px]">
      {/* Welcome banner */}
      <div className="bg-[#174a37] rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute right-4 top-4 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute right-16 top-12 w-16 h-16 bg-[#b89b6b]/10 rounded-full" />
        <p className="text-white/50 text-sm uppercase tracking-wider">Good Morning ✨</p>
        <h1 className="font-baskerville text-[32px] md:text-[42px] text-[#b89b6b] mt-1 mb-3">
          Rashed &amp; Fatima&apos;s Wedding
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-[480px] mb-6">
          Your AI planner found 4 new vendor matches based on your preferences.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/dashboard/ai-planner"
            className="bg-[#b89b6b] text-white text-sm font-medium px-6 py-2.5 rounded-[10px] hover:bg-[#a08860] transition-colors">
            Open AI Planner ✦
          </Link>
          <Link href="/dashboard/vendors"
            className="border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-[10px] hover:bg-white/10 transition-colors">
            Browse Vendors
          </Link>
          <Link href="/dashboard/getting-started"
            className="text-white/40 text-sm hover:text-white/60 transition-colors">
            Setup checklist →
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, change, icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-4 md:p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{icon}</span>
              <span className="text-[#b89b6b] text-[10px] uppercase tracking-wider">Now</span>
            </div>
            <p className="font-baskerville text-[28px] md:text-[36px] text-[#1a1a1a]">{value}</p>
            <p className="text-black/50 text-xs md:text-sm mt-0.5">{label}</p>
            <p className="text-[#174a37] text-xs mt-1.5">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-[rgba(184,154,105,0.1)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a]">Upcoming Bookings</h2>
            <Link href="/dashboard/bookings" className="text-[#b89b6b] text-sm hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-[rgba(184,154,105,0.08)]">
            {bookings.map(b => (
              <Link key={b.vendor} href="/dashboard/bookings/1"
                className="flex items-center gap-4 p-4 md:p-5 hover:bg-[#faf7f0] transition-colors group">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={b.img} alt={b.vendor} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a1a1a] text-sm truncate">{b.vendor}</p>
                  <p className="text-black/40 text-xs mt-0.5">{b.type} · {b.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <StatusBadge status={b.status} />
                  <p className="text-[#1a1a1a] text-sm font-medium mt-1">{b.amount}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Matches */}
        <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between p-5 md:p-6 border-b border-[rgba(184,154,105,0.1)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a]">AI Matches</h2>
            <span className="text-[#b89b6b] text-xs px-2 py-1 bg-[#f4ebd0] rounded-full">✦ 4 New</span>
          </div>
          <div className="divide-y divide-[rgba(184,154,105,0.08)]">
            {aiMatches.map(v => (
              <Link key={v.name} href="/dashboard/vendors/1"
                className="flex items-center gap-3 p-4 hover:bg-[#faf7f0] transition-colors group">
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a1a1a] text-sm truncate">{v.name}</p>
                  <p className="text-black/40 text-xs">{v.cat}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <img src={imgStar} alt="★" className="w-3 h-3 object-contain" />
                    <span className="text-xs text-black/50">{v.rating}</span>
                  </div>
                </div>
                <span className="bg-[#174a37] text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">{v.match}%</span>
              </Link>
            ))}
          </div>
          <div className="p-4">
            <Link href="/dashboard/ai-planner"
              className="w-full flex items-center justify-center gap-2 bg-[#f4ebd0] text-[#174a37] text-sm font-medium py-2.5 rounded-[10px] hover:bg-[#e8dfc5] transition-colors">
              ✦ See All AI Matches
            </Link>
          </div>
        </div>
      </div>

      {/* Budget overview */}
      <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)] p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a]">Budget Overview</h2>
          <Link href="/dashboard/budget" className="text-[#b89b6b] text-sm hover:underline">Manage →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {budgetCats.map(({ cat, budgeted, spent }) => {
            const pct = Math.round((spent / budgeted) * 100);
            return (
              <div key={cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#1a1a1a]">{cat}</span>
                  <span className="text-xs text-black/40">{pct}%</span>
                </div>
                <div className="h-1.5 bg-[#f4ebd0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#b89b6b] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-black/40">AED {spent.toLocaleString()}</span>
                  <span className="text-xs text-black/20">/ {(budgeted / 1000).toFixed(0)}K</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
