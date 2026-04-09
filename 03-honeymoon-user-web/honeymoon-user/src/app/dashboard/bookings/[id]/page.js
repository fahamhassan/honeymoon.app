'use client';
import { useApi } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import Link from 'next/link';

const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgStar = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

export default function BookingDetailPage({ params }) {
  const bId = params?.id || '';
  const { data, loading, refresh } = useApi(UserService.getBooking, bId);
  const booking = data?.booking || {};
  return (
    <div className="max-w-[900px]">
      <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
        <Link href="/dashboard/bookings" className="hover:text-[#174a37] transition-colors">Bookings</Link>
        <span>/</span>
        <span className="text-[#1a1a1a]">Al Habtoor Palace</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <div className="h-48 overflow-hidden">
              <img src={imgRectangle3883} alt="Al Habtoor Palace" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[#b89b6b] text-xs uppercase tracking-wider">Venue</span>
                  <h1 className="font-baskerville text-[30px] text-[#1a1a1a] mt-0.5">Al Habtoor Palace</h1>
                  <p className="text-black/40 text-sm mt-1">📍 Dubai Marina</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Booking Reference', value: 'BK-2025-0001' },
                { label: 'Package', value: 'Gold Package' },
                { label: 'Wedding Date', value: 'June 15, 2026' },
                { label: 'Guest Count', value: '~200 guests' },
                { label: 'Booked On', value: 'January 12, 2025' },
                { label: 'Event Manager', value: 'Laila Al Rashidi' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#f9f6ef] rounded-xl p-4">
                  <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-[#1a1a1a] font-medium text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment schedule */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Payment Schedule</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Deposit (25%)', amount: 15000, date: 'Jan 12, 2025', status: 'Paid' },
                { label: 'Second Payment (25%)', amount: 15000, date: 'Mar 15, 2025', status: 'Upcoming' },
                { label: 'Final Payment (50%)', amount: 30000, date: 'May 1, 2025', status: 'Scheduled' },
              ].map(p => (
                <div key={p.label} className="flex items-center justify-between py-3 border-b border-[rgba(184,154,105,0.08)] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{p.label}</p>
                    <p className="text-black/40 text-xs mt-0.5">Due: {p.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      p.status === 'Upcoming' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{p.status}</span>
                    <span className="font-baskerville text-[20px] text-[#1a1a1a]">AED {p.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-[rgba(184,154,105,0.15)]">
              <span className="font-medium text-[#1a1a1a]">Total</span>
              <span className="font-baskerville text-[24px] text-[#174a37]">AED 60,000</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <h3 className="font-baskerville text-[18px] text-[#1a1a1a] mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/chat"
                className="w-full bg-[#174a37] text-white text-sm font-medium py-3 rounded-[10px] hover:bg-[#1a5c45] transition-colors text-center">
                Message Venue
              </Link>
              <Link href="/dashboard/payments/checkout"
                className="w-full border border-[rgba(184,154,105,0.4)] text-[#b89b6b] text-sm font-medium py-3 rounded-[10px] hover:bg-[#f4ebd0] transition-colors text-center">
                Make Payment
              </Link>
              <button className="w-full text-black/40 text-sm hover:text-black/60 transition-colors py-2">
                Download Contract
              </button>
            </div>
          </div>

          <div className="bg-[#f4ebd0] rounded-2xl border border-[rgba(184,154,105,0.2)] p-5">
            <p className="text-[#b89b6b] text-xs uppercase tracking-wider mb-2">Next Steps</p>
            <div className="flex flex-col gap-2">
              {[
                { done: true, text: 'Deposit paid' },
                { done: false, text: 'Site visit scheduled' },
                { done: false, text: 'Menu selection' },
                { done: false, text: 'Final payment' },
              ].map(s => (
                <p key={s.text} className={`text-sm flex items-center gap-2 ${s.done ? 'text-black/30 line-through' : 'text-[#1a1a1a]'}`}>
                  <span>{s.done ? '✓' : '○'}</span> {s.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
