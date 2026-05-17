import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminListOrders } from '../../lib/supabase'

const STATUSES = ['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  pending:   'bg-[#FFF3E0] text-[#FF9500]',
  confirmed: 'bg-[#E0F2FE] text-[#0EA5E9]',
  shipped:   'bg-[#E0F7FA] text-[#06B6D4]',
  delivered: 'bg-[#DCFCE7] text-[#16A34A]',
  cancelled: 'bg-[#FEE2E2] text-[#EF4444]',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    adminListOrders({ status: status || undefined, search: search || undefined })
      .then((data) => { if (!cancelled) { setOrders(data); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [status, search])

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-5">Orders</h2>

      <div className="flex gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order # or email"
          className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] outline-none focus:border-[#1D1D1F] transition"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] outline-none focus:border-[#1D1D1F] transition"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || 'All statuses'}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-[13px] text-[#86868B]">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-[13px] text-[#86868B]">No orders.</p>
      ) : (
        <div className="overflow-hidden bg-white border border-black/5 rounded-2xl">
          <table className="w-full text-[13px]">
            <thead className="bg-[#FBFBFD] text-[#86868B] text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const itemCount = (o.order_items || []).reduce((s, i) => s + (i.quantity || 0), 0)
                return (
                  <tr key={o.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium text-[#1D1D1F]">{o.order_number}</td>
                    <td className="px-4 py-3 text-[#86868B]">{o.email}</td>
                    <td className="px-4 py-3 text-[#86868B]">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${STATUS_STYLES[o.status] || 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#86868B]">{itemCount}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#1D1D1F]">${Number(o.total).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/orders/${o.id}`} className="text-[12px] text-[#1D1D1F] font-medium hover:underline">View</Link>
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
