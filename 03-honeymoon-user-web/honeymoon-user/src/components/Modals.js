'use client';

export function ConfirmModal({ title = 'Please Confirm', message, onYes, onNo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[420px] text-center relative">
        <button onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm">✕</button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">⚠</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        <div className="flex gap-4">
          <button onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </div>
  );
}

export function SuccessModal({ title = 'Successful', message, onOk }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[380px] text-center relative">
        <button onClick={onOk} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <button onClick={onOk} className="w-full bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Ok</button>
      </div>
    </div>
  );
}

export function LogoutModal({ onYes, onNo }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-[400px] text-center relative">
        <button onClick={onNo} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-4">⚠</div>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-2">Log Out</h3>
        <p className="text-gray-500 text-sm mb-8">Are You Sure You Want To Log Out?</p>
        <div className="flex gap-4">
          <button onClick={onNo} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">No</button>
          <button onClick={onYes} className="flex-1 bg-[#174a37] text-white py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors">Yes</button>
        </div>
      </div>
    </div>
  );
}

export function UploadPhotoModal({ onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[420px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#1a1a1a] mb-6">Upload Profile Photo</h3>
        <div className="border-2 border-dashed border-[rgba(184,154,105,0.4)] rounded-xl p-10 text-center mb-6 hover:border-[#b89b6b] cursor-pointer transition-colors">
          <div className="text-4xl mb-3 opacity-30">📷</div>
          <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
          <p className="text-gray-300 text-xs mt-1">PNG, JPG up to 5MB</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onSave} className="flex-1 bg-[#174a37] text-white py-3 rounded-xl font-medium hover:bg-[#1a5c45] transition-colors">Upload</button>
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function ChangePasswordModal({ onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[480px] relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
        <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-6">Change Password</h3>
        {[['Old Password','old'],['New Password','new'],['Confirm Password','confirm']].map(([label, key]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}<span className="text-red-500">*</span></label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-[#faf8f4]">
              <span className="text-gray-400 mr-2 text-sm">🔒</span>
              <input type="password" placeholder="••••••••" className="flex-1 bg-transparent text-sm outline-none" />
              <button className="text-gray-400 text-xs">👁</button>
            </div>
          </div>
        ))}
        <button onClick={onSave} className="w-full bg-[#b89b6b] text-white py-3.5 rounded-full font-medium mt-2 hover:bg-[#a08860] transition-colors">Update</button>
      </div>
    </div>
  );
}
