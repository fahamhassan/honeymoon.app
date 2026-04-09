'use client';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';
export default function AddUserPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ first:'', last:'', email:'', phone:'', gender:'', uaePass:'', password:'', confirm:'' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  return (
    <div className="max-w-2xl">
      {success && <SuccessModal message="User created successfully." onOk={() => window.location.href='/dashboard/users'} />}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/dashboard/users" className="hover:text-[#174a37]">User Management</Link>
        <span>/</span><span className="text-gray-800">Add User</span>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h1 className="font-baskerville text-2xl text-[#1a1a1a] mb-6">Add New User</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[['First Name','first','Enter first name'],['Last Name','last','Enter last name']].map(([l,k,ph]) => (
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
              <input value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
          ))}
        </div>
        {[['Email Address','email','email','Enter email address'],['UAE Pass','uaePass','text','Enter UAE Pass']].map(([l,k,t,ph]) => (
          <div key={k} className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
            <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
        ))}
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="flex gap-2"><div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-2.5 flex-shrink-0 bg-[#faf8f4]"><span>🇦🇪</span><span className="text-xs text-gray-500">+971</span></div>
            <input value={form.phone} onChange={e=>f('phone',e.target.value)} placeholder="Enter phone" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div></div>
        <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select value={form.gender} onChange={e=>f('gender',e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
            <option value="">Select</option><option>Male</option><option>Female</option></select></div>
        <div className="flex gap-3">
          <button onClick={() => form.first && form.email && setSuccess(true)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Create User</button>
          <Link href="/dashboard/users" className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors text-center">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
