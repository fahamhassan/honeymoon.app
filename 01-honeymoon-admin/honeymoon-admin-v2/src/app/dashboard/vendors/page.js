'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal, ApproveVendorModal, RejectVendorModal } from '@/components/Modals';

const VENDORS = Array.from({length:28},(_,i)=>({
  id:String(i+1).padStart(2,'0'), name:['Abc','Xyz'][i%2], company:['Abc','Xyz'][i%2],
  email:'abc@example.com', date:'01/12/2025',
  status:i%3===0?'Inactive':i%5===0?'Pending':'Active',
}));

const statusColor = { Active:'text-green-600', Inactive:'text-gray-400', Pending:'text-amber-600' };


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

export default function AdminVendorsPage(){
  const [search, setSearch] = useState('');
  const { items: vendors, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getVendors, { search });
  const [data,setData]=useState(VENDORS);
  const [show,setShow]=useState('5');
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');
  const [actionMenu,setActionMenu]=useState(null);
  const [page,setPage]=useState(1);

  const filtered=data.filter(v=>v.name.toLowerCase().includes(search.toLowerCase())||v.email.includes(search));
  const perPage=parseInt(show);
  const paged=filtered.slice((page-1)*perPage,page*perPage);
  const totalPages=Math.ceil(filtered.length/perPage);

  function handleAction(v,type){setActionMenu(null);setModal({type,vendor:v});}
  function doApprove(){setData(p=>p.map(v=>v.id===modal.vendor.id?{...v,status:'Active'}:v));setModal(null);setSuccess('Vendor approved successfully.');}
  function doReject(){setData(p=>p.map(v=>v.id===modal.vendor.id?{...v,status:'Inactive'}:v));setModal(null);setSuccess('Vendor rejected.');}
  function doToggle(){
    const newStatus=modal.vendor.status==='Active'?'Inactive':'Active';
    setData(p=>p.map(v=>v.id===modal.vendor.id?{...v,status:newStatus}:v));
    setModal(null);setSuccess(`Vendor status updated to ${newStatus}.`);
  }

  return(
    <>
    <div>
      {modal?.type==='approve'&&<ApproveVendorModal vendor={modal.vendor} onYes={doApprove} onNo={()=>setModal(null)}/>}
      {modal?.type==='reject'&&<RejectVendorModal onYes={doReject} onNo={()=>setModal(null)}/>}
      {modal?.type==='toggle'&&<ConfirmModal message="Are You Sure You Want To Active/Inactive This Vendor?" onYes={doToggle} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Vendor Management</h1>
        <Link href="/dashboard/vendors/requests" className="bg-[#174a37] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
          Requests ↗
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select value={show} onChange={e=>{setShow(e.target.value);setPage(1);}} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option><option>25</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
              <span className="text-gray-400">🔍</span>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search..." className="bg-transparent text-sm outline-none flex-1"/>
            </div>
            <button className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-400 text-sm">⊞</button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID','User Name','Company Name','Email Address','Registration Date','Status','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(v=>(
              <tr key={v.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-600">{v.id}</td>
                <td className="py-3.5 px-3 font-medium text-gray-800">{v.name}</td>
                <td className="py-3.5 px-3 text-gray-600">{v.company}</td>
                <td className="py-3.5 px-3 text-gray-500">{v.email}</td>
                <td className="py-3.5 px-3 text-gray-500">{v.date}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-xs font-medium ${statusColor[v.status]}`}>{v.status}</span>
                </td>
                <td className="py-3.5 px-3 relative">
                  <button onClick={()=>setActionMenu(actionMenu===v.id?null:v.id)} className="p-1 rounded hover:bg-gray-100 text-gray-500">⋮</button>
                  {actionMenu===v.id&&(
                    <div className="absolute right-8 top-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 w-36">
                      <Link href={`/dashboard/vendors/${v.id}`} onClick={()=>setActionMenu(null)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f4ebd0] transition-colors">
                        👁 View
                      </Link>
                      {v.status==='Pending'&&<>
                        <button onClick={()=>handleAction(v,'approve')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors">✓ Approve</button>
                        <button onClick={()=>handleAction(v,'reject')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">✕ Reject</button>
                      </>}
                      {v.status!=='Pending'&&(
                        <button onClick={()=>handleAction(v,'toggle')} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f4ebd0] transition-colors">
                          <span className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${v.status==='Active'?'bg-[#174a37] justify-end':'bg-gray-300 justify-start'}`}>
                            <span className="w-3 h-3 bg-white rounded-full shadow"/>
                          </span>
                          {v.status==='Active'?'Inactive':'Active'}
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Showing {(page-1)*perPage+1} to {Math.min(page*perPage,filtered.length)} from {filtered.length} entries</p>
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
    <Pagination items={vendors} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
