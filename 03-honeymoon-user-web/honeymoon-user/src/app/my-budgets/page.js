'use client';
import { usePaginated } from '../../hooks/useApi';
import UserService from '../../lib/services/user.service';
import { useState } from 'react';
import Link from 'next/link';
import LoggedInNav from '@/components/LoggedInNav';
import Footer from '@/components/Footer';

const imgVenue1 = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80";
const imgVenue2 = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80";
const imgVenue3 = "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80";

function DeleteSuccessModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        </div>
        <p className="text-[#1a1a1a] text-lg font-medium mb-6">Budget Deleted Successfully.</p>
        <button onClick={onClose} className="bg-[#b89b6b] text-white px-10 py-3 rounded-xl hover:bg-[#a08860] transition-colors font-medium">
          Okay
        </button>
      </div>
    </div>
  );
}

function EditBudgetModal({ budget, onClose, onSave }) {
  const [form, setForm] = useState({ name: budget.name, total: budget.total, location: budget.location });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-[500px] p-8 shadow-2xl">
        <h2 className="font-baskerville text-[28px] text-[#b89b6b] mb-6">Edit Budget</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Budget Name<span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Total Budget (AED)<span className="text-red-500">*</span></label>
            <input type="number" value={form.total} onChange={e => setForm(p => ({...p, total: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
          </div>
          <div>
            <label className="text-sm text-black/60 block mb-1.5">Location</label>
            <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))}
              className="w-full border border-[#d4d4d4] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#b89b6b] transition-colors" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onSave} className="flex-1 bg-[#b89b6b] text-white font-medium py-3 rounded-xl hover:bg-[#a08860] transition-colors">Save</button>
          <button onClick={onClose} className="flex-1 border border-[rgba(184,154,105,0.3)] text-black/50 font-medium py-3 rounded-xl hover:bg-[#f4ebd0] transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const initBudgets = [
  { id: 1, name: 'Wedding Budget 2026', total: 200000, spent: 84000, location: 'Dubai', guests: 200, img: imgVenue1,
    items: [{cat:'Venue',budget:80000,spent:45000},{cat:'Photography',budget:15000,spent:8500},{cat:'Beauty',budget:8000,spent:3200},{cat:'Catering',budget:60000,spent:0},{cat:'Decoration',budget:25000,spent:0},{cat:'Music',budget:12000,spent:0}] },
  { id: 2, name: 'Engagement Party', total: 50000, spent: 12000, location: 'Abu Dhabi', guests: 80, img: imgVenue2,
    items: [{cat:'Venue',budget:20000,spent:10000},{cat:'Catering',budget:15000,spent:2000},{cat:'Decoration',budget:10000,spent:0},{cat:'Music',budget:5000,spent:0}] },
  { id: 3, name: 'Rehearsal Dinner', total: 15000, spent: 8000, location: 'Sharjah', guests: 30, img: imgVenue3,
    items: [{cat:'Venue',budget:6000,spent:6000},{cat:'Catering',budget:7000,spent:2000},{cat:'Decoration',budget:2000,spent:0}] },
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

export default function MyBudgetsPage() {
  const { items: apiBudgets, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getBudgets, {});
  const [budgets, setBudgets] = useState(initBudgets);
  const [showDelete, setShowDelete] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try { await UserService.deleteBudget(deleteId); refresh(); } catch(e) {
      setBudgets(p => p.filter(b => b.id !== deleteId)); // fallback local
    }
    setShowDelete(false);
    setDeleteId(null);
  };

  return (
    <>
    <div className="min-h-screen bg-[#f4ebd0] font-sans flex flex-col">
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-[400px] p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">✓</div>
            </div>
            <p className="text-[#1a1a1a] text-lg font-medium mb-6">Budget Deleted Successfully.</p>
            <button onClick={confirmDelete} className="bg-[#b89b6b] text-white px-10 py-3 rounded-xl hover:bg-[#a08860] transition-colors font-medium w-full">
              Okay
            </button>
          </div>
        </div>
      )}
      {editBudget && <EditBudgetModal budget={editBudget} onClose={() => setEditBudget(null)} onSave={() => setEditBudget(null)} />}

      <LoggedInNav />
      <main className="flex-1 max-w-7xl mx-auto px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-baskerville text-[28px] sm:text-[36px] lg:text-[40px] text-[#b89b6b]">My Budgets</h1>
          <Link href="/budget-estimation" className="bg-[#174a37] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c45] transition-colors">
            + New Budget
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          {budgets.map(b => {
            const pct = Math.round((b.spent / b.total) * 100);
            const isExpanded = expanded === b.id;
            return (
              <div key={b.id} className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="flex items-center gap-5 p-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a1a1a] text-base">{b.name}</p>
                    <p className="text-black/40 text-sm mt-0.5">📍 {b.location} · 👥 {b.guests} guests</p>
                    <div className="mt-2 h-1.5 bg-[#f4ebd0] rounded-full overflow-hidden w-48">
                      <div className="h-full bg-[#b89b6b] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-black/40 mt-1">AED {b.spent.toLocaleString()} / {b.total.toLocaleString()} ({pct}% used)</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => setExpanded(isExpanded ? null : b.id)}
                      className="text-sm text-[#b89b6b] border border-[rgba(184,154,105,0.3)] px-3 py-1.5 rounded-lg hover:bg-[#f4ebd0] transition-colors">
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>
                    <button onClick={() => setEditBudget(b)}
                      className="text-sm text-white bg-[#174a37] px-3 py-1.5 rounded-lg hover:bg-[#1a5c45] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(b.id)}
                      className="text-sm text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[rgba(184,154,105,0.1)]">
                    <div className="pt-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {b.items.map(item => {
                        const ip = Math.round((item.spent / item.budget) * 100);
                        return (
                          <div key={item.cat} className="bg-[#f9f6ef] rounded-xl p-3">
                            <div className="flex justify-between mb-1.5">
                              <span className="text-sm font-medium text-[#1a1a1a]">{item.cat}</span>
                              <span className="text-xs text-black/40">{ip}%</span>
                            </div>
                            <div className="h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
                              <div className="h-full bg-[#b89b6b] rounded-full" style={{ width: `${ip}%` }} />
                            </div>
                            <p className="text-xs text-black/40 mt-1">AED {item.spent.toLocaleString()} / {item.budget.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
    <Pagination items={apiBudgets} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
