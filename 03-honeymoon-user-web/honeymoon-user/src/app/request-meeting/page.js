'use client';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.5)'}}>
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-10 text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <p className="text-[#1a1a1a] text-lg font-medium mb-2">Meeting Requested!</p>
        <p className="text-gray-400 text-sm mb-6">Your meeting request has been sent. The vendor will confirm shortly.</p>
        <button onClick={onClose} className="bg-[#b89b6b] text-white px-10 py-3 rounded-xl hover:bg-[#a08860] transition-colors font-medium">Okay</button>
      </div>
    </div>
  );
}

export default function RequestMeetingPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ vendor:'', date:'', time:'', notes:'' });
  const [success, setSuccess] = useState(false);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {success && <SuccessModal onClose={() => { setSuccess(false); window.location.href='/my-bookings'; }} />}
      <LoggedInNav />
      <main className="flex-1 max-w-3xl mx-auto px-8 py-10 w-full">
        <h1 className="font-baskerville text-[40px] text-[#b89b6b] mb-8">Request a Meeting</h1>
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Vendor<span className="text-red-500">*</span></label>
            <select value={form.vendor} onChange={e=>f('vendor',e.target.value)} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
              <option value="">Select a vendor</option>
              {['Al Habtoor Palace','Studio Lumière','Glamour Touch','Emirates Floral','Saveur Catering'].map(v=><option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date<span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={e=>f('date',e.target.value)} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time<span className="text-red-500">*</span></label>
              <select value={form.time} onChange={e=>f('time',e.target.value)} className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
                <option value="">Select time</option>
                {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Notes</label>
            <textarea value={form.notes} onChange={e=>f('notes',e.target.value)} rows={4} placeholder="What would you like to discuss? (venue availability, packages, pricing...)"
              className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] resize-none bg-[#faf8f4]" />
          </div>
          <button onClick={() => form.vendor && form.date && form.time && setSuccess(true)}
            className="w-full bg-[#174a37] text-white py-3.5 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">
            Send Meeting Request
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
