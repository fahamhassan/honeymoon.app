'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

function EditReferralModal({ config, onClose, onSave }) {
  const [form, setForm] = useState({ ...config });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[480px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-6">Edit Referral Settings</h3>
        {[['Referrer Reward (AED)','referrerReward'],['Referee Reward (AED)','refereeReward'],['Max Referrals/User','maxReferrals'],['Expiry Days','expiryDays']].map(([label,key]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
          </div>
        ))}
        <div className="flex gap-3 mt-2">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Save</button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const REFERRALS = Array.from({length:12},(_,i) => ({
  id:i+1, referrer:['Sarah J.','Mohammed A.','Priya S.','James W.'][i%4],
  referee:['Tom B.','Lisa K.','Ahmed M.','Emma C.'][i%4],
  date:`${String((i%28)+1).padStart(2,'0')}/01/2025`,
  status:i%3===0?'Pending':i%3===1?'Completed':'Expired',
  reward:`AED ${i%3===1?'100':'0'}`,
}));

export default function ReferralPage() {
  const { data, loading, refresh } = useApi(AdminService.getReferralConfig);
  const { data: logsData } = useApi(AdminService.getLoyaltyLogs);
  const config = data?.config || {};
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');

  return (
    <div>
      {editing && <EditReferralModal config={config} onClose={() => setEditing(false)} onSave={c => { setConfig(c); setEditing(false); setSuccess('Referral settings updated.'); }} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Referral Program Management</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[['Total Referrals','248'],['Successful','186'],['Pending','42'],['Rewards Paid','AED 18,600']].map(([l,v]) => (
          <div key={l} className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
            <p className="font-baskerville text-2xl text-[#1a1a1a] mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-baskerville text-xl text-[#1a1a1a]">Program Configuration</h2>
          <button onClick={() => setEditing(true)} className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">Edit Settings</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[['Referrer Reward',`AED ${config.referrerReward}`],['Referee Reward',`AED ${config.refereeReward}`],['Max Referrals',config.maxReferrals],['Expiry',`${config.expiryDays} days`]].map(([l,v]) => (
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="font-baskerville text-xl text-[#174a37] mt-1">{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-baskerville text-xl text-[#1a1a1a]">Referral History</h2></div>
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['#','Referrer','Referee','Date','Status','Reward'].map(h => <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {(logsData?.logs || REFERRALS).map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-[#fafaf8]">
                <td className="py-3 px-5 text-gray-400 text-xs">{r.id}</td>
                <td className="py-3 px-5 font-medium text-gray-800">{r.referrer}</td>
                <td className="py-3 px-5 text-gray-500">{r.referee}</td>
                <td className="py-3 px-5 text-gray-400 text-xs">{r.date}</td>
                <td className="py-3 px-5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.status==='Completed'?'text-green-700 bg-green-100':r.status==='Pending'?'text-amber-700 bg-amber-100':'text-gray-500 bg-gray-100'}`}>{r.status}</span></td>
                <td className="py-3 px-5 font-medium text-[#174a37]">{r.reward}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
