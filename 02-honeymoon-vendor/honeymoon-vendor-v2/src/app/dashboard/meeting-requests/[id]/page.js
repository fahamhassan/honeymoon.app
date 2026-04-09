'use client';
import { useApi } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const transitions = {
  Pending: { next: 'Contacted', action: 'Mark as Contacted', color: 'text-amber-600' },
  Contacted: { next: 'Meeting Scheduled', action: 'Schedule Meeting', color: 'text-blue-600' },
  'Meeting Scheduled': { next: 'Converted', action: 'Mark as Converted', color: 'text-purple-600' },
  Lost: { next: null, action: null, color: 'text-red-600' },
  Converted: { next: null, action: null, color: 'text-green-600' },
};

export default function VendorRequestDetailPage({ params }) {
  const mId = params?.id || '';
  const { data, loading, refresh } = useApi(VendorService.getMeetingRequest, mId);
  const meeting = data?.meeting || {};
  const [status, setStatus] = useState('Pending');
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');

  const config = transitions[status] || {};

  return (
    <div className="max-w-2xl">
      {modal && <ConfirmModal message={`${modal} this meeting request?`} onYes={() => {
        if (modal === 'Convert') setStatus('Converted');
        else if (modal === 'Lost') setStatus('Lost');
        else setStatus(config.next || status);
        setModal(null);
        setSuccess('Meeting request status updated.');
      }} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/meeting-requests" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Request Detail</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex gap-8 text-sm">
            <div><p className="text-gray-400 text-xs">Request ID:</p><p className="font-medium">#12345678</p></div>
            <div><p className="text-gray-400 text-xs">Request Date:</p><p className="font-medium">mm/dd/yyyy</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Status: </span>
            <span className={`text-sm font-semibold ${config.color}`}>{status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs mb-0.5">Name:</p><p className="font-medium text-gray-800">User ABC</p></div>
          <div><p className="text-gray-400 text-xs mb-0.5">Phone Number:</p><p className="font-medium text-gray-800">123456789</p></div>
          <div className="sm:col-span-2"><p className="text-gray-400 text-xs mb-0.5">Email:</p><p className="font-medium text-gray-800">user@gmail.com</p></div>
        </div>

        <div className="mb-6 text-sm">
          <p className="text-gray-400 text-xs mb-1">Request Reason:</p>
          <p className="text-gray-600 leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam</p>
        </div>

        {/* Action buttons */}
        {config.next && (
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setModal(config.action)}
              className="flex items-center gap-2 bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">
              {config.action} ↗
            </button>
            {(status === 'Pending' || status === 'Contacted') && (
              <button onClick={() => setModal('Lost')}
                className="flex items-center gap-2 border border-red-300 text-red-500 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">
                Mark as Lost
              </button>
            )}
          </div>
        )}
        {!config.next && (
          <div className={`text-sm font-medium px-4 py-2.5 rounded-xl inline-flex items-center gap-2 ${status==='Converted'?'bg-green-50 text-green-600 border border-green-200':'bg-red-50 text-red-500 border border-red-200'}`}>
            {status === 'Converted' ? '✓ Successfully Converted' : '✕ Marked as Lost'}
          </div>
        )}
      </div>
    </div>
  );
}
