import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase, adminUpsertProduct } from '../../lib/supabase'

const EMPTY = {
  slug: '', name: '', subtitle: '', description: '',
  price: '0', dosage: '10MG', compound_type: '',
  bg_color: '#F5F5F5', is_featured: false, in_stock: true,
}

export default function AdminProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isNew) return
    supabase.from('products').select('*').eq('id', id).single().then(({ data, error: e }) => {
      if (e) setError(e.message)
      else setForm({ ...data, price: String(data.price) })
      setLoading(false)
    })
  }, [id, isNew])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
      }
      if (isNew) delete payload.id
      const saved = await adminUpsertProduct(payload)
      navigate(`/admin/products/${saved.id}/edit`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-[13px] text-[#86868B]">Loading…</p>

  return (
    <div>
      <Link to="/admin/products" className="text-[12px] text-[#86868B] hover:text-[#1D1D1F]">← All products</Link>
      <h2 className="text-[20px] font-semibold text-[#1D1D1F] mt-1 mb-6">{isNew ? 'New product' : form.name || 'Product'}</h2>

      <form onSubmit={handleSave} className="space-y-3 max-w-[640px]">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
        </div>
        <Field label="Subtitle" value={form.subtitle || ''} onChange={(v) => setForm({ ...form, subtitle: v })} />
        <div className="grid grid-cols-3 gap-3">
          <Field label="Price (USD)" type="number" step="0.01" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
          <Field label="Dosage" value={form.dosage || ''} onChange={(v) => setForm({ ...form, dosage: v })} />
          <Field label="Compound type" value={form.compound_type || ''} onChange={(v) => setForm({ ...form, compound_type: v })} />
        </div>
        <Field label="Background color" value={form.bg_color || ''} onChange={(v) => setForm({ ...form, bg_color: v })} placeholder="#F5F5F5" />
        <div>
          <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">Description</label>
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1D1D1F] outline-none focus:border-[#1D1D1F] transition"
          />
        </div>
        <div className="flex gap-6">
          <Check label="In stock" checked={form.in_stock} onChange={(v) => setForm({ ...form, in_stock: v })} />
          <Check label="Featured" checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
        </div>

        {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition ${
            saving ? 'bg-[#1D1D1F]/30 text-white cursor-not-allowed' : 'bg-[#1D1D1F] text-white btn-apple'
          }`}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1D1D1F] outline-none focus:border-[#1D1D1F] transition"
        {...rest}
      />
    </div>
  )
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-[#1D1D1F]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#1D1D1F]"
      />
      {label}
    </label>
  )
}
