'use client';
import { useVendorAuth } from '../context/auth';
import Link from 'next/link';
const BG = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const LOGO_ICON = "/logo-icon.png";
const LOGO_TEXT = "/logo-text.png";
const LOGO_AR = "/logo-arabic.png";
export default function VendorHomePage() {
  const { isLoggedIn, isLoading } = useVendorAuth();
  return (
    <div className="min-h-screen" style={{background:'#f4ebd0'}}>
      <nav className="bg-[#174a37] h-[70px] flex items-center px-10 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#b89b6b] rounded-full flex items-center justify-center">
            <img src={LOGO_ICON} alt="" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <img src={LOGO_TEXT} alt="HONEYMOON" className="h-3.5" />
            <img src={LOGO_AR} alt="" className="h-2.5 mt-0.5" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-white/70 hover:text-white text-sm transition-colors">Login</Link>
          <Link href="/signup" className="bg-[#b89b6b] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#a08860] transition-colors">Sign Up</Link>
        </div>
      </nav>
      <div className="relative h-[350px] sm:h-[500px] overflow-hidden">
        <img src={BG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#174a37]/60 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-baskerville text-[32px] sm:text-[42px] lg:text-[56px] text-white leading-tight mb-4">Grow Your Wedding<br/>Business with HoneyMoon</h1>
          <p className="text-white/80 text-lg max-w-lg mb-8">Join thousands of wedding vendors. Reach couples planning their perfect day.</p>
          <div className="flex gap-4">
            <Link href="/signup" className="bg-[#b89b6b] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-[#a08860] transition-colors">Join as Vendor</Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-4 rounded-full font-medium text-base hover:bg-white/10 transition-colors">Login</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="font-baskerville text-[28px] sm:text-[36px] lg:text-[40px] text-center text-[#1a1a1a] mb-12">Why Join HoneyMoon?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[['🎯','Reach More Couples','Get discovered by thousands of couples planning their weddings in UAE.'],['📊','Manage with Ease','Powerful dashboard to manage bookings, payments and communications.'],['💰','Grow Revenue','Set your own prices and packages. No hidden fees.']].map(([icon,title,desc])=>(
            <div key={title} className="bg-white rounded-2xl p-8 text-center shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-baskerville text-xl text-[#1a1a1a] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-6">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/signup" className="bg-[#174a37] text-white px-10 py-4 rounded-full font-medium text-base hover:bg-[#1a5c45] transition-colors">Get Started Today</Link>
        </div>
      </div>
    </div>
  );
}
