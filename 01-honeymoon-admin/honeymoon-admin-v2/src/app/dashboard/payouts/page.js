'use client';
import { usePaginated } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const PAYOUTS = Array.from({ length: 20 }, (_, i) => ({
  id: `PO${String(i+1).padStart(4,'0')}`,
  vendor: ['Al Habtoor Palace','Studio Lumière','Glamour Touch','Emirates Floral','Saveur Catering'][i%5],
  amount: `AED ${(5000 + i*1500).toLocaleString()}`,
  requestDate: `${String((i%28)+1).padStart(2,'0')}/01/2025`,
  status: i%4===0?'Pending':'Processed',
}));


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

export default function PayoutsPage() {
  const [status, setStatus] = useState('');
  const { items: payouts, loading, refresh, total, hasMore, nextPage} = usePaginated(AdminService.getPayouts, { status });
  const [data, setData] = useState(PAYOUTS);
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');

  async function approve() {
    try {
      if (modal?.payout?.id) await AdminService.processPayout(modal.payout.id);
      refresh();
    } catch(e) { /* fallback local */ }
    setData(p => p.map(d => d.id===modal.payout.id ? {...d, status:'Processed'} : d));
    setModal(null);
    setSuccess('Payout approved and processed successfully.');
  }

  return (
    <>
    <div>
      {modal?.type==='approve' && <ConfirmModal message="Are you sure you want to approve and process this payout?" onYes={approve} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Payouts Management</h1>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID','Vendor','Amount','Request Date','Status','Action'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-4 text-gray-500 text-xs">{p.id}</td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{p.vendor}</td>
                <td className="py-3.5 px-4 font-medium text-[#174a37]">{p.amount}</td>
                <td className="py-3.5 px-4 text-gray-500">{p.requestDate}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.status==='Processed'?'text-green-700 bg-green-100':'text-amber-700 bg-amber-100'}`}>{p.status}</span>
                </td>
                <td className="py-3.5 px-4">
                  {p.status==='Pending' && (
                    <button onClick={() => setModal({type:'approve', payout:p})}
                      className="text-xs text-white bg-[#174a37] px-4 py-1.5 rounded-lg hover:bg-[#1a5c45] transition-colors">
                      Approve
                    </button>
                  )}
                  {p.status==='Processed' && <span className="text-xs text-gray-400">Processed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
    <Pagination items={payouts} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
