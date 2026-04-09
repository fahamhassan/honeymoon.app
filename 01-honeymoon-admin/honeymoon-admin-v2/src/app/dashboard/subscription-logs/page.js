'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
const LOGS = Array.from({length:20},(_,i) => ({
  id:i+1, vendor:['Al Habtoor Palace','Studio Lumière','Glamour Touch','Emirates Floral','Saveur Catering'][i%5],
  plan:['Basic','Silver','Gold','Platinum'][i%4], startDate:`${String((i%28)+1).padStart(2,'0')}/01/2025`,
  endDate:`${String((i%28)+1).padStart(2,'0')}/02/2025`, amount:`AED ${[199,349,499,799][i%4]}`,
  status:i%4===0?'Expired':i%5===0?'Cancelled':'Active',
}));
const StatusBadge = ({s}) => {
  const m = {Active:'text-green-700 bg-green-100',Expired:'text-gray-500 bg-gray-100',Cancelled:'text-red-700 bg-red-100'};
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

export default function SubscriptionLogsPage() {
  const { items: logs, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getSubscriptionLogs, {});
  return (
    <>
    <div>
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Subscription Logs</h1>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['#','Vendor','Plan','Start','End','Amount','Status'].map(h => <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {(logs.length ? logs : LOGS).map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8]">
                <td className="py-3.5 px-5 text-gray-400 text-xs">{l.id}</td>
                <td className="py-3.5 px-5 font-medium text-gray-800">{l.vendor}</td>
                <td className="py-3.5 px-5 text-gray-600">{l.plan}</td>
                <td className="py-3.5 px-5 text-gray-400 text-xs">{l.startDate}</td>
                <td className="py-3.5 px-5 text-gray-400 text-xs">{l.endDate}</td>
                <td className="py-3.5 px-5 font-medium text-[#1a1a1a]">{l.amount}</td>
                <td className="py-3.5 px-5"><StatusBadge s={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
    <Pagination items={logs} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
