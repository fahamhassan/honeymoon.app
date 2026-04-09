'use client';
import { useUserAuth } from '../../../context/auth';
import { useState } from 'react';

const imgUnsplash1 = "https://ui-avatars.com/api/?name=Sarah+J&background=174a37&color=b89b6b&size=200";
const imgUnsplash2 = "https://ui-avatars.com/api/?name=Ali+R&background=b89b6b&color=fff&size=200";
const imgUnsplash3 = "https://ui-avatars.com/api/?name=Priya+S&background=174a37&color=fff&size=200";
const imgRectangle3883 = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80";
const imgRectangle3875 = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
const imgRectangle3876 = "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80";

const conversations = [
  { id: 1, name: 'Al Habtoor Palace', role: 'Events Manager', lastMsg: 'Your booking is confirmed for June 15. We will send the contract shortly.', time: '2h ago', unread: 2, img: imgRectangle3883, online: true },
  { id: 2, name: 'Studio Lumière', role: 'Photographer', lastMsg: 'We would love to discuss the shot list for your special day!', time: '5h ago', unread: 0, img: imgRectangle3875, online: false },
  { id: 3, name: 'Glamour Touch', role: 'Beauty Artist', lastMsg: 'The bridal trial is scheduled for May 20th at 10am.', time: '1d ago', unread: 0, img: imgRectangle3876, online: true },
  { id: 4, name: 'Smart Assistant', role: 'AI Planner ✦', lastMsg: 'I found 3 new vendor matches based on your updated preferences.', time: 'now', unread: 1, img: null, online: true, isAI: true },
];

const messages = {
  1: [
    { from: 'vendor', text: 'Hello! Thank you for your inquiry about booking Al Habtoor Palace for your wedding.', time: '10:30 AM' },
    { from: 'user', text: 'Hi! We are interested in the Gold Package for June 15, 2026. Is it available?', time: '10:45 AM' },
    { from: 'vendor', text: 'Great news! June 15 is available. The Gold Package includes 8-hour venue hire, premium decoration, bridal suite, and valet parking. Shall I send you the full details?', time: '11:00 AM' },
    { from: 'user', text: 'Yes please! Also, can we arrange a site visit?', time: '11:15 AM' },
    { from: 'vendor', text: 'Absolutely! We have openings this Saturday at 2pm or Sunday at 11am. Which works better for you?', time: '11:20 AM' },
    { from: 'vendor', text: 'Your booking is confirmed for June 15. We will send the contract shortly.', time: '2:00 PM' },
  ],
};

export default function ChatPage() {
  const { user } = useUserAuth();
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState('');
  const [allMessages, setAllMessages] = useState(messages);
  const active = conversations.find(c => c.id === activeId);
  const currentMessages = allMessages[activeId] || [];

  const send = () => {
    if (!input.trim()) return;
    setAllMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { from: 'user', text: input, time: 'Just now' }]
    }));
    setInput('');
  };

  return (
    <div className="max-w-[1200px] h-[calc(100vh-136px)]">
      <h1 className="font-baskerville text-[36px] text-[#1a1a1a] mb-6">Messages</h1>
      <div className="flex gap-0 bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)] overflow-hidden" style={{ height: 'calc(100% - 64px)' }}>

        {/* Sidebar */}
        <div className="w-[300px] border-r border-[rgba(184,154,105,0.12)] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-[rgba(184,154,105,0.12)]">
            <div className="bg-[#f9f6ef] rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-black/30">🔍</span>
              <input placeholder="Search messages..." className="bg-transparent text-sm text-black/50 outline-none flex-1 placeholder-black/30" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`w-full flex items-start gap-3 px-4 py-4 hover:bg-[#faf7f0] transition-colors text-left border-b border-[rgba(184,154,105,0.06)] ${activeId === c.id ? 'bg-[#faf7f0]' : ''}`}>
                <div className="relative flex-shrink-0">
                  {c.isAI
                    ? <div className="w-11 h-11 bg-[#174a37] rounded-full flex items-center justify-center text-white text-lg">✦</div>
                    : <div className="w-11 h-11 rounded-full overflow-hidden"><img src={c.img} alt="" className="w-full h-full object-cover" /></div>
                  }
                  {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#1a1a1a] truncate">{c.name}</p>
                    <span className="text-[10px] text-black/30 flex-shrink-0 ml-2">{c.time}</span>
                  </div>
                  <p className="text-[11px] text-[#b89b6b] mt-0.5">{c.role}</p>
                  <p className="text-xs text-black/40 truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <div className="w-5 h-5 bg-[#174a37] text-white text-[10px] rounded-full flex items-center justify-center flex-shrink-0 mt-1">{c.unread}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-[68px] border-b border-[rgba(184,154,105,0.12)] flex items-center px-6 gap-4 flex-shrink-0">
            {active?.isAI
              ? <div className="w-10 h-10 bg-[#174a37] rounded-full flex items-center justify-center text-white">✦</div>
              : <div className="w-10 h-10 rounded-full overflow-hidden"><img src={active?.img} alt="" className="w-full h-full object-cover" /></div>
            }
            <div>
              <p className="font-medium text-[#1a1a1a]">{active?.name}</p>
              <p className="text-xs text-[#b89b6b]">{active?.role}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="text-black/30 hover:text-[#174a37] transition-colors text-lg">📞</button>
              <button className="text-black/30 hover:text-[#174a37] transition-colors text-lg">📋</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
            {currentMessages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                {m.from !== 'user' && (
                  active?.isAI
                    ? <div className="w-8 h-8 bg-[#174a37] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">✦</div>
                    : <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1"><img src={active?.img} alt="" className="w-full h-full object-cover" /></div>
                )}
                <div className={`max-w-[65%] ${m.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-6 ${
                    m.from === 'user'
                      ? 'bg-[#174a37] text-white rounded-br-sm'
                      : 'bg-[#f4ebd0] text-[#1a1a1a] rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-black/30 px-1">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[rgba(184,154,105,0.12)] flex-shrink-0">
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-[#f9f6ef] border border-[rgba(184,154,105,0.2)] rounded-xl px-4 py-3">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none resize-none placeholder-black/30 leading-6" />
              </div>
              <button onClick={send}
                className="bg-[#174a37] text-white w-11 h-11 rounded-xl flex items-center justify-center hover:bg-[#1a5c45] transition-colors flex-shrink-0 text-lg">
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
