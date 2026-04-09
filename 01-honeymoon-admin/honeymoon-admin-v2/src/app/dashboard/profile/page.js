'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useAdminAuth } from '../../../context/auth';
import { useState } from 'react';
import { SuccessModal, ChangePasswordModal, UploadPhotoModal } from '@/components/Modals';

const AVATAR="https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";

function EditProfileModal({profile,onClose,onSave}){
  const [form,setForm]=useState({...profile});
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[480px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-6">Edit Profile</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[['First Name','firstName'],['Last Name','lastName']].map(([l,k])=>(
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]"/></div>
          ))}
        </div>
        {[['E-Mail Address','email'],['Phone Number','phone']].map(([l,k])=>(
          <div key={k} className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
            <input value={form[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]"/></div>
        ))}
        <button onClick={()=>onSave(form)} className="w-full bg-[#b89b6b] text-white py-3.5 rounded-full font-medium mt-2 hover:bg-[#a08860] transition-colors">Update ↗</button>
      </div>
    </div>
  );
}

export default function AdminProfilePage(){
  const { admin, logout } = useAdminAuth();
  const { data, loading, refresh } = useApi(AdminService.getProfile);
  const profile = data?.admin || admin || {};
  const [modal,setModal]=useState(null);
  const [success,setSuccess]=useState('');

  return(
    <div className="max-w-3xl">
      {modal==='edit'&&<EditProfileModal profile={profile} onClose={()=>setModal(null)} onSave={async p=>{
          try { await AdminService.updateProfile(p); refresh(); } catch(e) {}
          setProfile(prev=>({...prev,...p}));setModal(null);setSuccess('Profile updated successfully.');
        }}/>}
      {modal==='password'&&<ChangePasswordModal onClose={()=>setModal(null)} onSave={()=>{setModal(null);setSuccess('Password updated successfully.');}}/>}
      {modal==='photo'&&<UploadPhotoModal onClose={()=>setModal(null)} onSave={()=>{setModal(null);setSuccess('Profile photo updated.');}}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">My Profile</h1>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-start justify-between mb-8">
          <div className="grid grid-cols-2 gap-x-16 gap-y-5 text-sm">
            <div><p className="text-gray-400 text-xs mb-1">First Name:</p><p className="font-medium text-gray-800">{profile.firstName}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">Last Name:</p><p className="font-medium text-gray-800">{profile.lastName}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">Phone Number:</p><p className="font-medium text-gray-800">{profile.phone}</p></div>
            <div><p className="text-gray-400 text-xs mb-1">E-Mail Address:</p><p className="font-medium text-gray-800">{profile.email}</p></div>
          </div>
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-[rgba(184,154,105,0.2)]">
              <img src={AVATAR} alt="" className="w-full h-full object-cover"/>
            </div>
            <button onClick={()=>setModal('photo')} className="absolute bottom-0 right-0 w-7 h-7 bg-[#174a37] rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-[#1a5c45] transition-colors">📷</button>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={()=>setModal('edit')} className="flex items-center gap-2 bg-[#174a37] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors">
            Edit Profile ↗
          </button>
          <button onClick={()=>setModal('password')} className="flex items-center gap-2 border border-gray-300 text-gray-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Change Password ↗
          </button>
        </div>
      </div>
    </div>
  );
}
