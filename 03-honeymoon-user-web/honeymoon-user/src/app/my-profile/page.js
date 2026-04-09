'use client';
import { useApi } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useUserAuth } from '../../context/auth';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgProfile = "https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";
const imgAIBadge = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23b89b6b"><text y="20" font-size="20">✨</text></svg>`;

function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[420px] p-10 text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <p className="text-[#1a1a1a] text-lg font-medium mb-6">{message}</p>
        <button onClick={onClose} className="bg-[#b89b6b] text-white px-10 py-3 rounded-xl hover:bg-[#a08860] transition-colors font-medium">
          Okay
        </button>
      </div>
    </div>
  );
}

function EditProfileModal({ onClose, onSave }) {
  const [form, setForm] = useState({ firstName: 'John', lastName: 'Harper', phone: '915 9969 739', gender: 'Male', uaePass: '19159969739' });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] p-8 shadow-2xl">
        <h2 className="font-baskerville text-[30px] text-[#b89b6b] mb-6">Edit Profile</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-black/60 block mb-1.5">First Name<span className="text-red-500">*</span></label>
            <input value={form.firstName} onChange={e => setForm(p => ({...p, firstName: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Last Name<span className="text-red-500">*</span></label>
            <input value={form.lastName} onChange={e => setForm(p => ({...p, lastName: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-black/60 block mb-1.5">Phone Number<span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 border border-[#d4d4d4] rounded-lg px-3 py-2.5 flex-shrink-0">
              <span className="text-sm">🇦🇪</span><span className="text-sm text-black/60">+971</span><span className="text-black/30 text-xs">▾</span>
            </div>
            <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
              className="flex-1 border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-black/60 block mb-1.5">Gender<span className="text-red-500">*</span></label>
          <select value={form.gender} onChange={e => setForm(p => ({...p, gender: e.target.value}))}
            className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-white transition-colors">
            <option>Male</option><option>Female</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="text-sm text-black/60 block mb-1.5">UAE Pass<span className="text-red-500">*</span></label>
          <input value={form.uaePass} onChange={e => setForm(p => ({...p, uaePass: e.target.value}))}
            className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
        </div>
        <button onClick={onSave} className="w-full bg-[#b89b6b] text-white font-medium py-3.5 rounded-xl hover:bg-[#a08860] transition-colors">
          Update
        </button>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose, onSave }) {
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  const [show, setShow] = useState({});
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] p-8 shadow-2xl">
        <h2 className="font-baskerville text-[30px] text-[#b89b6b] mb-6">Change Passwords</h2>
        {[
          { key: 'old', label: 'Old Password' },
          { key: 'new', label: 'New Password' },
          { key: 'confirm', label: 'Confirm Password' },
        ].map(f => (
          <div key={f.key} className="mb-4">
            <label className="text-sm text-black/60 block mb-1.5">{f.label}<span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={show[f.key] ? 'text' : 'password'} value={form[f.key]} onChange={e => setPwForm(p => ({...p, [f.key]: e.target.value}))}
                placeholder="Enter your password"
                className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] pr-10 transition-colors" />
              <button onClick={() => setShow(p => ({...p, [f.key]: !p[f.key]}))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 text-xs">
                {show[f.key] ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        ))}
        <button onClick={onSave} className="w-full bg-[#b89b6b] text-white font-medium py-3.5 rounded-xl hover:bg-[#a08860] transition-colors mt-2">
          Update
        </button>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  const { user, updateUser, logout } = useUserAuth();
  const { data, loading } = useApi(UserService.getProfile);
  const profile = data?.user || user || {};
  const [modal, setModal] = useState(null); // null | 'edit' | 'password' | 'profileSuccess' | 'passwordSuccess'

  return (
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {modal === 'edit' && <EditProfileModal onClose={() => setModal(null)} onSave={async (formData) => {
          try { await UserService.updateProfile(formData); updateUser(formData); } catch(e) {}
          setModal('profileSuccess');
        }} />}
      {modal === 'password' && <ChangePasswordModal onClose={() => setModal(null)} onSave={async (pwData) => {
          try { await UserService.changePassword(pwData); } catch(e) {}
          setModal('passwordSuccess');
        }} />}
      {modal === 'profileSuccess' && <SuccessModal message="Profile Updated Successfully" onClose={() => setModal(null)} />}
      {modal === 'passwordSuccess' && <SuccessModal message="Password Updated Successfully" onClose={() => setModal(null)} />}

      <LoggedInNav />

      <main className="flex-1 max-w-7xl mx-auto px-8 py-10 w-full">
        <h1 className="font-baskerville text-[28px] sm:text-[36px] lg:text-[40px] text-[#b89b6b] mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)] max-w-[800px] relative">
          {/* AI badge */}
          <div className="absolute right-8 top-8 flex flex-col items-center">
            <img src={imgAIBadge} alt="" className="w-16" />
            <p className="text-[10px] text-black/30 uppercase tracking-wider mt-1 text-center">Smart Wedding<br/>Assistant</p>
          </div>

          {/* Avatar */}
          <div className="relative w-24 h-24 mb-6">
            <img src={imgProfile} alt="John Harper" className="w-24 h-24 rounded-full object-cover" />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#174a37] rounded-full flex items-center justify-center text-white text-sm">📷</button>
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-5 mb-8">
            {[
              { label: 'User Name:', value: 'John Harper' },
              { label: 'Gender:', value: 'Male' },
              { label: 'Phone Number:', value: '+19159969739' },
              { label: 'UAE Pass:', value: '19159969739' },
              { label: 'Email:', value: 'john.harper@example.com', span: true },
            ].map(f => (
              <div key={f.label} className={f.span ? 'sm:col-span-2' : ''}>
                <span className="text-black/50 text-sm">{f.label}</span>
                <span className="text-[#1a1a1a] text-sm font-medium ml-4">{f.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setModal('edit')}
              className="bg-[#b89b6b] text-white px-8 py-3 rounded-xl hover:bg-[#a08860] transition-colors font-medium">
              Update Profile
            </button>
            <button onClick={() => setModal('password')}
              className="bg-[#174a37] text-white px-8 py-3 rounded-xl hover:bg-[#1a5c45] transition-colors font-medium">
              Change Password
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
