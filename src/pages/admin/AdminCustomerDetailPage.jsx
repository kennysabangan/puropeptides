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

  if (loading) return <p className="text-[13px] text-[#8B95A5]">Loading…</p>
  if (!data) return <p className="text-[13px] text-[#8B95A5]">Not found.</p>

  const { profile, orders } = data
  const spend = orders.reduce((s, o) => s + Number(o.total || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <Link to="/admin/customers" className="text-[12px] text-[#8B95A5] hover:text-[#1A1F2E]">← All customers</Link>
        <h2 className="text-[20px] font-semibold text-[#1A1F2E] mt-1">{profile.full_name || profile.email}</h2>
        <p className="text-[12px] text-[#8B95A5]">{profile.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Orders" value={orders.length} />
        <Stat label="Lifetime spend" value={`$${spend.toFixed(2)}`} />
        <Stat label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
      </div>

      <div>
        <h3 className="text-[14px] font-semibold text-[#1A1F2E] mb-3">Orders</h3>
        {orders.length === 0 ? (
          <p className="text-[13px] text-[#8B95A5]">No orders.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between bg-[#FAFAF7] rounded-2xl px-4 py-3 hover:bg-[#F5F5F7] transition"
                >
                  <div>
                    <p className="text-[13px] font-medium text-[#1A1F2E]">{o.order_number}</p>
                    <p className="text-[11px] text-[#8B95A5]">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-[#1A1F2E]">${Number(o.total).toFixed(2)}</p>
                    <p className="text-[11px] text-[#8B95A5] capitalize">{o.status}</p>
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
    <div className="bg-[#FAFAF7] rounded-2xl p-4">
      <p className="text-[11px] text-[#8B95A5] uppercase tracking-wide">{label}</p>
      <p className="text-[18px] font-bold text-[#1A1F2E] mt-1">{value}</p>
    </div>
  )
}
