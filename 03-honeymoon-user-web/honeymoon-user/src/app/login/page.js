'use client';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';

const imgHeroBg = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const imgLogoIcon = "/logo-icon.png";
const imgLogoText = "/logo-text.png";
const imgLogoArabic = "/logo-arabic.png";
const imgAIBadge = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23b89b6b"><text y="20" font-size="20">✨</text></svg>`;

export default function LoginPage() {
  const { login } = useUserAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e && e.preventDefault();
    setLoading(true); setError('');
    try {
      if (tab === 'email') {
        await login(form.email, form.password);
      } else if (tab === 'uaepass') {
        const { AuthService } = await import('../../lib/services/user.service');
        const { data } = await AuthService.uaePassInit();
        window.location.href = data.authUrl;
        return;
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };
  const [tab, setTab] = useState('email');
  const [form, setForm] = useState({ email: '', mobile: '', uaePass: '', password: '' });
  const [show, setShow] = useState(false);

  const tabs = [
    { id: 'email', label: 'Login with Email' },
    { id: 'uae', label: 'Login with UAE Pass' },
    { id: 'mobile', label: 'Login with Mobile Number' },
  ];

  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans">
      {/* Nav */}
      <nav className="bg-[#174a37] h-[68px] flex items-center px-10 justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src={imgLogoIcon} alt="" className="h-10 w-auto" />
          <div><img src={imgLogoText} alt="honeymoon" className="h-[16px] w-auto" /><img src={imgLogoArabic} alt="" className="h-[12px] w-auto mt-0.5" /></div>
        </Link>
        <div className="hidden lg:flex items-center gap-6 text-white/80 text-[13px] uppercase tracking-wide">
          {['Home','About','Budget Estimation','Vendors','Services','Contact Us'].map((l,i)=>(
            <Link key={l} href={l==='Home'?'/':'/'+l.toLowerCase().replace(/ /g,'-')}
              className={`hover:text-white transition-colors ${i===0?'text-white font-bold':''}`}>{l}</Link>
          ))}
        </div>
        <Link href="/signup" className="border border-white/40 text-white text-[13px] uppercase px-5 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
          Sign Up | Login
        </Link>
      </nav>

      {/* Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-68px)] px-4 py-12">
        <div className="w-full max-w-[520px]">
          <h1 className="font-baskerville text-[48px] text-[#b89b6b] text-center mb-8">Login</h1>

          {/* Tabs */}
          <div className="flex border border-[rgba(184,154,105,0.3)] rounded-xl overflow-hidden mb-8 bg-white">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-[13px] font-medium transition-colors ${
                  tab === t.id ? 'bg-[#174a37] text-white' : 'text-black/60 hover:bg-[#f4ebd0]'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.06)]">
            {tab === 'email' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Email address<span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                    placeholder="Enter your email" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      placeholder="Enter your password" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-colors pr-12" />
                    <button onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 text-xs">{show?'🙈':'👁'}</button>
                  </div>
                </div>
              </div>
            )}
            {tab === 'uae' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">UAE Pass<span className="text-red-500">*</span></label>
                  <input value={form.uaePass} onChange={e=>setForm(p=>({...p,uaePass:e.target.value}))}
                    placeholder="Enter UAE Pass" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      placeholder="Enter your password" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b89b6b] pr-12 transition-colors" />
                    <button onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 text-xs">{show?'🙈':'👁'}</button>
                  </div>
                </div>
              </div>
            )}
            {tab === 'mobile' && (
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Mobile Number<span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 border border-[#d4d4d4] rounded-lg px-3 py-3 bg-white flex-shrink-0">
                      <span className="text-sm">🇦🇪</span>
                      <span className="text-sm text-black/60">+971</span>
                      <span className="text-black/30 text-xs">▾</span>
                    </div>
                    <input value={form.mobile} onChange={e=>setForm(p=>({...p,mobile:e.target.value}))}
                      placeholder="Enter Mobile Number" className="flex-1 border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-black/60 block mb-1.5">Password<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={show?'text':'password'} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                      placeholder="Enter your password" className="w-full border border-[#d4d4d4] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#b89b6b] pr-12 transition-colors" />
                    <button onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 text-xs">{show?'🙈':'👁'}</button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 text-sm text-black/60 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-[#b89b6b] hover:underline">Forgot Password?</Link>
            </div>

            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            <button onClick={handleLogin} disabled={loading}
              className="block w-full bg-[#b89b6b] text-white text-center font-medium py-3.5 rounded-xl hover:bg-[#a08860] transition-colors text-base disabled:opacity-60">
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-black/50 mt-5">
              Not A User?{' '}
              <Link href="/signup" className="text-[#b89b6b] font-medium hover:underline">Sign Up Now</Link>
            </p>
          </div>

          {/* AI badge */}
          <div className="flex flex-col items-center mt-6 opacity-70">
            <img src={imgAIBadge} alt="" className="w-16" />
            <p className="text-[11px] text-black/40 uppercase tracking-wider mt-2 text-center">Smart Wedding<br/>Assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
