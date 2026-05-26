import { Link, useLocation } from 'react-router-dom'

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const orderNumber = state?.orderNumber || 'N/A'
  const email = state?.email || ''
  const total = state?.total || 0

  return (
    <div className="max-w-[600px] mx-auto px-6 lg:px-8 py-20 text-center">
      {/* Checkmark */}
      <div className="w-20 h-20 bg-[#C9A96E] rounded-full flex items-center justify-center mx-auto mb-8">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-bold text-[#1A1F2E] tracking-[-0.03em] mb-3">Order Confirmed</h1>
      <p className="text-[#8B95A5] text-[15px] mb-8">
        Thank you for your order. We've sent a confirmation to {email || 'your email'}.
      </p>

      <div className="bg-[#FAFAF7] rounded-[20px] p-7 mb-10 text-left">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-[14px] text-[#8B95A5]">Order number</span>
            <span className="text-[14px] font-semibold text-[#1A1F2E]">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[14px] text-[#8B95A5]">Total</span>
            <span className="text-[14px] font-semibold text-[#1A1F2E]">${total.toFixed(2)}</span>
          </div>
          <div className="border-t border-[#E8E8ED] pt-4 flex justify-between">
            <span className="text-[14px] text-[#8B95A5]">Estimated shipping</span>
            <span className="text-[14px] font-medium text-[#1A1F2E]">0–2 business days</span>
          </div>
        </div>
      </div>

      <Link
        to="/store"
        className="inline-flex items-center gap-2 bg-[#1A1F2E] text-white text-[14px] font-medium px-8 py-3.5 rounded-full"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
