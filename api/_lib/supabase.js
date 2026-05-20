import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) throw new Error('Missing VITE_SUPABASE_URL / SUPABASE_URL')
if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export async function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization || req.headers.Authorization
  if (!auth || !auth.startsWith('Bearer ')) return null
  const token = auth.slice('Bearer '.length).trim()
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) return null
  return data.user
}
