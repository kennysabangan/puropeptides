import { useEffect, useMemo, useState } from 'react'
import {
  adminListCertificates,
  adminListProducts,
  adminUpsertCertificate,
  adminDeleteCertificate,
  adminUploadCoa,
} from '../../lib/supabase'
import Select from '../../components/Select'

const EMPTY = {
  product_id: '',
  lot_number: '',
  variant: '10mg',
  purity: '99.0',
  labeled_amount: '10mg',
  actual_amount: '',
  tested_date: new Date().toISOString().slice(0, 10),
  file_path: null,
  file_name: null,
}

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const refresh = () =>
    Promise.all([adminListCertificates(), adminListProducts()]).then(([c, p]) => {
      setCerts(c)
      setProducts(p)
      setLoading(false)
    })

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: p.name })),
    [products],
  )

  useEffect(() => {
    Promise.all([adminListCertificates(), adminListProducts()])
      .then(([c, p]) => { setCerts(c); setProducts(p); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      let filePath = form.file_path
      let fileName = form.file_name
      if (file) {
        filePath = `${form.product_id}/${form.lot_number || Date.now()}-${file.name}`
        await adminUploadCoa(file, filePath)
        fileName = file.name
      }
      await adminUpsertCertificate({
        ...form,
        purity: parseFloat(form.purity),
        file_path: filePath,
        file_name: fileName,
      })
      setForm(EMPTY)
      setFile(null)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this COA?')) return
    await adminDeleteCertificate(id)
    await refresh()
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-5">Upload COA</h2>
        <form onSubmit={handleSave} className="space-y-3 bg-[#FBFBFD] rounded-2xl p-5 max-w-[640px]">
          <div>
            <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">Product</label>
            <Select
              value={form.product_id}
              onChange={(v) => setForm({ ...form, product_id: v })}
              options={productOptions}
              placeholder="Select a product…"
              ariaLabel="Product"
              buttonClassName="w-full !justify-between !py-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lot number" value={form.lot_number} onChange={(v) => setForm({ ...form, lot_number: v })} required />
            <Field label="Variant" value={form.variant} onChange={(v) => setForm({ ...form, variant: v })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Purity (%)" type="number" step="0.001" value={form.purity} onChange={(v) => setForm({ ...form, purity: v })} required />
            <Field label="Labeled amount" value={form.labeled_amount || ''} onChange={(v) => setForm({ ...form, labeled_amount: v })} />
            <Field label="Actual amount" value={form.actual_amount || ''} onChange={(v) => setForm({ ...form, actual_amount: v })} />
          </div>
          <Field label="Tested date" type="date" value={form.tested_date || ''} onChange={(v) => setForm({ ...form, tested_date: v })} />
          <div>
            <label className="block text-[12px] font-medium text-[#1D1D1F] mb-1.5">COA PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-[13px]"
            />
          </div>
          {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition ${
              saving ? 'bg-[#1D1D1F]/30 text-white cursor-not-allowed' : 'bg-[#1D1D1F] text-white btn-apple'
            }`}
          >
            {saving ? 'Saving…' : 'Save COA'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-5">Existing COAs</h2>
        {loading ? (
          <p className="text-[13px] text-[#86868B]">Loading…</p>
        ) : certs.length === 0 ? (
          <p className="text-[13px] text-[#86868B]">None yet.</p>
        ) : (
          <div className="overflow-hidden bg-white border border-black/5 rounded-2xl">
            <table className="w-full text-[13px]">
              <thead className="bg-[#FBFBFD] text-[#86868B] text-[11px] uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Lot</th>
                  <th className="px-4 py-3 text-left">Variant</th>
                  <th className="px-4 py-3 text-right">Purity</th>
                  <th className="px-4 py-3 text-left">Tested</th>
                  <th className="px-4 py-3 text-left">File</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium text-[#1D1D1F]">{c.products?.name || '—'}</td>
                    <td className="px-4 py-3 text-[#86868B]">{c.lot_number}</td>
                    <td className="px-4 py-3 text-[#86868B]">{c.variant}</td>
                    <td className="px-4 py-3 text-right text-[#1D1D1F]">{Number(c.purity).toFixed(3)}%</td>
                    <td className="px-4 py-3 text-[#86868B]">{c.tested_date || '—'}</td>
                    <td className="px-4 py-3 text-[#86868B]">{c.file_name || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(c.id)} className="text-[12px] text-[#FF3B30] hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
