'use client';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LOGO_ICON="/logo-icon.png";
const LOGO_TEXT="/logo-text.png";
const LOGO_AR="/logo-arabic.png";
const HERO_BG="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";

export default function SignupPage() {
  const { signup } = useUserAuth();
  const [role, setRole] = useState('user');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName:'', lastName:'', gender:'', profileImage:null,
    companyName:'', phone:'', services:[], address:'', tradeLicense:null, companyBanner:null,
    email:'', password:'', confirmPassword:''
  });
  const router = useRouter();
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const totalSteps = role === 'vendor' ? 3 : 1;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (step < totalSteps) { setStep(s => s + 1); return; }
    // Final step - call signup API
    setSaving(true); setError('');
    try {
      if (role === 'vendor') {
        // Vendor signup - redirect to vendor portal
        router.push('/login?registered=1');
      } else {
        // User signup
        await signup({
          firstName: form.firstName || form.name?.split(' ')[0] || '',
          lastName:  form.lastName  || form.name?.split(' ')[1] || '',
          email:     form.email    || '',
          password:  form.password || '',
          phone:     form.phone    || '',
          gender:    form.gender   || '',
        });
        router.push('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4ebd0]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#174a37] h-[70px] flex items-center justify-between px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 border-2 border-[#b89b6b] rounded-full flex items-center justify-center">
            <img src={LOGO_ICON} alt="" className="w-5 h-5 object-contain"/>
          </div>
          <div><img src={LOGO_TEXT} alt="HONEYMOON" className="h-3"/><img src={LOGO_AR} alt="" className="h-2.5 mt-0.5"/></div>
        </Link>
        <div className="flex items-center gap-8 text-white text-sm">
          {['HOME','ABOUT','BUDGET ESTIMATION','VENDORS','SERVICES','CONTACT US'].map(l=>(
            <Link key={l} href={`/${l.toLowerCase().replace(' ','-').replace(' ','-')}`} className="hover:text-[#b89b6b] transition-colors uppercase text-xs tracking-wide">{l}</Link>
          ))}
        </div>
        <Link href="/login" className="text-white text-sm uppercase border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Sign In</Link>
      </nav>

      <div className="pt-[70px] min-h-screen flex flex-col">
        {/* Hero bg */}
        <div className="absolute inset-0 pt-[70px]"><div className="absolute inset-0 bg-[#f4ebd0]"/></div>

        <div className="relative flex-1 flex flex-col items-center py-12 px-4">
          <h1 className="font-baskerville text-4xl text-[#1a1a1a] mb-6 mt-4">Sign Up</h1>

          {/* Role tabs */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
            <button onClick={()=>{setRole('user');setStep(1);}} className={`px-12 py-3.5 text-sm font-medium transition-colors ${role==='user'?'bg-[#174a37] text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>User</button>
            <button onClick={()=>{setRole('vendor');setStep(1);}} className={`px-12 py-3.5 text-sm font-medium transition-colors ${role==='vendor'?'bg-[#174a37] text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>Vendor</button>
          </div>

          {/* Step indicator */}
          {role === 'vendor' && (
            <p className="text-[#174a37] font-semibold text-lg mb-6">Step {step}/{totalSteps}</p>
          )}

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.08)] p-8 w-full max-w-xl">

            {/* User signup - only 1 step */}
            {role === 'user' && (
              <div>
                <h2 className="font-semibold text-xl text-[#1a1a1a] mb-5">Personal Detail</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[['First Name','firstName','Enter First Name'],['Last Name','lastName','Enter Last Name']].map(([l,k,ph])=>(
                    <div key={k}>
                      <label className="block text-sm text-[#1a1a1a] mb-1">{l}<span className="text-red-500">*</span></label>
                      <input value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph}
                        className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] bg-white"/>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Gender<span className="text-red-500">*</span></label>
                  <select value={form.gender} onChange={e=>f('gender',e.target.value)} className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] bg-white text-gray-400">
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option><option>Prefer not to say</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Email address<span className="text-red-500">*</span></label>
                  <input value={form.email} onChange={e=>f('email',e.target.value)} placeholder="Enter email address"
                    className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] bg-white"/>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Password<span className="text-red-500">*</span></label>
                  <input type="password" value={form.password} onChange={e=>f('password',e.target.value)} placeholder="Enter your password"
                    className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] bg-white"/>
                </div>
                <div className="mb-5 flex items-center gap-2 cursor-pointer text-sm text-[#1a1a1a]">
                  <div className="w-8 h-8 border border-dashed border-[#b89b6b] rounded-lg flex items-center justify-center text-[#b89b6b]">📷</div>
                  Upload image
                </div>
              </div>
            )}

            {/* Vendor Step 1 - Personal Detail */}
            {role === 'vendor' && step === 1 && (
              <div>
                <h2 className="font-semibold text-xl text-[#1a1a1a] mb-5">Personal Detail</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[['First Name','firstName','Enter First Name'],['Last Name','lastName','Enter Last Name']].map(([l,k,ph])=>(
                    <div key={k}>
                      <label className="block text-sm text-[#1a1a1a] mb-1">{l}<span className="text-red-500">*</span></label>
                      <input value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph}
                        className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37]"/>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Gender<span className="text-red-500">*</span></label>
                  <select value={form.gender} onChange={e=>f('gender',e.target.value)} className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] text-gray-400">
                    <option value="">Select Gender</option>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 cursor-pointer text-sm text-[#1a1a1a] mb-2">
                  <div className="w-8 h-8 border border-dashed border-[#b89b6b] rounded-lg flex items-center justify-center text-[#b89b6b]">📷</div>
                  Upload image
                </div>
              </div>
            )}

            {/* Vendor Step 2 - Company Detail */}
            {role === 'vendor' && step === 2 && (
              <div>
                <h2 className="font-semibold text-xl text-[#1a1a1a] mb-5">Company Detail</h2>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Name<span className="text-red-500">*</span></label>
                  <input value={form.companyName} onChange={e=>f('companyName',e.target.value)} placeholder="Enter name"
                    className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37]"/>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Phone Number<span className="text-red-500">*</span></label>
                  <div className="flex border border-[#bebebe] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-[#bebebe] text-sm flex-shrink-0">
                      🇦🇪 +971 ▾
                    </div>
                    <input value={form.phone} onChange={e=>f('phone',e.target.value)} placeholder="Enter Phone Number"
                      className="flex-1 px-4 py-3 text-sm outline-none"/>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Services Offered<span className="text-red-500">*</span></label>
                  <select className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] text-gray-400">
                    <option value="">Select Services</option>
                    {['Venue','Photography','Beauty','Catering','Decoration'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Address<span className="text-red-500">*</span></label>
                  <textarea value={form.address} onChange={e=>f('address',e.target.value)} placeholder="Enter Address" rows={3}
                    className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] resize-none"/>
                </div>
                <div className="flex gap-4 mb-2">
                  <button className="flex items-center gap-2 border border-dashed border-[#b89b6b] rounded-xl px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#f4ebd0] transition-colors">
                    📷 Trade License
                  </button>
                  <button className="flex items-center gap-2 border border-dashed border-[#b89b6b] rounded-xl px-4 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#f4ebd0] transition-colors">
                    📷 Company Banner
                  </button>
                </div>
              </div>
            )}

            {/* Vendor Step 3 - Login Detail */}
            {role === 'vendor' && step === 3 && (
              <div>
                <h2 className="font-semibold text-xl text-[#1a1a1a] mb-5">Login Detail</h2>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Email address<span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={e=>f('email',e.target.value)} placeholder="Enter Email address"
                    className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37]"/>
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="password" value={form.password} onChange={e=>f('password',e.target.value)} placeholder="Enter your password"
                      className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] pr-12"/>
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁</button>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm text-[#1a1a1a] mb-1">Confirm Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="password" value={form.confirmPassword} onChange={e=>f('confirmPassword',e.target.value)} placeholder="Enter your password"
                      className="w-full border border-[#bebebe] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#174a37] pr-12"/>
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁</button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit button */}
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <button onClick={handleSubmit} disabled={saving}
              className="w-full bg-[#b89b6b] text-white py-4 rounded-xl font-medium text-base hover:bg-[#a08860] transition-colors mt-2">
              {step < totalSteps ? 'Continue' : (role === 'vendor' ? 'Signup' : 'Continue')}
            </button>

            <p className="text-center text-sm text-[#1a1a1a] mt-4">
              Already Have An Account?{' '}
              <Link href="/login" className="text-[#b89b6b] hover:underline font-medium">Login</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1a1a1a] py-10 px-10 mt-12">
          <div className="max-w-6xl mx-auto flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 border border-[#b89b6b] rounded-full flex items-center justify-center">
                  <img src={LOGO_ICON} alt="" className="w-6 h-6 object-contain opacity-80"/>
                </div>
                <div><img src={LOGO_TEXT} alt="HONEYMOON" className="h-3 opacity-80"/><img src={LOGO_AR} alt="" className="h-2.5 mt-0.5 opacity-60"/></div>
              </div>
              <p className="text-white/50 text-xs">Copyright © HoneyMoon. All Rights Reserved.</p>
            </div>
            <div>
              <div className="border-b border-white/20 pb-3 mb-3">
                <input placeholder="rakabir@gmail.com" className="bg-transparent text-white text-base outline-none w-52"/>
              </div>
              <p className="text-white/50 text-xs">210 Qilo Stereet, California, Main OC, USA</p>
              <div className="flex gap-3 mt-3">
                {['X','Fb','In','Li'].map(s=><span key={s} className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center text-white text-xs cursor-pointer hover:border-[#b89b6b] transition-colors">{s}</span>)}
              </div>
            </div>
            <nav className="flex gap-4 text-white/50 text-sm mt-1">
              {['Home','About','Vendors','Services','Contact'].map(l=><Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link>)}
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
