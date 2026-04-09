'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoutModal } from '@/components/Modals';

const LOGO_ICON="/logo-icon.png";
const LOGO_TEXT="/logo-text.png";
const LOGO_AR="/logo-arabic.png";
const AVATAR="https://ui-avatars.com/api/?name=User&background=174a37&color=b89b6b&size=200";

const NAV=[
  {href:'/dashboard',label:'Dashboard',icon:'⊞'},
  {href:'/dashboard/services',label:'Service Management',icon:'🛎'},
  {href:'/dashboard/addons',label:'Add-On Management',icon:'➕'},
  {href:'/dashboard/bookings',label:'Booking Management',icon:'📋'},
  {href:'/dashboard/reported-bookings',label:'Reported Booking',icon:'🚩'},
  {href:'/dashboard/meeting-requests',label:'Meeting Request',icon:'🤝'},
  {href:'/dashboard/reviews',label:'Ratings & Reviews',icon:'⭐'},
  {href:'/dashboard/about',label:'About Us',icon:'ℹ'},
  {href:'/dashboard/contact-us',label:'Contact Us',icon:'💬'},
  {href:'/dashboard/bank-details',label:'Bank Details',icon:'🏦'},
  {href:'/dashboard/payment-logs',label:'Payment Logs',icon:'💳'},
  {href:'/dashboard/subscription-logs',label:'Subscription Logs',icon:'📄'},
  {href:'/dashboard/notifications',label:'Notifications',icon:'🔔'},
  {href:'/dashboard/profile',label:'My Profile',icon:'👤'},
];

export default function VendorLayout({children}){
  const pathname=usePathname();
  const router=useRouter();
  const [showLogout,setShowLogout]=useState(false);
  const [showUserMenu,setShowUserMenu]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const menuRef=useRef(null);

  // Close sidebar on route change
  useEffect(()=>{ setSidebarOpen(false); },[pathname]);

  useEffect(()=>{
    function h(e){if(menuRef.current&&!menuRef.current.contains(e.target))setShowUserMenu(false);}
    document.addEventListener('mousedown',h); return()=>document.removeEventListener('mousedown',h);
  },[]);

  const isActive=(href)=>href==='/dashboard'?pathname==='/dashboard':pathname.startsWith(href);

  return(
    <div className="flex flex-col min-h-screen bg-[#f4ebd0]">
      {showLogout&&<LogoutModal onYes={()=>router.push('/login')} onNo={()=>setShowLogout(false)}/>}

      <header className="fixed top-0 left-0 right-0 z-40 h-[70px] bg-[#174a37] flex items-center justify-between px-4 md:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3">
          <button onClick={()=>setSidebarOpen(true)} className="lg:hidden p-1.5 -ml-1 mr-1" aria-label="Open menu">
            <div className="flex flex-col gap-1.5">
              <span className="block w-5 h-0.5 bg-white/70" />
              <span className="block w-5 h-0.5 bg-white/70" />
              <span className="block w-4 h-0.5 bg-white/70" />
            </div>
          </button>
          <div className="w-10 h-10 border-2 border-[#b89b6b] rounded-full flex items-center justify-center">
            <img src={LOGO_ICON} alt="" className="w-6 h-6 object-contain"/>
          </div>
          <div className="hidden sm:block"><img src={LOGO_TEXT} alt="HONEYMOON" className="h-3.5"/><img src={LOGO_AR} alt="" className="h-2.5 mt-0.5"/></div>
        </div>
        <div className="flex items-center gap-4 md:gap-5">
          <Link href="/dashboard/notifications" className="relative text-white/70 hover:text-white transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b89b6b] rounded-full text-white text-[9px] flex items-center justify-center font-bold">2</span>
          </Link>
          <div className="relative" ref={menuRef}>
            <button onClick={()=>setShowUserMenu(!showUserMenu)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#b89b6b]/40"><img src={AVATAR} alt="" className="w-full h-full object-cover"/></div>
              <span className="text-white text-sm font-medium hidden md:block">Tom Albert</span>
              <span className="text-white/50 text-xs hidden sm:block">▾</span>
            </button>
            {showUserMenu&&(
              <div className="absolute right-0 top-full mt-2 bg-white border border-[rgba(184,154,105,0.2)] rounded-xl shadow-xl py-1.5 w-44 z-50">
                <Link href="/dashboard/profile" onClick={()=>setShowUserMenu(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f4ebd0] transition-colors">👤 My Profile</Link>
                <button onClick={()=>{setShowUserMenu(false);setShowLogout(true);}} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">🚪 Log Out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-[70px] min-h-screen">
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)} />}

        <aside className={`fixed top-[70px] bottom-0 w-[240px] bg-[#174a37] overflow-y-auto scrollbar-hide z-30 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:left-0`}>
          <nav className="p-3 py-4">
            {NAV.map(({href,label,icon})=>{
              const active=isActive(href);
              return(
                <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-0.5 transition-all text-sm ${active?'bg-[#b89b6b] text-white font-medium':'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                  <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-[240px] min-w-0">{children}</main>
      </div>
    </div>
  );
}
