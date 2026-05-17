import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrder } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const { id } = useParams()
  const { addToCart, openCart } = useCart()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-[13px] text-[#86868B]">Loading…</p>
  if (error) return <p className="text-[13px] text-[#FF3B30]">{error}</p>
  if (!order) return <p className="text-[13px] text-[#86868B]">Not found.</p>

  const handleReorder = () => {
    order.order_items.forEach((item) => {
      if (!item.products) return
      addToCart(item.products, item.quantity, item.dosage || '10MG', 'single')
    })
    openCart()
  }

  const stepIndex = STATUS_STEPS.indexOf(order.status)
  const cancelled = order.status === 'cancelled'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/account/orders" className="text-[12px] text-[#86868B] hover:text-[#1D1D1F]">← All orders</Link>
          <h2 className="text-[20px] font-semibold text-[#1D1D1F] mt-1">{order.order_number}</h2>
          <p className="text-[12px] text-[#86868B]">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <button
          onClick={handleReorder}
          className="px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-[12px] font-medium btn-apple"
        >
          Reorder
        </button>
      </div>

      {/* Status */}
      <div className="bg-[#FBFBFD] rounded-2xl p-5">
        {cancelled ? (
          <p className="text-[13px] text-[#FF3B30] font-medium">This order was cancelled.</p>
        ) : (
          <div className="flex items-center gap-2">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex
              return (
                <div key={step} className="flex-1 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${done ? 'bg-[#34C759]' : 'bg-black/10'}`} />
                  <span className={`text-[11px] capitalize ${done ? 'text-[#1D1D1F] font-medium' : 'text-[#86868B]'}`}>{step}</span>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-px ${i < stepIndex ? 'bg-[#34C759]' : 'bg-black/10'}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}
        {order.tracking_number && (
          <p className="text-[12px] text-[#86868B] mt-3">
            Tracking: <span className="text-[#1D1D1F] font-medium">{order.tracking_carrier ? `${order.tracking_carrier} — ` : ''}{order.tracking_number}</span>
          </p>
        )}
      </div>

      {/* Items */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-3">Items</h3>
        <ul className="space-y-2">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-[#FBFBFD] rounded-2xl px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1F]">{item.products?.name || 'Product'}</p>
                <p className="text-[11px] text-[#86868B]">{item.dosage || ''} · qty {item.quantity}</p>
              </div>
              <p className="text-[13px] font-semibold text-[#1D1D1F]">${Number(item.total_price).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Totals */}
      <div className="bg-[#FBFBFD] rounded-2xl p-5 space-y-2 text-[13px]">
        <Row label="Subtotal" value={`$${Number(order.subtotal).toFixed(2)}`} />
        <Row label="Shipping" value={Number(order.shipping) === 0 ? 'Free' : `$${Number(order.shipping).toFixed(2)}`} />
        <div className="border-t border-black/5 pt-2 flex justify-between">
          <span className="font-semibold text-[#1D1D1F]">Total</span>
          <span className="font-bold text-[15px] text-[#1D1D1F]">${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
      {order.shipping_address && (
        <div>
          <h3 className="text-[14px] font-semibold text-[#1D1D1F] mb-2">Shipping address</h3>
          <div className="bg-[#FBFBFD] rounded-2xl p-4 text-[13px] text-[#1D1D1F] leading-relaxed">
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
      <span className="text-[#86868B]">{label}</span>
      <span className="text-[#1D1D1F] font-medium">{value}</span>
    </div>
  )
}
