'use client';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';
export default function AddVendorPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ first:'', last:'', business:'', email:'', phone:'', category:'', location:'' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div className="max-w-2xl">
      {success && <SuccessModal message="Vendor created successfully." onOk={() => window.location.href='/dashboard/vendors'} />}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/dashboard/vendors" className="hover:text-[#174a37]">Vendor Management</Link>
        <span>/</span><span className="text-gray-800">Add Vendor</span>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h1 className="font-baskerville text-2xl text-[#1a1a1a] mb-6">Add New Vendor</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[['First Name','first','Enter first name'],['Last Name','last','Enter last name']].map(([l,k,ph]) => (
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
              <input value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
          ))}
        </div>
        {[['Business Name','business','text','Enter business name'],['Email Address','email','email','Enter email']].map(([l,k,t,ph]) => (
          <div key={k} className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
            <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
        ))}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
            <select value={form.category} onChange={e=>f('category',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
              <option value="">Select</option>{['Venue','Photography','Beauty','Catering','Decoration'].map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location<span className="text-red-500">*</span></label>
            <select value={form.location} onChange={e=>f('location',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
              <option value="">Select</option>{['Dubai','Abu Dhabi','Sharjah','Ajman'].map(c => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => form.first && form.business && setSuccess(true)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Create Vendor</button>
          <Link href="/dashboard/vendors" className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
