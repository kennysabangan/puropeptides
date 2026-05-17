import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { listMyOrders } from '../../lib/supabase'

const STATUS_STYLES = {
  pending:   'bg-[#FFF3E0] text-[#FF9500]',
  confirmed: 'bg-[#E0F2FE] text-[#0EA5E9]',
  shipped:   'bg-[#E0F7FA] text-[#06B6D4]',
  delivered: 'bg-[#DCFCE7] text-[#16A34A]',
  cancelled: 'bg-[#FEE2E2] text-[#EF4444]',
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    listMyOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-5">Orders</h2>

      {loading ? (
        <p className="text-[13px] text-[#86868B]">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="bg-[#FBFBFD] rounded-2xl p-8 text-center">
          <p className="text-[13px] text-[#86868B] mb-4">You haven't placed any orders yet.</p>
          <Link to="/store" className="inline-block px-5 py-2.5 rounded-full bg-[#1D1D1F] text-white text-[13px] font-medium btn-apple">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-black/5 rounded-2xl">
          <table className="w-full text-[13px]">
            <thead className="bg-[#FBFBFD] text-[#86868B] text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium text-[#1D1D1F]">{o.order_number}</td>
                  <td className="px-4 py-3 text-[#86868B]">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${STATUS_STYLES[o.status] || 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#1D1D1F]">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/account/orders/${o.id}`} className="text-[12px] text-[#1D1D1F] font-medium hover:underline">View</Link>
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
