'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
export default function AdminReportsPage() {
  const { data, loading } = useApi(AdminService.getReports);
  const reports = data || {};
  return (
    <div>
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Reports</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[['Total Revenue','AED 1.2M'],['Bookings This Month','48'],['Active Vendors','156'],['Active Users','2,840']].map(([l,v])=>(
          <div key={l} className="bg-white rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
            <p className="text-gray-400 text-xs uppercase tracking-wider">{l}</p>
            <p className="font-baskerville text-2xl text-[#1a1a1a] mt-1">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
        <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-4">Revenue Overview</h2>
        <div className="h-48 flex items-end gap-2">
          {[40,65,50,80,70,90,75,85,60,95,80,100].map((h,i)=>(
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#174a37] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity" style={{height:`${h}%`}} />
              <p className="text-gray-400 text-xs">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
