'use client';
import { useState } from 'react';
import { usePaginated } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const imgVenue = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgPhoto = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgBeauty = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const SERVICES = [
  { id:1, name:'Grand Ballroom Package', category:'Venue', price:'AED 45,000', status:'active', img:imgVenue, bookings:12 },
  { id:2, name:'Gold Photography Bundle', category:'Photography', price:'AED 8,500', status:'active', img:imgPhoto, bookings:8 },
  { id:3, name:'Bridal Beauty Package', category:'Beauty', price:'AED 3,200', status:'inactive', img:imgBeauty, bookings:5 },
];

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState(service || { name:'', category:'', price:'', description:'', status:'active' });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[560px] relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-6">{service?.id ? 'Edit' : 'Add New'} Service</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name<span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Enter service name"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
                <option value="">Select...</option>
                {['Venue','Photography','Beauty','Decoration','Catering'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED)<span className="text-red-500">*</span></label>
              <input value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} placeholder="e.g. 45,000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3}
              placeholder="Describe this service..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4] resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Images</label>
            <div className="border-2 border-dashed border-[rgba(184,154,105,0.3)] rounded-xl p-6 text-center cursor-pointer hover:border-[#b89b6b] transition-colors">
              <div className="text-2xl mb-1 opacity-30">📸</div>
              <p className="text-gray-400 text-xs">Click to upload images</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onSave(form)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Save Service</button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function VendorServicesPage() {
  const { items: apiServices, refresh } = usePaginated(VendorService.getServices, {});
  const [services, setServices] = useState(SERVICES);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [success, setSuccess] = useState('');

  async function saveService(form) {
    try {
      if (modal?.service?.id) {
        await VendorService.updateService(modal.service.id, form);
      } else {
        await VendorService.createService(form);
      }
      refresh();
    } catch(e) { /* fallback local */ }
  }

  function doDelete() {
    setServices(p => p.filter(s => s.id !== confirm.id));
    setConfirm(null);
    setSuccess('Service deleted successfully.');
  }

  return (
    <div>
      {modal && <ServiceModal service={modal.service} onClose={() => setModal(null)} onSave={saveService} />}
      {confirm && <ConfirmModal message="Are you sure you want to delete this service? This action cannot be undone." onYes={doDelete} onNo={() => setConfirm(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Services</h1>
        <button onClick={() => setModal({ service: null })}
          className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map(s => (
          <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-[rgba(184,154,105,0.1)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-shadow">
            <div className="relative h-44 overflow-hidden">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${s.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                {s.status==='active'?'Active':'Inactive'}
              </span>
            </div>
            <div className="p-5">
              <span className="text-[#b89b6b] text-xs uppercase tracking-wider font-medium">{s.category}</span>
              <h3 className="font-medium text-[#1a1a1a] text-base mt-1">{s.name}</h3>
              <p className="font-baskerville text-[22px] text-[#174a37] mt-1">{s.price}</p>
              <p className="text-gray-400 text-xs mt-1">{s.bookings} booking{s.bookings!==1?'s':''}</p>
              <div className="flex items-center gap-2 mt-4">
                <Link href={`/dashboard/services/${s.id}`} className="flex-1 text-center text-xs border border-[rgba(184,154,105,0.3)] text-[#174a37] py-2 rounded-lg hover:bg-[#f4ebd0] transition-colors">View</Link>
                <button onClick={() => setModal({ service: s })} className="flex-1 text-xs text-white bg-[#174a37] py-2 rounded-lg hover:bg-[#1a5c45] transition-colors">Edit</button>
                <button onClick={() => setConfirm(s)} className="flex-1 text-xs text-red-500 bg-red-50 border border-red-200 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
