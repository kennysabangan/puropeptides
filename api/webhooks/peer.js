import { createHmac } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

function verifySignature(secret, headers, body) {
  const signature = headers['x-peer-signature']
  const timestamp = headers['x-peer-timestamp']
  if (!signature || !timestamp) return false

  const message = `${timestamp}.${JSON.stringify(body)}`
  const expected = createHmac('sha256', secret).update(message).digest('hex')
  return signature === expected
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.VITE_PEER_WEBHOOK_SECRET
  if (!secret) {
    console.error('VITE_PEER_WEBHOOK_SECRET not configured')
    return res.status(500).json({ error: 'Webhook secret not configured' })
  }

  // Verify HMAC-SHA256 signature
  if (!verifySignature(secret, req.headers, req.body)) {
    console.error('Invalid webhook signature')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const { eventType, orderId, orderData } = req.body || {}
  const merchantOrderId = orderData?.notes?.merchantOrderId
  const customerId = orderData?.notes?.customerId

  console.log(`Peer webhook: ${eventType} for order ${orderId}`)

  switch (eventType) {
    case 'ORDER_FULFILLED': {
      if (merchantOrderId) {
        await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            payment_method: 'peer_crypto',
            payment_ref: orderId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', merchantOrderId)
      }
      break
    }

    case 'PAYMENT_SETTLED': {
      if (merchantOrderId) {
        await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', merchantOrderId)
      }
      break
    }

    case 'PAYMENT_FAILED':
    case 'PAYMENT_EXPIRED': {
      if (merchantOrderId) {
        await supabase
          .from('orders')
          .update({
            status: 'payment_failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', merchantOrderId)
      }
      break
    }

    default:
      console.log(`Unhandled Peer event: ${eventType}`)
  }

  return res.status(200).json({ received: true })
}
