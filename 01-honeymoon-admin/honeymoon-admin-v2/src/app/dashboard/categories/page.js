'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import { ConfirmModal, SuccessModal } from '@/components/Modals';
const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const IMG3="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";
const CATS = [
  {id:1,name:'Venue',vendors:45,bookings:312,img:IMG1,status:'active'},
  {id:2,name:'Photography',vendors:28,bookings:198,img:IMG2,status:'active'},
  {id:3,name:'Beauty',vendors:31,bookings:156,img:IMG3,status:'active'},
  {id:4,name:'Catering',vendors:22,bookings:203,img:IMG1,status:'active'},
  {id:5,name:'Decoration',vendors:19,bookings:145,img:IMG2,status:'active'},
  {id:6,name:'Music',vendors:14,bookings:88,img:IMG3,status:'inactive'},
];
function CatModal({cat,onClose,onSave}) {
  const [form,setForm]=useState(cat||{name:'',status:'active'});
  return (<div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.6)'}}>
    <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 w-full max-w-[440px] relative">
      <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-sm">✕</button>
      <h3 className="font-baskerville text-2xl text-[#b89b6b] mb-6">{cat?.id?'Edit':'Add'} Category</h3>
      <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Category Name<span className="text-red-500">*</span></label>
        <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Venue" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]" /></div>
      <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Icon / Image</label>
        <div className="border-2 border-dashed border-[rgba(184,154,105,0.3)] rounded-xl p-6 text-center cursor-pointer hover:border-[#b89b6b] transition-colors">
          <div className="text-2xl mb-1 opacity-30">🖼</div><p className="text-gray-400 text-xs">Click to upload</p></div></div>
      <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]">
          <option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      <div className="flex gap-3">
        <button onClick={()=>onSave(form)} className="flex-1 bg-[#b89b6b] text-white py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Save</button>
        <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-full font-medium">Cancel</button>
      </div>
    </div>
  </div>);
}
export default function CategoriesPage() {
  const handleToggle = async (cat) => {
    const newStatus = cat.status === 'active' ? 'inactive' : 'active';
    try {
      await AdminService.updateCategory(cat.id, { status: newStatus });
      refresh();
    } catch(e) {}
    setCats(prev => prev.map(c => c.id === cat.id ? {...c, status: newStatus} : c));
  };
  const { data, loading, refresh } = useApi(AdminService.getCategories);
  const categories = data?.categories || [];
  const [cats,setCats]=useState(CATS);
  const [modal,setModal]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const [success,setSuccess]=useState('');
  function saveCat(form) {
    if(modal?.id) setCats(p=>p.map(c=>c.id===modal.id?{...c,...form}:c));
    else setCats(p=>[...p,{id:Date.now(),...form,vendors:0,bookings:0,img:IMG1}]);
    setModal(null); setSuccess(modal?.id?'Category updated.':'Category added.');
  }
  function doDelete() { setCats(p=>p.filter(c=>c.id!==confirm.id)); setConfirm(null); setSuccess('Category deleted.'); }
  return (
    <div>
      {modal && <CatModal cat={modal.id?modal:null} onClose={()=>setModal(null)} onSave={saveCat}/>}
      {confirm && <ConfirmModal message={`Delete "${confirm.name}" category?`} onYes={doDelete} onNo={()=>setConfirm(null)}/>}
      {success && <SuccessModal message={success} onOk={()=>setSuccess('')}/>}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Category Management</h1>
        <button onClick={()=>setModal({})} className="bg-[#174a37] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">+ Add Category</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cats.map(c=>(
          <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <div className="h-36 overflow-hidden relative">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover"/>
              <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${c.status==='active'?'text-green-700 bg-green-100':'text-gray-500 bg-gray-100'}`}>{c.status==='active'?'Active':'Inactive'}</span>
            </div>
            <div className="p-5">
              <h3 className="font-baskerville text-xl text-[#1a1a1a]">{c.name}</h3>
              <p className="text-gray-400 text-xs mt-1">{c.vendors} vendors · {c.bookings} bookings</p>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>setModal(c)} className="flex-1 text-xs text-white bg-[#174a37] py-2 rounded-lg hover:bg-[#1a5c45] transition-colors">Edit</button>
                <button onClick={()=>setConfirm(c)} className="flex-1 text-xs text-red-500 bg-red-50 border border-red-200 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
