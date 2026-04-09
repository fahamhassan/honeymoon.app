'use client';
import { useApi } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useVendorAuth } from '../../../context/auth';
import { useState } from 'react';
import { UpdateProfileModal, ChangePasswordModal, UploadPhotoModal, SuccessModal, LogoutModal } from '@/components/Modals';
import { useRouter } from 'next/navigation';

const AVATAR = "https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";

export default function VendorProfilePage() {
  const { vendor, logout, updateVendor } = useVendorAuth();
  const { data, loading, refresh } = useApi(VendorService.getProfile);
  const profile = data?.vendor || vendor || {};
  const router = useRouter();
  const [modal, setModal] = useState(null);
  const [success, setSuccess] = useState('');

  return (
    <div className="max-w-3xl">
      {modal === 'edit'     && <UpdateProfileModal   onClose={() => setModal(null)} onSave={() => { setModal(null); setSuccess('Profile updated successfully.'); }} />}
      {modal === 'password' && <ChangePasswordModal  onClose={() => setModal(null)} onSave={() => { setModal(null); setSuccess('Password updated successfully.'); }} />}
      {modal === 'photo'    && <UploadPhotoModal     onClose={() => setModal(null)} onSave={() => { setModal(null); setSuccess('Profile photo updated.'); }} />}
      {modal === 'logout'   && <LogoutModal          onYes={() => router.push('/login')} onNo={() => setModal(null)} />}
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">My Profile</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[rgba(184,154,105,0.2)]">
              <img src={AVATAR} alt="" className="w-full h-full object-cover"/>
            </div>
            <button onClick={() => setModal('photo')}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#174a37] rounded-full flex items-center justify-center text-white text-sm shadow-md hover:bg-[#1a5c45] transition-colors">
              📷
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-5 text-sm mb-8">
          {[
            ['First Name', profile.firstName],
            ['Last Name', profile.lastName],
            ['Phone Number', profile.phone],
            ['E-Mail Address', profile.email],
            ['Company', profile.company],
            ['Services', profile.services],
          ].map(([l,v]) => (
            <div key={l}>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{l}</p>
              <p className="font-medium text-gray-800">{v}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setModal('edit')}
            className="flex items-center gap-2 bg-[#174a37] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">
            Edit Profile ↗
          </button>
          <button onClick={() => setModal('password')}
            className="flex items-center gap-2 border border-gray-300 text-gray-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Change Password ↗
          </button>
          <button onClick={() => setModal('logout')}
            className="flex items-center gap-2 border border-red-300 text-red-500 px-6 py-3 rounded-full text-sm font-medium hover:bg-red-50 transition-colors ml-auto">
            🚪 Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
