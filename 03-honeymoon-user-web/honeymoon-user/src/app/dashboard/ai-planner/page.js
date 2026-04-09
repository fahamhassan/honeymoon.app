'use client';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';

const imgStar = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgRectangle3875 = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
const imgRectangle3876 = "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80";

const initMessages = [
  { role: 'ai', text: 'Hello! I\'m your AI wedding planner. I\'ve analyzed your preferences and found 12 perfect vendors for your luxury Emirati wedding. How can I help you today?' },
  { role: 'user', text: 'We want a luxury Emirati wedding in Dubai for about 200 guests in June 2026.' },
  { role: 'ai', text: 'Excellent! Based on your criteria — 200 guests, luxury style, June 2026, Dubai — I\'ve shortlisted 3 top venues. Al Habtoor Palace has a 98% match score. Shall I show you the details?' },
];

const matches = [
  { name: 'Al Habtoor Palace', cat: 'Venue', rating: 4.9, match: 98, reason: 'Perfect capacity for 200 guests, luxury palace style, within budget range', img: imgRectangle3883, price: 'AED 65,000' },
  { name: 'Studio Lumière', cat: 'Photography', rating: 4.8, match: 95, reason: 'Specialises in luxury Emirati weddings, available on your date', img: imgRectangle3875, price: 'AED 12,000' },
  { name: 'Glamour Touch', cat: 'Beauty', rating: 4.7, match: 92, reason: 'Top-rated bridal artist in Dubai, has UAE traditional experience', img: imgRectangle3876, price: 'AED 4,500' },
];

const suggestions = [
  'Find me the best venues for 200 guests',
  'What\'s a realistic budget for a luxury wedding?',
  'Compare Photography packages',
  'Which vendors are available on June 15?',
];

export default function AIPlannerPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState('');
  const [comparing, setComparing] = useState([]);
  const [typing, setTyping] = useState(false);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Based on your preferences, I recommend starting with Al Habtoor Palace — it has a 98% match with your requirements. The Gold Package at AED 65,000 includes everything you need for 200 guests. Would you like to request a site visit?'
      }]);
    }, 1500);
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#174a37] rounded-2xl flex items-center justify-center text-white text-xl shadow-[0_4px_12px_rgba(23,74,55,0.3)]">✦</div>
        <div>
          <h1 className="font-baskerville text-[36px] text-[#1a1a1a]">AI Wedding Planner</h1>
          <p className="text-black/40 text-sm">Intelligent curation · 12 matches found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ height: 'calc(100vh - 220px)', minHeight: 600 }}>
        {/* Chat */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="p-5 border-b border-[rgba(184,154,105,0.1)] flex items-center gap-3">
            <div className="w-9 h-9 bg-[#174a37] rounded-full flex items-center justify-center text-white text-sm">✦</div>
            <div>
              <p className="font-medium text-sm text-[#1a1a1a]">Smart Wedding Assistant</p>
              <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />Active</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="w-7 h-7 bg-[#f4ebd0] rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">✦</div>
                )}
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6 ${
                  m.role === 'user' ? 'bg-[#174a37] text-white rounded-br-sm' : 'bg-[#f4ebd0] text-[#1a1a1a] rounded-bl-sm'
                }`}>{m.text}</div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-[#f4ebd0] rounded-full flex items-center justify-center text-sm flex-shrink-0">✦</div>
                <div className="bg-[#f4ebd0] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-[#b89b6b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#b89b6b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#b89b6b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {suggestions.slice(0, 2).map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-[11px] text-[#b89b6b] bg-[#f4ebd0] px-3 py-1.5 rounded-full hover:bg-[#e8dfc5] transition-colors">
                {s}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[rgba(184,154,105,0.1)]">
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask your AI planner..."
                className="flex-1 bg-[#f9f6ef] border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b]" />
              <button onClick={() => send()}
                className="bg-[#174a37] text-white px-4 py-2.5 rounded-xl text-sm hover:bg-[#1a5c45] transition-colors">→</button>
            </div>
          </div>
        </div>

        {/* AI Matches */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-[#174a37] rounded-2xl p-5 flex-shrink-0">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-[#b89b6b] text-2xl mt-0.5">✦</span>
              <div>
                <p className="text-white font-medium">AI found 12 perfect matches</p>
                <p className="text-white/50 text-xs mt-0.5">Based on: 200 guests · June 2026 · Luxury · Dubai · AED 200K</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Venues: 3', 'Photography: 2', 'Beauty: 2', 'Catering: 3', 'Décor: 2'].map(tag => (
                <span key={tag} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          {matches.map(v => (
            <div key={v.name} className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)] p-5 flex gap-5 flex-shrink-0">
              <div className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0">
                <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[#b89b6b] text-[11px] uppercase tracking-wider font-medium">{v.cat}</span>
                    <h3 className="font-medium text-[#1a1a1a] text-base mt-0.5">{v.name}</h3>
                    <p className="text-[#174a37] text-sm font-medium mt-0.5">{v.price}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="bg-[#174a37] text-white text-sm font-bold px-3 py-1.5 rounded-full">✦ {v.match}%</div>
                    <div className="flex items-center gap-1 justify-end mt-1.5">
                      <img src={imgStar} alt="★" className="w-3 h-3 object-contain" />
                      <span className="text-xs text-black/50">{v.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-black/50 text-xs mt-2 leading-5">{v.reason}</p>
                <div className="flex gap-2 mt-3">
                  <Link href="/dashboard/vendors/1"
                    className="bg-[#174a37] text-white text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#1a5c45] transition-colors">
                    Book Now
                  </Link>
                  <button
                    onClick={() => setComparing(p => p.includes(v.name) ? p.filter(x => x !== v.name) : [...p, v.name])}
                    className={`text-xs font-medium px-4 py-2 rounded-[8px] transition-colors ${
                      comparing.includes(v.name) ? 'bg-[#b89b6b] text-white' : 'border border-[rgba(184,154,105,0.4)] text-[#b89b6b] hover:bg-[#f4ebd0]'
                    }`}>
                    {comparing.includes(v.name) ? '✓ Added' : 'Compare'}
                  </button>
                  <Link href="/dashboard/chat" className="border border-[rgba(184,154,105,0.3)] text-black/40 text-xs font-medium px-4 py-2 rounded-[8px] hover:bg-[#f4ebd0] hover:text-[#b89b6b] transition-colors">
                    Message
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {comparing.length >= 2 && (
            <div className="bg-[#f4ebd0] border border-[rgba(184,154,105,0.4)] rounded-2xl p-4 flex items-center justify-between flex-shrink-0">
              <p className="text-sm text-[#1a1a1a]">Comparing <strong>{comparing.length}</strong> vendors</p>
              <button className="bg-[#b89b6b] text-white text-xs font-medium px-5 py-2 rounded-[8px] hover:bg-[#a08860] transition-colors">
                Compare Side-by-Side →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
