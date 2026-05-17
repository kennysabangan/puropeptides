import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adminGetCustomer } from '../../lib/supabase'

export default function AdminCustomerDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetCustomer(id).then(setData).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-[13px] text-[#86868B]">Loading…</p>
  if (!data) return <p className="text-[13px] text-[#86868B]">Not found.</p>

  const { profile, orders } = data
  const spend = orders.reduce((s, o) => s + Number(o.total || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <Link to="/admin/customers" className="text-[12px] text-[#86868B] hover:text-[#1D1D1F]">← All customers</Link>
        <h2 className="text-[20px] font-semibold text-[#1D1D1F] mt-1">{profile.full_name || profile.email}</h2>
        <p className="text-[12px] text-[#86868B]">{profile.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Orders" value={orders.length} />
        <Stat label="Lifetime spend" value={`$${spend.toFixed(2)}`} />
        <Stat label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
      </div>

      <div>
        <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-3">Orders</h3>
        {orders.length === 0 ? (
          <p className="text-[13px] text-[#86868B]">No orders.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between bg-[#FBFBFD] rounded-2xl px-4 py-3 hover:bg-[#F5F5F7] transition"
                >
                  <div>
                    <p className="text-[13px] font-medium text-[#1D1D1F]">{o.order_number}</p>
                    <p className="text-[11px] text-[#86868B]">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-[#1D1D1F]">${Number(o.total).toFixed(2)}</p>
                    <p className="text-[11px] text-[#86868B] capitalize">{o.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#FBFBFD] rounded-2xl p-4">
      <p className="text-[11px] text-[#86868B] uppercase tracking-wide">{label}</p>
      <p className="text-[18px] font-bold text-[#1D1D1F] mt-1">{value}</p>
    </div>
  )
}
