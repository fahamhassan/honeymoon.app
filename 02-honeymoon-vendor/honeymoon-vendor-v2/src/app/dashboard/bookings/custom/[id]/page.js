'use client';
import { useApi } from '../../../../../hooks/useApi';
import VendorService from '../../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

const STATUS_COLORS = {
  Requested:'text-blue-600', Pending:'text-amber-600',
  Upcoming:'text-purple-600', Completed:'text-green-600', Rejected:'text-red-600'
};

function PieChart({ amount, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28 mb-2">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#174a37" strokeWidth="3" strokeDasharray="65 35"/>
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#b89b6b" strokeWidth="3" strokeDasharray="35 65" strokeDashoffset="-65"/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[8px] text-gray-500">Venue</p>
          <p className="text-xs font-semibold text-[#1a1a1a] leading-tight">{amount}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center leading-4 max-w-[120px]">{label}</p>
    </div>
  );
}

export default function VendorCustomQuotationDetailPage({ params }) {
  const qId = params?.id || '';
  const { data, loading, refresh } = useApi(VendorService.getCustomQuotation, qId);
  const quotation = data?.quotation || {};
  const user = data?.user || {};
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('Requested');
  const [quotationAmount, setQuotationAmount] = useState('');

  function doSend() { setStatus('Pending'); setModal(null); setSuccess('Quotation sent to customer successfully.'); }
  function doReject() { setStatus('Rejected'); setModal(null); setSuccess('Request rejected.'); }

  return (
    <div>
      {/* Pop Up - 54: Send quotation confirm */}
      {modal === 'send' && (
        <ConfirmModal
          title="Send Quotation"
          message="Are you sure you want to send this quotation to the customer?"
          onYes={doSend}
          onNo={() => setModal(null)}
        />
      )}
      {/* Pop Up - 55: Reject request confirm */}
      {modal === 'reject' && (
        <ConfirmModal
          title="Reject Request"
          message="Are you sure you want to reject this booking request?"
          onYes={doReject}
          onNo={() => setModal(null)}
        />
      )}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/bookings" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Custom Quotation Details</h1>
      </div>

      {/* Request info card */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5">
        <div className="flex items-start justify-between mb-5">
          <div className="flex gap-6 text-sm flex-wrap">
            <div><p className="text-gray-400 text-xs">Request ID:</p><p className="font-medium">#{params.id}</p></div>
            <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium">User ABC</p></div>
            <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">123456789</p></div>
            <div><p className="text-gray-400 text-xs">Email:</p><p className="font-medium">user@gmail.com</p></div>
          </div>
          <div><span className="text-xs text-gray-400">Status: </span>
            <span className={`text-sm font-semibold ${STATUS_COLORS[status]}`}>{status}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Services To Be Availed</p>
          <div className="flex gap-2 flex-wrap">
            {['Service ABC','Service ABC','Service ABC'].map((s,i)=>(
              <span key={i} className="bg-[#174a37] text-white text-xs px-5 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Location:</p><p className="font-medium">Location ABC</p></div>
          <div><p className="text-gray-400 text-xs">Event Date:</p><p className="font-medium">mm/dd/yyyy</p></div>
          <div><p className="text-gray-400 text-xs">Event Time:</p><p className="font-medium">HH:MM – HH:MM</p></div>
          <div><p className="text-gray-400 text-xs">No. Of Guests:</p><p className="font-medium">200</p></div>
          <div className="sm:col-span-2"><p className="text-gray-400 text-xs">Budget Range:</p><p className="font-medium">2000 AED – 5000 AED</p></div>
        </div>

        <div className="mb-4 text-sm">
          <p className="text-gray-400 text-xs mb-1">Additional Note:</p>
          <p className="text-gray-600 leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.</p>
        </div>

        <div>
          <p className="text-gray-400 text-xs mb-2">Inspirational Images:</p>
          <div className="flex gap-2">
            {[IMG1,IMG2,IMG3].map((img,i)=>(
              <div key={i} className="w-28 h-24 rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover"/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation card */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5">
        <h2 className="font-baskerville text-2xl text-[#1a1a1a] text-center mb-2">AI Recommendation</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Most couples in the [User Defined Location] with 300 guests spend 7000 AED – 9000 AED or 8000 AED on average
        </p>
        <div className="flex justify-center gap-12">
          <PieChart amount="Venue 8000 AED" label="Spending Graph according to AI Recommended Budget Range"/>
          <PieChart amount="Venue 5000 AED" label="Spending Graph according to your provided Budget Range"/>
        </div>

        {status === 'Requested' && (
          <div className="mt-6 max-w-sm mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Your Quotation Amount (AED)</label>
            <input value={quotationAmount} onChange={e => setQuotationAmount(e.target.value)}
              placeholder="Enter your quote..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4] text-center"/>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          {status === 'Requested' && <>
            <button onClick={() => setModal('send')}
              className="flex items-center gap-2 bg-[#174a37] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">
              Send Quotation ↗
            </button>
            <button onClick={() => setModal('reject')}
              className="flex items-center gap-2 border border-gray-300 text-gray-600 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
              Reject Request ↗
            </button>
          </>}
          {status === 'Pending' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-3 text-amber-700 text-sm font-medium">
              ⏳ Waiting for customer confirmation
            </div>
          )}
          {status === 'Rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-3 text-red-600 text-sm font-medium">
              ✕ Request has been rejected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
