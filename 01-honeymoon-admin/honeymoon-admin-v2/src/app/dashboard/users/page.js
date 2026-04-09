'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';

const MOCK = Array.from({ length: 25 }, (_, i) => ({
  id: `0${i+1}`, name: ['Sarah Johnson','Mohammed Al-Rashid','Priya Sharma','James Wilson','Fatima Al-Hassan','Chen Wei','Amelia Roberts','Khalid Al-Farsi'][i%8],
  email: `user${i+1}@example.com`, date: `${String((i%28)+1).padStart(2,'0')}/01/2025`, status: i%3===0?'inactive':'active',
}));

/* ---------- Reusable modal primitives ---------- */
function ConfirmModal({ message, onYes, onNo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[420px] text-center relative">
        <button onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm">✕</button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">⚠</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Please Confirm</h3>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        <div className="flex gap-4">
          <button onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ message, onOk }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[380px] text-center relative">
        <button onClick={onOk} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Successful</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <button onClick={onOk} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Ok</button>
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

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { items: users, total, loading, refresh, hasMore, nextPage} = usePaginated(AdminService.getUsers, { search, status });
  const [data, setData] = useState(MOCK);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [confirm, setConfirm] = useState(null); // {user, action}
  const [success, setSuccess] = useState('');
  const [actionMenu, setActionMenu] = useState(null);

  const filtered = data.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page-1)*perPage, page*perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  function handleToggle(user) {
    setActionMenu(null);
    setConfirm({ user, action: user.status === 'active' ? 'deactivate' : 'activate' });
  }

  async function doToggle() {
    const { user } = confirm;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await AdminService.updateUserStatus(user.id, newStatus);
      refresh();
    } catch(e) { /* fallback local update */ }
    setData(p => p.map(u => u.id === user.id ? {...u, status: newStatus} : u));
    setConfirm(null);
    setSuccess(`User has been ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`);
  }

  const StatusBadge = ({ s }) => (
    <span className={`text-xs px-3 py-1 rounded-full font-medium ${s==='active'?'text-green-700 bg-green-100':'text-gray-400'}`}>
      {s==='active'?'Active':'Inactive'}
    </span>
  );

  return (
    <>
    <div>
      {confirm && <ConfirmModal message="Are You Sure You Want To Active/Inactive User" onYes={doToggle} onNo={() => setConfirm(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">User Management</h1>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none">
              <option>5</option><option>10</option><option>25</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
              <span className="text-gray-400 text-sm">🔍</span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..."
                className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
            </div>
            <button className="border border-gray-200 rounded-xl px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors text-sm">⊞</button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID','User Name','Email Address','Registration Date','Status','Action'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 text-gray-600 text-sm">{u.id}</td>
                <td className="py-3.5 px-3 font-medium text-gray-800">{u.name}</td>
                <td className="py-3.5 px-3 text-gray-500">{u.email}</td>
                <td className="py-3.5 px-3 text-gray-500">{u.date}</td>
                <td className="py-3.5 px-3"><StatusBadge s={u.status} /></td>
                <td className="py-3.5 px-3 relative">
                  <button onClick={() => setActionMenu(actionMenu===u.id?null:u.id)} className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500">⋮</button>
                  {actionMenu === u.id && (
                    <div className="absolute right-8 top-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 w-36">
                      <Link href={`/dashboard/users/${u.id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f4ebd0] transition-colors">
                        <span>👁</span> View
                      </Link>
                      <button onClick={() => handleToggle(u)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f4ebd0] transition-colors">
                        <span className={`w-8 h-4 rounded-full flex-shrink-0 flex items-center px-0.5 transition-colors ${u.status==='active'?'bg-[#174a37] justify-end':'bg-gray-300 justify-start'}`}>
                          <span className="w-3 h-3 bg-white rounded-full shadow" />
                        </span>
                        {u.status==='active'?'Inactive':'Active'}
                      </button>
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
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] disabled:opacity-40 transition-colors">Previous</button>
            {Array.from({length:totalPages},(_, i) => i+1).slice(0,3).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page===p?'bg-[#174a37] text-white':'text-gray-500 hover:bg-[#f4ebd0]'}`}>{p}</button>
            ))}
            {totalPages > 3 && <span className="text-gray-400">|</span>}
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-[#f4ebd0] disabled:opacity-40 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
    <Pagination items={users} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
