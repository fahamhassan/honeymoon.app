'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const logoIcon = "/logo-icon.png";
const logoText = "/logo-text.png";
const logoArabic = "/logo-arabic.png";

const navGroups = [
  {
    label: 'Planning',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
      { href: '/dashboard/ai-planner', label: 'AI Planner', icon: '✦', badge: '4' },
      { href: '/dashboard/getting-started', label: 'Getting Started', icon: '🚀' },
    ]
  },
  {
    label: 'Vendors',
    items: [
      { href: '/dashboard/vendors', label: 'Browse Vendors', icon: '🏛' },
      { href: '/dashboard/compare', label: 'Compare', icon: '⚖' },
      { href: '/dashboard/search', label: 'Search', icon: '🔍' },
    ]
  },
  {
    label: 'Bookings & Finance',
    items: [
      { href: '/dashboard/bookings', label: 'My Bookings', icon: '📋' },
      { href: '/dashboard/budget', label: 'Budget', icon: '💰' },
      { href: '/dashboard/payments', label: 'Payments', icon: '💳' },
    ]
  },
  {
    label: 'Communication',
    items: [
      { href: '/dashboard/chat', label: 'Messages', icon: '💬', badge: '2' },
      { href: '/dashboard/reviews', label: 'Reviews', icon: '⭐' },
      { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔', badge: '3' },
      { href: '/dashboard/invite', label: 'Invite Team', icon: '👥' },
    ]
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
      { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
    ]
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <div className="flex min-h-screen bg-[#f9f6ef]">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`bg-[#174a37] flex flex-col fixed lg:sticky top-0 h-screen z-40 transition-all duration-300 flex-shrink-0
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Link href="/" className="flex items-center gap-3 px-5 py-5 border-b border-white/10 hover:bg-white/5 transition-colors flex-shrink-0">
          <img src={logoIcon} alt="HoneyMoon" className="h-10 w-auto object-contain flex-shrink-0" />
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <img src={logoText} alt="honeymoon" className="h-[16px] w-auto object-contain" />
              <img src={logoArabic} alt="هني موون" className="h-[12px] w-auto object-contain mt-0.5" />
            </div>
          )}
        </Link>

        {!collapsed && (
          <div className="mx-3 my-3 bg-white/10 rounded-xl px-4 py-3 flex-shrink-0">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Wedding</p>
            <p className="text-white text-sm font-medium">Rashed &amp; Fatima</p>
            <p className="text-[#b89b6b] text-xs mt-0.5">June 15, 2026 · 187 days</p>
          </div>
        )}

        <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-hide">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <p className="text-white/20 text-[10px] uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map(({ href, label, icon, badge }) => {
                  const active = isActive(href);
                  return (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active ? 'bg-[#b89b6b] text-white' : 'text-white/55 hover:bg-white/10 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}>
                      <span className="text-[15px] flex-shrink-0 w-5 text-center leading-none">{icon}</span>
                      {!collapsed && <span className="text-[13px] font-medium flex-1 truncate">{label}</span>}
                      {!collapsed && badge && (
                        <span className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ${active ? 'bg-white/25 text-white' : 'bg-[#b89b6b] text-white'}`}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 flex-shrink-0">
          <button onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center gap-3 px-4 py-3 text-white/30 hover:text-white/60 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}>
            <span>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[rgba(184,154,105,0.15)] h-[68px] flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 -ml-1">
              <div className="flex flex-col gap-1.5">
                <span className="block w-5 h-0.5 bg-[#1a1a1a]/60" />
                <span className="block w-5 h-0.5 bg-[#1a1a1a]/60" />
                <span className="block w-4 h-0.5 bg-[#1a1a1a]/60" />
              </div>
            </button>
            <Link href="/dashboard/search"
              className="bg-[#f9f6ef] border border-[rgba(184,154,105,0.15)] rounded-full h-9 w-44 md:w-72 flex items-center px-4 gap-2 hover:border-[#b89b6b] transition-colors">
              <span className="text-black/25 text-sm">🔍</span>
              <span className="text-sm text-black/25 hidden sm:block">Search...</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/dashboard/notifications" className="relative">
              <span className="text-black/40 text-xl hover:text-black/70 transition-colors">🔔</span>
              <span className="absolute -top-1 -right-1 bg-[#b89b6b] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">3</span>
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#174a37] rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">RK</div>
              <div className="hidden md:block">
                <p className="text-[#1a1a1a] text-sm font-medium leading-none">Rashed Kabir</p>
                <p className="text-black/35 text-xs mt-0.5">Premium Member</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
