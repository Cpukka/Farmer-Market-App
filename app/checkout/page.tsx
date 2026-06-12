// app/checkout/page.tsx - Updated with database integration
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle,
  Lock,
  AlertCircle,
  Package,
  Calendar,
  Home
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../contexts/CartContext'

interface OrderDetails {
  id: string;
  orderNumber: string;
  total: number;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, subtotal, clearCart } = useCart()
  
  const [step, setStep] = useState<'address' | 'delivery' | 'payment' | 'review'>('address')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  const [formData, setFormData] = useState({
    // Address Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Delivery
    deliveryMethod: 'standard',
    deliveryInstructions: '',
    
    // Payment
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    saveCard: false
  })

  // Load user data if logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      }))
    }
  }, [session])

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      price: 5.99,
      description: '2-3 business days',
      freeThreshold: 35
    },
    {
      id: 'express',
      name: 'Express Delivery',
      price: 9.99,
      description: 'Next business day',
      freeThreshold: 50
    },
    {
      id: 'pickup',
      name: 'Farm Pickup',
      price: 0,
      description: 'Pick up from local farm',
      freeThreshold: 0
    }
  ]

  const selectedDelivery = deliveryOptions.find(d => d.id === formData.deliveryMethod)
  const deliveryFee = subtotal >= (selectedDelivery?.freeThreshold || 0) ? 0 : (selectedDelivery?.price || 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateStep = () => {
    switch (step) {
      case 'address':
        return (
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          formData.address.trim() &&
          formData.city.trim() &&
          formData.state.trim() &&
          formData.zipCode.trim()
        )
      case 'payment':
        return (
          formData.cardNumber.replace(/\s/g, '').length === 16 &&
          formData.cardName.trim() &&
          formData.cardExpiry.match(/^\d{2}\/\d{2}$/) &&
          formData.cardCvc.length >= 3
        )
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (!validateStep()) {
      alert('Please fill in all required fields correctly.')
      return
    }
    
    switch (step) {
      case 'address':
        setStep('delivery')
        break
      case 'delivery':
        setStep('payment')
        break
      case 'payment':
        setStep('review')
        break
      case 'review':
        handlePlaceOrder()
        break
    }
  }

  const handlePrevStep = () => {
    switch (step) {
      case 'delivery':
        setStep('address')
        break
      case 'payment':
        setStep('delivery')
        break
      case 'review':
        setStep('payment')
        break
    }
  }

  const handlePlaceOrder = async () => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }

    if (items.length === 0) {
      alert('Your cart is empty')
      router.push('/cart')
      return
    }

    setIsProcessing(true)
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        deliveryInstructions: formData.deliveryInstructions,
        phone: formData.phone,
        deliveryMethod: formData.deliveryMethod,
        notes: formData.deliveryInstructions,
        paymentMethod: 'card',
        cardLastFour: formData.cardNumber.slice(-4),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to place order')
      }

      const result = await response.json()
      
      // Clear cart
      await clearCart()
      
      // Set order details for success page
      setOrderDetails({
        id: result.orderId,
        orderNumber: `ORD-${result.orderId.slice(0, 8).toUpperCase()}`,
        total: total,
        estimatedDelivery: getEstimatedDeliveryDate(),
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      })
      
      setOrderComplete(true)
    } catch (error) {
      console.error('Order error:', error)
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getEstimatedDeliveryDate = () => {
    const daysToAdd = formData.deliveryMethod === 'express' ? 1 : 
                     formData.deliveryMethod === 'standard' ? 3 : 0
    const date = new Date()
    date.setDate(date.getDate() + daysToAdd)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items to your cart before checking out.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  if (orderComplete && orderDetails) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been received and is being processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-semibold">{orderDetails.orderNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="text-lg font-semibold">{orderDetails.estimatedDelivery}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">${orderDetails.total.toFixed(2)}</p>
            </div>
            
            {/* Order Summary */}
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Order Summary</h4>
              <div className="space-y-2">
                {orderDetails.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
                {orderDetails.items.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {orderDetails.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link href={`/dashboard/orders/${orderDetails.id}`}>
                <Button>
                  View Order Details
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center">
        {[
          { key: 'address', label: 'Address', icon: <MapPin className="w-5 h-5" /> },
          { key: 'delivery', label: 'Delivery', icon: <Truck className="w-5 h-5" /> },
          { key: 'payment', label: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
          { key: 'review', label: 'Review', icon: <CheckCircle className="w-5 h-5" /> }
        ].map((stepItem, index) => (
          <div key={stepItem.key} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step === stepItem.key 
                ? 'bg-primary text-primary-foreground' 
                : stepItem.key < step
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}>
              {stepItem.icon}
            </div>
            <div className="ml-3 hidden sm:block">
              <p className="text-sm text-muted-foreground">Step {index + 1}</p>
              <p className="font-medium">{stepItem.label}</p>
            </div>
            {index < 3 && (
              <div className={`h-1 w-8 sm:w-16 mx-2 ${
                stepItem.key < step ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'address' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Enter your shipping information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Apartment, Suite, etc. (Optional)</label>
                  <Input
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Springfield"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="CA"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'delivery' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Method
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        formData.deliveryMethod === option.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: option.id }))}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{option.name}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {subtotal >= option.freeThreshold ? 'FREE' : `$${option.price.toFixed(2)}`}
                          </p>
                          {option.freeThreshold > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Free on orders over ${option.freeThreshold}
                            </p>
                          )}
                        </div>
                      </div>
                      {formData.deliveryMethod === option.id && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Delivery Instructions (Optional)
                          </label>
                          <textarea
                            name="deliveryInstructions"
                            value={formData.deliveryInstructions}
                            onChange={handleChange}
                            placeholder="e.g., Leave package at front door"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-20"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Enter your payment details securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number *</label>
                  <div className="relative">
                    <Input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16)
                        const formatted = value.replace(/(\d{4})/g, '$1 ').trim()
                        setFormData(prev => ({ ...prev, cardNumber: formatted }))
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Name on Card *</label>
                  <Input
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                    <Input
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        if (value.length >= 2) {
                          const formatted = value.slice(0, 2) + '/' + value.slice(2, 4)
                          setFormData(prev => ({ ...prev, cardExpiry: formatted }))
                        } else {
                          setFormData(prev => ({ ...prev, cardExpiry: value }))
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVC *</label>
                    <Input
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                        setFormData(prev => ({ ...prev, cardCvc: value }))
                      }}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="saveCard"
                    name="saveCard"
                    checked={formData.saveCard}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <label htmlFor="saveCard" className="ml-2 text-sm">
                    Save card for future purchases
                  </label>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Review Your Order
                </CardTitle>
                <CardDescription>
                  Please review all details before placing your order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}</p>
                    {formData.apartment && <p>{formData.apartment}</p>}
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                    <p className="mt-2">{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Delivery Method</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium">{selectedDelivery?.name}</p>
                    <p className="text-muted-foreground">{selectedDelivery?.description}</p>
                    {formData.deliveryInstructions && (
                      <p className="mt-2">
                        <span className="font-medium">Instructions:</span> {formData.deliveryInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Payment Method</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Credit Card</p>
                        <p className="text-muted-foreground">
                          **** **** **** {formData.cardNumber.replace(/\s/g, '').slice(-4)}
                        </p>
                      </div>
                      <CreditCard className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Order Items ({items.length})</h3>
                  <div className="space-y-3">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} {item.unit} • {item.farmerName}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        + {items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {step !== 'address' && (
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            )}
            <Button
              onClick={handleNextStep}
              disabled={isProcessing || items.length === 0}
              className={`ml-auto ${step === 'address' ? '' : ''}`}
            >
              {isProcessing ? 'Processing...' : step === 'review' ? 'Place Order' : 'Continue'}
            </Button>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From: {item.farmerName}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {items.length - 3} more items
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t pt-4 space-y-2">
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
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Including all taxes and fees
                </p>
              </div>

              {/* Security Badge */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Secure SSL Encryption</span>
                </div>
              </div>

              {/* Need Help */}
              <div className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Need help?</span>
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Policy */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Our Guarantee</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Freshness guaranteed or your money back</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Easy returns within 7 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Support from local farmers</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}