import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ---------- Products ----------

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function getProduct(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_aliases(alias), certificates(*)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('name')
  if (error) throw error
  return data
}

export async function subscribeEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert({ email })
  if (error) throw error
  return data
}

// ---------- Auth ----------

export async function signUp({ email, password, fullName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// ---------- Profile ----------

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateProfile(userId, patch) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---------- Addresses ----------

export async function listAddresses(userId) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createAddress(userId, address) {
  if (address.is_default) await clearDefaultAddress(userId)
  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...address, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAddress(userId, id, patch) {
  if (patch.is_default) await clearDefaultAddress(userId, id)
  const { data, error } = await supabase
    .from('addresses')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAddress(userId, id) {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

async function clearDefaultAddress(userId, exceptId = null) {
  const query = supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', userId)
    .eq('is_default', true)
  if (exceptId) query.neq('id', exceptId)
  const { error } = await query
  if (error) throw error
}

// ---------- Orders ----------

export async function listMyOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

// ---------- Cart (signed-in only) ----------

export async function loadServerCart(userId) {
  const { data, error } = await supabase
    .from('carts')
    .select('items')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.items ?? []
}

export async function saveServerCart(userId, items) {
  const { error } = await supabase
    .from('carts')
    .upsert(
      { user_id: userId, items, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  if (error) throw error
}

// ---------- Admin queries ----------

export async function adminListOrders({ status, search } = {}) {
  let query = supabase
    .from('orders')
    .select('*, order_items(quantity)')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  if (search) query = query.or(`email.ilike.%${search}%,order_number.ilike.%${search}%`)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function adminUpdateOrder(id, patch) {
  const { data, error } = await supabase
    .from('orders')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function adminListProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function adminUpsertProduct(product) {
  const payload = { ...product, updated_at: new Date().toISOString() }
  const { data, error } = await supabase
    .from('products')
    .upsert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function adminDeleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function adminListCustomers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function adminGetCustomer(id) {
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (pErr) throw pErr
  const { data: orders, error: oErr } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
  if (oErr) throw oErr
  return { profile, orders }
}

export async function adminListSubscribers() {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })
  if (error) throw error
  return data
}

export async function adminListCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, products(name, slug)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function adminUpsertCertificate(cert) {
  const { data, error } = await supabase
    .from('certificates')
    .upsert(cert)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function adminDeleteCertificate(id) {
  const { error } = await supabase.from('certificates').delete().eq('id', id)
  if (error) throw error
}

export async function adminUploadCoa(file, path) {
  const { error } = await supabase
    .storage
    .from('certificates')
    .upload(path, file, { upsert: true, contentType: file.type || 'application/pdf' })
  if (error) throw error
  const { data } = supabase.storage.from('certificates').getPublicUrl(path)
  return data.publicUrl
}

export async function adminAnalytics() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, total, status, created_at')
    .order('created_at', { ascending: true })
  if (error) throw error
  return orders
}
