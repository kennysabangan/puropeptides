import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const bottleColors = ['#E8D5F5', '#D5E8F5', '#F5E8D5', '#D5F5E8', '#F5D5E8', '#F5F5D5', '#D5F5F5', '#E8E8D5']

function BottleThumb({ name, index, productId }) {
  const color = bottleColors[index % bottleColors.length]
  const imgSrc = `/images/products/${productId}/${productId}-vial.png`
  return (
    <div className="w-16 h-16 rounded-[14px] flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: color }}>
      <img src={imgSrc} alt={name} className="w-12 h-12 object-contain" loading="lazy" />
    </div>
  )
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  const subtotal = getCartTotal()
  const shipping = subtotal >= 150 ? 0 : 9.99
  const total = subtotal + shipping

  return (
    <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-14 md:py-20">
      <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-2">Your Cart</h1>
      <p className="text-[#86868B] text-[14px] mb-10">{items.length === 0 ? 'Your cart is empty' : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}`}</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Link to="/store" className="btn-apple inline-flex items-center gap-2 bg-[#1D1D1F] text-white text-[14px] font-medium px-7 py-3 rounded-full">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-10">
            {items.map((item, i) => {
              let unitPrice = item.product.price
              if (item.bundleType === 2) unitPrice *= 0.95
              if (item.bundleType >= 3) unitPrice *= 0.925

              return (
                <div key={`${item.product.id}-${item.dosage}-${item.bundleType}`} className="flex items-center gap-4 bg-[#FBFBFD] rounded-[16px] p-4">
                  <BottleThumb name={item.product.name} index={i} productId={item.product.id} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-[#1D1D1F]">{item.product.name}</h3>
                    <p className="text-[12px] text-[#86868B]">{item.dosage} · {item.bundleType === 1 ? '1 Bottle' : item.bundleType === 2 ? '2 Bottles' : '3+ Bottles'}</p>
                  </div>
                  <div className="flex items-center border border-[#E8E8ED] rounded-full">
                    <button
                      onClick={() => updateQuantity(i, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-l-full transition text-[13px]"
                    >−</button>
                    <span className="w-8 text-center text-[13px] font-medium text-[#1D1D1F]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(i, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-r-full transition text-[13px]"
                    >+</button>
                  </div>
                  <p className="font-semibold text-[14px] text-[#1D1D1F] w-20 text-right">${(unitPrice * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(i)} className="text-[#86868B] hover:text-[#FF3B30] transition p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-[#FBFBFD] rounded-[20px] p-7 mb-8">
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#86868B]">Subtotal</span>
                <span className="text-[#1D1D1F] font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-[#86868B]">Shipping</span>
                <span className="text-[#1D1D1F] font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[12px] text-[#86868B]">Free shipping on orders over $150</p>
              )}
              <div className="border-t border-[#E8E8ED] pt-3 flex justify-between">
                <span className="font-semibold text-[15px] text-[#1D1D1F]">Total</span>
                <span className="font-bold text-[18px] text-[#1D1D1F]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/store" className="flex-1 text-center px-6 py-3.5 rounded-full border border-[#1D1D1F] text-[#1D1D1F] text-[14px] font-medium hover:bg-[#F5F5F7] transition">
              Continue Shopping
            </Link>
            <Link to="/checkout" className="flex-1 btn-apple bg-[#1D1D1F] text-white text-[14px] font-medium py-3.5 rounded-full text-center">
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
