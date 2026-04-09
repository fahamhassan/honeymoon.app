'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';
const IMG1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
export default function PayoutDetailPage({ params }) {
  const payoutId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getPayout, payoutId);
  const payout = data?.payout || {};
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('Pending');
  return (
    <div className="max-w-2xl">
      {modal && <ConfirmModal message="Approve and process this payout?" onYes={() => { setStatus('Processed'); setModal(false); setSuccess('Payout approved and processed.'); }} onNo={() => setModal(false)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/dashboard/payouts" className="hover:text-[#174a37]">Payouts Management</Link>
        <span>/</span><span className="text-gray-800">Payout Detail</span>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-baskerville text-2xl text-[#1a1a1a]">Payout Details</h1>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${status==='Processed'?'text-green-700 bg-green-100':'text-amber-700 bg-amber-100'}`}>{status}</span>
        </div>
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-xl overflow-hidden"><img src={IMG1} alt="" className="w-full h-full object-cover"/></div>
          <div><p className="font-baskerville text-xl text-[#1a1a1a]">Al Habtoor Palace</p><p className="text-gray-400 text-sm">Venue · Dubai</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[['Payout ID',`PO-${params.id}`],['Amount','AED 38,250'],['Commission (10%)','AED 4,250'],['Net Payout','AED 34,000'],['Period','Jan 1–31, 2025'],['Requested','Feb 5, 2025'],['Bookings Included','3'],['Bank Account','Emirates NBD •• 4567']].map(([l,v])=>(
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-1">{v}</p>
            </div>
          ))}
        </div>
        {status === 'Pending' && (
          <button onClick={() => setModal(true)} className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">
            Approve & Process Payout
          </button>
        )}
        {status === 'Processed' && (
          <div className="text-center py-3 text-green-600 font-medium text-sm">✓ This payout has been processed</div>
        )}
      </div>
    </div>
  );
}
