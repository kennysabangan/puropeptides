import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const FINAL_STATES = new Set(['finished', 'failed', 'expired', 'refunded'])

const STATE_COPY = {
  waiting: { title: 'Waiting for payment', body: 'Your invoice is ready. If you closed the NowPayments page before paying, you can return to it from your order.' },
  confirming: { title: 'Confirming on chain', body: 'We see your payment — waiting for network confirmations. This usually takes a few minutes.' },
  confirmed: { title: 'Payment confirmed', body: 'On-chain confirmations received. We\'re finalizing your order.' },
  sending: { title: 'Finalizing', body: 'Almost done — finalizing the transaction.' },
  partially_paid: { title: 'Partial payment', body: 'We received less than the full invoice amount. We\'ll be in touch by email.' },
  finished: { title: 'Order confirmed', body: 'Payment received. Thank you — we\'ll email you when your order ships.' },
  failed: { title: 'Payment failed', body: 'Your payment didn\'t go through. No funds have been taken.' },
  expired: { title: 'Invoice expired', body: 'The invoice expired before payment was received. You can start a new order from your cart.' },
  refunded: { title: 'Refunded', body: 'This order was refunded.' },
}

export default function CheckoutSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order_id')
  const { user, loading: authLoading } = useAuth()

  const [order, setOrder] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const stopRef = useRef(false)

  const setupError = authLoading
    ? null
    : !user
      ? 'Please sign in to view this order.'
      : !orderId
        ? 'Missing order reference.'
        : null
  const error = setupError || fetchError

  useEffect(() => {
    if (authLoading || !user || !orderId) return

    let cancelled = false
    let timer

    const tick = async () => {
      if (cancelled || stopRef.current) return
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData?.session?.access_token
        if (!token) throw new Error('Your session expired — please sign in again.')
        const res = await fetch(`/api/orders/${orderId}/status`, {
          headers: { authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Status check failed (${res.status})`)
        }
        const data = await res.json()
        if (cancelled) return
        setOrder(data)
        if (FINAL_STATES.has(data.payment_status)) {
          stopRef.current = true
          return
        }
      } catch (err) {
        if (!cancelled) setFetchError(err.message)
      }
      timer = setTimeout(tick, 4000)
    }

    tick()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [orderId, user, authLoading])

  const status = order?.payment_status || 'waiting'
  const copy = STATE_COPY[status] || STATE_COPY.waiting
  const isFinal = FINAL_STATES.has(status)
  const isGood = status === 'finished'

  return (
    <div className="max-w-[640px] mx-auto px-6 lg:px-8 py-14 md:py-20 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
        isGood ? 'bg-[#E8F8EE]' : isFinal ? 'bg-[#FFF5F5]' : 'bg-[#F5F5F7]'
      }`}>
        {isGood ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : isFinal ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        )}
      </div>

      <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">
        {copy.title}
      </h1>
      <p className="text-[14px] text-[#86868B] leading-relaxed mb-6 max-w-md mx-auto">{copy.body}</p>

      {order && (
        <div className="bg-[#FBFBFD] rounded-[20px] p-6 text-left mb-8 inline-block min-w-[280px]">
          <Row label="Order" value={order.order_number || orderId} />
          <Row label="Total" value={`$${Number(order.total).toFixed(2)}`} />
          {order.pay_currency && (
            <Row label="Paid in" value={`${Number(order.pay_amount || 0).toFixed(8)} ${order.pay_currency.toUpperCase()}`} />
          )}
          <Row label="Status" value={status.replace('_', ' ')} />
        </div>
      )}

      {error && (
        <div className="mb-6 text-[13px] text-[#FF3B30] bg-[#FFF5F5] border border-[#FFD5D5] rounded-2xl p-4">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {orderId && user && (
          <Link
            to={`/account/orders/${orderId}`}
            className="btn-apple bg-[#1D1D1F] text-white text-[14px] font-medium px-6 py-3 rounded-full"
          >
            View order
          </Link>
        )}
        <Link
          to="/store"
          className="px-6 py-3 rounded-full border border-[#1D1D1F] text-[#1D1D1F] text-[14px] font-medium hover:bg-[#F5F5F7] transition"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-6 py-1.5 text-[13px]">
      <span className="text-[#86868B]">{label}</span>
      <span className="text-[#1D1D1F] font-medium capitalize">{value}</span>
    </div>
  )
}
