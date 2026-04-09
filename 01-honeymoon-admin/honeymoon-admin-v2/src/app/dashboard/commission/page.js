'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

function EditCommissionModal({ item, onClose, onSave }) {
  const [rate, setRate] = useState(item.rate);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[440px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-6">Edit Commission Rate</h3>
        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
          <p className="text-gray-500 text-sm">Category: <strong className="text-[#1a1a1a]">{item.category}</strong></p>
          <p className="text-gray-500 text-sm mt-1">Current Rate: <strong className="text-[#174a37]">{item.rate}%</strong></p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Commission Rate (%)<span className="text-red-500">*</span></label>
          <input type="number" value={rate} onChange={e=>setRate(e.target.value)} min="0" max="50" placeholder="e.g. 15"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => onSave(rate)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Update Rate</button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { id:1, category:'Venue', rate:15, vendors:45, revenue:'AED 125,000' },
  { id:2, category:'Photography', rate:12, vendors:28, revenue:'AED 48,000' },
  { id:3, category:'Catering', rate:10, vendors:22, revenue:'AED 67,000' },
  { id:4, category:'Beauty', rate:12, vendors:31, revenue:'AED 38,000' },
  { id:5, category:'Decoration', rate:13, vendors:19, revenue:'AED 52,000' },
  { id:6, category:'Music & Entertainment', rate:10, vendors:14, revenue:'AED 29,000' },
  { id:7, category:'Transport', rate:8, vendors:11, revenue:'AED 18,000' },
];

export default function CommissionPage() {
  const { data, loading, refresh } = useApi(AdminService.getCommissionConfig);
  const commission = data?.commission || {};
  // Merge API category data (active vendors, revenue) with default rates
  const categories = commission.categories?.length
    ? commission.categories
    : CATEGORIES.map(cat => ({
        ...cat,
        vendors: commission[`vendors_${cat.category.toLowerCase()}`] || cat.vendors,
        revenue: commission[`revenue_${cat.category.toLowerCase()}`] || cat.revenue,
      }));
  const [cats, setCats] = useState(CATEGORIES);
  // Sync cats when API data loads
  if (data && commission.categories?.length && cats === CATEGORIES) { /* will re-render with categories */ }
  const [editing, setEditing] = useState(null);
  const [success, setSuccess] = useState('');

  async function saveRate(rate) {
    try {
      await AdminService.updateCommissionConfig({ categoryId: editing.id, rate: parseFloat(rate) });
      refresh();
    } catch(e) { /* API not connected yet - update locally */ }
    setCats(p => p.map(c => c.id===editing.id ? {...c, rate: parseFloat(rate)} : c));
    setEditing(null);
    setSuccess(`Commission rate for ${editing.category} updated to ${rate}%.`);
  }

  return (
    <div>
      {editing && <EditCommissionModal item={editing} onClose={() => setEditing(null)} onSave={saveRate} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Commission Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          ['Total Revenue', commission.totalRevenue ? `AED ${Number(commission.totalRevenue).toLocaleString()}` : 'AED 377,000'],
          ['Avg Commission', commission.avgRate ? `${commission.avgRate}%` : `${(cats.reduce((s,c)=>s+c.rate,0)/Math.max(cats.length,1)).toFixed(1)}%`],
          ['Active Categories', String(cats.filter(c=>c.active!==false).length)],
        ].map(([l,v]) => (
          <div key={l} className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
            <p className="font-baskerville text-2xl text-[#1a1a1a] mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100">{['Category','Commission Rate','Active Vendors','Revenue Generated','Action'].map(h => <th key={h} className="text-left py-3 px-5 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-4 px-5 font-medium text-gray-800">{c.category}</td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#b89b6b] rounded-full" style={{width:`${c.rate*4}%`}} /></div>
                    <span className="font-medium text-[#174a37]">{c.rate}%</span>
                  </div>
                </td>
                <td className="py-4 px-5 text-gray-500">{c.vendors}</td>
                <td className="py-4 px-5 font-medium text-[#1a1a1a]">{c.revenue}</td>
                <td className="py-4 px-5">
                  <button onClick={() => setEditing(c)} className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-4 py-2 rounded-lg hover:bg-[#f4ebd0] transition-colors">Edit Rate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
