'use client';
import { useVendorAuth } from '../../../context/auth';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';
export default function VendorAboutPage(){
  const { vendor } = useVendorAuth();
  const [form,setForm]=useState({tagline:'Premier wedding venue in Dubai Marina',description:'Al Habtoor Palace offers a world-class wedding experience with stunning views of the Dubai Marina. Our dedicated team ensures every detail of your special day is perfect.',location:'Dubai Marina, Dubai, UAE',phone:'+971 4 123 4567',email:'weddings@alhabtoor.ae',website:'www.alhabtoor.ae',capacity:'50-500',minPrice:'AED 20,000'});
  const [success,setSuccess]=useState('');
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(<div className="max-w-3xl">
    {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}
    <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">About Us</h1>
    <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-4">
        {[['Tagline','tagline','text','A short catchy tagline'],['Phone','phone','tel','+971 4 ...'],['Email','email','email','info@...'],['Website','website','text','www...'],['Location','location','text','City, Country'],['Min Price','minPrice','text','AED 20,000'],['Capacity','capacity','text','e.g. 50-500 guests']].map(([l,k,t,ph])=>(
          <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
            <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]"/></div>
        ))}
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
          <textarea value={form.description} onChange={e=>f('description',e.target.value)} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4] resize-none"/></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
          <div className="border-2 border-dashed border-[rgba(184,154,105,0.3)] rounded-xl p-8 text-center cursor-pointer hover:border-[#b89b6b] transition-colors">
            <div className="text-3xl mb-2 opacity-30">📸</div><p className="text-gray-400 text-sm">Upload up to 10 images</p></div></div>
      </div>
      <button onClick={()=>setSuccess('About page updated successfully.')} className="mt-6 bg-[#b89b6b] text-white px-8 py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Save Changes</button>
    </div>
  </div>);
}
