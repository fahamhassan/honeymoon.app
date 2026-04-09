'use client';
import { AuthService } from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgRectangle7 = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const imgGroup180 = "/logo-icon.png";
const imgHoneymoon = "/logo-text.png";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true); setError('');
    try { await AuthService.forgot(email); setStep(2); }
    catch(e) { setError(e.message || 'Failed to send code'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (!code) return;
    setLoading(true); setError('');
    try { await AuthService.verifyOtp(email, code); setStep(3); }
    catch(e) { setError(e.message || 'Invalid code'); }
    finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!password || password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try { await AuthService.resetPw(email, password); setStep(4); }
    catch(e) { setError(e.message || 'Reset failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src={imgRectangle7} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#174a37]/75" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <img src={imgGroup180} alt="" className="h-12 w-auto" />
            <img src={imgHoneymoon} alt="honeymoon" className="h-[18px] w-auto" />
          </Link>
          <div>
            <h2 className="font-baskerville text-[48px] leading-[56px] text-white capitalize mb-4">No worries,<br/>we've got you</h2>
            <p className="text-white/60 text-lg max-w-[340px] leading-7">We'll send a reset code to your email address within seconds.</p>
          </div>
          <p className="text-white/30 text-sm">© 2025 HoneyMoon. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 lg:max-w-[520px] flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[400px]">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          {step === 1 && (
            <>
              <h1 className="font-baskerville text-[36px] text-[#1a1a1a] mb-2">Forgot password?</h1>
              <p className="text-black/40 mb-8 text-sm">Enter your email and we'll send you a reset code.</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-all" />
                </div>
                <button onClick={handleSend} disabled={!email || loading}
                  className="w-full text-sm font-medium py-3.5 rounded-xl bg-[#174a37] text-white hover:bg-[#1a5c45] transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Code →'}
                </button>
              </div>
              <p className="text-center text-sm text-black/40 mt-8">
                Remembered it? <Link href="/login" className="text-[#b89b6b] font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="w-20 h-20 bg-[#f4ebd0] rounded-full flex items-center justify-center text-[#174a37] text-3xl mx-auto mb-6">✉</div>
              <h1 className="font-baskerville text-[36px] text-[#1a1a1a] mb-2 text-center">Check your email</h1>
              <p className="text-black/40 mb-8 text-sm text-center">We sent a code to <span className="font-medium text-[#1a1a1a]">{email}</span></p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Verification Code</label>
                  <input value={code} onChange={e => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-all tracking-widest text-center text-lg" />
                </div>
                <button onClick={handleVerify} disabled={!code || loading}
                  className="w-full text-sm font-medium py-3.5 rounded-xl bg-[#174a37] text-white hover:bg-[#1a5c45] transition-colors disabled:opacity-50">
                  {loading ? 'Verifying...' : 'Verify Code →'}
                </button>
                <button onClick={() => { setStep(1); setCode(''); }} className="text-sm text-black/40 hover:text-[#b89b6b] transition-colors text-center">
                  Try a different email
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="font-baskerville text-[36px] text-[#1a1a1a] mb-2">New password</h1>
              <p className="text-black/40 mb-8 text-sm">Create a strong new password for your account.</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">New Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-all pr-10" />
                    <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{showPass ? '🙈' : '👁'}</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] transition-all" />
                </div>
                <button onClick={handleReset} disabled={!password || !confirm || loading}
                  className="w-full text-sm font-medium py-3.5 rounded-xl bg-[#b89b6b] text-white hover:bg-[#a08860] transition-colors disabled:opacity-50">
                  {loading ? 'Resetting...' : 'Reset Password ↗'}
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-6">✓</div>
              <h1 className="font-baskerville text-[36px] text-[#1a1a1a] mb-2">Password reset!</h1>
              <p className="text-black/40 mb-8 text-sm">Your password has been updated successfully.</p>
              <Link href="/login" className="block w-full bg-[#174a37] text-white text-sm font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors text-center">
                Sign In Now →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
