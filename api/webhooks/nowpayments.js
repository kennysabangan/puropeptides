import { supabaseAdmin } from '../_lib/supabase.js'
import { verifyIpnSignature } from '../_lib/nowpayments.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const signature = req.headers['x-nowpayments-sig']
  const body = req.body
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'invalid_body' })
  }

  if (!verifyIpnSignature(body, signature)) {
    console.warn('NowPayments IPN signature mismatch', { payment_id: body.payment_id })
    return res.status(401).json({ error: 'invalid_signature' })
  }

  const orderId = body.order_id
  if (!orderId) return res.status(400).json({ error: 'missing_order_id' })

  const { data: order, error: lookupErr } = await supabaseAdmin
    .from('orders')
    .select('id, user_id, status, payment_status')
    .eq('id', orderId)
    .maybeSingle()
  if (lookupErr) {
    console.error('NowPayments IPN order lookup failed', lookupErr)
    return res.status(500).json({ error: 'lookup_failed' })
  }
  if (!order) {
    console.warn('NowPayments IPN for unknown order', { order_id: orderId })
    return res.status(200).json({ ok: true, ignored: true })
  }

  const paymentStatus = String(body.payment_status || '').toLowerCase()
  const patch = {
    payment_status: paymentStatus || order.payment_status,
    nowpayments_payment_id: body.payment_id ? String(body.payment_id) : null,
    pay_currency: body.pay_currency || null,
    pay_amount: body.pay_amount != null ? Number(body.pay_amount) : null,
    pay_address: body.pay_address || null,
    updated_at: new Date().toISOString(),
  }

  if (paymentStatus === 'finished' && order.status === 'pending') {
    patch.status = 'confirmed'
  } else if (paymentStatus === 'failed' || paymentStatus === 'expired') {
    if (order.status === 'pending') patch.status = 'cancelled'
  }

  const { error: updateErr } = await supabaseAdmin
    .from('orders')
    .update(patch)
    .eq('id', order.id)
  if (updateErr) {
    console.error('NowPayments IPN order update failed', updateErr)
    return res.status(500).json({ error: 'update_failed' })
  }

  if (patch.status === 'confirmed' && order.user_id) {
    await supabaseAdmin
      .from('carts')
      .delete()
      .eq('user_id', order.user_id)
      .then(({ error }) => {
        if (error) console.error('Cart clear after confirm failed', error)
      })
  }

  return res.status(200).json({ ok: true })
}
