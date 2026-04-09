'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgVenue2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgVenue3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";

const allBookings = [
  { id: 1, vendor: 'Al Habtoor Palace', type: 'Venue', date: 'Jun 15, 2026', amount: 45000, status: 'Upcoming', paid: true, img: imgVenue1, rating: 4.9 },
  { id: 2, vendor: 'Studio Lumière', type: 'Photography', date: 'Jun 15, 2026', amount: 12000, status: 'Upcoming', paid: false, img: imgVenue2, rating: 4.8 },
  { id: 3, vendor: 'Glamour Touch', type: 'Beauty', date: 'Jun 14, 2026', amount: 4500, status: 'Completed', paid: true, img: imgVenue3, rating: 4.7 },
  { id: 4, vendor: 'Emirates Floral', type: 'Decoration', date: 'Feb 10, 2026', amount: 18000, status: 'Completed', paid: false, img: imgVenue1, rating: 4.6 },
  { id: 5, vendor: 'Saveur Catering', type: 'Catering', date: 'Jan 5, 2026', amount: 25000, status: 'Rejected', paid: false, img: imgVenue2, rating: 4.5 },
  { id: 6, vendor: 'Bloom Decor', type: 'Decoration', date: 'Dec 20, 2025', amount: 8000, status: 'Pending', paid: false, img: imgVenue3, rating: 4.4 },
  { id: 7, vendor: 'Royal Events', type: 'Venue', date: 'Jun 15, 2026', amount: 55000, status: 'Custom Booking', paid: true, img: imgVenue1, rating: 4.9 },
];

const statusColors = {
  'Upcoming': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-green-100 text-green-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Pending': 'bg-amber-100 text-amber-700',
  'Custom Booking': 'bg-purple-100 text-purple-700',
};

function RejectionModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[480px] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-baskerville text-[24px] text-[#1a1a1a]">Rejection Reason</h2>
          <button onClick={onClose} className="text-black/30 hover:text-black/60 text-xl">✕</button>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 leading-6">
            Unfortunately, we are unable to accommodate your booking request for the requested date. The venue is already fully booked for June 15, 2026. We apologize for any inconvenience and encourage you to select an alternative date or venue.
          </p>
        </div>
        <button onClick={onClose} className="w-full bg-[#174a37] text-white font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors">
          Understood
        </button>
      </div>
    </div>
  );
}


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

export default function MyBookingsPage() {
  const [tab, setTab] = useState('standard');
  const [status, setStatus] = useState('');
  const { items: bookings, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getBookings, { type: tab, status });
  const [activeTab, setActiveTab] = useState('All');
  const [showRejection, setShowRejection] = useState(false);

  const tabs = ['All', 'Upcoming', 'Completed', 'Rejected', 'Pending', 'Custom Booking'];

  const filtered = activeTab === 'All' ? allBookings : allBookings.filter(b => b.status === activeTab);

  return (
    <>
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {showRejection && <RejectionModal onClose={() => setShowRejection(false)} />}
      <LoggedInNav />

      <main className="flex-1 max-w-7xl mx-auto px-8 py-10 w-full">
        <h1 className="font-baskerville text-[40px] text-[#b89b6b] mb-8">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-[#174a37] text-white' : 'bg-white border border-[rgba(184,154,105,0.3)] text-black/60 hover:border-[#b89b6b]'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="divide-y divide-[rgba(184,154,105,0.08)]">
            {filtered.map(b => (
              <div key={b.id} className="flex items-center gap-5 p-5 hover:bg-[#faf7f0] transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={b.img} alt={b.vendor} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-medium text-[#1a1a1a]">{b.vendor}</p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                    {b.paid && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">Paid</span>}
                    {b.status !== 'Rejected' && !b.paid && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Unpaid</span>}
                  </div>
                  <p className="text-black/40 text-sm mt-1">{b.type} · {b.date}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <img src={imgStar} alt="★" className="w-3 h-3 object-contain" />
                    <span className="text-xs text-black/50">{b.rating}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-baskerville text-[22px] text-[#1a1a1a]">AED {b.amount.toLocaleString()}</p>
                  <div className="flex gap-2 mt-2 justify-end flex-wrap">
                    {b.status === 'Rejected' && (
                      <button onClick={() => setShowRejection(true)}
                        className="text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                        View Reason
                      </button>
                    )}
                    {b.status === 'Upcoming' && !b.paid && (
                      <Link href="/my-bookings/payment"
                        className="text-xs text-white bg-[#174a37] px-3 py-1.5 rounded-lg hover:bg-[#1a5c45] transition-colors">
                        Pay Now
                      </Link>
                    )}
                    <Link href={`/my-bookings/${b.id}`}
                      className="text-xs text-[#b89b6b] border border-[rgba(184,154,105,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
    <Pagination items={bookings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
