import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { openPoofCheckout } from '../lib/poof'

const bottleColors = ['#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8', '#F5D5E8', '#F5F5D5', '#D5F5F5', '#E8E8D5']

function BottleThumb({ name, index, productId }) {
  const color = bottleColors[index % bottleColors.length]
  const imgSrc = `/images/products/${productId}/${productId}-vial.png`
  return (
    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: color }}>
      <img src={imgSrc} alt={name} className="w-8 h-8 object-contain" loading="lazy" />
    </div>
  )
}

export default function CheckoutPage() {
  const { items, clearCart, getCartTotal } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  })

  const subtotal = getCartTotal()
  const shipping = subtotal >= 150 ? 0 : 9.99
  const total = subtotal + shipping

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  function validate() {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required'
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Name is required'
    if (!form.address1.trim()) return 'Address is required'
    if (!form.city.trim() || !form.state.trim() || !form.zip.trim()) return 'City, state, and zip are required'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      // 1. Create order in Supabase
      const orderNumber = 'AS-' + Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          email: form.email,
          status: 'pending',
          subtotal,
          shipping,
          total,
          shipping_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            address1: form.address1,
            address2: form.address2,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create order items
      const orderItems = items.map((item) => {
        let unitPrice = item.product.price
        if (item.bundleType === 2) unitPrice *= 0.95
        if (item.bundleType >= 3) unitPrice *= 0.925

        return {
          order_id: order.id,
          product_id: item.product.id,
          dosage: item.dosage,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantity,
        }
      })

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      // 3. Trigger Poof checkout
      await openPoofCheckout({
        orderId: orderNumber,
        amount: total,
        email: form.email,
        items: orderItems,
      })

      // 4. Clear cart and redirect to confirmation
      clearCart()
      navigate('/order-confirmation', { state: { orderNumber, email: form.email, total } })
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-20 text-center">
        <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-4">Your cart is empty</h1>
        <Link to="/store" className="inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[14px] font-medium px-7 py-3 rounded-full mt-4">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-8 py-14 md:py-20">
      <Link to="/cart" className="inline-flex items-center gap-2 text-[14px] text-[#86868B] hover:text-[#1D1D1F] transition mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to cart
      </Link>

      <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="flex-1 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 text-[14px] text-red-600">{error}</div>
          )}

          {/* Contact */}
          <div>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] mb-4">Contact</h2>
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={update('email')}
              className="w-full border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
              required
            />
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F] mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={update('firstName')}
                className="border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={update('lastName')}
                className="border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
                required
              />
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Address line 1"
                value={form.address1}
                onChange={update('address1')}
                className="w-full border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
                required
              />
              <input
                type="text"
                placeholder="Address line 2 (optional)"
                value={form.address2}
                onChange={update('address2')}
                className="w-full border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={update('city')}
                  className="border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={form.state}
                  onChange={update('state')}
                  className="border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
                  required
                />
                <input
                  type="text"
                  placeholder="ZIP"
                  value={form.zip}
                  onChange={update('zip')}
                  className="border border-[#E8E8ED] rounded-[12px] px-4 py-3 text-[14px] text-[#1D1D1F] bg-white focus:outline-none focus:border-[#1D1D1F] transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit (mobile) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-apple bg-[#1D1D1F] text-white text-[14px] font-medium py-4 rounded-full lg:hidden disabled:opacity-50 transition"
          >
            {loading ? 'Processing...' : `Complete Order — $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <div className="bg-[#FBFBFD] rounded-[20px] p-6 sticky top-24">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] mb-5">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item, i) => {
                let unitPrice = item.product.price
                if (item.bundleType === 2) unitPrice *= 0.95
                if (item.bundleType >= 3) unitPrice *= 0.925

                return (
                  <div key={`${item.product.id}-${item.dosage}-${item.bundleType}`} className="flex items-center gap-3">
                    <BottleThumb name={item.product.name} index={i} productId={item.product.id} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#1D1D1F] truncate">{item.product.name}</p>
                      <p className="text-[12px] text-[#86868B]">{item.dosage} × {item.quantity}</p>
                    </div>
                    <p className="text-[13px] font-medium text-[#1D1D1F]">${(unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-[#E8E8ED] pt-4 space-y-2 mb-5">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868B]">Subtotal</span>
                <span className="text-[#1D1D1F]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#86868B]">Shipping</span>
                <span className="text-[#1D1D1F]">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-[#E8E8ED] pt-2 flex justify-between">
                <span className="font-semibold text-[14px] text-[#1D1D1F]">Total</span>
                <span className="font-bold text-[16px] text-[#1D1D1F]">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full btn-apple bg-[#1D1D1F] text-white text-[14px] font-medium py-3.5 rounded-full hidden lg:block disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
