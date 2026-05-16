import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch all products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

// Fetch single product by slug
export async function getProduct(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_aliases(alias), certificates(*)')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

// Fetch featured products
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('name')
  if (error) throw error
  return data
}

// Subscribe to newsletter
export async function subscribeEmail(email) {
  const { data, error } = await supabase
    .from('subscribers')
    .insert({ email })
  if (error) throw error
  return data
}
