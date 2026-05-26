import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminListCustomers, adminListOrders } from '../../lib/supabase'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([adminListCustomers(), adminListOrders()])
      .then(([c, o]) => { setCustomers(c); setOrders(o) })
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const map = {}
    for (const o of orders) {
      if (!o.user_id) continue
      const s = map[o.user_id] || { count: 0, spend: 0 }
      s.count += 1
      s.spend += Number(o.total || 0)
      map[o.user_id] = s
    }
    return map
  }, [orders])

  const filtered = customers.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (c.email || '').toLowerCase().includes(q) || (c.full_name || '').toLowerCase().includes(q)
  })

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#1A1F2E] mb-5">Customers</h2>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or email"
        className="w-full mb-4 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] outline-none focus:border-[#1A1F2E] transition"
      />

      {loading ? (
        <p className="text-[13px] text-[#8B95A5]">Loading…</p>
      ) : (
        <div className="overflow-hidden bg-white border border-black/5 rounded-2xl">
          <table className="w-full text-[13px]">
            <thead className="bg-[#FAFAF7] text-[#8B95A5] text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Spend</th>
                <th className="px-4 py-3 text-center">Admin</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const s = stats[c.id] || { count: 0, spend: 0 }
                return (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium text-[#1A1F2E]">{c.full_name || '—'}</td>
                    <td className="px-4 py-3 text-[#8B95A5]">{c.email}</td>
                    <td className="px-4 py-3 text-[#8B95A5]">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">{s.count}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#1A1F2E]">${s.spend.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">{c.is_admin ? '✓' : ''}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/customers/${c.id}`} className="text-[12px] text-[#1A1F2E] font-medium hover:underline">View</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
