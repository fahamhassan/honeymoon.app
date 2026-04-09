'use client';
import { AuthService } from '../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';

const BG_IMG = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const LOGO_ICON = "/logo-icon.png";
const LOGO_TEXT = "/logo-text.png";
const LOGO_AR = "/logo-arabic.png";

function SuccessModal({ onOk }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-[380px] text-center relative">
        <button onClick={onOk} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Successful</h3>
        <p className="text-gray-500 text-sm mb-6">Your Password Has Been Reset. Please Login To Continue.</p>
        <button onClick={onOk} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Ok</button>
      </div>
    </div>
  );
}

export default function VendorForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#f4ebd0'}}>
      {success && <SuccessModal onOk={() => { setSuccess(false); window.location.href='/login'; }} />}
      <div className="flex items-center gap-10 max-w-5xl w-full px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-[420px] flex-shrink-0">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 border-2 border-[#b89b6b] rounded-full flex items-center justify-center mb-3">
              <img src={LOGO_ICON} alt="" className="w-10 h-10 object-contain" />
            </div>
            <img src={LOGO_TEXT} alt="HONEYMOON" className="h-4 mb-0.5" />
            <img src={LOGO_AR} alt="" className="h-3" />
          </div>
          <h2 className="font-baskerville text-3xl text-center mb-2">Forgot Password</h2>
          <p className="text-gray-400 text-sm text-center mb-6 leading-5">
            {step===1 && 'Enter your email address to receive a verification code'}
            {step===2 && 'An email has been sent. Please enter the verification code.'}
            {step===3 && 'Set New Password for your Account'}
          </p>

          {step===1 && <>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Address<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4] mb-6">
              <span className="text-gray-400 mr-2">✉</span>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter Email Address" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
            <button onClick={() => email && setStep(2)} className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#1a5c45] transition-colors">Continue ↗</button>
          </>}

          {step===2 && <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4] mb-1">
              <span className="text-gray-400 mr-2">🛡</span>
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter Verification Code" className="flex-1 bg-transparent text-sm outline-none" />
            </div>
            <div className="flex justify-end mb-6"><button className="text-sm text-[#b89b6b] hover:underline">Resend Code</button></div>
            <button onClick={() => code && setStep(3)} className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#1a5c45] transition-colors">Continue ↗</button>
          </>}

          {step===3 && <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password<span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
                <span className="text-gray-400 mr-2">🔒</span>
                <input type={showP?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter Password" className="flex-1 bg-transparent text-sm outline-none" />
                <button onClick={()=>setShowP(!showP)} className="text-gray-400 text-xs">{showP?'🙈':'👁'}</button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password<span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
                <span className="text-gray-400 mr-2">🔒</span>
                <input type={showC?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm Password" className="flex-1 bg-transparent text-sm outline-none" />
                <button onClick={()=>setShowC(!showC)} className="text-gray-400 text-xs">{showC?'🙈':'👁'}</button>
              </div>
            </div>
            <button onClick={() => password && setSuccess(true)} className="w-full bg-[#174a37] text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#1a5c45] transition-colors">Update ↗</button>
          </>}

          <div className="text-center mt-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-[#174a37] underline">Back to Login</Link>
          </div>
        </div>
        <div className="flex-1 hidden lg:block">
          <div className="rounded-2xl overflow-hidden h-[500px]">
            <img src={BG_IMG} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
