'use client';
import { useApi } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import { AddonModal, ConfirmModal, SuccessModal } from '@/components/Modals';

const INIT = [
  { id:1, title:'Premium Floral Setup', category:'Decoration', priceType:'Per Guest', price:'150', status:'Active' },
  { id:2, title:'Professional Lighting', category:'Venue', priceType:'Per Hour', price:'200', status:'Active' },
  { id:3, title:'Live Band', category:'Music', priceType:'Package', price:'2000', status:'Inactive' },
  { id:4, title:'Custom Cake', category:'Catering', priceType:'Per Item', price:'500', status:'Active' },
];

const STATUS_COLOR = { Active:'text-green-600 bg-green-100', Inactive:'text-gray-500 bg-gray-100' };

export default function AddonsPage() {
  const { data, loading, refresh } = useApi(VendorService.getAddons);
  const addons = data?.addons || [];
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');

  function saveAddon(form) {
    if (modal?.type === 'edit') {
      setAddons(p => p.map(a => a.id === modal.addon.id ? { ...a, ...form } : a));
      setSuccess('Add-on updated successfully.');
    } else {
      setAddons(p => [...p, { id: Date.now(), ...form }]);
      setSuccess('Add-on created successfully.');
    }
    setModal(null);
  }

  async function deleteAddon() {
    VendorService.deleteAddon(modal.addon.id).then(() => refresh()).catch(() => {});
    setAddons(p => p.filter(a => a.id !== modal.addon.id));
    setModal(null);
    setSuccess('Add-on deleted.');
  }

  function toggleStatus(addon) {
    setAddons(p => p.map(a => a.id === addon.id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a));
  }

  return (
    <div>
      {modal?.type === 'add' && <AddonModal onClose={() => setModal(null)} onSave={saveAddon} />}
      {modal?.type === 'edit' && <AddonModal addon={modal.addon} onClose={() => setModal(null)} onSave={saveAddon} />}
      {modal?.type === 'delete' && <ConfirmModal message="Are you sure you want to delete this add-on?" onYes={deleteAddon} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Add-On Management</h1>
        <button onClick={() => setModal({ type:'add' })}
          className="bg-[#174a37] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
          + Add Add-On
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['#','Title','Category','Price Type','Price','Status','Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {addons.map((a, i) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-4 text-gray-400 text-xs">{String(i+1).padStart(2,'0')}</td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{a.title}</td>
                <td className="py-3.5 px-4 text-gray-500">{a.category}</td>
                <td className="py-3.5 px-4 text-gray-500">{a.priceType}</td>
                <td className="py-3.5 px-4 font-medium text-[#174a37]">AED {a.price}</td>
                <td className="py-3.5 px-4">
                  <button onClick={() => toggleStatus(a)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[a.status]}`}>
                    {a.status}
                  </button>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex gap-1.5">
                    <button onClick={() => setModal({ type:'edit', addon:a })}
                      className="text-xs text-[#174a37] border border-[rgba(23,74,55,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => setModal({ type:'delete', addon:a })}
                      className="text-xs text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
