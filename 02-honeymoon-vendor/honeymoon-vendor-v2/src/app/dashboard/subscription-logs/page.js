'use client';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import Link from 'next/link';
const LOGS=[
  {id:1,plan:'Gold Plan',start:'01/01/2025',end:'01/02/2025',amount:'AED 499',status:'Active'},
  {id:2,plan:'Silver Plan',start:'01/12/2024',end:'01/01/2025',amount:'AED 349',status:'Expired'},
  {id:3,plan:'Basic Plan',start:'01/11/2024',end:'01/12/2024',amount:'AED 199',status:'Expired'},
];

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

export default function VendorSubscriptionLogsPage(){
  const { items: logs, loading, refresh, total, hasMore, nextPage} = usePaginated(VendorService.getSubscriptionLogs, {});
  const isEmpty=false;
  return(
    <>
    <div>
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Subscription Logs</h1>
      {isEmpty?(
        <div className="bg-white rounded-2xl p-16 text-center shadow-[0_0_20px_rgba(0,0,0,0.05)]">
          <div className="text-5xl mb-4 opacity-20">📄</div>
          <p className="text-gray-400 text-sm mb-4">No subscription logs found</p>
          <Link href="/dashboard/subscription" className="text-[#b89b6b] hover:underline text-sm">View Plans →</Link>
        </div>
      ):(
        <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">{['#','Plan','Start Date','End Date','Amount','Status'].map(h=><th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs">{h}</th>)}</tr></thead>
            <tbody>
              {(logs.length ? logs : LOGS).map(l=>(
                <tr key={l.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                  <td className="py-3.5 px-5 text-gray-400 text-xs">{l.id}</td>
                  <td className="py-3.5 px-5 font-medium text-gray-800">{l.plan}</td>
                  <td className="py-3.5 px-5 text-gray-500">{l.start}</td>
                  <td className="py-3.5 px-5 text-gray-500">{l.end}</td>
                  <td className="py-3.5 px-5 font-medium text-[#174a37]">{l.amount}</td>
                  <td className="py-3.5 px-5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${l.status==='Active'?'text-green-700 bg-green-100':'text-gray-500 bg-gray-100'}`}>{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
    </div>
    <Pagination items={logs} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
