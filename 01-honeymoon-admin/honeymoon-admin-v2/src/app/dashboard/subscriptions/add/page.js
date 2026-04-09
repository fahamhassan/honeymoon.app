'use client';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

export default function AddSubscriptionPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', price:'', duration:'monthly', maxServices:'', features:'', status:'active' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div className="max-w-2xl">
      {success && <SuccessModal message="New subscription plan created successfully." onOk={() => window.location.href='/dashboard/subscriptions'} />}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/dashboard/subscriptions" className="hover:text-[#174a37]">Subscription Management</Link>
        <span>/</span><span className="text-gray-800">Add Plan</span>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h1 className="font-baskerville text-2xl text-[#1a1a1a] mb-6">Add Subscription Plan</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Plan Name<span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e=>f('name',e.target.value)} placeholder="e.g. Gold Plan" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (AED)<span className="text-red-500">*</span></label>
            <input value={form.price} onChange={e=>f('price',e.target.value)} placeholder="e.g. 499" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <select value={form.duration} onChange={e=>f('duration',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
              <option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Services</label>
            <input value={form.maxServices} onChange={e=>f('maxServices',e.target.value)} placeholder="e.g. 10 or Unlimited" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
        </div>
        <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
          <textarea value={form.features} onChange={e=>f('features',e.target.value)} rows={5} placeholder="Unlimited listings&#10;Priority placement&#10;Analytics dashboard" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4] resize-none" /></div>
        <div className="flex gap-3">
          <button onClick={() => form.name && form.price && setSuccess(true)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Create Plan</button>
          <Link href="/dashboard/subscriptions" className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
