import crypto from 'node:crypto'

const SANDBOX_BASE = 'https://api-sandbox.nowpayments.io/v1'
const PROD_BASE = 'https://api.nowpayments.io/v1'

export function nowpaymentsBaseUrl() {
  const env = (process.env.NOWPAYMENTS_ENV || 'sandbox').toLowerCase()
  return env === 'prod' || env === 'production' ? PROD_BASE : SANDBOX_BASE
}

export function nowpaymentsApiKey() {
  const key = process.env.NOWPAYMENTS_API_KEY
  if (!key) throw new Error('Missing NOWPAYMENTS_API_KEY')
  return key
}

export function nowpaymentsIpnSecret() {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET
  if (!secret) throw new Error('Missing NOWPAYMENTS_IPN_SECRET')
  return secret
}

export async function createInvoice(payload) {
  const res = await fetch(`${nowpaymentsBaseUrl()}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': nowpaymentsApiKey(),
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = body?.message || `NowPayments invoice failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

// Recursively sort object keys for deterministic JSON.stringify.
// NowPayments signs JSON.stringify(sortObject(body)) with HMAC-SHA512.
function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject)
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObject(value[key])
        return acc
      }, {})
  }
  return value
}

export function verifyIpnSignature(body, signature) {
  if (!signature) return false
  const sorted = JSON.stringify(sortObject(body))
  const hmac = crypto.createHmac('sha512', nowpaymentsIpnSecret())
  hmac.update(sorted)
  const expected = hmac.digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(String(signature), 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
