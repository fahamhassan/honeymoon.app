'use client';
import { useState, useEffect } from 'react';

// ── Confirm Modal (Please Confirm style from design) ─────────────────────────
export function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="card p-8 w-full max-w-sm text-center modal-in">
        <button onClick={onCancel} className="absolute top-4 right-4 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer" style={{ position: 'absolute', top: 16, right: 16 }}>✕</button>
        {/* Warning icon */}
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#FEE2E2' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#EF4444"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="font-serif text-xl mb-2">Please Confirm</h2>
        <p className="text-sm mb-7" style={{ color: '#6B6050' }}>{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">No</button>
          <button onClick={onConfirm} disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? 'Processing…' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Success Modal ─────────────────────────────────────────────────────────────
export function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="card p-8 w-full max-w-sm text-center modal-in" style={{ position: 'relative' }}>
        <button onClick={onClose} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer" style={{ position: 'absolute', top: 16, right: 16 }}>✕</button>
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#22C55E' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="font-serif text-xl mb-2">Successful</h2>
        <p className="text-sm mb-7" style={{ color: '#6B6050' }}>{message}</p>
        <button onClick={onClose} className="btn-primary w-full justify-center">Ok</button>
      </div>
    </div>
  );
}

// ── Generic Modal ─────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, maxWidth = '500px' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="card p-7 w-full overflow-y-auto modal-in" style={{ maxWidth, maxHeight: '90vh', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Status Badge (text-only as per design) ────────────────────────────────────
export function StatusText({ status }) {
  const map = {
    completed:  'status-completed',
    upcoming:   'status-upcoming',
    pending:    'status-pending',
    rejected:   'status-rejected',
    resolved:   'status-resolved',
    active:     'status-active',
    inactive:   'status-inactive',
    paid:       'status-paid',
    unpaid:     'status-unpaid',
    confirmed:  'status-completed',
    cancelled:  'status-rejected',
  };
  const cls = map[(status || '').toLowerCase()] || '';
  return <span className={cls}>{status}</span>;
}

// ── Pill badge (for tables) ───────────────────────────────────────────────────
export function StatusPill({ status }) {
  const styles = {
    active:    { bg: '#DCFCE7', color: '#15803D' },
    completed: { bg: '#DCFCE7', color: '#15803D' },
    resolved:  { bg: '#DCFCE7', color: '#15803D' },
    confirmed: { bg: '#DCFCE7', color: '#15803D' },
    pending:   { bg: '#FEF3C7', color: '#D97706' },
    upcoming:  { bg: '#FEF3C7', color: '#D97706' },
    rejected:  { bg: '#FEE2E2', color: '#DC2626' },
    cancelled: { bg: '#FEE2E2', color: '#DC2626' },
    inactive:  { bg: '#F3F4F6', color: '#6B7280' },
    paid:      { bg: '#DCFCE7', color: '#15803D' },
    unpaid:    { bg: '#FEE2E2', color: '#DC2626' },
  };
  const s = styles[(status || '').toLowerCase()] || { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
          style={{ background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 32 }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="rounded-full border-2 animate-spin" style={{
        width: size, height: size,
        borderColor: '#E4DEC8',
        borderTopColor: '#1A3828',
      }} />
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📋', title = 'No data found', sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <span className="text-5xl">{icon}</span>
      <p className="font-serif text-lg" style={{ color: '#1A1A1A' }}>{title}</p>
      {sub && <p className="text-sm" style={{ color: '#8A8070' }}>{sub}</p>}
    </div>
  );
}

// ── Page title with back arrow ────────────────────────────────────────────────
export function PageTitle({ title, onBack, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="page-title">
        {onBack && (
          <button onClick={onBack} className="back-arrow bg-transparent border-none cursor-pointer">←</button>
        )}
        {title}
      </div>
      {action}
    </div>
  );
}

// ── Field group ───────────────────────────────────────────────────────────────
export function Field({ label, required, children }) {
  return (
    <div className="mb-5">
      <label className="field-label">{label}{required && <span>*</span>}</label>
      {children}
    </div>
  );
}

// ── Payment summary row ───────────────────────────────────────────────────────
export function SummaryRow({ label, value, bold, muted, indent }) {
  return (
    <div className="flex justify-between items-baseline py-1.5 border-b border-gray-100 last:border-0"
         style={{ paddingLeft: indent ? 12 : 0 }}>
      <span className="text-sm" style={{ color: muted ? '#9A9080' : bold ? '#1A1A1A' : '#4A4A4A', fontWeight: bold ? 600 : 400 }}>
        {label}
      </span>
      <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{value}</span>
    </div>
  );
}
