'use client';
import UserService from '../../lib/services/user.service';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const imgs = {
  heroBg: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  heroOverlay: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80",
  archDeco1: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  logoIcon: "/logo-icon.png",
  logoText: "/logo-text.png",
  logoArabic: "/logo-arabic.png",
  waitlistBtn: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
};

const navLinks = [
  { label: 'Home', href: '/' }, { label: 'About', href: '/about' },
  { label: 'Budget Estimation', href: '/budget-estimation' }, { label: 'Vendors', href: '/vendors' },
  { label: 'Services', href: '/services' }, { label: 'Contact Us', href: '/contact' },
];

export default function ContactPage() {
  const [saving, setSaving] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[88px] flex items-center px-10 justify-between transition-all duration-300 ${scrolled ? 'bg-[#174a37] shadow-[0_2px_20px_rgba(0,0,0,0.2)]' : 'bg-transparent'}`}>
        <Link href="/" className="flex items-center gap-3">
          <img src={imgs.logoIcon} alt="Logo" className="h-[55px] w-auto" />
          <div><img src={imgs.logoText} alt="honeymoon" className="h-[21px] w-auto" />
            <img src={imgs.logoArabic} alt="" className="h-[16px] w-auto mt-1" /></div>
        </Link>
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map(l => (
            <Link key={l.label} href={l.href}
              className={`text-[14px] uppercase tracking-wide hover:text-white transition-colors ${l.href === '/contact' ? 'text-white font-bold' : 'text-white/80'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/login" className="border border-white/40 text-white text-[14px] uppercase px-5 py-2.5 rounded-[7.5px] hover:bg-white/10 transition-colors">
          Sign Up | Login
        </Link>
      </nav>

      <section className="relative h-[400px] flex items-center overflow-hidden">
        <img src={imgs.heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <img src={imgs.heroOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-[88px]">
          <p className="text-[#b89b6b] text-[14px] uppercase tracking-[4px] mb-4">Get In Touch</p>
          <h1 className="font-baskerville text-[72px] leading-[80px] text-[#fff6e9] capitalize">Contact Us</h1>
        </div>
      </section>

      <section className="bg-[#174a37] relative overflow-hidden py-24">
        <div className="absolute right-[160px] bottom-0 w-[257px] h-[268px] rounded-t-[500px] overflow-hidden opacity-15 rotate-180">
          <img src={imgs.archDeco1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-10">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Info */}
            <div className="lg:w-[400px] flex-shrink-0">
              <h2 className="font-baskerville text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px] text-[#b89b6b] capitalize mb-6">Let's Talk</h2>
              <p className="text-white/70 text-[17px] leading-7 mb-10">
                Whether you're just beginning your planning journey or need specific assistance, our team is ready to help.
              </p>
              {[
                { icon: '📍', label: 'Visit Us', value: '210 Qilo Street, Dubai, UAE' },
                { icon: '📧', label: 'Email Us', value: 'hello@honeymoon.ae' },
                { icon: '📞', label: 'Call Us', value: '+971 4 123 4567' },
                { icon: '🕐', label: 'Working Hours', value: 'Sun–Thu, 9am–6pm GST' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{c.label}</p>
                    <p className="text-white text-sm font-medium mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="flex-1">
              {submitted ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <div className="w-20 h-20 bg-[#174a37] rounded-full flex items-center justify-center text-[#b89b6b] text-3xl mx-auto mb-6">✓</div>
                  <h3 className="font-baskerville text-[32px] text-[#174a37] mb-3">Message Sent!</h3>
                  <p className="text-black/60">We'll be in touch within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-[#b89b6b] text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-10">
                  <div className="grid grid-cols-2 gap-5 mb-5">
                    {[
                      { label: 'Full Name*', key: 'name', placeholder: 'Rashed Kabir' },
                      { label: 'Email Address*', key: 'email', placeholder: 'you@example.com' },
                      { label: 'Phone Number', key: 'phone', placeholder: '+971 50 123 4567' },
                      { label: 'Subject', key: 'subject', placeholder: 'How can we help?' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">{f.label}</label>
                        <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div className="mb-6">
                    <label className="text-xs text-black/40 uppercase tracking-wider block mb-1.5">Message*</label>
                    <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your wedding plans..."
                      rows={5}
                      className="w-full border border-[rgba(184,154,105,0.3)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#b89b6b] resize-none transition-colors" />
                  </div>
                  <button onClick={() => setSubmitted(true)}
                    className="w-full bg-[#174a37] text-white font-medium py-4 rounded-xl hover:bg-[#1a5c45] transition-colors text-base">
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
