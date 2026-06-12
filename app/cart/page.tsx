// app/cart/page.tsx - Fix the conditional rendering
'use client'

import { useCart } from '../contexts/CartContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowRight,
  Tag,
  Truck,
  Shield,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount, isLoading } = useCart() // Added isLoading
  const [promoCode, setPromoCode] = useState('')

  // Calculate totals
  const deliveryFee = subtotal > 35 ? 0 : 5.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* DEBUG: Show cart info */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <p className="text-sm font-medium">Debug Info:</p>
        <p className="text-xs">Items array length: {items.length}</p>
        <p className="text-xs">Item count: {itemCount}</p>
        <p className="text-xs">First item: {items[0]?.name || 'None'}</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some fresh produce to get started!</p>
          <Link href="/products">
            <Button>
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          From <span className="text-primary">{item.farmerName}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm text-muted-foreground ml-2">{item.unit}</span>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Code */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Promo Code</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  Apply
                </Button>
              </div>
            </div>

            {/* Cart Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Free Delivery</h4>
                <p className="text-sm text-muted-foreground">On orders over $35</p>
              </div>
              <div className="card p-4 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Quality Guarantee</h4>
                <p className="text-sm text-muted-foreground">Freshness guaranteed</p>
              </div>
              <div className="card p-4 text-center">
                <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <Button className="w-full gap-2" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Delivery Estimate */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-2">Delivery Estimate</h4>
                <p className="text-sm text-muted-foreground">
                  Order today for delivery within 1-2 business days.
                  Available in select areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}