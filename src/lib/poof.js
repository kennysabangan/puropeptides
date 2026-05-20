// Poof.io integration — loads checkout SDK and initiates payment
const POOF_MERCHANT_ID = import.meta.env.VITE_POOF_MERCHANT_ID || 'YOUR_POOF_MERCHANT_ID'
const POOF_API_KEY = import.meta.env.VITE_POOF_API_KEY || 'YOUR_POOF_API_KEY'

let poofLoaded = false

export async function loadPoof() {
  if (poofLoaded) return
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.poof.io/checkout.js'
    script.async = true
    script.onload = () => { poofLoaded = true; resolve() }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export async function openPoofCheckout({ orderId, amount, email, items }) {
  await loadPoof()

  // Try Poof SDK first
  if (window.Poof) {
    return window.Poof.open({
      merchant: POOF_MERCHANT_ID,
      amount: Math.round(amount * 100), // cents
      currency: 'USD',
      metadata: { orderId, email },
      description: `Amino Select Order #${orderId}`,
      onSuccess: (result) => result,
      onCancel: () => null,
    })
  }

  // Fallback: redirect to Poof hosted page
  const params = new URLSearchParams({
    merchant: POOF_MERCHANT_ID,
    amount: amount.toFixed(2),
    email,
    order_id: orderId,
  })
  window.open(`https://pay.poof.io/${POOF_MERCHANT_ID}?${params}`, '_blank')
}
