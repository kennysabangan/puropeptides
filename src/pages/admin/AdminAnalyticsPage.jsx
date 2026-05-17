import { useEffect, useMemo, useState } from 'react'
import { adminAnalytics } from '../../lib/supabase'

function bucketByDay(orders) {
  const map = new Map()
  for (const o of orders) {
    const day = o.created_at.slice(0, 10)
    const entry = map.get(day) || { day, count: 0, revenue: 0 }
    entry.count += 1
    entry.revenue += Number(o.total || 0)
    map.set(day, entry)
  }
  return Array.from(map.values()).sort((a, b) => a.day.localeCompare(b.day))
}

function MiniChart({ data, valueKey, format }) {
  if (data.length === 0) {
    return <p className="text-[12px] text-[#86868B]">No data yet.</p>
  }
  const w = 600
  const h = 160
  const pad = 24
  const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1))
  const ys = data.map((d) => d[valueKey])
  const max = Math.max(...ys, 1)
  const points = ys.map((y, i) => `${xs[i]},${h - pad - (y / max) * (h - pad * 2)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <polyline fill="none" stroke="#1D1D1F" strokeWidth="2" points={points} />
      {ys.map((y, i) => (
        <circle key={i} cx={xs[i]} cy={h - pad - (y / max) * (h - pad * 2)} r="3" fill="#1D1D1F" />
      ))}
      <text x={pad} y={h - 4} fontSize="10" fill="#86868B">{data[0]?.day}</text>
      <text x={w - pad} y={h - 4} fontSize="10" fill="#86868B" textAnchor="end">{data[data.length - 1]?.day}</text>
      <text x={pad} y={12} fontSize="10" fill="#86868B">max {format ? format(max) : max}</text>
    </svg>
  )
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAnalytics().then(setOrders).finally(() => setLoading(false))
  }, [])

  const daily = useMemo(() => bucketByDay(orders), [orders])
  const last30 = daily.slice(-30)
  const totals = useMemo(() => ({
    count: orders.length,
    revenue: orders.reduce((s, o) => s + Number(o.total || 0), 0),
    aov: orders.length ? orders.reduce((s, o) => s + Number(o.total || 0), 0) / orders.length : 0,
  }), [orders])

  if (loading) return <p className="text-[13px] text-[#86868B]">Loading…</p>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total orders" value={totals.count} />
        <Stat label="Total revenue" value={`$${totals.revenue.toFixed(2)}`} />
        <Stat label="AOV" value={`$${totals.aov.toFixed(2)}`} />
      </div>

      <Section title="Orders per day (last 30)">
        <MiniChart data={last30} valueKey="count" />
      </Section>

      <Section title="Revenue per day (last 30)">
        <MiniChart data={last30} valueKey="revenue" format={(v) => `$${v.toFixed(0)}`} />
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-[14px] font-semibold text-[#1D1D1F] mb-3">{title}</h2>
      <div className="bg-[#FBFBFD] rounded-2xl p-5">{children}</div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#FBFBFD] rounded-2xl p-4">
      <p className="text-[11px] text-[#86868B] uppercase tracking-wide">{label}</p>
      <p className="text-[20px] font-bold text-[#1D1D1F] mt-1">{value}</p>
    </div>
  )
}
