import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCheckout } from '@zkp2p/pay-sdk'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { listAddresses, createAddress } from '../lib/supabase'
import { getPrimaryImage } from '../lib/productImage'

const PEER_OPTS = {
  apiBaseUrl: import.meta.env.VITE_PEER_API_BASE_URL,
  checkoutBaseUrl: import.meta.env.VITE_PEER_CHECKOUT_BASE_URL,
  apiKey: import.meta.env.VITE_PEER_API_KEY,
}

const EMPTY_ADDRESS = {
  full_name: '', line1: '', line2: '', city: '', state: '',
  postal_code: '', country: 'US', phone: '', is_default: false,
}

function bottleColors(i) {
  const palette = ['#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8', '#F5D5E8', '#F5F5D5', '#D5F5F5', '#E8E8D5']
  return palette[i % palette.length]
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const { items, getCartTotal } = useCart()
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const shipping = subtotal >= 150 ? 0 : 9.99
  const total = subtotal + shipping

  const [addresses, setAddresses] = useState([])
  const [addrLoading, setAddrLoading] = useState(true)
  const [selectedId, setSelectedId] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_ADDRESS })
  const [savingAddr, setSavingAddr] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authLoading || !user) return
    if (items.length === 0) {
      navigate('/cart', { replace: true })
      return
    }
    listAddresses(user.id)
      .then((list) => {
        setAddresses(list)
        const def = list.find((a) => a.is_default) || list[0]
        if (def) {
          setSelectedId(def.id)
          setShowNew(false)
        } else {
          setShowNew(true)
          setForm({ ...EMPTY_ADDRESS, full_name: user.user_metadata?.full_name || '' })
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setAddrLoading(false))
  }, [user, authLoading, items.length, navigate])

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedId),
    [addresses, selectedId],
  )

  const handlePay = async () => {
    setError(null)
    setPaying(true)
    try {
      let address = selectedAddress
      if (showNew) {
        if (!form.full_name || !form.line1 || !form.city || !form.postal_code) {
          throw new Error('Please fill in all required address fields.')
        }
        setSavingAddr(true)
        try {
          address = await createAddress(user.id, form)
        } finally {
          setSavingAddr(false)
        }
      }
      if (!address) throw new Error('Pick or add a shipping address.')

      const orderId = crypto.randomUUID()
      const result = await createCheckout(
        {
          requestedUsdcAmount: total.toFixed(2),
          destinationChainId: Number(import.meta.env.VITE_PEER_DESTINATION_CHAIN_ID) || 8453,
          destinationToken: 'USDC',
          destinationAddress: import.meta.env.VITE_PEER_DESTINATION_ADDRESS,
          successUrl: window.location.origin + '/checkout/success?order_id=' + orderId,
          cancelUrl: window.location.origin + '/checkout',
          notes: {
            merchantOrderId: orderId,
            customerId: user?.id || '',
          },
        },
        PEER_OPTS,
      )
      window.location.href = result.checkoutUrl
    } catch (err) {
      setError(err.message || 'Failed to create checkout')
      setPaying(false)
    }
  }

  if (authLoading || addrLoading) {
    return <p className="max-w-[800px] mx-auto px-6 py-20 text-[13px] text-[#8B95A5]">Loading…</p>
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-14 md:py-20">
      <Link to="/cart" className="text-[12px] text-[#8B95A5] hover:text-[#1A1F2E]">← Back to cart</Link>
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1A1F2E] tracking-[-0.03em] mt-2 mb-2">Checkout</h1>
      <p className="text-[#8B95A5] text-[14px] mb-10">Pay with Venmo, CashApp, or PayPal — settle in USDC on Base.</p>

      {/* Items */}
      <section className="mb-10">
        <h2 className="text-[14px] font-semibold text-[#1A1F2E] mb-3">Items</h2>
        <ul className="space-y-3">
          {items.map((item, i) => {
            let unit = item.product.price
            if (item.bundleType === 2) unit *= 0.95
            if (typeof item.bundleType === 'number' && item.bundleType >= 3) unit *= 0.925
            return (
              <li key={`${item.product.id}-${item.dosage}-${item.bundleType}`} className="flex items-center gap-4 bg-[#FAFAF7] rounded-[16px] p-4">
                <div
                  className="w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: bottleColors(i) }}
                >
                  <img
                    src={getPrimaryImage(item.product)}
                    alt={item.product.name}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#1A1F2E]">{item.product.name}</p>
                  <p className="text-[12px] text-[#8B95A5]">{item.dosage} · qty {item.quantity}</p>
                </div>
                <p className="text-[14px] font-semibold text-[#1A1F2E]">${(unit * item.quantity).toFixed(2)}</p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Shipping address */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-semibold text-[#1A1F2E]">Shipping address</h2>
          {addresses.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setShowNew((v) => !v)
                if (!showNew) {
                  setForm({ ...EMPTY_ADDRESS, full_name: user.user_metadata?.full_name || '' })
                }
              }}
              className="text-[12px] text-[#1A1F2E] hover:underline"
            >
              {showNew ? 'Use saved address' : '+ Add new'}
            </button>
          )}
        </div>

        {!showNew && (
          <ul className="space-y-2">
            {addresses.map((a) => (
              <li key={a.id}>
                <label className={`flex gap-3 items-start cursor-pointer rounded-2xl p-4 border transition ${
                  selectedId === a.id ? 'border-[#1A1F2E] bg-white' : 'border-transparent bg-[#FAFAF7] hover:bg-[#F5F5F7]'
                }`}>
                  <input
                    type="radio"
                    name="addr"
                    checked={selectedId === a.id}
                    onChange={() => setSelectedId(a.id)}
                    className="mt-1 accent-[#1A1F2E]"
                  />
                  <div className="text-[13px] text-[#1A1F2E] leading-relaxed">
                    <p className="font-medium flex items-center gap-2">
                      {a.full_name}
                      {a.is_default && <span className="text-[10px] uppercase bg-[#1A1F2E] text-white px-2 py-0.5 rounded-full">Default</span>}
                    </p>
                    <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                    <p>{a.city}{a.state ? `, ${a.state}` : ''} {a.postal_code}, {a.country}</p>
                    {a.phone && <p className="text-[#8B95A5]">{a.phone}</p>}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}

        {showNew && (
          <div className="bg-[#FAFAF7] rounded-2xl p-5 space-y-3">
            <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
            <Field label="Address line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} required />
            <Field label="Address line 2" value={form.line2 || ''} onChange={(v) => setForm({ ...form, line2: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
              <Field label="State" value={form.state || ''} onChange={(v) => setForm({ ...form, state: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Postal code" value={form.postal_code} onChange={(v) => setForm({ ...form, postal_code: v })} required />
              <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
            </div>
            <Field label="Phone" value={form.phone || ''} onChange={(v) => setForm({ ...form, phone: v })} />
            <label className="flex items-center gap-2 text-[13px] text-[#1A1F2E]">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                className="w-4 h-4 accent-[#1A1F2E]"
              />
              Save as default
            </label>
          </div>
        )}
      </section>

      {/* Totals */}
      <section className="bg-[#FAFAF7] rounded-[20px] p-7 mb-8 space-y-3">
        <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
        <div className="border-t border-[#E8E8ED] pt-3 flex justify-between">
          <span className="font-semibold text-[15px] text-[#1A1F2E]">Total</span>
          <span className="font-bold text-[18px] text-[#1A1F2E]">${total.toFixed(2)}</span>
        </div>
      </section>

      {error && (
        <div className="mb-5 text-[13px] text-[#FF3B30] bg-[#FFF5F5] border border-[#FFD5D5] rounded-2xl p-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={paying || savingAddr}
        className={`w-full btn-apple text-white text-[14px] font-medium py-4 rounded-full transition ${
          paying || savingAddr ? 'bg-[#1A1F2E]/40' : 'bg-[#1A1F2E]'
        }`}
      >
        {paying ? 'Creating invoice…' : `Pay $${total.toFixed(2)} with crypto`}
      </button>
      <p className="mt-3 text-[11px] text-[#8B95A5] text-center">
        You'll be redirected to Peer Pay to complete payment. Pay with Venmo, CashApp, or PayPal.
      </p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', ...rest }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#1A1F2E] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-[#1A1F2E] outline-none focus:border-[#1A1F2E] transition"
        {...rest}
      />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-[14px]">
      <span className="text-[#8B95A5]">{label}</span>
      <span className="text-[#1A1F2E] font-medium">{value}</span>
    </div>
  )
}
