'use client';
import { useApi } from '../../hooks/useApi';
import VendorService from '../../lib/services/vendor.service';
import { useVendorAuth } from '../../context/auth';
import Link from 'next/link';
const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const RECENT=[{id:'BK0028',customer:'Sarah Johnson',service:'Grand Ballroom',date:'Jun 15, 2026',amount:'AED 45,000',status:'Upcoming - Paid',img:IMG1},{id:'BK0027',customer:'Mohammed Al-Rashid',service:'Garden Venue',date:'Mar 22, 2026',amount:'AED 30,000',status:'Pending',img:IMG2},{id:'BK0026',customer:'Priya Sharma',service:'Private Hall',date:'Apr 10, 2026',amount:'AED 20,000',status:'Completed - Paid',img:IMG3}];
const StatusBadge=({s})=>{const m={'Upcoming - Paid':'text-blue-700 bg-blue-100','Pending':'text-amber-700 bg-amber-100','Completed - Paid':'text-green-700 bg-green-100'};return <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${m[s]||'bg-gray-100 text-gray-600'}`}>{s}</span>;};
export default function VendorDashboardPage(){
  const { vendor } = useVendorAuth();
  const { data, loading } = useApi(VendorService.getDashboard);
  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];
  return(<div>
    <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Dashboard</h1>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[['Total Bookings','28','↑ 4 this month'],['Revenue','AED 420K','↑ 12% vs last'],['Avg Rating','4.9 ★','From 186 reviews'],['Active Services','3','2 pending review']].map(([l,v,s])=>(
        <div key={l} className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
          <p className="font-baskerville text-2xl text-[#1a1a1a] mt-1">{v}</p>
          <p className="text-[#174a37] text-xs mt-1">{s}</p>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-baskerville text-xl text-[#1a1a1a]">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm text-[#b89b6b] hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {(recentBookings.length ? recentBookings : RECENT).map(b=>(
            <div key={b.id} className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"><img src={b.img} alt="" className="w-full h-full object-cover"/></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">{b.customer}</p>
                <p className="text-gray-400 text-xs">{b.service} · {b.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-medium text-sm text-[#1a1a1a]">{b.amount}</p>
                <StatusBadge s={b.status}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <h3 className="font-medium text-gray-700 text-sm mb-3">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {[['📋','Manage Bookings','/dashboard/bookings'],['🛎','Add Service','/dashboard/services'],['💰','Payment Logs','/dashboard/payment-logs'],['⭐','View Reviews','/dashboard/reviews']].map(([icon,l,href])=>(
              <Link key={href} href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f4ebd0] transition-colors">
                <span>{icon}</span><span className="text-sm text-gray-700">{l}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-[#174a37] rounded-2xl p-5">
          <p className="text-white/60 text-xs uppercase tracking-wider">Current Plan</p>
          <p className="font-baskerville text-xl text-[#b89b6b] mt-1">Gold</p>
          <p className="text-white/60 text-xs mt-1">AED 499/month</p>
          <Link href="/dashboard/subscription-logs" className="mt-3 block text-center text-xs bg-[#b89b6b] text-white py-2 rounded-lg hover:bg-[#a08860] transition-colors">Manage Subscription</Link>
        </div>
      </div>
    </div>
  </div>);
}
