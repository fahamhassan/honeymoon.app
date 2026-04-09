'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import Link from 'next/link';
export default function PushNotificationDetailPage({ params }) {
  const notifId = params?.id || '';
  const { data, loading } = useApi(AdminService.getPushNotification, notifId);
  const notification = data?.notification || {};
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/dashboard/push-notifications" className="hover:text-[#174a37]">Push Notifications</Link>
        <span>/</span><span className="text-gray-800">Notification Detail</span>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-baskerville text-2xl text-[#1a1a1a]">Notification Detail</h1>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium text-green-700 bg-green-100">Sent</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[['Title','New Feature Available'],['Audience','All Users'],['Sent At','15/01/2025 10:00 AM'],['Reach','4,832 users'],['Opened','1,240 (25.7%)'],['Clicked','384 (7.9%)']].map(([l,v])=>(
            <div key={l} className="bg-[#f9f6ef] rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
              <p className="text-[#1a1a1a] font-medium text-sm mt-1">{v}</p>
            </div>
          ))}
        </div>
        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Message</p>
          <p className="text-gray-600 text-sm bg-[#f9f6ef] rounded-xl p-4 leading-6">
            We're excited to announce our latest feature update! You can now compare vendors side-by-side, set budget alerts, and invite your wedding party to collaborate on planning. Log in to explore all the new features.
          </p>
        </div>
        <Link href="/dashboard/push-notifications" className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          ← Back to List
        </Link>
      </div>
    </div>
  );
}
