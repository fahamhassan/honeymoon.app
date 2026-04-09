'use client';
import { AuthService } from '../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';

const BG_IMG = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const LOGO_ICON = "/logo-icon.png";
const LOGO_TEXT = "/logo-text.png";
const LOGO_AR = "/logo-arabic.png";

const STEPS = [
  { title: 'Personal Information', desc: 'Tell us about yourself' },
  { title: 'Business Information', desc: 'Tell us about your business' },
  { title: 'Account Setup', desc: 'Create your login credentials' },
];

function Step1({ form, setForm }) {
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (step < 3) { setStep(s => s + 1); return; }
    setSaving(true); setError('');
    try {
      await AuthService.signup({
        firstName:   form.firstName || '',
        lastName:    form.lastName  || '',
        email:       form.email     || '',
        password:    form.password  || '',
        phone:       form.phone     || '',
        companyName: form.company   || '',
        category:    form.category  || '',
        location:    form.location  || '',
        about:       form.about     || '',
      });
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setSaving(false);
    }
  };


  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[['First Name','firstName','Enter First Name'],['Last Name','lastName','Enter Last Name']].map(([l,k,p]) => (
          <div key={k}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
            <input value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={p} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-2.5 flex-shrink-0 bg-[#faf8f4]">
            <span className="text-sm">🇦🇪</span><span className="text-xs text-gray-500">+971</span><span className="text-gray-400 text-xs">▾</span>
          </div>
          <input value={form.phone||''} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="Enter Phone Number" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender<span className="text-red-500">*</span></label>
        <select value={form.gender||''} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
          <option value="">Select Gender</option><option>Male</option><option>Female</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">UAE Pass<span className="text-red-500">*</span></label>
        <input value={form.uaePass||''} onChange={e=>setForm(p=>({...p,uaePass:e.target.value}))} placeholder="Enter UAE Pass" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
      </div>
    </>
  );
}

function Step2({ form, setForm }) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name<span className="text-red-500">*</span></label>
        <input value={form.business||''} onChange={e=>setForm(p=>({...p,business:e.target.value}))} placeholder="Enter Business Name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category<span className="text-red-500">*</span></label>
        <select value={form.category||''} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
          <option value="">Select Category</option>
          {['Venue','Photography','Beauty','Decoration','Catering','Music','Transport'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Location<span className="text-red-500">*</span></label>
        <select value={form.location||''} onChange={e=>setForm(p=>({...p,location:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
          <option value="">Select Emirate</option>
          {['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'].map(e => <option key={e}>{e}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
        <textarea value={form.description||''} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} placeholder="Describe your business..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4] resize-none" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Profile Photo</label>
        <div className="border-2 border-dashed border-[rgba(184,154,105,0.4)] rounded-xl p-5 text-center cursor-pointer hover:border-[#b89b6b] transition-colors">
          <div className="text-2xl mb-1 opacity-30">📷</div>
          <p className="text-gray-400 text-xs">Click to upload (PNG, JPG)</p>
        </div>
      </div>
    </>
  );
}

function Step3({ form, setForm }) {
  const [show, setShow] = useState({ p: false, c: false });
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address<span className="text-red-500">*</span></label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4]">
          <span className="text-gray-400 mr-2">✉</span>
          <input type="email" value={form.email||''} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="Enter Email Address" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4]">
          <span className="text-gray-400 mr-2">🔒</span>
          <input type={show.p?'text':'password'} value={form.password||''} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="Enter Password" className="flex-1 bg-transparent text-sm outline-none" />
          <button onClick={()=>setShow(s=>({...s,p:!s.p}))} className="text-gray-400 text-xs">{show.p?'🙈':'👁'}</button>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password<span className="text-red-500">*</span></label>
        <div className="flex items-center border border-gray-200 rounded-xl px-4 py-2.5 bg-[#faf8f4]">
          <span className="text-gray-400 mr-2">🔒</span>
          <input type={show.c?'text':'password'} value={form.confirm||''} onChange={e=>setForm(p=>({...p,confirm:e.target.value}))} placeholder="Confirm Password" className="flex-1 bg-transparent text-sm outline-none" />
          <button onClick={()=>setShow(s=>({...s,c:!s.c}))} className="text-gray-400 text-xs">{show.c?'🙈':'👁'}</button>
        </div>
      </div>
    </>
  );
}

export default function VendorSignupPage() {
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f4ebd0'}}>
      <div className="flex items-center gap-10 max-w-5xl w-full px-8 py-10">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-[460px] flex-shrink-0">
          <div className="flex flex-col items-center mb-5">
            <div className="w-14 h-14 border-2 border-[#b89b6b] rounded-full flex items-center justify-center mb-2">
              <img src={LOGO_ICON} alt="" className="w-9 h-9 object-contain" />
            </div>
            <img src={LOGO_TEXT} alt="HONEYMOON" className="h-4 mb-0.5" />
            <img src={LOGO_AR} alt="" className="h-3" />
          </div>

          <h2 className="font-baskerville text-3xl text-center mb-1 text-[#1a1a1a]">Sign Up</h2>
          <p className="text-gray-400 text-xs text-center mb-4">Step {step} of 3 — {STEPS[step-1].desc}</p>

          {/* Step progress */}
          <div className="flex gap-1.5 mb-6">
            {[1,2,3].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s<=step?'bg-[#174a37]':'bg-gray-200'}`} />)}
          </div>

          <div className="overflow-y-auto max-h-[400px] pr-1">
            {step===1 && <Step1 form={form} setForm={setForm} />}
            {step===2 && <Step2 form={form} setForm={setForm} />}
            {step===3 && <Step3 form={form} setForm={setForm} />}
          </div>

          <div className="flex gap-3 mt-5">
            {step > 1 && (
              <button onClick={() => setStep(s=>s-1)} className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-colors">← Back</button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s=>s+1)} className="flex-1 bg-[#174a37] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#1a5c45] transition-colors">
                Continue ↗
              </button>
            ) : (
              <>
                {error && <p className="text-red-500 text-xs text-center mb-1">{error}</p>}
                <button onClick={handleSignup} disabled={saving}
                  className="flex-1 bg-[#b89b6b] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#a08860] transition-colors disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Account ↗'}
                </button>
              </>
            )}
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#b89b6b] font-medium hover:underline">Login</Link>
          </p>
        </div>

        <div className="flex-1 hidden lg:block">
          <div className="rounded-2xl overflow-hidden h-[580px]">
            <img src={BG_IMG} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
