'use client';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

function RedeemModal({ points, onClose, onRedeem }) {
  const [amount, setAmount] = useState('');
  const maxRedeem = Math.floor(points / 10);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.5)'}}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black/30 hover:text-black/60 text-xl">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-2">Redeem Points</h3>
        <p className="text-black/40 text-sm mb-5">10 points = AED 1 discount on your next booking.</p>
        <div className="bg-[#f9f6ef] rounded-xl p-4 mb-5">
          <p className="text-black/40 text-xs">Available Points</p>
          <p className="font-baskerville text-3xl text-[#174a37]">{points.toLocaleString()} pts</p>
          <p className="text-black/40 text-xs mt-1">= Up to AED {maxRedeem} discount</p>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Points to Redeem</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            max={points} placeholder={`Max ${points}`}
            className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
          {amount && <p className="text-[#174a37] text-sm mt-1">= AED {Math.floor(parseInt(amount||0)/10)} discount</p>}
        </div>
        <button onClick={() => amount && parseInt(amount) <= points && onRedeem(parseInt(amount))}
          className="w-full bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">
          Redeem Now
        </button>
      </div>
    </div>
  );
}

const HISTORY = [
  { id:1, type:'earned', desc:'Booking with Al Habtoor Palace', points:450, date:'Jan 12, 2025', booking:'BK0001' },
  { id:2, type:'earned', desc:'Booking with Studio Lumière', points:85, date:'Jan 20, 2025', booking:'BK0002' },
  { id:3, type:'redeemed', desc:'Redeemed on booking BK0003', points:-200, date:'Jan 25, 2025', booking:'BK0003' },
  { id:4, type:'earned', desc:'Referral bonus - Ahmed M.', points:100, date:'Feb 1, 2025', booking:'-' },
  { id:5, type:'earned', desc:'Booking with Glamour Touch', points:32, date:'Feb 5, 2025', booking:'BK0004' },
];

const tiers = [
  { name:'Bronze', min:0, max:500, color:'#cd7f32', perks:'5% discount on bookings' },
  { name:'Silver', min:500, max:1500, color:'#C0C0C0', perks:'10% discount + priority support' },
  { name:'Gold', min:1500, max:5000, color:'#b89b6b', perks:'15% discount + dedicated manager' },
  { name:'Platinum', min:5000, max:null, color:'#E5E4E2', perks:'20% discount + exclusive access' },
];

export default function LoyaltyPage() {
  const { data, loading } = useApi(UserService.getLoyalty);
  const loyalty = data || {};
  const [points] = useState(667);
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemed, setRedeemed] = useState(0);

  const currentTier = tiers.find(t => points >= t.min && (t.max === null || points < t.max));
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progress = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;
  const historyList = Array.isArray(loyalty?.history) ? loyalty.history : HISTORY;

  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {showRedeem && <RedeemModal points={points} onClose={() => setShowRedeem(false)} onRedeem={p => { setRedeemed(p); setShowRedeem(false); }} />}
      {redeemed > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white rounded-2xl w-full max-w-[380px] p-10 text-center shadow-2xl">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Points Redeemed!</h3>
            <p className="text-black/40 text-sm mb-6">{redeemed} points = AED {Math.floor(redeemed/10)} discount applied to your account.</p>
            <button onClick={() => setRedeemed(0)} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium">Done</button>
          </div>
        </div>
      )}
      <LoggedInNav />
      <main className="flex-1 max-w-4xl mx-auto px-8 py-10 w-full">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] lg:text-[40px] text-[#b89b6b] mb-8">Loyalty Points</h1>

        {/* Points card */}
        <div className="bg-[#174a37] rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute right-8 top-8 text-[120px] opacity-5 select-none">⭐</div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/50 text-sm uppercase tracking-wider">Your Balance</p>
              <p className="font-baskerville text-[56px] text-[#b89b6b] leading-none">{points.toLocaleString()}</p>
              <p className="text-white/50 text-sm">loyalty points</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm font-semibold" style={{color: currentTier?.color}}>{currentTier?.name} Member</span>
                <span className="text-white/30 text-xs">·</span>
                <span className="text-white/50 text-xs">{nextTier ? `${(nextTier.min - points).toLocaleString()} pts to ${nextTier.name}` : 'Maximum tier reached'}</span>
              </div>
              {nextTier && (
                <div className="mt-3 w-48">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#b89b6b] rounded-full transition-all" style={{width:`${progress}%`}} />
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setShowRedeem(true)}
              className="bg-[#b89b6b] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#a08860] transition-colors">
              Redeem Points
            </button>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {tiers.map(t => (
            <div key={t.name} className={`bg-white rounded-2xl p-4 shadow-[0_2px_15px_rgba(0,0,0,0.06)] ${currentTier?.name===t.name?'ring-2 ring-[#b89b6b]':''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2" style={{background:t.color}}>★</div>
              <p className="font-medium text-sm text-[#1a1a1a]">{t.name}</p>
              <p className="text-black/30 text-xs mt-0.5">{t.min.toLocaleString()}{t.max?`–${t.max.toLocaleString()}`:'+'} pts</p>
              <p className="text-black/50 text-xs mt-1.5 leading-4">{t.perks}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(184,154,105,0.08)]">
            <h2 className="font-baskerville text-xl text-[#1a1a1a]">Points History</h2>
          </div>
          {historyList.map(h => (
            <div key={h.id} className="flex items-center gap-4 px-6 py-4 border-b border-[rgba(184,154,105,0.06)] hover:bg-[#fafaf8] transition-colors last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${h.type==='earned'?'bg-green-100':'bg-red-50'}`}>
                {h.type === 'earned' ? '↑' : '↓'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a1a]">{h.desc}</p>
                <p className="text-xs text-black/30">{h.date} · {h.booking !== '-' ? `Booking ${h.booking}` : 'Referral'}</p>
              </div>
              <p className={`font-baskerville text-xl font-medium flex-shrink-0 ${h.type==='earned'?'text-green-600':'text-red-500'}`}>
                {h.type==='earned'?'+':''}{h.points} pts
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
