import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { listMyOrders } from '../../lib/supabase'

export default function AccountOverviewPage() {
  const { user, profile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    listMyOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [user])

  const recent = orders.slice(0, 3)
  const totalSpend = orders.reduce((s, o) => s + Number(o.total || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[20px] font-semibold text-[#1A1F2E] mb-1">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h2>
        <p className="text-[13px] text-[#8B95A5]">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Stat label="Orders" value={loading ? '…' : orders.length} />
        <Stat label="Total spend" value={loading ? '…' : `$${totalSpend.toFixed(2)}`} />
        <Stat label="Status" value={profile?.is_admin ? 'Admin' : 'Researcher'} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-[#1A1F2E]">Recent orders</h3>
          <Link to="/account/orders" className="text-[12px] text-[#8B95A5] hover:text-[#1A1F2E]">View all →</Link>
        </div>
        {loading ? (
          <p className="text-[13px] text-[#8B95A5]">Loading…</p>
        ) : recent.length === 0 ? (
          <div className="bg-[#FAFAF7] rounded-2xl p-6 text-center">
            <p className="text-[13px] text-[#8B95A5] mb-3">No orders yet.</p>
            <Link to="/store" className="inline-block px-5 py-2.5 rounded-full bg-[#1A1F2E] text-white text-[13px] font-medium btn-apple">
              Browse products
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/account/orders/${o.id}`}
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
      <p className="text-[20px] font-bold text-[#1A1F2E] mt-1">{value}</p>
    </div>
  )
}
