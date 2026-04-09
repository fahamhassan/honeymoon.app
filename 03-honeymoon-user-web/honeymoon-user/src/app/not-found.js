import Link from 'next/link';

const imgHeroBg = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80";
const imgHeroOverlay = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80";
const imgLogoIcon = "/logo-icon.png";

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      <img src={imgHeroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <img src={imgHeroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10 text-center px-8 max-w-lg">
        <img src={imgLogoIcon} alt="HoneyMoon" className="h-16 w-auto mx-auto mb-8 opacity-80" />
        <p className="font-baskerville text-[120px] leading-none text-[#b89b6b] mb-4">404</p>
        <h1 className="font-baskerville text-[36px] text-[#fff6e9] mb-4">Page Not Found</h1>
        <p className="text-white/60 text-[17px] leading-7 mb-10">
          This page seems to have wandered off. Let us help you find your way back.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="bg-[#b89b6b] text-white text-[15px] font-medium px-8 py-3.5 rounded-xl hover:bg-[#a08860] transition-colors">
            Back to Home
          </Link>
          <Link href="/dashboard" className="border border-white/40 text-white text-[15px] font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
