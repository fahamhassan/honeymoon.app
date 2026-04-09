'use client';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const IMG1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const STAR = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";

function SuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{background:'rgba(0,0,0,0.5)'}}>
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-10 text-center shadow-2xl">
        <div className="text-5xl mb-4">⭐</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Review Submitted!</h3>
        <p className="text-black/40 text-sm mb-6">Thank you for sharing your experience. Your review helps other couples.</p>
        <button onClick={onClose} className="w-full bg-[#b89b6b] text-white py-3 rounded-xl font-medium hover:bg-[#a08860] transition-colors">Done</button>
      </div>
    </div>
  );
}

export default function SubmitReviewPage() {
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ title: '', review: '', recommend: true });
  const [success, setSuccess] = useState(false);

  const aspects = [
    { label: 'Communication', rating: 0 },
    { label: 'Value for Money', rating: 0 },
    { label: 'Quality of Service', rating: 0 },
    { label: 'Professionalism', rating: 0 },
  ];
  const [aspectRatings, setAspectRatings] = useState(aspects.map(a => ({ ...a })));

  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {success && <SuccessModal onClose={() => { setSuccess(false); window.location.href = '/my-bookings'; }} />}
      <LoggedInNav />
      <main className="flex-1 max-w-3xl mx-auto px-8 py-10 w-full">
        <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
          <Link href="/my-bookings" className="hover:text-[#174a37]">My Bookings</Link>
          <span>/</span><span className="text-[#1a1a1a]">Leave a Review</span>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
          {/* Vendor info */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[rgba(184,154,105,0.1)]">
            <div className="w-16 h-16 rounded-2xl overflow-hidden">
              <img src={IMG1} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-baskerville text-xl text-[#1a1a1a]">Al Habtoor Palace</p>
              <p className="text-black/40 text-sm">Venue · Dubai Marina</p>
              <p className="text-black/30 text-xs mt-0.5">Booking #BK-2025-0001 · Jun 15, 2026</p>
            </div>
          </div>

          {/* Overall rating */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">Overall Rating</p>
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="text-4xl transition-transform hover:scale-110">
                  <span className={(hover || rating) >= s ? 'text-amber-400' : 'text-gray-200'}>★</span>
                </button>
              ))}
            </div>
            <p className="text-black/40 text-sm mt-2">
              {rating === 5 ? 'Outstanding!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Tap to rate'}
            </p>
          </div>

          {/* Aspect ratings */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {aspectRatings.map((a, i) => (
              <div key={a.label} className="bg-[#f9f6ef] rounded-xl p-4">
                <p className="text-xs text-black/50 mb-2">{a.label}</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setAspectRatings(p => p.map((x, j) => j===i ? {...x, rating:s} : x))}
                      className={`text-lg ${a.rating >= s ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Written review */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
            <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
              placeholder="Summarise your experience"
              className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea value={form.review} onChange={e => setForm(p => ({...p, review: e.target.value}))}
              rows={4} placeholder="Share your experience with other couples..."
              className="w-full border border-[#d4d4d4] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] resize-none bg-[#faf8f4]" />
          </div>

          {/* Recommend */}
          <div className="flex items-center gap-3 mb-6 bg-[#f9f6ef] rounded-xl p-4">
            <input type="checkbox" checked={form.recommend} onChange={e => setForm(p => ({...p, recommend: e.target.checked}))}
              className="w-5 h-5 accent-[#174a37] cursor-pointer" />
            <p className="text-sm text-[#1a1a1a]">I would recommend this vendor to other couples</p>
          </div>

          <button onClick={() => rating > 0 && form.review && setSuccess(true)}
            className="w-full bg-[#b89b6b] text-white py-3.5 rounded-full font-medium hover:bg-[#a08860] transition-colors">
            Submit Review
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
