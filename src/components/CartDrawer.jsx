import { useEffect } from 'react'
import { useCart } from '../context/CartContext'

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

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCart()

  // Close on ESC
  useEffect(() => {
    if (!isCartOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isCartOpen, closeCart])

  // Lock body scroll while open
  useEffect(() => {
    if (!isCartOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [isCartOpen])

  const subtotal = getCartTotal()
  const shipping = subtotal >= 150 ? 0 : 9.99
  const total = subtotal + shipping
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-[91] h-full w-full sm:w-[440px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b border-black/[0.07] flex-shrink-0">
          <div>
            <h2 className="text-[18px] font-bold text-[#1D1D1F] tracking-tight">Your Cart</h2>
            <p className="text-[12px] text-[#86868B] mt-0.5">
              {itemCount === 0 ? 'Empty' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-black/[0.04] flex items-center justify-center mb-5 text-[#1D1D1F]/50">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">Your cart is empty</p>
            <p className="text-[13px] text-[#86868B] mb-6">Add some research peptides to get started.</p>
            <button
              onClick={closeCart}
              className="bg-[#1D1D1F] text-white rounded-full px-6 py-2.5 text-[13px] font-medium hover:opacity-90 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {items.map((item, i) => {
                let unitPrice = item.product.price
                if (item.bundleType === 2) unitPrice *= 0.95
                if (item.bundleType >= 3) unitPrice *= 0.925

                return (
                  <div
                    key={`${item.product.id}-${item.dosage}-${item.bundleType}`}
                    className="flex items-start gap-3"
                  >
                    <BottleThumb name={item.product.name} index={i} productId={item.product.id} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[14px] text-[#1D1D1F] leading-tight truncate">{item.product.name}</h3>
                        <button
                          onClick={() => removeFromCart(i)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-[#86868B] hover:text-[#FF3B30] transition p-0.5 flex-shrink-0"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[12px] text-[#86868B] mb-2">
                        {item.dosage} · {item.bundleType === 1 ? '1 Bottle' : item.bundleType === 2 ? '2 Bottles' : '3+ Bottles'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[#E8E8ED] rounded-full">
                          <button
                            onClick={() => updateQuantity(i, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-l-full transition text-[12px]"
                            aria-label="Decrease quantity"
                          >−</button>
                          <span className="w-7 text-center text-[12px] font-medium text-[#1D1D1F]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(i, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-r-full transition text-[12px]"
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                        <p className="font-semibold text-[14px] text-[#1D1D1F]">${(unitPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <footer className="border-t border-black/[0.07] px-6 py-5 flex-shrink-0 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#86868B]">Subtotal</span>
                  <span className="text-[#1D1D1F] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#86868B]">Shipping</span>
                  <span className="text-[#1D1D1F] font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-[#86868B]">Free shipping on orders over $150</p>
                )}
                <div className="border-t border-[#E8E8ED] pt-2 flex justify-between items-center">
                  <span className="font-semibold text-[14px] text-[#1D1D1F]">Total</span>
                  <span className="font-bold text-[18px] text-[#1D1D1F]">${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full bg-[#1D1D1F] text-white rounded-full py-3.5 text-[14px] font-medium hover:opacity-90 transition">
                Checkout
              </button>
              <button
                onClick={closeCart}
                className="w-full mt-2 text-[12px] text-[#86868B] hover:text-[#1D1D1F] transition py-1"
              >
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
