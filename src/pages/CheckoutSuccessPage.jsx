import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="text-[24px] font-bold text-[#1D1D1F] tracking-tight mb-3">Payment Received</h1>
      <p className="text-[14px] text-[#86868B] leading-relaxed mb-8 max-w-md mx-auto">
        Your payment is being processed. You'll receive a confirmation email once it settles on-chain.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/account/orders"
          className="bg-[#1D1D1F] text-white text-[14px] font-medium px-6 py-3 rounded-full hover:opacity-90 transition"
        >
          View orders
        </Link>
        <Link
          to="/store"
          className="border border-[#1D1D1F] text-[#1D1D1F] text-[14px] font-medium px-6 py-3 rounded-full hover:bg-[#F5F5F7] transition"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
