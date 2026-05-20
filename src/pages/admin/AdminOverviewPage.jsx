import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  adminListOrders,
  adminListProducts,
  adminListCustomers,
  adminListSubscribers,
} from '../../lib/supabase'

export default function AdminOverviewPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      adminListOrders(),
      adminListProducts(),
      adminListCustomers(),
      adminListSubscribers(),
    ]).then(([orders, products, customers, subs]) => {
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const todayOrders = orders.filter((o) => new Date(o.created_at) >= today)
      const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0)
      const todayRev = todayOrders.reduce((s, o) => s + Number(o.total || 0), 0)
      const oos = products.filter((p) => !p.in_stock).length
      setData({
        orders, products, customers, subs,
        todayOrderCount: todayOrders.length,
        todayRevenue: todayRev,
        totalRevenue: revenue,
        oosCount: oos,
        recentOrders: orders.slice(0, 5),
      })
    })
  }, [])

  if (!data) return <p className="text-[13px] text-[#86868B]">Loading…</p>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Orders today" value={data.todayOrderCount} />
        <Stat label="Revenue today" value={`$${data.todayRevenue.toFixed(2)}`} />
        <Stat label="Total revenue" value={`$${data.totalRevenue.toFixed(2)}`} />
        <Stat label="Customers" value={data.customers.length} />
        <Stat label="Products" value={data.products.length} />
        <Stat label="Out of stock" value={data.oosCount} accent={data.oosCount > 0 ? 'warn' : undefined} />
        <Stat label="Subscribers" value={data.subs.length} />
        <Stat label="Total orders" value={data.orders.length} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F]">Recent orders</h2>
          <Link to="/admin/orders" className="text-[12px] text-[#86868B] hover:text-[#1D1D1F]">View all →</Link>
        </div>
        <ul className="space-y-2">
          {data.recentOrders.map((o) => (
            <li key={o.id}>
              <Link
                to={`/admin/orders/${o.id}`}
                className="flex items-center justify-between bg-[#FBFBFD] rounded-2xl px-4 py-3 hover:bg-[#F5F5F7] transition"
              >
                <div>
                  <p className="text-[13px] font-medium text-[#1D1D1F]">{o.order_number}</p>
                  <p className="text-[11px] text-[#86868B]">{o.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-[#1D1D1F]">${Number(o.total).toFixed(2)}</p>
                  <p className="text-[11px] text-[#86868B] capitalize">{o.status}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="bg-[#FBFBFD] rounded-2xl p-4">
      <p className="text-[11px] text-[#86868B] uppercase tracking-wide">{label}</p>
      <p className={`text-[20px] font-bold mt-1 ${accent === 'warn' ? 'text-[#FF9500]' : 'text-[#1D1D1F]'}`}>{value}</p>
    </div>
  )
}
