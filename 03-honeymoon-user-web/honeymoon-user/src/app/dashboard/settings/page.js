'use client';
import { useUserAuth } from '../../../context/auth';
import { useState } from 'react';

export default function SettingsPage() {
  const { logout } = useUserAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    aiRecommendations: true,
    budgetAlerts: true,
    marketingEmails: false,
    language: 'en',
    currency: 'AED',
    timezone: 'Asia/Dubai',
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ k }) => (
    <button onClick={() => toggle(k)}
      className={`relative w-12 h-6 rounded-full transition-colors ${settings[k] ? 'bg-[#174a37]' : 'bg-[#d4d4d4]'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings[k] ? 'left-7' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="max-w-[800px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-baskerville text-[36px] text-[#1a1a1a]">Settings</h1>
          <p className="text-black/40 text-sm mt-1">Manage your account preferences</p>
        </div>
        <button onClick={save}
          className={`text-sm font-medium px-5 py-2.5 rounded-[10px] transition-all ${saved ? 'bg-green-600 text-white' : 'bg-[#174a37] text-white hover:bg-[#1a5c45]'}`}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Notifications</h2>
          <div className="flex flex-col gap-5">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates about bookings, payments, and messages via email' },
              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get important alerts sent to your phone number' },
              { key: 'aiRecommendations', label: 'AI Recommendations', desc: 'Let the AI proactively suggest new vendor matches' },
              { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when spending approaches your budget limits' },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive tips, wedding ideas, and promotional offers' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
                  <p className="text-xs text-black/40 mt-0.5 max-w-[500px]">{desc}</p>
                </div>
                <Toggle k={key} />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Preferences</h2>
          <div className="grid grid-cols-2 gap-5">
            {[
              { key: 'language', label: 'Language', opts: [{ v: 'en', l: 'English' }, { v: 'ar', l: 'العربية' }] },
              { key: 'currency', label: 'Currency', opts: [{ v: 'AED', l: 'AED — UAE Dirham' }, { v: 'USD', l: 'USD — US Dollar' }] },
              { key: 'timezone', label: 'Timezone', opts: [{ v: 'Asia/Dubai', l: 'Gulf Standard Time (GST)' }, { v: 'UTC', l: 'UTC' }] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">{label}</label>
                <select value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#b89b6b] bg-white transition-all">
                  {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a] mb-5">Account</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-[#f9f6ef] rounded-xl">
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">Download My Data</p>
                <p className="text-xs text-black/40 mt-0.5">Export all your wedding planning data as a PDF report</p>
              </div>
              <button className="border border-[rgba(184,154,105,0.3)] text-[#b89b6b] text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#f4ebd0] transition-colors">
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div>
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-400 mt-0.5">Permanently delete your account and all associated data</p>
              </div>
              <button className="bg-red-100 text-red-600 text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-red-200 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
