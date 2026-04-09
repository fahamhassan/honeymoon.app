'use client';
import { useApi } from '../../../../hooks/useApi';
import AdminService from '../../../../lib/services/admin.service';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Field, SuccessModal, ConfirmModal } from '@/components/ui';

export default function EditCategoryPage({ params }) {
  const catId = params?.id || '';
  const { data, loading, refresh } = useApi(AdminService.getCategory, catId);
  const category = data?.category || {};
  const router = useRouter();
  const [form, setForm] = useState({ name: 'Venues', nameAr: 'أماكن', description: 'Wedding venue services across UAE', status: 'active', commission: '12' });
  const [success, setSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="fade-in" style={{ maxWidth: 580 }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="btn-secondary px-3 py-1.5 text-sm">← Back</button>
        <h1 className="page-title" style={{ margin: 0 }}>Edit Category</h1>
      </div>
      <div className="card p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl border-2 border-dashed border-gray-200">🏛</div>
          <button className="btn-secondary text-sm">Change Icon</button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Category Name (EN)" required>
            <input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} className="input" />
          </Field>
          <Field label="Category Name (AR)">
            <input value={form.nameAr} onChange={e => setForm(p=>({...p,nameAr:e.target.value}))} className="input" dir="rtl" />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))}
            rows={3} className="input" style={{ height: 'auto', resize: 'vertical' }} />
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Commission (%)">
            <input type="number" value={form.commission} onChange={e => setForm(p=>({...p,commission:e.target.value}))} className="input" min={0} max={100} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))} className="input">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setSuccess(true)} className="btn-primary">Save Changes</button>
          <button onClick={() => setDeleteConfirm(true)} className="btn-secondary" style={{ color: '#DC2626', borderColor: '#FCA5A5' }}>Delete Category</button>
          <button onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </div>
      {success && <SuccessModal message="Category Updated Successfully." onClose={() => { setSuccess(false); router.push('/dashboard/categories'); }} />}
      {deleteConfirm && <ConfirmModal message="Are you sure you want to delete this category?" onConfirm={() => { setDeleteConfirm(false); router.push('/dashboard/categories'); }} onCancel={() => setDeleteConfirm(false)} />}
    </div>
  );
}
