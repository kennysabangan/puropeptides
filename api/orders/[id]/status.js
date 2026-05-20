import { supabaseAdmin, getUserFromAuthHeader } from '../../_lib/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const user = await getUserFromAuthHeader(req)
  if (!user) return res.status(401).json({ error: 'unauthorized' })

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'missing_id' })

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, status, payment_status, pay_currency, pay_amount, pay_address, total')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) return res.status(500).json({ error: 'lookup_failed', detail: error.message })
  if (!order) return res.status(404).json({ error: 'not_found' })

  res.setHeader('cache-control', 'no-store')
  return res.status(200).json(order)
}
