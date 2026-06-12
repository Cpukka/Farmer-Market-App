// app/components/debug/CartDebug.tsx
'use client'

import { useCart } from '../../contexts/CartContext'
import { useSession } from 'next-auth/react'

export default function CartDebug() {
  const { items, itemCount, subtotal, isLoading } = useCart()
  const { data: session } = useSession()

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-sm max-w-md">
      <h3 className="font-bold mb-2">Cart Debug</h3>
      <div className="space-y-1">
        <p>Session: {session ? 'Logged in' : 'Not logged in'}</p>
        <p>User ID: {session?.user?.id?.slice(0, 8)}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Item Count: {itemCount}</p>
        <p>Items in cart: {items.length}</p>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <div className="mt-2">
          <p className="font-semibold">Cart Items:</p>
          {items.map((item, index) => (
            <div key={index} className="pl-2">
              {index + 1}. {item.name} (Qty: {item.quantity})
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}