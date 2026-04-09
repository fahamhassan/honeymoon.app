'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const statuses=['Pending','Contacted','Meeting Scheduled','Lost','Converted'];
const statusColor={Pending:'text-amber-600',Contacted:'text-blue-600','Meeting Scheduled':'text-purple-600',Lost:'text-red-600',Converted:'text-green-600'};

export default function AdminRequestDetailPage({ params }) {
  const meetingId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getMeetingRequest, meetingId);
  const meeting = data?.meeting || {};
  const [status,setStatus]=useState('Contacted');
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');

  return(
    <div className="max-w-3xl">
      {modal&&<ConfirmModal message={`Update status to "${modal}"?`} onYes={()=>{setStatus(modal);setModal(null);setSuccess('Status updated.');}} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}
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
          <div><span className="text-xs text-gray-400">Status: </span><span className={`text-sm font-semibold ${statusColor[status]}`}>{status}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Company:</p><p className="font-medium">Company ABC</p></div>
          <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium">User ABC</p></div>
          <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">123456789</p></div>
          <div><p className="text-gray-400 text-xs">Email:</p><p className="font-medium">user@gmail.com</p></div>
        </div>
        <div className="mb-6 text-sm">
          <p className="text-gray-400 text-xs mb-1">Request Reason:</p>
          <p className="text-gray-600 leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s=>(
              <button key={s} onClick={()=>s!==status&&setModal(s)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${s===status?'bg-[#174a37] text-white border-[#174a37]':'border-gray-200 text-gray-500 hover:border-[#174a37]'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
