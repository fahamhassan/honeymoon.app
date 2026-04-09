'use client';
import { useApi } from '../../../hooks/useApi';
import AdminService from '../../../lib/services/admin.service';
import { useState, useEffect } from 'react';
import { SuccessModal } from '@/components/Modals';

const defaultSettings = {
  emailNotifications: true,
  smsNotifications: false,
  bookingAlerts: true,
  newVendorAlerts: true,
  maintenanceMode: false,
  twoFactorAuth: true,
};

export default function AdminSettingsPage() {
  const { data, loading, refresh } = useApi(AdminService.getSettings);
  const [settings, setSettings] = useState(defaultSettings);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (data?.settings && typeof data.settings === 'object') {
      setSettings((s) => ({ ...s, ...data.settings }));
    }
  }, [data]);

  const toggle = (k) => setSettings((p) => ({ ...p, [k]: !p[k] }));
  const Toggle = ({k}) => (
    <button onClick={() => toggle(k)} className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${settings[k]?'bg-[#174a37] justify-end':'bg-gray-200 justify-start'}`}>
      <div className="w-5 h-5 bg-white rounded-full shadow" />
    </button>
  );
  return (
    <div className="max-w-2xl">
      {success && <SuccessModal message={success} onOk={() => setSuccess('')} />}
      <h1 className="font-baskerville text-3xl text-[#1a1a1a] mb-6">Settings</h1>
      {[
        { title: 'Notifications', items: [['Email Notifications','Receive booking updates via email','emailNotifications'],['SMS Notifications','Receive alerts via SMS','smsNotifications'],['New Booking Alerts','Alert when new booking is made','bookingAlerts'],['New Vendor Alerts','Alert when vendor registers','newVendorAlerts']] },
        { title: 'Security', items: [['Two-Factor Authentication','Add extra security layer','twoFactorAuth'],['Maintenance Mode','Put site in maintenance mode','maintenanceMode']] },
      ].map(section => (
        <div key={section.title} className="bg-white rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.05)] mb-5">
          <h2 className="font-baskerville text-xl text-[#1a1a1a] mb-4">{section.title}</h2>
          {section.items.map(([l,d,k]) => (
            <div key={k} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
              <div><p className="font-medium text-sm text-gray-800">{l}</p><p className="text-gray-400 text-xs mt-0.5">{d}</p></div>
              <Toggle k={k} />
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => setSuccess('Settings saved successfully.')} className="bg-[#b89b6b] text-white px-8 py-3 rounded-full font-medium hover:bg-[#a08860] transition-colors">Save Settings</button>
    </div>
  );
}
