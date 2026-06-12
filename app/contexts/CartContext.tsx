// app/contexts/CartContext.tsx - Complete working version
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  unit: string
  image: string
  farmerId: string
  farmerName: string
  quantity: number
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: () => Promise<void>
  subtotal: number
  itemCount: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    
    if (session) {
      loadCartFromDatabase()
    } else {
      loadCartFromLocalStorage()
    }
  }, [session, status])

  const loadCartFromDatabase = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
        localStorage.setItem('farmer-market-cart', JSON.stringify(data.items || []))
      }
    } catch (error) {
      console.error('Failed to load cart from database:', error)
      loadCartFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('farmer-market-cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
    setIsLoading(false)
  }

  const syncCart = async () => {
    if (!session) return
    
    try {
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  const addItem = async (item: Omit<CartItem, 'id'>) => {
    const newItem = { ...item, id: `temp-${Date.now()}` }
    
    setItems(prev => {
      const existingItem = prev.find(i => i.productId === item.productId)
      if (existingItem) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, newItem]
    })

    localStorage.setItem('farmer-market-cart', JSON.stringify([
      ...items.filter(i => i.productId !== item.productId),
      { ...newItem, quantity: 1 }
    ]))

    if (session) {
      try {
        await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.productId,
            quantity: 1,
          }),
        })
      } catch (error) {
        console.error('Failed to sync with database:', error)
      }
    }
  }

  const removeItem = async (cartItemId: string) => {
    const item = items.find(i => i.id === cartItemId)
    if (!item) return

    setItems(prev => prev.filter(i => i.id !== cartItemId))
    localStorage.setItem('farmer-market-cart', JSON.stringify(
      items.filter(i => i.id !== cartItemId)
    ))

    if (session && !cartItemId.startsWith('temp-')) {
      try {
        await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Failed to remove from database:', error)
      }
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(cartItemId)
      return
    }

    const item = items.find(i => i.id === cartItemId)
    if (!item) return

    const newQuantity = Math.max(1, Math.min(item.stock, quantity))
    
    setItems(prev =>
      prev.map(item =>
        item.id === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )

    localStorage.setItem('farmer-market-cart', JSON.stringify(
      items.map(i => i.id === cartItemId ? { ...i, quantity: newQuantity } : i)
    ))

    if (session && !cartItemId.startsWith('temp-')) {
      try {
        await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        })
      } catch (error) {
        console.error('Failed to update quantity in database:', error)
      }
    }
  }

  const clearCart = async () => {
    setItems([])
    localStorage.removeItem('farmer-market-cart')

    if (session) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Failed to clear cart in database:', error)
      }
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncCart,
        subtotal,
        itemCount,
        isLoading,
         
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}