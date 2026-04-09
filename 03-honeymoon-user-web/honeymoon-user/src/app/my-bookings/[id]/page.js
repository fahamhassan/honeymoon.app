'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

export default function BookingDetailPage({ params }) {
  const bId = params?.id || '';
  const { data, loading, refresh } = useApi(UserService.getBooking, bId);
  const booking = data?.booking || {};
  const vendor = data?.vendor || {};
  const service = data?.service || {};
  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      <LoggedInNav />
      <main className="flex-1 max-w-5xl mx-auto px-8 py-10 w-full">
        <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
          <Link href="/my-bookings" className="hover:text-[#174a37] transition-colors">My Bookings</Link>
          <span>/</span>
          <span className="text-[#1a1a1a]">Booking Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <div className="h-52 overflow-hidden">
                <img src={imgVenue1} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="text-[#b89b6b] text-xs uppercase tracking-wider font-medium">Venue</span>
                <h1 className="font-baskerville text-[32px] text-[#1a1a1a] mt-1">{vendor.companyName || service.name || booking.serviceId || "Booking Detail"}</h1>
                <p className="text-black/40 mt-1">📍 Dubai Marina</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Booking Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Reference', booking.id || 'BK-2025-0001'],
                  ['Package', booking.packageName || service.name || 'Standard Package'],
                  ['Event Date', booking.eventDate || '—'],
                  ['Guests', booking.guestCount ? `~${booking.guestCount}` : '—'],
                  ['Status', booking.status || 'Upcoming'],
                  ['Payment', booking.paymentStatus || 'Pending'],
                ].map(([l,v]) => (
                  <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
                    <p className="text-black/40 text-xs uppercase tracking-wider">{l}</p>
                    <p className="text-[#1a1a1a] font-medium text-sm mt-1">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Payment Schedule</h2>
              <div className="flex flex-col gap-3">
                {[['Deposit (25%)','AED 15,000','Jan 12, 2025','Paid'],['2nd Payment (25%)','AED 15,000','Mar 15, 2025','Upcoming'],['Final (50%)','AED 30,000','May 1, 2025','Scheduled']].map(([l,a,d,s]) => (
                  <div key={l} className="flex items-center justify-between py-3 border-b border-[rgba(184,154,105,0.08)] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">{l}</p>
                      <p className="text-black/40 text-xs">{d}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s==='Paid'?'bg-green-100 text-green-700':s==='Upcoming'?'bg-amber-100 text-amber-700':'bg-blue-100 text-blue-700'}`}>{s}</span>
                      <span className="font-baskerville text-[20px] text-[#1a1a1a]">{a}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <h3 className="font-baskerville text-[20px] text-[#1a1a1a] mb-4">Actions</h3>
              <div className="flex flex-col gap-3">
                <Link href="/meeting-requests" className="w-full bg-[#174a37] text-white text-sm font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors text-center">
                  Request Meeting
                </Link>
                <Link href="/my-bookings/payment" className="w-full border border-[rgba(184,154,105,0.4)] text-[#b89b6b] text-sm font-medium py-3 rounded-xl hover:bg-[#f4ebd0] transition-colors text-center">
                  Make Payment
                </Link>
                {booking.status === 'Pending' || booking.status === 'Upcoming' ? (
                  <button onClick={async () => {
                    if (!confirm('Cancel this booking?')) return;
                    try { await UserService.cancelBooking(bId); refresh(); } catch(e) {}
                  }} className="w-full text-center text-red-400 text-sm hover:text-red-600 transition-colors py-2 border border-red-200 rounded-xl">
                    Cancel Booking
                  </button>
                ) : null}
                <Link href="/reported-bookings" className="w-full text-center text-red-400 text-sm hover:text-red-600 transition-colors py-2">
                  Report Issue
                </Link>
              </div>
            </div>
            <div className="bg-[#f4ebd0] rounded-2xl border border-[rgba(184,154,105,0.2)] p-5">
              <p className="text-[#b89b6b] text-xs uppercase tracking-wider mb-3">Next Steps</p>
              {[['✓','Deposit paid',true],['○','Site visit',false],['○','Menu selection',false],['○','Final payment',false]].map(([icon,text,done]) => (
                <p key={text} className={`text-sm flex items-center gap-2 mb-2 ${done?'text-black/30 line-through':'text-[#1a1a1a]'}`}>
                  <span>{icon}</span>{text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
