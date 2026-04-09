'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const AVATAR="https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";
const BOOKINGS=Array.from({length:8},(_,i)=>({
  id:String(i+1).padStart(2,'0'),bookingId:'#12345678',company:'Company ABC',
  date:'01/12/2025',amount:'$20',paymentStatus:i%3===0?'-':i%3===1?'Unpaid':'Paid',
  status:['Pending','Rejected','Upcoming','Completed'][i%4],
}));
const statusColor={Pending:'text-amber-600',Rejected:'text-red-600',Upcoming:'text-blue-600',Completed:'text-green-600'};

export default function AdminUserDetailPage({ params }) {
  const userId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getUser, userId);
  const user = data?.user || {};
  const bookings = data?.bookings || [];
  const [tab,setTab]=useState('standard');
  const [status,setStatus]=useState('Active');
  const [modal,setModal]=useState(false);
  const [success,setSuccess]=useState('');

  return(
    <div>
      {modal&&<ConfirmModal message="Are you sure you want to change this user's status?" onYes={async ()=>{
        const newStatus = status==='Active'?'Inactive':'Active';
        try { await AdminService.updateUserStatus(userId, newStatus); refresh(); } catch(e) {}
        setStatus(newStatus); setModal(false); setSuccess('User status updated successfully.');
      }} onNo={()=>setModal(false)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/users" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">User Profile</h1>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5">
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
            <div><p className="text-gray-400 text-xs">User Name:</p><p className="font-medium text-gray-800">{(user.firstName||'') + ' ' + (user.lastName||'')}</p></div>
            <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">{user.phone||'—'}</p></div>
            <div><p className="text-gray-400 text-xs">Gender:</p><p className="font-medium">{user.gender||'—'}</p></div>
            <div><p className="text-gray-400 text-xs">UAE Pass:</p><p className="font-medium">{user.uaePass||'—'}</p></div>
            <div><p className="text-gray-400 text-xs">Email:</p><p className="font-medium">{user.email||'—'}</p></div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[rgba(184,154,105,0.2)]">
              <img src={user.avatar || AVATAR} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Status: </span>
              <span className={`text-sm font-semibold ${status==='Active'?'text-green-600':'text-gray-400'}`}>{status}</span>
            </div>
            <button onClick={()=>setModal(true)}
              className={`text-xs px-4 py-2 rounded-full border transition-colors ${status==='Active'?'text-red-500 border-red-200 bg-red-50 hover:bg-red-100':'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'}`}>
              {status==='Active'?'Inactive':'Active'}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-baskerville text-xl text-[#1a1a1a]">Bookings</h2>
          <div className="flex rounded-full border border-[rgba(23,74,55,0.3)] overflow-hidden">
            <button onClick={()=>setTab('standard')} className={`px-4 py-2 text-xs font-medium transition-colors ${tab==='standard'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#f4ebd0]'}`}>Standard Booking</button>
            <button onClick={()=>setTab('custom')} className={`px-4 py-2 text-xs font-medium transition-colors ${tab==='custom'?'bg-[#174a37] text-white':'text-[#174a37] hover:bg-[#f4ebd0]'}`}>Custom Booking</button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"><option>5</option><option>10</option></select>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-52 bg-[#faf8f4]">
            <span className="text-gray-400">🔍</span>
            <input placeholder="Search..." className="bg-transparent text-sm outline-none flex-1"/>
          </div>
        </div>
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Sr. No.','Booking ID','Company','Booking Date','Amount','Payment Status','Status'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(bookings.length ? bookings : BOOKINGS).map(b=>(
              <tr key={b.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3 px-3 text-gray-400 text-xs">{b.id}</td>
                <td className="py-3 px-3 font-mono text-xs text-gray-600">{b.bookingId}</td>
                <td className="py-3 px-3 text-gray-600">{b.company}</td>
                <td className="py-3 px-3 text-gray-500">{b.date}</td>
                <td className="py-3 px-3 text-gray-700">{b.amount}</td>
                <td className="py-3 px-3 text-gray-500">{b.paymentStatus}</td>
                <td className="py-3 px-3"><span className={`text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing 1 to 5 of 20 entries</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-500">Previous</button>
            {[1,2,3].map(p=><button key={p} className={`w-9 h-9 rounded-xl text-sm ${p===1?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#f4ebd0]'}`}>{p}</button>)}
            <span className="text-gray-400 text-sm self-center">|</span>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-500">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
