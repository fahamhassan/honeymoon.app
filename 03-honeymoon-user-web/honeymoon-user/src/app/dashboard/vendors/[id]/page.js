'use client';
import { useApi } from '../../../../hooks/useApi';
import UserService from '../../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgRectangle3883 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgStar = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Emblema_del_Quinto_Centenario.svg/200px-Emblema_del_Quinto_Centenario.svg.png";
const imgUnsplash1 = "https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";
const imgUnsplash2 = "https://ui-avatars.com/api/?name=Omar+H&background=b89b6b&color=fff&size=200";
const imgPhotoImg = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgBeautyImg = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

// ── Booking Request Modal ──────────────────────────────────────────────────
function BookingModal({ vendor, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState('Gold Package');
  const [guests, setGuests] = useState('200');
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#174a37] px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider">Booking Request</p>
            <h2 className="font-baskerville text-[24px] text-[#b89b6b] mt-0.5">{vendor}</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl transition-colors">✕</button>
        </div>

        {step === 1 && (
          <div className="p-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#174a37]' : 'bg-[#f4ebd0]'}`} />
              ))}
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-5">Select a Package</h3>
            <div className="flex flex-col gap-3 mb-8">
              {(services.length ? services.map(s => ({ name: s.name, price: `AED ${(s.basePrice||0).toLocaleString()}`, desc: s.description || '' })) : [
                { name: 'Silver Package', price: 'AED 45,000', desc: '5-hour hire · Basic decoration · 150 guests' },
                { name: 'Gold Package', price: 'AED 65,000', desc: '8-hour hire · Premium decoration · 300 guests' },
                { name: 'Platinum Package', price: 'AED 80,000', desc: 'Full day · Luxury decoration · 500 guests' },
              ]).map(p => (
                <button key={p.name} onClick={() => setPkg(p.name)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${pkg === p.name ? 'border-[#174a37] bg-[#f4ebd0]' : 'border-[rgba(184,154,105,0.2)]'}`}>
                  <div>
                    <p className={`text-sm font-medium ${pkg === p.name ? 'text-[#174a37]' : 'text-[#1a1a1a]'}`}>{p.name}</p>
                    <p className="text-black/40 text-xs mt-0.5">{p.desc}</p>
                  </div>
                  <p className="font-baskerville text-[18px] text-[#174a37]">{p.price}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-[#174a37] text-white font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors">
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="p-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#174a37]' : 'bg-[#f4ebd0]'}`} />
              ))}
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-5">Wedding Details</h3>
            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Wedding Date</label>
                <input type="date" defaultValue="2026-06-15"
                  className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-all" />
              </div>
              <div>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Expected Guests</label>
                <input value={guests} onChange={e => setGuests(e.target.value)}
                  className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-all" />
              </div>
              <div>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Special Requests</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={3} placeholder="Any specific requirements or questions..."
                  className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] resize-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-[rgba(184,154,105,0.3)] text-black/50 font-medium py-3.5 rounded-xl hover:bg-[#f4ebd0] transition-colors">← Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-[#174a37] text-white font-medium py-3.5 rounded-xl hover:bg-[#1a5c45] transition-colors">Review →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-[#174a37]' : 'bg-[#f4ebd0]'}`} />
              ))}
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-5">Review & Confirm</h3>
            <div className="bg-[#f9f6ef] rounded-xl p-5 mb-6 flex flex-col gap-3">
              {[
                { l: 'Vendor', v: vendor },
                { l: 'Package', v: pkg },
                { l: 'Date', v: 'June 15, 2026' },
                { l: 'Guests', v: guests },
                { l: 'Deposit Required', v: 'AED 16,250 (25%)' },
              ].map(({ l, v }) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-black/50">{l}</span>
                  <span className="font-medium text-[#1a1a1a]">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-black/40 mb-6 leading-5">
              By submitting, you agree to the booking terms. The vendor will review your request and respond within 24 hours.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-[rgba(184,154,105,0.3)] text-black/50 font-medium py-3.5 rounded-xl hover:bg-[#f4ebd0] transition-colors">← Back</button>
              <button onClick={onConfirm} className="flex-1 bg-[#b89b6b] text-white font-medium py-3.5 rounded-xl hover:bg-[#a08860] transition-colors">Submit Request ✦</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Booking Confirmed Modal ─────────────────────────────────────────────────
function ConfirmedModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[440px] p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-[#f4ebd0] rounded-full flex items-center justify-center text-[#174a37] text-3xl mx-auto mb-6">✓</div>
        <h2 className="font-baskerville text-[32px] text-[#174a37] mb-3">Request Sent!</h2>
        <p className="text-black/50 text-[15px] leading-6 mb-8">
          Your booking request has been sent to Al Habtoor Palace. They'll respond within 24 hours. We'll notify you by email.
        </p>
        <div className="flex gap-3">
          <Link href="/dashboard/bookings" className="flex-1 bg-[#174a37] text-white font-medium py-3 rounded-xl hover:bg-[#1a5c45] transition-colors text-center text-sm">
            View Bookings
          </Link>
          <button onClick={onClose} className="flex-1 border border-[rgba(184,154,105,0.3)] text-[#b89b6b] font-medium py-3 rounded-xl hover:bg-[#f4ebd0] transition-colors text-sm">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendorDetailPage({ params }) {
  const vId = params?.id || '';
  const { data, loading } = useApi(UserService.getVendor, vId);
  const vendor = data?.vendor || {};
  const services = data?.services || [];
  const [showBooking, setShowBooking] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  return (
    <div className="max-w-[1100px]">
      {showBooking && (
        <BookingModal vendor="Al Habtoor Palace"
          onClose={() => setShowBooking(false)}
          onConfirm={() => { setShowBooking(false); setShowConfirmed(true); }} />
      )}
      {showConfirmed && <ConfirmedModal onClose={() => setShowConfirmed(false)} />}

      <div className="flex items-center gap-2 mb-6 text-sm text-black/40">
        <Link href="/dashboard/vendors" className="hover:text-[#174a37] transition-colors">Vendors</Link>
        <span>/</span>
        <span className="text-[#1a1a1a]">Al Habtoor Palace</span>
      </div>

      {/* Hero images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden h-[300px]">
        <div className="col-span-1 md:col-span-2 overflow-hidden">
          <img src={imgRectangle3883} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className="overflow-hidden rounded-tr-2xl">
            <img src={imgPhotoImg} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="overflow-hidden rounded-br-2xl">
            <img src={imgBeautyImg} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[#b89b6b] text-xs uppercase tracking-wider font-medium">Venue</span>
              <h1 className="font-baskerville text-[40px] text-[#1a1a1a] mt-1">Al Habtoor Palace</h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <img key={i} src={imgStar} alt="" className="w-4 h-4 object-contain" />)}
                  <span className="text-sm font-medium text-[#1a1a1a] ml-1">4.9</span>
                  <span className="text-sm text-black/40">(128 reviews)</span>
                </div>
                <span className="text-black/50 text-sm">📍 Dubai Marina</span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-[#174a37] text-white text-sm font-bold px-4 py-2 rounded-full">✦ 98% match</div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">About</h2>
            <p className="text-black/60 leading-7 text-sm">Al Habtoor Palace is Dubai's most prestigious luxury wedding venue, nestled within the magnificent Al Habtoor City complex. With its stunning Baroque-inspired architecture, crystal chandeliers, and world-class service, it offers an unparalleled setting for luxury Emirati weddings.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[{ label: 'Capacity', value: '50–500 guests' }, { label: 'Style', value: 'Luxury, Palace' }, { label: 'Availability', value: '✓ Your date' }].map(({ label, value }) => (
                <div key={label} className="bg-[#f9f6ef] rounded-xl p-4">
                  <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
                  <p className="text-[#1a1a1a] font-medium text-sm mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Packages</h2>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Silver Package', price: 'AED 45,000', guests: 'Up to 150', features: ['5-hour venue hire', 'Basic decoration', 'Bridal suite', 'Parking'] },
                { name: 'Gold Package', price: 'AED 65,000', guests: 'Up to 300', features: ['8-hour venue hire', 'Premium decoration', 'Bridal suite', 'Catering coordinator', 'Valet'], popular: true },
                { name: 'Platinum Package', price: 'AED 80,000', guests: 'Up to 500', features: ['Full day hire', 'Luxury decoration', 'Bridal suite', 'In-house catering', 'Valet', 'Wedding coordinator'] },
              ].map(pkg => (
                <div key={pkg.name} className={`border rounded-xl p-4 flex items-start justify-between ${pkg.popular ? 'border-[#b89b6b] bg-[#faf7f0]' : 'border-[rgba(184,154,105,0.2)]'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#1a1a1a]">{pkg.name}</p>
                      {pkg.popular && <span className="bg-[#b89b6b] text-white text-[10px] px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                    <p className="text-black/40 text-xs mt-1">{pkg.guests}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pkg.features.map(f => <span key={f} className="text-xs text-black/50 bg-white border border-[rgba(184,154,105,0.2)] px-2 py-0.5 rounded-full">{f}</span>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-baskerville text-[22px] text-[#174a37]">{pkg.price}</p>
                    <button onClick={() => setShowBooking(true)} className="mt-2 bg-[#174a37] text-white text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#1a5c45] transition-colors">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6">
            <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-4">Client Reviews</h2>
            {[
              { name: 'Aisha Al Mansoori', date: 'March 2025', text: 'Absolutely magnificent. Our 300-guest wedding was flawless. Every detail was perfect.', img: imgUnsplash1 },
              { name: 'James Milner', date: 'January 2025', text: 'The palace exceeded every expectation. Professional team, stunning venue.', img: imgUnsplash2 },
            ].map(r => (
              <div key={r.name} className="flex gap-4 pb-4 border-b border-[rgba(184,154,105,0.1)] last:border-0 mb-4 last:mb-0">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-medium text-sm text-[#1a1a1a]">{r.name}</p>
                    <span className="text-black/30 text-xs">{r.date}</span>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <img key={i} src={imgStar} alt="" className="w-3 h-3" />)}</div>
                  </div>
                  <p className="text-black/60 text-sm mt-1 leading-6">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking sidebar */}
        <div>
          <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 sticky top-[88px]">
            <p className="text-black/40 text-xs uppercase tracking-wider mb-1">Starting from</p>
            <p className="font-baskerville text-[36px] text-[#174a37]">AED 45,000</p>
            <div className="my-4 h-px bg-[rgba(184,154,105,0.15)]" />
            <div className="flex flex-col gap-3 text-sm mb-6">
              {[['Your Date', 'June 15, 2026'], ['Guests', '~200'], ['Style', 'Luxury Emirati'], ['AI Match', '98%']].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span className="text-black/40">{l}</span>
                  <span className="text-[#1a1a1a] font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowBooking(true)}
                className="w-full bg-[#174a37] text-white font-medium py-3 rounded-[10px] hover:bg-[#1a5c45] transition-colors">
                Request Booking
              </button>
              <Link href="/dashboard/chat" className="w-full border border-[rgba(184,154,105,0.4)] text-[#b89b6b] font-medium py-3 rounded-[10px] hover:bg-[#f4ebd0] transition-colors text-center text-sm">
                Message Vendor
              </Link>
              <button onClick={() => setShortlisted(!shortlisted)}
                className="w-full text-black/40 text-sm hover:text-[#b89b6b] transition-colors py-1">
                {shortlisted ? '❤️ Shortlisted' : '♡ Add to Shortlist'}
              </button>
              <Link href="/dashboard/compare" className="w-full text-center text-black/30 text-xs hover:text-[#b89b6b] transition-colors">
                Compare with others ⚖
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
