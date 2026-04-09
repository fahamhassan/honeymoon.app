'use client';
import { usePaginated } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';

const REQUESTS = Array.from({length:12},(_,i)=>({
  id:String(i+1).padStart(2,'0'),
  requestId:'#12345678',
  user:'User ABC',
  date:'mm/dd/yyyy',
  budget:'20 AED – 30 AED',
  status:i%3===0?'Requested':i%3===1?'Pending':'Rejected',
}));

const statusColor = { Requested:'text-blue-600', Pending:'text-amber-600', Rejected:'text-red-600' };


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

export default function BookingRequestsPage(){
  const { items: requests, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getBookingRequests, {});
  const [show, setShow] = useState('5');
  const [search, setSearch] = useState('');
  const filtered = REQUESTS.filter(r => r.requestId.includes(search) || r.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Booking Request</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e=>setShow(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option>
            </select>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
            <span className="text-gray-400">🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              className="bg-transparent text-sm outline-none flex-1"/>
          </div>
        </div>

        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Sr. No.','Request ID','User Name','Request Date','Budget Range','Status','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0,parseInt(show)).map(r=>(
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-400 text-xs">{r.id}</td>
                <td className="py-3.5 px-3 font-mono text-xs text-gray-600">{r.requestId}</td>
                <td className="py-3.5 px-3 text-gray-700">{r.user}</td>
                <td className="py-3.5 px-3 text-gray-500">{r.date}</td>
                <td className="py-3.5 px-3 text-gray-500 text-xs">{r.budget}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                </td>
                <td className="py-3.5 px-3">
                  <Link href={`/dashboard/bookings/custom/${r.id}`}
                    className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to {Math.min(parseInt(show),filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] transition-colors text-gray-500">Previous</button>
            {[1,2,3].map(p=><button key={p} className={`w-9 h-9 rounded-xl text-sm ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#f4ebd0]'} transition-colors`}>{p}</button>)}
            <span className="text-gray-400">|</span>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] transition-colors text-gray-500">Next</button>
          </div>
        </div>
      </div>
    </div>
    <Pagination items={requests} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
