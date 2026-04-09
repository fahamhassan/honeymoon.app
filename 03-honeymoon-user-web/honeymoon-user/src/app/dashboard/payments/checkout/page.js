'use client';
import { SuccessModal } from '@/components/Modals';
import UserService from '../../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgVenueImg = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

function PaymentSuccessModal({ amount, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[440px] p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-[#f4ebd0] rounded-full flex items-center justify-center text-[#174a37] text-3xl mx-auto mb-6">✓</div>
        <h2 className="font-baskerville text-[32px] text-[#174a37] mb-3">Payment Successful!</h2>
        <p className="text-black/50 text-[15px] leading-6 mb-2">
          <span className="font-baskerville text-[28px] text-[#174a37] block mb-1">AED {amount.toLocaleString()}</span>
          paid to Al Habtoor Palace
        </p>
        <p className="text-black/30 text-xs mb-8">A receipt has been sent to your email address.</p>
        <div className="flex gap-3">
          <Link href="/dashboard/payments" className="flex-1 bg-[#174a37] text-white font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors text-center text-sm">
            View Payments
          </Link>
          <button onClick={onClose} className="flex-1 border border-[rgba(184,154,105,0.3)] text-[#b89b6b] font-medium py-3 rounded-xl hover:bg-[#f4ebd0] transition-colors text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const amount = 15000;

  return (
    <div className="max-w-[1000px]">
      {showSuccess && <PaymentSuccessModal amount={amount} onClose={() => setShowSuccess(false)} />}

      <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
        <Link href="/dashboard/payments" className="hover:text-[#174a37] transition-colors">Payments</Link>
        <span>/</span>
        <span className="text-[#1a1a1a]">Checkout</span>
      </div>

      <h1 className="font-baskerville text-[36px] text-[#1a1a1a] mb-8">Make Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment form */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { id: 'card', label: 'Credit / Debit', icon: '💳' },
                { id: 'apple', label: 'Apple Pay', icon: '' },
                { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
              ].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    method === m.id ? 'border-[#174a37] bg-[#f4ebd0]' : 'border-[rgba(184,154,105,0.2)] hover:border-[#b89b6b]'
                  }`}>
                  <span className="text-2xl">{m.icon}</span>
                  <span className={`text-xs font-medium ${method === m.id ? 'text-[#174a37]' : 'text-black/60'}`}>{m.label}</span>
                </button>
              ))}
            </div>

            {method === 'card' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Card Number</label>
                  <input value={card.number} onChange={e => setCard(p => ({ ...p, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] font-mono transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Expiry Date</label>
                    <input value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry: e.target.value }))}
                      placeholder="MM / YY"
                      className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">CVV</label>
                    <input value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.slice(0, 4) }))}
                      placeholder="•••"
                      type="password"
                      className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Cardholder Name</label>
                  <input value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                    placeholder="Rashed Kabir"
                    className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-all" />
                </div>
              </div>
            )}

            {method === 'apple' && (
              <div className="flex items-center justify-center py-10 bg-[#f9f6ef] rounded-xl">
                <div className="text-center">
                  <div className="text-5xl mb-3"></div>
                  <p className="text-sm text-black/50">Touch ID or Face ID to pay</p>
                  <p className="text-xs text-black/30 mt-1">Available on Safari / iOS</p>
                </div>
              </div>
            )}

            {method === 'bank' && (
              <div className="bg-[#f9f6ef] rounded-xl p-5">
                <p className="text-sm font-medium text-[#1a1a1a] mb-4">Bank Transfer Details</p>
                {[['Bank', 'Emirates NBD'], ['Account Name', 'HoneyMoon Platform FZ LLC'], ['IBAN', 'AE07 0331 2345 6789 0123 456'], ['Reference', 'BK-2025-0001']].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm py-2 border-b border-[rgba(184,154,105,0.1)] last:border-0">
                    <span className="text-black/50">{l}</span>
                    <span className="font-medium text-[#1a1a1a] font-mono text-xs">{v}</span>
                  </div>
                ))}
                <p className="text-xs text-black/40 mt-4">Payment processing may take 1–2 business days.</p>
              </div>
            )}
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-3 px-4">
            <span className="text-green-500">🔒</span>
            <p className="text-xs text-black/40">Payments are secured with 256-bit SSL encryption. Your card details are never stored on our servers.</p>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)] sticky top-[88px]">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Order Summary</h2>

            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[rgba(184,154,105,0.1)]">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <img src={imgVenueImg} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#1a1a1a] truncate">Al Habtoor Palace</p>
                <p className="text-xs text-black/40 mt-0.5">Gold Package · June 15, 2026</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {[['Package Total', 'AED 65,000'], ['Deposit (25%)', `AED ${amount.toLocaleString()}`], ['Processing Fee', 'AED 0'], ['Tax (5%)', `AED ${(amount * 0.05).toLocaleString()}`]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-black/50">{l}</span>
                  <span className="text-[#1a1a1a]">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-4 border-t border-[rgba(184,154,105,0.15)] mb-5">
              <span className="font-medium text-[#1a1a1a]">Total Due Now</span>
              <span className="font-baskerville text-[28px] text-[#174a37]">AED {(amount * 1.05).toLocaleString()}</span>
            </div>

            <button onClick={() => setShowSuccess(true)}
              className="w-full bg-[#174a37] text-white font-medium py-4 rounded-xl hover:bg-[#1a5c45] transition-colors shadow-[0_4px_16px_rgba(23,74,55,0.2)]">
              Pay AED {(amount * 1.05).toLocaleString()}
            </button>

            <Link href="/dashboard/bookings" className="block text-center text-sm text-black/40 hover:text-[#b89b6b] transition-colors mt-4">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
