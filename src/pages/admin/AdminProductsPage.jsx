import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminListProducts, adminUpsertProduct, adminDeleteProduct } from '../../lib/supabase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    adminListProducts()
      .then((d) => { setProducts(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggleField = async (p, field) => {
    setBusyId(p.id)
    try {
      await adminUpsertProduct({ ...p, [field]: !p[field] })
      load()
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return
    await adminDeleteProduct(p.id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-semibold text-[#1A1F2E]">Products</h2>
        <Link to="/admin/products/new" className="px-4 py-2 rounded-full bg-[#1A1F2E] text-white text-[12px] font-medium btn-apple">
          + New product
        </Link>
      </div>

      {loading ? (
        <p className="text-[13px] text-[#8B95A5]">Loading…</p>
      ) : (
        <div className="overflow-hidden bg-white border border-black/5 rounded-2xl">
          <table className="w-full text-[13px]">
            <thead className="bg-[#FAFAF7] text-[#8B95A5] text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">In stock</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium text-[#1A1F2E]">{p.name}</td>
                  <td className="px-4 py-3 text-[#8B95A5]">{p.slug}</td>
                  <td className="px-4 py-3 text-right text-[#1A1F2E]">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <Toggle on={p.in_stock} disabled={busyId === p.id} onClick={() => toggleField(p, 'in_stock')} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Toggle on={p.is_featured} disabled={busyId === p.id} onClick={() => toggleField(p, 'is_featured')} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-[12px] text-[#1A1F2E] font-medium hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(p)} className="text-[12px] text-[#FF3B30] hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Toggle({ on, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 rounded-full transition ${on ? 'bg-[#4CAF7D]' : 'bg-black/15'} ${disabled ? 'opacity-50' : ''}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition ${on ? 'translate-x-4' : ''}`} />
    </button>
  )
}
