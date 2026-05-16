import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'puro-peptides-cart'

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, dosage, bundleType } = action.payload
      const key = `${product.id}-${dosage}-${bundleType}`
      const existing = state.find(item => `${item.product.id}-${item.dosage}-${item.bundleType}` === key)
      if (existing) {
        return state.map(item =>
          `${item.product.id}-${item.dosage}-${item.bundleType}` === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...state, { product, quantity, dosage, bundleType, addedAt: Date.now() }]
    }
    case 'REMOVE_ITEM':
      return state.filter((_, i) => i !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map((item, i) =>
        i === action.payload.index ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCart)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

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
