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

  if (loading) return <p className="text-[13px] text-[#8B95A5]">Loading…</p>
  if (error) return <p className="text-[13px] text-[#FF3B30]">{error}</p>
  if (!order) return <p className="text-[13px] text-[#8B95A5]">Not found.</p>

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
          <Link to="/account/orders" className="text-[12px] text-[#8B95A5] hover:text-[#1A1F2E]">← All orders</Link>
          <h2 className="text-[20px] font-semibold text-[#1A1F2E] mt-1">{order.order_number}</h2>
          <p className="text-[12px] text-[#8B95A5]">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <button
          onClick={handleReorder}
          className="px-4 py-2 rounded-full bg-[#1A1F2E] text-white text-[12px] font-medium btn-apple"
        >
          Reorder
        </button>
      </div>

      {/* Status */}
      <div className="bg-[#FAFAF7] rounded-2xl p-5">
        {cancelled ? (
          <p className="text-[13px] text-[#FF3B30] font-medium">This order was cancelled.</p>
        ) : (
          <div className="flex items-center gap-2">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIndex
              return (
                <div key={step} className="flex-1 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${done ? 'bg-[#4CAF7D]' : 'bg-black/10'}`} />
                  <span className={`text-[11px] capitalize ${done ? 'text-[#1A1F2E] font-medium' : 'text-[#8B95A5]'}`}>{step}</span>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-px ${i < stepIndex ? 'bg-[#4CAF7D]' : 'bg-black/10'}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}
        {order.tracking_number && (
          <p className="text-[12px] text-[#8B95A5] mt-3">
            Tracking: <span className="text-[#1A1F2E] font-medium">{order.tracking_carrier ? `${order.tracking_carrier} — ` : ''}{order.tracking_number}</span>
          </p>
        )}
      </div>

      {/* Items */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1A1F2E] mb-3">Items</h3>
        <ul className="space-y-2">
          {order.order_items.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-[#FAFAF7] rounded-2xl px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-[#1A1F2E]">{item.products?.name || 'Product'}</p>
                <p className="text-[11px] text-[#8B95A5]">{item.dosage || ''} · qty {item.quantity}</p>
              </div>
              <p className="text-[13px] font-semibold text-[#1A1F2E]">${Number(item.total_price).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Totals */}
      <div className="bg-[#FAFAF7] rounded-2xl p-5 space-y-2 text-[13px]">
        <Row label="Subtotal" value={`$${Number(order.subtotal).toFixed(2)}`} />
        <Row label="Shipping" value={Number(order.shipping) === 0 ? 'Free' : `$${Number(order.shipping).toFixed(2)}`} />
        <div className="border-t border-black/5 pt-2 flex justify-between">
          <span className="font-semibold text-[#1A1F2E]">Total</span>
          <span className="font-bold text-[15px] text-[#1A1F2E]">${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
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
