'use client';
import { SuccessModal } from '@/components/Modals';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

function PaymentSuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.5)'}}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">✓</div>
        </div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Payment Successful!</h3>
        <p className="text-black/40 text-sm mb-2">Transaction ID: TXN-2025-0042</p>
        <p className="font-baskerville text-3xl text-[#174a37] mb-6">AED 15,000</p>
        <button onClick={onClose} className="w-full bg-[#174a37] text-white py-3.5 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">View Booking</button>
      </div>
    </div>
  );
}

export default function BookingPaymentPage() {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('card');
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {success && <PaymentSuccessModal onClose={() => { setSuccess(false); window.location.href='/my-bookings'; }} />}
      <LoggedInNav />
      <main className="flex-1 max-w-5xl mx-auto px-8 py-10 w-full">
        <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
          <Link href="/my-bookings" className="hover:text-[#174a37]">My Bookings</Link>
          <span>/</span><span className="text-[#1a1a1a]">Make Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-5">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-5">Payment Method</h2>
              <div className="flex flex-col gap-3 mb-6">
                {[['card','💳 Credit / Debit Card'],['apple','🍎 Apple Pay'],['bank','🏦 Bank Transfer']].map(([id,label])=>(
                  <label key={id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${method===id?'border-[#174a37] bg-[#f9f6ef]':'border-[rgba(184,154,105,0.3)] hover:border-[#b89b6b]'}`}>
                    <input type="radio" name="method" value={id} checked={method===id} onChange={()=>setMethod(id)} className="accent-[#174a37]"/>
                    <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
                  </label>
                ))}
              </div>

              {method === 'card' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input placeholder="1234 5678 9012 3456" className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input placeholder="MM / YY" className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input placeholder="123" className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input placeholder="Enter name on card" className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
                  </div>
                </div>
              )}
              {method === 'bank' && (
                <div className="bg-[#f9f6ef] rounded-xl p-5">
                  <p className="text-sm font-medium text-[#1a1a1a] mb-3">Transfer to:</p>
                  {[['Bank','Emirates NBD'],['Account Name','HoneyMoon Events LLC'],['IBAN','AE07 0331 2345 6789 0123 456'],['Reference',`BK-2025-0001`]].map(([l,v])=>(
                    <div key={l} className="flex items-center justify-between py-1.5">
                      <p className="text-xs text-black/40">{l}</p>
                      <p className="text-sm font-medium text-[#1a1a1a] font-mono">{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.06)] h-fit">
            <h3 className="font-baskerville text-lg text-[#1a1a1a] mb-4">Payment Summary</h3>
            <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-[rgba(184,154,105,0.1)]">
              <div className="flex justify-between text-sm"><span className="text-black/50">Booking</span><span className="font-medium">BK-2025-0001</span></div>
              <div className="flex justify-between text-sm"><span className="text-black/50">Vendor</span><span className="font-medium">Al Habtoor Palace</span></div>
              <div className="flex justify-between text-sm"><span className="text-black/50">Instalment</span><span className="font-medium">2nd Payment (25%)</span></div>
            </div>
            <div className="flex justify-between mb-5">
              <span className="font-medium text-[#1a1a1a]">Total Due</span>
              <span className="font-baskerville text-2xl text-[#174a37]">AED 15,000</span>
            </div>
            <button onClick={() => setSuccess(true)} className="w-full bg-[#b89b6b] text-white py-3.5 rounded-xl font-medium hover:bg-[#a08860] transition-colors">
              Pay AED 15,000
            </button>
            <p className="text-center text-xs text-black/30 mt-3">🔒 Secured by SSL encryption</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
