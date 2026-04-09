'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const initNotifs = [
  { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: false },
  { id: 2, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 3, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 4, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 5, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
  { id: 6, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.', date: '20 June 2025', time: '22:14', read: true },
];


function Pagination({ items, total, hasMore, nextPage, loading }) {
  if (!total || total <= items.length) return null;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:16,borderTop:'1px solid #f3f4f6'}}>
      <span className="text-sm text-gray-500">Showing {items.length} of {total}</span>
      {hasMore && (
        <button onClick={nextPage} disabled={loading}
          className="px-5 py-2 bg-[#174a37] text-white text-sm font-medium rounded-lg hover:bg-[#1a5c45] transition-colors disabled:opacity-50">
          {loading ? 'Loading...' : 'Load More ↓'}
        </button>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { items: notifications, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getNotifications, {});
  const [notifs, setNotifs] = useState(initNotifs);
  const [filter, setFilter] = useState('All');

  const markAllRead = () => setNotifs(p => p.map(n => ({...n, read: true})));
  const markOne = (id) => setNotifs(p => p.map(n => n.id === id ? {...n, read: !n.read} : n));

  const filtered = filter === 'All' ? notifs : filter === 'Unread' ? notifs.filter(n => !n.read) : notifs.filter(n => n.read);

  return (
    <>
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-baskerville text-[40px] text-[#b89b6b]">Notifications</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden max-w-[900px]">
          <div className="flex items-center justify-between p-5 border-b border-[rgba(184,154,105,0.1)]">
            <div className="flex items-center gap-3">
              <span className="text-sm text-black/50">Showing:</span>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="border border-[rgba(184,154,105,0.3)] rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-[#b89b6b] transition-colors">
                <option>All</option>
                <option>Unread</option>
                <option>Read</option>
              </select>
            </div>
            <button onClick={markAllRead} className="text-sm text-[#b89b6b] hover:underline font-medium">
              Mark all As Read
            </button>
          </div>

          <div className="divide-y divide-[rgba(184,154,105,0.08)]">
            {filtered.map(n => (
              <div key={n.id} className={`p-5 flex items-start justify-between gap-4 hover:bg-[#faf7f0] transition-colors ${!n.read ? 'bg-[#fdf9f0]' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-6 ${n.read ? 'text-black/50' : 'text-black/80'}`}>{n.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-black/40 flex items-center gap-1">📅 {n.date}</span>
                    <span className="text-xs text-black/40 flex items-center gap-1">⏰ Time: {n.time}</span>
                  </div>
                </div>
                <button onClick={() => markOne(n.id)}
                  className="text-sm text-[#b89b6b] hover:text-[#174a37] transition-colors whitespace-nowrap flex-shrink-0 font-medium">
                  {n.read ? 'Mark As Unread' : 'Mark As Read'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
    <Pagination items={notifications} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
