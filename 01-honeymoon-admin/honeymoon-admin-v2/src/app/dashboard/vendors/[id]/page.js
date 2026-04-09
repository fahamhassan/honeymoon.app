'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal, ApproveVendorModal, RejectVendorModal } from '@/components/Modals';

const AVATAR="https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";
const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";

const statusColor={Active:'text-green-600',Pending:'text-amber-600',Rejected:'text-red-600',Inactive:'text-gray-400'};

export default function AdminVendorDetailPage({ params }) {
  const vendorId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getVendor, vendorId);
  const vendor = data?.vendor || {};
  const services = data?.services || [];
  const bookings  = data?.bookings  || [];
  const [status,setStatus]=useState('Pending');
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');

  function doApprove(){setStatus('Active');setModal(null);setSuccess('Vendor approved successfully.');}
  function doReject(){setStatus('Rejected');setModal(null);setSuccess('Vendor rejected.');}
  function doToggle(){setStatus(s=>s==='Active'?'Inactive':'Active');setModal(null);setSuccess('Vendor status updated.');}

  return(
    <div className="max-w-3xl">
      {modal==='approve'&&<ApproveVendorModal onYes={doApprove} onNo={()=>setModal(null)}/>}
      {modal==='reject'&&<RejectVendorModal onYes={doReject} onNo={()=>setModal(null)}/>}
      {modal==='toggle'&&<ConfirmModal message="Are you sure you want to change this vendor's status?" onYes={doToggle} onNo={()=>setModal(null)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/vendors" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Vendor Profile</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        {/* Profile photo + status */}
        <div className="flex items-start justify-between mb-5">
          <div/>
          <div className="flex flex-col items-end gap-2">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[rgba(184,154,105,0.2)]">
              <img src={AVATAR} alt="" className="w-full h-full object-cover"/>
            </div>
            <div><span className="text-xs text-gray-400">Status: </span><span className={`text-sm font-semibold ${statusColor[status]}`}>{status}</span></div>
          </div>
        </div>

        {/* Personal Detail */}
        <h2 className="font-semibold text-[#1a1a1a] text-base mb-3">Personal Detail</h2>
        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div><p className="text-gray-400 text-xs">User Name:</p><p className="font-medium">Tom Albert</p></div>
          <div><p className="text-gray-400 text-xs">Gender:</p><p className="font-medium">Male</p></div>
        </div>

        {/* Company Detail */}
        <h2 className="font-semibold text-[#1a1a1a] text-base mb-3">Company Detail</h2>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Name:</p><p className="font-medium">Company ABC</p></div>
          <div><p className="text-gray-400 text-xs">Phone Number:</p><p className="font-medium">+19159969739</p></div>
          <div><p className="text-gray-400 text-xs">Services Offered:</p><p className="font-medium">+19159969739</p></div>
          <div><p className="text-gray-400 text-xs">Address:</p><p className="font-medium text-xs leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></div>
        </div>

        {/* Trade Licence */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Trade Licence</p>
          <div className="w-48 h-32 rounded-xl overflow-hidden border border-gray-100">
            <img src={IMG1} alt="Trade Licence" className="w-full h-full object-cover"/>
          </div>
        </div>

        {/* Company Banner */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Company Banner</p>
          <div className="w-full h-32 rounded-xl overflow-hidden border border-gray-100">
            <img src={IMG1} alt="Company Banner" className="w-full h-full object-cover"/>
          </div>
        </div>

        {/* Login Detail */}
        <h2 className="font-semibold text-[#1a1a1a] text-base mb-3">Login Detail</h2>
        <div className="mb-6 text-sm">
          <p className="text-gray-400 text-xs">Email:</p>
          <p className="font-medium">tomalbert@gmail.com</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {status==='Pending'&&<>
            <button onClick={()=>setModal('approve')} className="flex items-center gap-2 bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">Approve ↗</button>
            <button onClick={()=>setModal('reject')} className="flex items-center gap-2 border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">Reject ↗</button>
          </>}
          {status!=='Pending'&&(
            <button onClick={()=>setModal('toggle')} className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${status==='Active'?'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100':'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'}`}>
              {status==='Active'?'Deactivate':'Activate'} ↗
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
