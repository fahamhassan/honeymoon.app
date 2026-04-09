'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const STANDARD = Array.from({length:20},(_,i)=>({
  id:String(i+1).padStart(2,'0'), bookingId:'#12345678',
  user:'User ABC', company:'Company ABC', date:'mm/dd/yyyy',
  amount:'$20', paymentStatus:i%3===0?'-':i%3===1?'Unpaid':'Paid',
  status:['Pending','Rejected','Upcoming','Completed'][i%4],
}));
const CUSTOM = Array.from({length:12},(_,i)=>({
  id:String(i+1).padStart(2,'0'), bookingId:'#12345678',
  user:'User ABC', company:'Company ABC', date:'mm/dd/yyyy',
  amount:'$20', paymentStatus:i%2===0?'-':'Paid',
  status:['Requested','Pending','Upcoming','Completed'][i%4],
}));

const statusColor={Pending:'text-amber-600',Rejected:'text-red-600',Upcoming:'text-blue-600',Completed:'text-green-600',Requested:'text-blue-600'};


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

export default function AdminBookingsPage(){
  const [status, setStatus] = useState('');
  const { items: bookings, total, loading, refresh, hasMore, nextPage} = usePaginated(AdminService.getBookings, { status });
  const [tab,setTab]=useState('standard');
  const [show,setShow]=useState('5');
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);

  const list=tab==='standard'?STANDARD:CUSTOM;
  const filtered=list.filter(b=>b.bookingId.includes(search)||b.user.toLowerCase().includes(search.toLowerCase()));
  const perPage=parseInt(show);
  const paged=filtered.slice((page-1)*perPage,page*perPage);
  const totalPages=Math.ceil(filtered.length/perPage);
  const cols=tab==='standard'
    ?['Sr. No.','Booking ID','User','Company','Booking Date','Amount','Payment Status','Status','Action']
    :['Sr. No.','Booking ID','User','Company','Booking Date','Amount','Payment Status','Status','Action'];

  return(
    <>
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Booking Management</h1>
        <div className="flex rounded-full border border-[rgba(23,74,55,0.3)] overflow-hidden">
          <button onClick={()=>{setTab('standard');setPage(1);}} className={`px-5 py-2.5 text-sm font-medium transition-colors ${tab==='standard'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#f4ebd0]'}`}>Standard Booking</button>
          <button onClick={()=>{setTab('custom');setPage(1);}} className={`px-5 py-2.5 text-sm font-medium transition-colors ${tab==='custom'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#f4ebd0]'}`}>Custom Booking</button>
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
            <button className="bg-[#174a37] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#1a5c45] transition-colors">Export To Excel</button>
            <button className="border border-[#174a37] text-[#174a37] text-xs px-4 py-2 rounded-lg hover:bg-[#f4ebd0] transition-colors">Export To PDF</button>
            <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-52 bg-[#faf8f4]">
              <span className="text-gray-400">🔍</span>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="bg-transparent text-sm outline-none flex-1"/>
            </div>
            <button className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-400 text-sm">⊞</button>
          </div>
        </div>
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {cols.map(h=><th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.map(b=>(
              <tr key={b.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-400 text-xs">{b.id}</td>
                <td className="py-3.5 px-3 font-mono text-xs text-gray-600">{b.bookingId}</td>
                <td className="py-3.5 px-3 text-gray-700">{b.user}</td>
                <td className="py-3.5 px-3 text-gray-500">{b.company}</td>
                <td className="py-3.5 px-3 text-gray-500">{b.date}</td>
                <td className="py-3.5 px-3 text-gray-700">{b.amount}</td>
                <td className="py-3.5 px-3 text-gray-500">{b.paymentStatus}</td>
                <td className="py-3.5 px-3"><span className={`text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span></td>
                <td className="py-3.5 px-3">
                  <Link href={tab==='standard'?`/dashboard/bookings/${b.id}`:`/dashboard/bookings/custom/${b.id}`}
                    className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing {(page-1)*perPage+1} to {Math.min(page*perPage,filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] disabled:opacity-40 transition-colors">Previous</button>
            {Array.from({length:Math.min(3,totalPages)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium ${page===p?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#f4ebd0]'} transition-colors`}>{p}</button>
            ))}
            {totalPages>3&&<span className="text-gray-400">|</span>}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
    <Pagination items={bookings} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
