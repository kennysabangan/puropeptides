import { supabaseAdmin, getUserFromAuthHeader } from './_lib/supabase.js'
import { createInvoice } from './_lib/nowpayments.js'

function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  return `${proto}://${host}`
}

function unitPriceFor(basePrice, bundleType) {
  if (bundleType === 2) return Number(basePrice) * 0.95
  if (typeof bundleType === 'number' && bundleType >= 3) return Number(basePrice) * 0.925
  return Number(basePrice)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const user = await getUserFromAuthHeader(req)
  if (!user) return res.status(401).json({ error: 'unauthorized' })

  const { items, shipping_address } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'empty_cart' })
  }
  if (!shipping_address || !shipping_address.line1 || !shipping_address.city || !shipping_address.postal_code) {
    return res.status(400).json({ error: 'missing_shipping_address' })
  }

  const productIds = [...new Set(items.map((i) => i.product_id).filter(Boolean))]
  if (productIds.length === 0) return res.status(400).json({ error: 'invalid_items' })

  const { data: products, error: prodErr } = await supabaseAdmin
    .from('products')
    .select('id, name, price, in_stock')
    .in('id', productIds)
  if (prodErr) return res.status(500).json({ error: 'product_lookup_failed', detail: prodErr.message })

  const byId = new Map(products.map((p) => [p.id, p]))
  for (const id of productIds) {
    if (!byId.has(id)) return res.status(400).json({ error: 'unknown_product', product_id: id })
    if (byId.get(id).in_stock === false) {
      return res.status(409).json({ error: 'out_of_stock', product_id: id })
    }
  }

  let subtotal = 0
  const orderItemRows = []
  for (const it of items) {
    const product = byId.get(it.product_id)
    const qty = Math.max(1, parseInt(it.quantity, 10) || 0)
    if (qty <= 0) return res.status(400).json({ error: 'invalid_quantity', product_id: it.product_id })
    const unit = unitPriceFor(product.price, it.bundleType)
    const lineTotal = unit * qty
    subtotal += lineTotal
    orderItemRows.push({
      product_id: product.id,
      quantity: qty,
      dosage: it.dosage || '10MG',
      unit_price: Number(unit.toFixed(2)),
      total_price: Number(lineTotal.toFixed(2)),
    })
  }

  const shipping = subtotal >= 150 ? 0 : 9.99
  const total = Number((subtotal + shipping).toFixed(2))
  subtotal = Number(subtotal.toFixed(2))

  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      email: user.email,
      user_id: user.id,
      status: 'pending',
      payment_status: 'waiting',
      subtotal,
      shipping,
      total,
      shipping_address,
    })
    .select()
    .single()
  if (orderErr) return res.status(500).json({ error: 'order_create_failed', detail: orderErr.message })

  const itemRowsWithOrder = orderItemRows.map((r) => ({ ...r, order_id: order.id }))
  const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(itemRowsWithOrder)
  if (itemsErr) {
    await supabaseAdmin.from('orders').delete().eq('id', order.id)
    return res.status(500).json({ error: 'order_items_failed', detail: itemsErr.message })
  }

  const base = siteUrl(req)
  let invoice
  try {
    invoice = await createInvoice({
      price_amount: total,
      price_currency: 'usd',
      order_id: order.id,
      order_description: `Amino Select order ${order.order_number}`,
      ipn_callback_url: `${base}/api/webhooks/nowpayments`,
      success_url: `${base}/checkout/success?order_id=${order.id}`,
      cancel_url: `${base}/cart`,
      is_fixed_rate: false,
      is_fee_paid_by_user: false,
    })
  } catch (err) {
    await supabaseAdmin
      .from('orders')
      .update({ payment_status: 'failed', notes: `NowPayments invoice creation failed: ${err.message}` })
      .eq('id', order.id)
    return res.status(502).json({ error: 'invoice_create_failed', detail: err.message })
  }

  await supabaseAdmin
    .from('orders')
    .update({ nowpayments_invoice_id: String(invoice.id) })
    .eq('id', order.id)

  return res.status(200).json({
    order_id: order.id,
    order_number: order.order_number,
    invoice_url: invoice.invoice_url,
  })
}
