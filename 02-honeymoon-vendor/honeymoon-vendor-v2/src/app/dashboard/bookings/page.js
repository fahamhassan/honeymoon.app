'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { AcceptBookingModal, RejectBookingModal, ConfirmModal, SuccessModal } from '@/components/Modals';

const STANDARD = Array.from({length:12},(_,i)=>({
  id:`BK${String(i+1).padStart(4,'0')}`, user:'User ABC', date:'mm/dd/yyyy',
  amount:'200 AED', paymentStatus:i%2===0?'Paid':'Unpaid',
  status:i%3===0?'Upcoming':i%3===1?'Completed':'Pending',
}));
const CUSTOM = Array.from({length:8},(_,i)=>({
  id:`RQ${String(i+1).padStart(4,'0')}`, user:'User ABC', date:'mm/dd/yyyy',
  amount:'200 AED', paymentStatus:i%2===0?'Paid':'Unpaid',
  status:i%3===0?'Upcoming':i%3===1?'Completed':'Pending',
}));

const StatusBadge=({s})=>{
  const m={Upcoming:'text-blue-600',Completed:'text-green-600',Pending:'text-amber-600',Rejected:'text-red-600'};
  return <span className={`text-xs font-medium ${m[s]||'text-gray-500'}`}>{s}</span>;
};


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

export default function VendorBookingsPage(){
  const [tab, setTab] = useState('standard');
  const [status, setStatus] = useState('');
  const { items: bookings, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getBookings, { status, type: tab });
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');
  const [data,setData]=useState({standard:STANDARD,custom:CUSTOM});
  const [search,setSearch]=useState('');
  const [show,setShow]=useState('5');

  const list=tab==='standard'?data.standard:data.custom;
  const filtered=list.filter(b=>b.id.toLowerCase().includes(search.toLowerCase()));

  function doAccept(){
    setData(p=>({...p,[tab]:p[tab].map(b=>b.id===modal.booking.id?{...b,status:'Upcoming'}:b)}));
    setModal(null); setSuccess('Booking accepted.');
  }
  function doReject(){
    setData(p=>({...p,[tab]:p[tab].map(b=>b.id===modal.booking.id?{...b,status:'Rejected'}:b)}));
    setModal(null); setSuccess('Booking rejected.');
  }

  return (
    <>
    <div>
      {modal?.type==='accept'&&<AcceptBookingModal onYes={doAccept} onNo={()=>setModal(null)}/>}
      {modal?.type==='reject'&&<RejectBookingModal onYes={doReject} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Booking Management</h1>
        <div className="flex rounded-full border border-[rgba(23,74,55,0.3)] overflow-hidden">
          <button onClick={()=>setTab('standard')} className={`px-5 py-2 text-sm font-medium transition-colors ${tab==='standard'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#f4ebd0]'}`}>Standard Booking</button>
          <button onClick={()=>setTab('custom')} className={`px-5 py-2 text-sm font-medium transition-colors ${tab==='custom'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#f4ebd0]'}`}>Custom Booking</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e=>setShow(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option><option>25</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
              <span className="text-gray-400">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="bg-transparent text-sm outline-none flex-1"/>
            </div>
            {tab==='custom'&&(
              <Link href="/dashboard/bookings/requests" className="bg-[#174a37] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">Requests</Link>
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {(tab==='standard'
                ?['Sr. No.','Booking ID','User Name','Booking Date','Amount','Payment Status','Status','Action']
                :['Sr. No.','Request ID','User','Booking Date','Amount','Payment Status','Status','Action']
              ).map(h=><th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0,parseInt(show)).map((b,i)=>(
              <tr key={b.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-400 text-xs">{String(i+1).padStart(2,'0')}</td>
                <td className="py-3.5 px-3 font-mono text-xs text-gray-600">#{b.id}</td>
                <td className="py-3.5 px-3 text-gray-700">{b.user}</td>
                <td className="py-3.5 px-3 text-gray-500">{b.date}</td>
                <td className="py-3.5 px-3 text-gray-700">{b.amount}</td>
                <td className="py-3.5 px-3 text-gray-500">{b.paymentStatus}</td>
                <td className="py-3.5 px-3"><StatusBadge s={b.status}/></td>
                <td className="py-3.5 px-3">
                  <div className="flex gap-1.5">
                    <Link href={`/dashboard/bookings/${b.id}`} className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-2.5 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">View</Link>
                    {b.status==='Pending'&&<>
                      <button onClick={()=>setModal({type:'accept',booking:b})} className="text-xs text-green-600 border border-green-200 bg-green-50 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Accept</button>
                      <button onClick={()=>setModal({type:'reject',booking:b})} className="text-xs text-red-500 border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to {Math.min(parseInt(show),filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] transition-colors text-gray-500">Previous</button>
            <button className="w-9 h-9 rounded-xl text-sm font-medium bg-[#174a37] text-white">1</button>
            <button className="w-9 h-9 rounded-xl text-sm text-gray-500 hover:bg-[#f4ebd0] transition-colors">2</button>
            <span className="text-gray-400 text-sm">|</span>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] transition-colors text-gray-500">Next</button>
          </div>
        </div>
      </div>
    </div>
    <Pagination items={bookings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
