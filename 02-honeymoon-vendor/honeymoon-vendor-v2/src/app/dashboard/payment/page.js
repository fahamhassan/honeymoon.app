'use client';
import { useApi } from '../../../hooks/useApi';
import VendorService from '../../../lib/services/vendor.service';
import { useState } from 'react';
import { SuccessModal } from '@/components/Modals';
export default function VendorPaymentPage(){
  const { data, loading } = useApi(VendorService.getEarnings);
  const earnings = data?.earnings || {};
  const [form,setForm]=useState({name:'',card:'',cvv:'',validity:''});
  const [success,setSuccess]=useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="max-w-2xl">
      {success&&<SuccessModal message="Payment completed successfully!" onOk={()=>{setSuccess(false);window.history.back();}}/>}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>window.history.back()} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">Payment</h1>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-end mb-6">
          <p className="font-semibold text-[#1a1a1a] text-lg">Total Amount: <span className="text-[#174a37]">$10</span></p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[['Cardholder Name','name','text','Enter Cardholder Name'],['Card Number','card','text','Enter Card Number'],['CVV Number','cvv','text','Enter CVV'],['Validity Date','validity','date','']].map(([l,k,t,ph])=>(
            <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}<span className="text-red-500">*</span></label>
              <input type={t} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] bg-[#faf8f4]"/></div>
          ))}
        </div>
        <button onClick={()=>form.name&&form.card&&setSuccess(true)} className="bg-[#174a37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">Pay Now ↗</button>
      </div>
    </div>
  );
}
