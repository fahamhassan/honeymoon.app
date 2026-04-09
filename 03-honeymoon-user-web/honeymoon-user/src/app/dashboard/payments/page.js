'use client';
import { useApi } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';

const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgRectangle3875 = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
const imgRectangle3876 = "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80";

const payments = [
  { id: 'PAY-001', vendor: 'Al Habtoor Palace', type: 'Deposit (25%)', amount: 15000, date: 'Jan 12, 2025', status: 'Paid', method: 'Visa •••• 4242', img: imgRectangle3883 },
  { id: 'PAY-002', vendor: 'Studio Lumière', type: 'Deposit (33%)', amount: 4000, date: 'Jan 25, 2025', status: 'Paid', method: 'Apple Pay', img: imgRectangle3875 },
  { id: 'PAY-003', vendor: 'Glamour Touch', type: 'Deposit (33%)', amount: 1500, date: 'Feb 3, 2025', status: 'Paid', method: 'Visa •••• 4242', img: imgRectangle3876 },
  { id: 'PAY-004', vendor: 'Al Habtoor Palace', type: 'Second Payment (25%)', amount: 15000, date: 'Mar 15, 2025', status: 'Upcoming', method: '—', img: imgRectangle3883 },
  { id: 'PAY-005', vendor: 'Al Habtoor Palace', type: 'Final Payment (50%)', amount: 30000, date: 'May 1, 2025', status: 'Scheduled', method: '—', img: imgRectangle3883 },
];

const statusStyle = {
  Paid: 'bg-green-100 text-green-700',
  Upcoming: 'bg-amber-100 text-amber-700',
  Scheduled: 'bg-blue-100 text-blue-700',
};

export default function PaymentsPage() {
  const { data, loading } = useApi(UserService.getPayments);
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-baskerville text-[36px] text-[#1a1a1a]">Payment Logs</h1>
          <p className="text-black/40 text-sm mt-1">All transactions for your wedding</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Paid', value: `AED ${totalPaid.toLocaleString()}`, icon: '✅', color: '#174a37' },
          { label: 'Outstanding', value: `AED ${totalPending.toLocaleString()}`, icon: '⏳', color: '#b89b6b' },
          { label: 'Next Payment', value: 'Mar 15, 2025', icon: '📅', color: '#1a1a1a' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <span className="text-2xl">{icon}</span>
            <p className="font-baskerville text-[28px] mt-2" style={{ color }}>{value}</p>
            <p className="text-black/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-[rgba(184,154,105,0.1)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a]">Transaction History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(184,154,105,0.08)]">
              {['Reference', 'Vendor', 'Description', 'Amount', 'Date', 'Method', 'Status'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-[11px] uppercase tracking-wider text-black/30 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-[rgba(184,154,105,0.05)] hover:bg-[#faf7f0] transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-black/40">{p.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={p.img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium text-[#1a1a1a]">{p.vendor}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-black/50">{p.type}</td>
                <td className="px-6 py-4">
                  <span className="font-baskerville text-[18px] text-[#1a1a1a]">AED {p.amount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 text-sm text-black/50">{p.date}</td>
                <td className="px-6 py-4 text-sm text-black/50">{p.method}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle[p.status]}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
