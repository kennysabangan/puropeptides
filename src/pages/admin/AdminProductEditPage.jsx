import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  supabase,
  adminUpsertProduct,
  adminUploadProductImage,
  adminDeleteProductImage,
} from '../../lib/supabase'

const EMPTY = {
  slug: '', name: '', subtitle: '', description: '',
  price: '0', dosage: '10MG', compound_type: '',
  bg_color: '#F5F5F5', is_featured: false, in_stock: true,
  image_url: null, gallery_urls: [],
}

export default function AdminProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingPrimary, setUploadingPrimary] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isNew) return
    supabase.from('products').select('*').eq('id', id).single().then(({ data, error: e }) => {
      if (e) setError(e.message)
      else setForm({
        ...data,
        price: String(data.price),
        gallery_urls: Array.isArray(data.gallery_urls) ? data.gallery_urls : [],
      })
      setLoading(false)
    })
  }, [id, isNew])

  const buildPathPrefix = () => form.slug || id || `new-${Date.now()}`

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

  const handlePrimaryUpload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadingPrimary(true); setError(null)
    try {
      const path = `${buildPathPrefix()}/primary-${Date.now()}-${file.name}`
      const url = await adminUploadProductImage(file, path)
      const previous = form.image_url
      setForm((f) => ({ ...f, image_url: url }))
      if (previous) {
        adminDeleteProductImage(previous).catch(() => {})
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingPrimary(false)
    }
  }

  const handlePrimaryClear = async () => {
    const previous = form.image_url
    setForm((f) => ({ ...f, image_url: null }))
    if (previous) {
      try { await adminDeleteProductImage(previous) } catch { /* best effort */ }
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (files.length === 0) return
    setUploadingGallery(true); setError(null)
    try {
      const uploaded = []
      for (const file of files) {
        const path = `${buildPathPrefix()}/gallery-${Date.now()}-${file.name}`
        const url = await adminUploadProductImage(file, path)
        uploaded.push(url)
      }
      setForm((f) => ({ ...f, gallery_urls: [...(f.gallery_urls || []), ...uploaded] }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingGallery(false)
    }
  }

  const moveGallery = (index, delta) => {
    setForm((f) => {
      const arr = [...(f.gallery_urls || [])]
      const target = index + delta
      if (target < 0 || target >= arr.length) return f
      ;[arr[index], arr[target]] = [arr[target], arr[index]]
      return { ...f, gallery_urls: arr }
    })
  }

  const removeGallery = async (index) => {
    const url = form.gallery_urls[index]
    setForm((f) => ({
      ...f,
      gallery_urls: f.gallery_urls.filter((_, i) => i !== index),
    }))
    if (url) {
      try { await adminDeleteProductImage(url) } catch { /* best effort */ }
    }
  }

  const promoteToPrimary = (index) => {
    setForm((f) => {
      const arr = [...(f.gallery_urls || [])]
      const [picked] = arr.splice(index, 1)
      const prevPrimary = f.image_url
      return {
        ...f,
        image_url: picked,
        gallery_urls: prevPrimary ? [prevPrimary, ...arr] : arr,
      }
    })
  }

  if (loading) return <p className="text-[13px] text-[#8B95A5]">Loading…</p>

  return (
    <div>
      <Link to="/admin/products" className="text-[12px] text-[#8B95A5] hover:text-[#1A1F2E]">← All products</Link>
      <h2 className="text-[20px] font-semibold text-[#1A1F2E] mt-1 mb-6">{isNew ? 'New product' : form.name || 'Product'}</h2>

      <form onSubmit={handleSave} className="space-y-6 max-w-[720px]">
        {/* Basic fields */}
        <div className="space-y-3">
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
            <label className="block text-[12px] font-medium text-[#1A1F2E] mb-1.5">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1A1F2E] outline-none focus:border-[#1A1F2E] transition"
            />
          </div>
          <div className="flex gap-6">
            <Check label="In stock" checked={form.in_stock} onChange={(v) => setForm({ ...form, in_stock: v })} />
            <Check label="Featured" checked={form.is_featured} onChange={(v) => setForm({ ...form, is_featured: v })} />
          </div>
        </div>

        {/* Primary image */}
        <div className="bg-[#FAFAF7] rounded-2xl p-5">
          <p className="text-[13px] font-semibold text-[#1A1F2E] mb-3">Primary image</p>
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white border border-black/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {form.image_url ? (
                <img src={form.image_url} alt="Primary" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[11px] text-[#8B95A5]">No image</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-[12px] text-[#8B95A5]">
                Replaces the legacy <code className="text-[11px]">/images/products/{form.slug || '…'}/{(form.slug || 'slug')}-vial.png</code> thumbnail.
                If empty, the legacy file is still used.
              </p>
              <div className="flex gap-2">
                <label className={`px-4 py-2 rounded-full text-[12px] font-medium cursor-pointer transition ${
                  uploadingPrimary ? 'bg-[#1A1F2E]/30 text-white cursor-not-allowed' : 'bg-[#1A1F2E] text-white btn-apple'
                }`}>
                  {uploadingPrimary ? 'Uploading…' : (form.image_url ? 'Replace' : 'Upload')}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePrimaryUpload} disabled={uploadingPrimary} />
                </label>
                {form.image_url && (
                  <button
                    type="button"
                    onClick={handlePrimaryClear}
                    className="px-4 py-2 rounded-full text-[12px] font-medium border border-black/10 text-[#1A1F2E] hover:bg-[#F5F5F7] transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-[#FAFAF7] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#1A1F2E]">Gallery images</p>
            <label className={`px-4 py-2 rounded-full text-[12px] font-medium cursor-pointer transition ${
              uploadingGallery ? 'bg-[#1A1F2E]/30 text-white cursor-not-allowed' : 'bg-[#1A1F2E] text-white btn-apple'
            }`}>
              {uploadingGallery ? 'Uploading…' : '+ Add images'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
            </label>
          </div>
          {(form.gallery_urls || []).length === 0 ? (
            <p className="text-[12px] text-[#8B95A5]">No gallery images. Legacy <code className="text-[11px]">00.png–04.png</code> are used as fallback on the product page.</p>
          ) : (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {form.gallery_urls.map((url, i) => (
                <li key={`${url}-${i}`} className="bg-white rounded-2xl border border-black/10 p-2 flex flex-col gap-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#F5F5F7] flex items-center justify-center">
                    <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveGallery(i, -1)} disabled={i === 0} className="px-1.5 py-0.5 text-[11px] text-[#1A1F2E] disabled:text-[#8B95A5]/50 hover:bg-[#F5F5F7] rounded">↑</button>
                      <button type="button" onClick={() => moveGallery(i, 1)} disabled={i === form.gallery_urls.length - 1} className="px-1.5 py-0.5 text-[11px] text-[#1A1F2E] disabled:text-[#8B95A5]/50 hover:bg-[#F5F5F7] rounded">↓</button>
                    </div>
                    <button type="button" onClick={() => promoteToPrimary(i)} className="text-[10px] text-[#1A1F2E] hover:underline">Set primary</button>
                    <button type="button" onClick={() => removeGallery(i)} className="text-[10px] text-[#FF3B30] hover:underline">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition ${
            saving ? 'bg-[#1A1F2E]/30 text-white cursor-not-allowed' : 'bg-[#1A1F2E] text-white btn-apple'
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
      <label className="block text-[12px] font-medium text-[#1A1F2E] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1A1F2E] outline-none focus:border-[#1A1F2E] transition"
        {...rest}
      />
    </div>
  )
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-[#1A1F2E]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#1A1F2E]"
      />
      {label}
    </label>
  )
}
