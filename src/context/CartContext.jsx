import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'
import { loadServerCart, saveServerCart } from '../lib/supabase'

const CartContext = createContext()

const CART_STORAGE_KEY = 'amino-select-cart'

function loadLocalCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function keyOf(item) {
  return `${item.product.id}-${item.dosage}-${item.bundleType}`
}

function mergeItems(a, b) {
  const merged = [...a]
  for (const item of b) {
    const existing = merged.find((m) => keyOf(m) === keyOf(item))
    if (existing) existing.quantity += item.quantity
    else merged.push(item)
  }
  return merged
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'REPLACE':
      return action.payload
    case 'ADD_ITEM': {
      const { product, quantity, dosage, bundleType } = action.payload
      const key = `${product.id}-${dosage}-${bundleType}`
      const existing = state.find((item) => keyOf(item) === key)
      if (existing) {
        return state.map((item) =>
          keyOf(item) === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...state, { product, quantity, dosage, bundleType, addedAt: Date.now() }]
    }
    case 'REMOVE_ITEM':
      return state.filter((_, i) => i !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map((item, i) =>
        i === action.payload.index ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item,
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [items, dispatch] = useReducer(cartReducer, null, loadLocalCart)

  // Track which user we've hydrated for, so a sign-in only merges once.
  const hydratedFor = useRef(null)
  const lastSavedSignature = useRef(null)

  // Hydrate from server when the user changes.
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      hydratedFor.current = null
      return
    }
    if (hydratedFor.current === user.id) return
    hydratedFor.current = user.id

    let cancelled = false
    ;(async () => {
      try {
        const local = loadLocalCart()
        const server = await loadServerCart(user.id)
        const merged = mergeItems(server, local)
        if (cancelled) return
        dispatch({ type: 'REPLACE', payload: merged })
        if (local.length > 0) {
          await saveServerCart(user.id, merged)
        }
      } catch (err) {
        console.error('Cart hydrate failed', err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  // Mirror to localStorage always.
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Mirror to server for signed-in users (skip the first echo after hydrate).
  useEffect(() => {
    if (!user) return
    const sig = JSON.stringify(items)
    if (sig === lastSavedSignature.current) return
    lastSavedSignature.current = sig
    saveServerCart(user.id, items).catch((err) => console.error('Cart save failed', err))
  }, [items, user])

  const addToCart = (product, quantity = 1, dosage = '10MG', bundleType = 'single') => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, dosage, bundleType } })
  }

  const removeFromCart = (index) => {
    dispatch({ type: 'REMOVE_ITEM', payload: index })
  }

  const updateQuantity = (index, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR' })
  }

  const getCartTotal = () => {
    return items.reduce((sum, item) => {
      let price = item.product.price
      if (item.bundleType === 2) price *= 0.95
      if (item.bundleType >= 3) price *= 0.925
      return sum + price * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
