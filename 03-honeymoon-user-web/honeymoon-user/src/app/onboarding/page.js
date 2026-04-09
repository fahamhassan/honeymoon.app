'use client';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';

const imgRectangle7 = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const imgGroup180 = "/logo-icon.png";
const imgHoneymoon = "/logo-text.png";

const steps = [
  { title: 'Your Wedding Date', desc: 'When is the big day?' },
  { title: 'Guest Count & Location', desc: 'Help us understand your scale.' },
  { title: 'Your Style', desc: 'What best describes your dream wedding?' },
];

const styles = [
  { id: 'traditional', label: 'Traditional Emirati', icon: '🌙' },
  { id: 'luxury', label: 'Modern Luxury', icon: '✦' },
  { id: 'garden', label: 'Garden Romance', icon: '🌿' },
  { id: 'minimal', label: 'Elegant Minimal', icon: '○' },
];

export default function OnboardingPage() {
  const { isLoggedIn } = useUserAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ date: '', guests: '150', city: 'Dubai', budget: '200000', style: '' });

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 relative overflow-hidden flex-col">
        <img src={imgRectangle7} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#174a37]/80" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-auto">
            <img src={imgGroup180} alt="" className="h-12 w-auto" />
            <img src={imgHoneymoon} alt="honeymoon" className="h-4 w-auto" />
          </Link>
          <div className="my-auto">
            <h2 className="font-baskerville text-[42px] leading-[50px] text-[#b89b6b] capitalize mb-4">Let's plan your perfect day</h2>
            <p className="text-white/60 text-[16px] leading-7 mb-10">3 quick steps and your AI planner is ready to find your perfect vendors.</p>
            <div className="flex flex-col gap-4">
              {steps.map((s, i) => (
                <div key={s.title} className={`flex items-center gap-4 transition-all ${i === step ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all ${
                    i < step ? 'bg-[#b89b6b] text-white' : i === step ? 'bg-white text-[#174a37]' : 'bg-white/20 text-white'
                  }`}>{i < step ? '✓' : i + 1}</div>
                  <div>
                    <p className={`text-sm font-medium ${i === step ? 'text-white' : 'text-white/60'}`}>{s.title}</p>
                    {i === step && <p className="text-white/40 text-xs">{s.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-sm">© 2025 HoneyMoon.</p>
        </div>
      </div>

      {/* Right: steps */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[480px]">
          {/* Progress */}
          <div className="flex gap-2 mb-10">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-[#174a37]' : 'bg-[#f4ebd0]'}`} />
            ))}
          </div>

          {step === 0 && (
            <div>
              <h1 className="font-baskerville text-[40px] text-[#1a1a1a] mb-2">{steps[0].title}</h1>
              <p className="text-black/40 mb-8 text-sm">This helps us check vendor availability for your date.</p>
              <div className="mb-5">
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Wedding Date</label>
                <input type="date" value={data.date} onChange={e => setData(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-[#1a1a1a] text-sm outline-none focus:border-[#b89b6b] transition-all" />
              </div>
              <div className="bg-[#f4ebd0] rounded-xl p-4 text-sm text-[#174a37]">
                <span className="font-medium">✦ Pro tip:</span> Book vendors at least 12 months in advance for the best availability.
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-baskerville text-[40px] text-[#1a1a1a] mb-2">{steps[1].title}</h1>
              <p className="text-black/40 mb-8 text-sm">This shapes the venues and vendors we recommend.</p>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Expected Guests</label>
                  <input type="number" value={data.guests} onChange={e => setData(p => ({ ...p, guests: e.target.value }))}
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-all" />
                </div>
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">City</label>
                  <select value={data.city} onChange={e => setData(p => ({ ...p, city: e.target.value }))}
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-white transition-all">
                    {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-black/40 uppercase tracking-wider">Total Budget (AED)</label>
                  <span className="text-sm font-medium text-[#b89b6b]">AED {Number(data.budget).toLocaleString()}</span>
                </div>
                <input type="range" min={50000} max={500000} step={5000} value={data.budget} onChange={e => setData(p => ({ ...p, budget: e.target.value }))}
                  className="w-full accent-[#b89b6b]" />
                <div className="flex justify-between text-xs text-black/30 mt-1"><span>50K</span><span>500K</span></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-baskerville text-[40px] text-[#1a1a1a] mb-2">{steps[2].title}</h1>
              <p className="text-black/40 mb-8 text-sm">Select the aesthetic that speaks to you.</p>
              <div className="grid grid-cols-2 gap-4">
                {styles.map(s => (
                  <button key={s.id} onClick={() => setData(p => ({ ...p, style: s.id }))}
                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                      data.style === s.id ? 'border-[#174a37] bg-[#f4ebd0]' : 'border-[rgba(184,154,105,0.2)] bg-white'
                    }`}>
                    <span className="text-2xl block mb-3">{s.icon}</span>
                    <p className={`font-medium text-sm ${data.style === s.id ? 'text-[#174a37]' : 'text-[#1a1a1a]'}`}>{s.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-24 h-24 bg-[#f4ebd0] rounded-full flex items-center justify-center text-[#174a37] text-4xl mx-auto mb-6">✦</div>
              <h1 className="font-baskerville text-[40px] text-[#1a1a1a] mb-3">You're all set!</h1>
              <p className="text-black/50 text-[16px] mb-8 leading-7">Your AI planner is analyzing 500+ vendors to find your perfect matches.</p>
              <Link href="/dashboard" className="block w-full bg-[#174a37] text-white text-base font-medium py-4 rounded-xl hover:bg-[#1a5c45] transition-colors text-center">
                View My AI Matches ✦
              </Link>
            </div>
          )}

          {step < 3 && (
            <div className="flex gap-3 mt-10">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex-1 border border-[rgba(184,154,105,0.3)] text-black/50 text-sm font-medium py-3.5 rounded-xl hover:bg-[#f4ebd0] transition-colors">
                  ← Back
                </button>
              )}
              <button onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-[#174a37] text-white text-sm font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors shadow-[0_4px_16px_rgba(23,74,55,0.2)]">
                {step === 2 ? 'Find My Vendors ✦' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
