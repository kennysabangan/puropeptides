import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { listAddresses, createAddress, updateAddress, deleteAddress } from '../../lib/supabase'

const EMPTY = {
  full_name: '', line1: '', line2: '', city: '', state: '',
  postal_code: '', country: 'US', phone: '', is_default: false,
}

export default function AddressesPage() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const refresh = () => {
    if (!user) return Promise.resolve()
    return listAddresses(user.id).then((list) => {
      setAddresses(list)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!user) return
    listAddresses(user.id)
      .then((list) => { setAddresses(list); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const startNew = () => {
    setEditing('new')
    setForm({ ...EMPTY, full_name: '' })
  }
  const startEdit = (a) => {
    setEditing(a.id)
    setForm({ ...a })
  }
  const cancel = () => {
    setEditing(null)
    setForm(EMPTY)
    setError(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      if (editing === 'new') {
        await createAddress(user.id, form)
      } else {
        await updateAddress(user.id, editing, form)
      }
      await refresh()
      cancel()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return
    await deleteAddress(user.id, id)
    await refresh()
  }

  if (loading) return <p className="text-[13px] text-[#8B95A5]">Loading…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-semibold text-[#1A1F2E]">Addresses</h2>
        {!editing && (
          <button onClick={startNew} className="px-4 py-2 rounded-full bg-[#1A1F2E] text-white text-[12px] font-medium btn-apple">
            + Add
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-3 bg-[#FAFAF7] rounded-2xl p-5">
          <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
          <Field label="Address line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} required />
          <Field label="Address line 2" value={form.line2 || ''} onChange={(v) => setForm({ ...form, line2: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <Field label="State" value={form.state || ''} onChange={(v) => setForm({ ...form, state: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Postal code" value={form.postal_code} onChange={(v) => setForm({ ...form, postal_code: v })} required />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
          </div>
          <Field label="Phone" value={form.phone || ''} onChange={(v) => setForm({ ...form, phone: v })} />
          <label className="flex items-center gap-2 text-[13px] text-[#1A1F2E]">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="w-4 h-4 accent-[#1A1F2E]"
            />
            Set as default
          </label>

          {error && <p className="text-[12px] text-[#FF3B30]">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition ${
                saving ? 'bg-[#1A1F2E]/30 text-white' : 'bg-[#1A1F2E] text-white btn-apple'
              }`}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={cancel} className="px-5 py-2.5 rounded-full border border-black/10 text-[13px] font-medium text-[#1A1F2E] hover:bg-[#F5F5F7] transition">
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="bg-[#FAFAF7] rounded-2xl p-8 text-center">
          <p className="text-[13px] text-[#8B95A5]">No addresses on file.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {addresses.map((a) => (
            <li key={a.id} className="bg-[#FAFAF7] rounded-2xl p-4 flex items-start justify-between gap-4">
              <div className="text-[13px] text-[#1A1F2E] leading-relaxed">
                <p className="font-medium flex items-center gap-2">
                  {a.full_name}
                  {a.is_default && <span className="text-[10px] uppercase bg-[#1A1F2E] text-white px-2 py-0.5 rounded-full">Default</span>}
                </p>
                <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                <p>{a.city}{a.state ? `, ${a.state}` : ''} {a.postal_code}, {a.country}</p>
                {a.phone && <p className="text-[#8B95A5]">{a.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(a)} className="text-[12px] text-[#1A1F2E] hover:underline">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="text-[12px] text-[#FF3B30] hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
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
