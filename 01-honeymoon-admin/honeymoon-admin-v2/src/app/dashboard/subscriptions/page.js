'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState } from 'react';
import Link from 'next/link';
import { SuccessModal } from '@/components/Modals';

const PLANS=[
  {id:'01',name:'Basic',commDiscount:'10%',commDiscountVal:'10%',profileFeaturing:'Not Included',bannerPromotion:'Not Included',priceMonthly:'$20',priceYearly:'$40',modDate:'DD/MM/YYYY'},
  {id:'02',name:'Standard',commDiscount:'10%',commDiscountVal:'10%',profileFeaturing:'Included',bannerPromotion:'Not Included',priceMonthly:'$20',priceYearly:'$40',modDate:'DD/MM/YYYY'},
  {id:'03',name:'Premium',commDiscount:'10%',commDiscountVal:'10%',profileFeaturing:'Included',bannerPromotion:'Included',priceMonthly:'$20',priceYearly:'$40',modDate:'DD/MM/YYYY'},
];

export default function AdminSubscriptionsPage(){
  const { data, loading, refresh } = useApi(AdminService.getSubscriptionPlans);
  const plans = data?.plans || [];
  return(
    <div>
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Subscription Management</h1>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white outline-none"><option>5</option><option>10</option></select>
          </div>
          <div className="border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 w-56 bg-[#faf8f4]">
            <span className="text-gray-400">🔍</span>
            <input placeholder="Search..." className="bg-transparent text-sm outline-none flex-1"/>
          </div>
        </div>
        <div className="overflow-x-auto -mx-1 px-1"><table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['S.N','Subscription Name','Commission Discount','Commission Discount','Profile Featuring','Banner Promotion','Price Monthly','Price Yearly','Modification Date','Action'].map(h=>(
                <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium text-xs whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(plans.length ? plans : PLANS).map(p=>(
              <tr key={p.id} className="border-b border-gray-50 hover:bg-[#fafaf8] transition-colors">
                <td className="py-3.5 px-2 text-gray-400 text-xs">{p.id}</td>
                <td className="py-3.5 px-2 font-medium text-gray-800">{p.name}</td>
                <td className="py-3.5 px-2 text-gray-500">{p.commDiscount}</td>
                <td className="py-3.5 px-2 text-gray-500">{p.commDiscountVal}</td>
                <td className="py-3.5 px-2 text-gray-500">{p.profileFeaturing}</td>
                <td className="py-3.5 px-2 text-gray-500">{p.bannerPromotion}</td>
                <td className="py-3.5 px-2 font-medium text-gray-700">{p.priceMonthly}</td>
                <td className="py-3.5 px-2 font-medium text-gray-700">{p.priceYearly}</td>
                <td className="py-3.5 px-2 text-gray-400 text-xs">{p.modDate}</td>
                <td className="py-3.5 px-2">
                  <Link href={`/dashboard/subscriptions/${p.id}`} className="text-xs text-[#174a37] font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
