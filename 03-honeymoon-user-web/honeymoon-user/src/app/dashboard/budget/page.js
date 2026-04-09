'use client';
import { usePaginated } from '../../../hooks/useApi';
import UserService from '../../../lib/services/user.service';
import { useState } from 'react';

const categories = [
  { cat: 'Venue', budgeted: 80000, spent: 45000, color: '#174a37', items: ['Al Habtoor Palace deposit'] },
  { cat: 'Photography', budgeted: 15000, spent: 8500, color: '#b89b6b', items: ['Studio Lumière deposit'] },
  { cat: 'Beauty', budgeted: 8000, spent: 3200, color: '#4a7a5c', items: ['Glamour Touch booking'] },
  { cat: 'Catering', budgeted: 60000, spent: 0, color: '#8a6b3c', items: [] },
  { cat: 'Decoration', budgeted: 25000, spent: 0, color: '#2d6b50', items: [] },
  { cat: 'Music & Entertainment', budgeted: 12000, spent: 0, color: '#c9a66b', items: [] },
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

export default function BudgetPage() {
  const { items: budgets, loading, refresh, total, hasMore, nextPage} = usePaginated(UserService.getBudgets, {});
  const [view, setView] = useState('overview');
  const totalBudget = categories.reduce((s, c) => s + c.budgeted, 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const pct = Math.round((totalSpent / totalBudget) * 100);

  return (
    <>
    <div className="max-w-[1100px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-baskerville text-[36px] text-[#1a1a1a]">Budget Estimation</h1>
          <p className="text-black/40 text-sm mt-1">Track and manage your wedding budget</p>
        </div>
        <button className="bg-[#174a37] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#1a5c45] transition-colors">
          + Add Expense
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Budget', value: `AED ${totalBudget.toLocaleString()}`, sub: 'Set by you', color: '#174a37' },
          { label: 'Amount Spent', value: `AED ${totalSpent.toLocaleString()}`, sub: `${pct}% of total`, color: '#b89b6b' },
          { label: 'Remaining', value: `AED ${remaining.toLocaleString()}`, sub: `${100 - pct}% left`, color: remaining > 0 ? '#174a37' : '#c0392b' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
            <p className="text-black/40 text-xs uppercase tracking-wider">{label}</p>
            <p className="font-baskerville text-[30px] mt-1" style={{ color }}>{value}</p>
            <p className="text-black/40 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] p-6 mb-8 shadow-[0_0_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#1a1a1a]">Overall Spending</span>
          <span className="text-sm text-[#b89b6b] font-medium">{pct}%</span>
        </div>
        <div className="h-3 bg-[#f4ebd0] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#174a37] to-[#b89b6b] rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-black/40">AED {totalSpent.toLocaleString()} spent</span>
          <span className="text-xs text-black/40">AED {totalBudget.toLocaleString()} total</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-[rgba(184,154,105,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between p-6 border-b border-[rgba(184,154,105,0.1)]">
          <h2 className="font-baskerville text-[22px] text-[#1a1a1a]">Category Breakdown</h2>
          <div className="flex gap-2">
            {['overview', 'detailed'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`text-xs font-medium px-4 py-2 rounded-[8px] transition-colors capitalize ${
                  view === v ? 'bg-[#174a37] text-white' : 'bg-[#f4ebd0] text-black/50 hover:text-black/70'
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-5">
            {categories.map(({ cat, budgeted, spent, color }) => {
              const p = Math.round((spent / budgeted) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-[#1a1a1a]">{cat}</span>
                      {spent === 0 && <span className="text-xs text-black/30 bg-[#f4ebd0] px-2 py-0.5 rounded-full">Not started</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-black/40">AED {spent.toLocaleString()} / {budgeted.toLocaleString()}</span>
                      <span className="text-xs font-medium text-[#1a1a1a] w-8 text-right">{p}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#f4ebd0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    <Pagination items={budgets} total={total} hasMore={hasMore} nextPage={nextPage} loading={loading} />
    </>
  );
}
