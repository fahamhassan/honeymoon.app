'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';

const LOGS = Array.from({length:30},(_,i) => ({
  id:`TXN${String(i+1).padStart(6,'0')}`, user:['Sarah J.','Mohammed A.','Priya S.','James W.','Fatima H.'][i%5],
  vendor:['Al Habtoor Palace','Studio Lumière','Glamour Touch','Emirates Floral'][i%4],
  amount:`AED ${(5000+i*1500).toLocaleString()}`, date:`${String((i%28)+1).padStart(2,'0')}/01/2025`,
  method:['Card','Apple Pay','Bank Transfer'][i%3], status:i%6===0?'Failed':i%4===0?'Refunded':'Success',
}));

const StatusBadge = ({s}) => {
  const m = {Success:'text-green-700 bg-green-100',Failed:'text-red-700 bg-red-100',Refunded:'text-orange-700 bg-orange-100'};
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m[s]}`}>{s}</span>;
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

export default function PaymentLogsPage() {
  const { items: payments, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getPaymentLogs, {});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const filtered = LOGS.filter(l => (filter==='All'||l.status===filter) && (l.user.toLowerCase().includes(search.toLowerCase())||l.id.includes(search)));
  return (
    <>
    <div>
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Payment Logs</h1>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 flex-1 max-w-64 bg-[#faf8f4]">
            <span className="text-gray-400">🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="bg-transparent text-sm outline-none flex-1" /></div>
          {['All','Success','Failed','Refunded'].map(s => <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter===s?'bg-[#174a37] text-white':'bg-[#f4ebd0] text-gray-600 hover:bg-[#e8dfc5]'}`}>{s}</button>)}
        </div>
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['Transaction ID','User','Vendor','Amount','Method','Date','Status','Details'].map(h => <th key={h} className="text-left py-3 px-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-3 font-mono text-xs text-gray-500">{l.id}</td>
                <td className="py-3.5 px-3 font-medium text-gray-800">{l.user}</td>
                <td className="py-3.5 px-3 text-gray-500 text-xs">{l.vendor}</td>
                <td className="py-3.5 px-3 font-medium text-[#1a1a1a]">{l.amount}</td>
                <td className="py-3.5 px-3 text-gray-500">{l.method}</td>
                <td className="py-3.5 px-3 text-gray-400 text-xs">{l.date}</td>
                <td className="py-3.5 px-3"><StatusBadge s={l.status} /></td>
                <td className="py-3.5 px-3"><Link href={`/dashboard/payment-logs/${l.id}`} className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
    <Pagination items={payments} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
