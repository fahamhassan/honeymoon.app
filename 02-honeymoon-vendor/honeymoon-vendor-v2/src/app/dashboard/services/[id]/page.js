'use client';
import { useApi } from '../../../../hooks/useApi';
import VendorService from '../../../../lib/services/vendor.service';
import { useState } from 'react';
import Link from 'next/link';
import { ConfirmModal, SuccessModal } from '@/components/Modals';

const IMG1="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const IMG2="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";

const CALENDAR_DAYS = ['M','T','W','T','F','S','S'];
const UNAVAILABLE = [13,19,20];
const ALL_DAYS = Array.from({length:30},(_,i)=>i+1);

export default function VendorViewServicePage({ params }) {
  const svcId = params?.id || '';
  const { data, loading, refresh } = useApi(VendorService.getService, svcId);
  const service = data?.service || {};
  const [confirm,setConfirm]=useState(false);
  const [success,setSuccess]=useState('');

  return(
    <div>
      {confirm&&<ConfirmModal message="Delete this service? This cannot be undone." onYes={()=>{setConfirm(false);setSuccess('Service deleted.');window.location.href='/dashboard/services';}} onNo={()=>setConfirm(false)}/>}
      {success&&<SuccessModal message={success} onOk={()=>setSuccess('')}/>}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/services" className="text-gray-400 hover:text-gray-600 text-lg">←</Link>
        <h1 className="font-baskerville text-3xl text-[#1a1a1a]">View Service</h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-semibold text-base text-gray-800">Service ABC</h2>
          <span className="text-xs px-3 py-1 rounded-full font-medium text-green-700 bg-green-100">Active</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Category:</p><p className="font-medium">Category A</p></div>
          <div><p className="text-gray-400 text-xs">Location:</p><p className="font-medium">Location A</p></div>
        </div>

        <div className="mb-4 text-sm">
          <p className="text-gray-400 text-xs mb-1">Description</p>
          <p className="text-gray-600 leading-6 text-xs">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Aenean Euismod Bibendum Laoreet. Proin Gravida Dolor Sit Amet Lacus Accumsan Et Viverra Justo Commodo. Proin Sodales Pulvinar Tempor. Cum Sociis Natoque Penatibus Et Magnis Dis Parturient Montes, Nascetur Ridiculus Mus.</p>
        </div>

        {/* Pricing table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-gray-100">
            {['Price Per Guest:','Price Per Hour:','Minimum Guests:','Minimum Hours:'].map((h,i)=>(
              <div key={h} className={`p-3 ${i<3?'border-r border-gray-100':''}`}>
                <p className="text-gray-400 text-xs">{h}</p><p className="font-medium">20.00 AED</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {['Minimum Guests:','','',''].map((h,i)=>(
              <div key={i} className={`p-3 ${i<3?'border-r border-gray-100':''}`}>
                {i===0&&<><p className="text-gray-400 text-xs">{h}</p><p className="font-medium">200</p></>}
              </div>
            ))}
          </div>
        </div>

        {/* Packages table */}
        <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
          <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 bg-[#faf8f4]">
              {['Package Name','Package Price','Inclusions'].map(h=><th key={h} className="text-left py-2.5 px-4 text-gray-500 font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {[1,2].map(i=><tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 px-4 text-gray-700">Package ABC</td>
                <td className="py-2.5 px-4 text-gray-700">200.00 AED</td>
                <td className="py-2.5 px-4 text-gray-500">Lorem ipsum dolor</td>
              </tr>)}
            </tbody>
          </table></div>
        </div>

        {/* Per Item */}
        <div className="mb-4 text-sm border border-gray-100 rounded-xl p-3">
          <p className="text-gray-400 text-xs">Price Per Item:</p><p className="font-medium">20.00 AED</p>
        </div>

        {/* Policies */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
          <div><p className="text-gray-400 text-xs">Initial Deposit:</p><p className="font-medium">Category A</p></div>
          <div><p className="text-gray-400 text-xs">Is The Initial Deposit Refundable Upon Cancellation?</p><p className="font-medium">Yes</p></div>
          <div><p className="text-gray-400 text-xs">Can The Deposit Be Refunded At Any Time?</p><p className="font-medium">No</p></div>
        </div>
        <div className="mb-5 text-sm">
          <p className="text-gray-400 text-xs">What Is The Minimum Notice Period For A Refund?</p><p className="font-medium">14 Days</p>
        </div>

        {/* Calendar */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Service Availability For Booking</p>
          <div className="border border-gray-200 rounded-xl p-4 inline-block">
            <div className="flex items-center justify-between mb-3">
              <button className="text-gray-400 hover:text-gray-600 text-sm">‹</button>
              <span className="text-sm font-medium text-gray-800">February 2026</span>
              <button className="text-gray-400 hover:text-gray-600 text-sm">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {CALENDAR_DAYS.map((d,i)=><div key={i} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[null,null].concat(ALL_DAYS).map((d,i)=>(
                d===null?<div key={i} className="w-8 h-8"/>:
                <div key={i} className={`w-8 h-8 flex items-center justify-center text-xs rounded-full transition-colors
                  ${UNAVAILABLE.includes(d)?'bg-red-100 text-red-600 font-medium':'text-gray-600 hover:bg-[#f4ebd0] cursor-pointer'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-gray-300 bg-white"/><span className="text-xs text-gray-500">Available</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-200"/><span className="text-xs text-gray-500">Unavailable</span></div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[IMG1,IMG2].map((img,i)=><div key={i} className="h-40 rounded-xl overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover"/></div>)}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href={`/dashboard/services/edit/${params.id}`} className="bg-[#174a37] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a5c45] transition-colors flex items-center gap-2">
            Save & Next →
          </Link>
          <button onClick={()=>setConfirm(true)} className="border border-red-200 text-red-500 bg-red-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-100 transition-colors">
            Delete Service
          </button>
        </div>
      </div>
    </div>
  );
}
