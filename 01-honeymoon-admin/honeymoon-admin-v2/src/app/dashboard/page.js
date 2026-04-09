'use client';
import { useApi } from '../../hooks/useApi';
import AdminService from '../../lib/services/admin.service';
import { useState, useEffect } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function makeData(base, seed) {
  return MONTHS.map((m, i) => ({
    month: m,
    value: Math.floor(base + (Math.sin(i * 0.7 + seed) + 1) * 150 + i * 15)
  }));
}

const CHART_CONFIGS = [
  { key: 'earning', label: 'Total Earning', data: makeData(200, 0.5), color: '#1A3828' },
  { key: 'users', label: 'New Users Registered', data: makeData(100, 1.2), color: '#1A3828' },
  { key: 'vendors', label: 'New Vendors Registered', data: makeData(50, 2.0), color: '#1A3828' },
  { key: 'bookings', label: 'New Bookings Received', data: makeData(80, 0.3), color: '#1A3828' },
];

function SVGChart({ data, color }) {
  const W = 900, H = 220;
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;
  const pad = { left: 48, right: 20, top: 20, bottom: 30 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * innerW,
    y: pad.top + (1 - (d.value - minVal) / range) * innerH,
    val: d.value,
    label: d.month,
  }));

  const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `C ${pts[i-1].x + innerW/(data.length-1)*0.5} ${pts[i-1].y}, ${p.x - innerW/(data.length-1)*0.5} ${p.y}, ${p.x} ${p.y}`)).join(' ');
  const areaD = pathD + ` L ${pts[pts.length-1].x} ${pad.top+innerH} L ${pts[0].x} ${pad.top+innerH} Z`;

  const yTicks = 5;
  const yTickVals = Array.from({length: yTicks}, (_, i) => Math.round(minVal + (range / (yTicks-1)) * i));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {yTickVals.map((v, i) => {
        const y = pad.top + (1 - (v - minVal) / range) * innerH;
        return <g key={i}>
          <line x1={pad.left} y1={y} x2={W-pad.right} y2={y} stroke="#F0EBE0" strokeWidth="1"/>
          <text x={pad.left - 6} y={y+4} textAnchor="end" fontSize="10" fill="#9A9080">{v}</text>
        </g>;
      })}
      {/* Month labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H-4} textAnchor="middle" fontSize="10" fill="#9A9080">{p.label}</text>
      ))}
      {/* Area fill */}
      <path d={areaD} fill={`url(#g-${color.replace('#','')})`}/>
      {/* Line */}
      <path d={pathD} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#fff" strokeWidth="1.5"/>
      ))}
    </svg>
  );
}

function ChartCard({ label, data, color }) {
  const [period, setPeriod] = useState('Monthly');
  const [open, setOpen] = useState(false);

  return (
    <div className="card" style={{ padding:'28px 24px', marginBottom:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ fontFamily:'inherit', fontSize:17, fontWeight:700 }}>{label}</h3>
        <div style={{ position:'relative' }}>
          <button onClick={() => setOpen(v=>!v)} style={{ display:'flex', alignItems:'center', gap:6, border:'1px solid #E0D8C8', borderRadius:6, padding:'6px 12px', background:'#fff', fontSize:12, cursor:'pointer', color:'#1A1A1A' }}>
            {period}
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {open && (
            <div style={{ position:'absolute', top:'110%', right:0, background:'#fff', border:'1px solid #E0D8C8', borderRadius:8, overflow:'hidden', boxShadow:'0 4px 16px rgba(0,0,0,0.1)', zIndex:10 }}>
              {['Monthly','6 Months','Yearly'].map(p => (
                <button key={p} onClick={() => { setPeriod(p); setOpen(false); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'8px 16px', fontSize:12, cursor:'pointer', background:period===p?'#EDE8D3':'#fff', border:'none', color:'#1A1A1A', whiteSpace:'nowrap' }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <SVGChart data={data} color={color} />
    </div>
  );
}

function StatCard({ label, value, trend='up', icon }) {
  return (
    <div className="card" style={{ padding:'28px 24px', display:'flex', alignItems:'center', gap:20 }}>
      <div style={{ width:60, height:60, borderRadius:'50%', background:'#EDE8D3', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <div style={{ color:'#1A3828' }}>{icon}</div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, color:'#6B6050', marginBottom:4, fontWeight:500 }}>{label}</div>
        <div style={{ fontSize:30, fontWeight:700, color:'#1A1A1A', lineHeight:1 }}>{value}</div>
      </div>
      <div style={{ color:trend==='up'?'#16A34A':'#DC2626' }}>
        {trend==='up'
          ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          : <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: dashData, loading: dashLoading } = useApi(AdminService.getDashboard);
  const stats = dashData?.stats || {};
  const recentBookings = dashData?.recentBookings || [];
  const recentUsers = dashData?.recentUsers || [];

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily:"'Baskerville Old Face', 'Libre Baskerville', serif", fontSize:32, fontWeight:500, marginBottom:28, color:'#1A1A1A' }}>Dashboard</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>
        <StatCard label="New Users" value={stats.users} trend="up" icon={<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} />
        <StatCard label="New Vendors" value={stats.vendors} trend="down" icon={<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>} />
        <StatCard label="New Bookings" value={stats.bookings} trend="up" icon={<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>} />
        <StatCard label="Total Earning" value={stats.earning} trend="up" icon={<svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
      </div>
      {CHART_CONFIGS.map(cfg => <ChartCard key={cfg.key} {...cfg} />)}
    </div>
  );
}
