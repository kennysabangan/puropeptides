import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrder, adminUpdateOrder } from '../../lib/supabase'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingCarrier, setTrackingCarrier] = useState('')

  const refetch = () => {
    getOrder(id)
      .then((o) => {
        setOrder(o)
        setTrackingNumber(o.tracking_number || '')
        setTrackingCarrier(o.tracking_carrier || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    getOrder(id)
      .then((o) => {
        setOrder(o)
        setTrackingNumber(o.tracking_number || '')
        setTrackingCarrier(o.tracking_carrier || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const setStatus = async (status) => {
    setSaving(true)
    try {
      await adminUpdateOrder(id, { status })
      refetch()
    } finally {
      setSaving(false)
    }
  }

  const saveTracking = async () => {
    setSaving(true)
    try {
      await adminUpdateOrder(id, {
        tracking_number: trackingNumber || null,
        tracking_carrier: trackingCarrier || null,
      })
      refetch()
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-[13px] text-[#8B95A5]">Loading…</p>
  if (!order) return <p className="text-[13px] text-[#8B95A5]">Not found.</p>

  return (
    <div className="space-y-8">
      <div>
        <Link to="/admin/orders" className="text-[12px] text-[#8B95A5] hover:text-[#1A1F2E]">← All orders</Link>
        <h2 className="text-[20px] font-semibold text-[#1A1F2E] mt-1">{order.order_number}</h2>
        <p className="text-[12px] text-[#8B95A5]">{new Date(order.created_at).toLocaleString()} · {order.email}</p>
      </div>

      <div className="bg-[#FAFAF7] rounded-2xl p-5 space-y-3">
        <p className="text-[13px] font-medium text-[#1A1F2E]">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={saving || s === order.status}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium capitalize transition ${
                s === order.status
                  ? 'bg-[#1A1F2E] text-white'
                  : 'bg-white border border-black/10 text-[#1A1F2E] hover:bg-[#F5F5F7]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#FAFAF7] rounded-2xl p-5 space-y-3">
        <p className="text-[13px] font-medium text-[#1A1F2E]">Tracking</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Carrier (UPS, FedEx…)"
            value={trackingCarrier}
            onChange={(e) => setTrackingCarrier(e.target.value)}
            className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A1F2E] transition"
          />
          <input
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-[13px] outline-none focus:border-[#1A1F2E] transition"
          />
        </div>
        <button
          onClick={saveTracking}
          disabled={saving}
          className="px-4 py-2 rounded-full bg-[#1A1F2E] text-white text-[12px] font-medium btn-apple"
        >
          Save tracking
        </button>
      </div>

      <div>
        <h3 className="text-[14px] font-semibold text-[#1A1F2E] mb-3">Items</h3>
        <ul className="space-y-2">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-[#FAFAF7] rounded-2xl px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-[#1A1F2E]">{item.products?.name || 'Product'}</p>
                <p className="text-[11px] text-[#8B95A5]">{item.dosage || ''} · qty {item.quantity} · ${Number(item.unit_price).toFixed(2)} ea</p>
              </div>
              <p className="text-[13px] font-semibold text-[#1A1F2E]">${Number(item.total_price).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#FAFAF7] rounded-2xl p-5 space-y-2 text-[13px]">
        <Row label="Subtotal" value={`$${Number(order.subtotal).toFixed(2)}`} />
        <Row label="Shipping" value={Number(order.shipping) === 0 ? 'Free' : `$${Number(order.shipping).toFixed(2)}`} />
        <div className="border-t border-black/5 pt-2 flex justify-between">
          <span className="font-semibold text-[#1A1F2E]">Total</span>
          <span className="font-bold text-[15px] text-[#1A1F2E]">${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {order.shipping_address && (
        <div>
          <h3 className="text-[14px] font-semibold text-[#1A1F2E] mb-2">Shipping address</h3>
          <div className="bg-[#FAFAF7] rounded-2xl p-4 text-[13px] text-[#1A1F2E] leading-relaxed">
            {order.shipping_address.full_name && <p className="font-medium">{order.shipping_address.full_name}</p>}
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.city}{order.shipping_address.state ? `, ${order.shipping_address.state}` : ''} {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#8B95A5]">{label}</span>
      <span className="text-[#1A1F2E] font-medium">{value}</span>
    </div>
  )
}
