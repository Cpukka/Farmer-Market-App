// app/dashboard/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Printer,
  MessageSquare,
  Star,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    description?: string;
    images: string[];
    category: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  notes?: string;
  deliveryDate?: string;
  farmer: {
    id: string;
    farmName: string;
    description?: string;
    image?: string;
    rating?: number;
    user: {
      email: string;
      name?: string;
    };
  };
  items: OrderItem[];
}

interface StatusUpdate {
  status: string;
  timestamp: string;
  note?: string;
}

export default function OrderDetailPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([
    { status: 'PENDING', timestamp: new Date().toISOString(), note: 'Order placed' },
    { status: 'CONFIRMED', timestamp: new Date().toISOString(), note: 'Order confirmed by farmer' },
    { status: 'PROCESSING', timestamp: new Date().toISOString(), note: 'Items being prepared' },
  ])

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetchOrderDetails()
  }, [authStatus, orderId, router])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Order not found')
      }
      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5" />
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5" />
      case 'PROCESSING': return <Package className="w-5 h-5" />
      case 'SHIPPED': return <Truck className="w-5 h-5" />
      case 'DELIVERED': return <CheckCircle className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      case 'PROCESSING': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30'
      case 'SHIPPED': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30'
      case 'DELIVERED': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'CANCELLED': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Order received, awaiting confirmation'
      case 'CONFIRMED': return 'Order confirmed by farmer'
      case 'PROCESSING': return 'Items being prepared for delivery'
      case 'SHIPPED': return 'Order is on its way'
      case 'DELIVERED': return 'Order has been delivered'
      case 'CANCELLED': return 'Order has been cancelled'
      default: return 'Order status unknown'
    }
  }

  const handleDownloadInvoice = async () => {
    // Implement invoice download
    console.log('Download invoice for order:', orderId)
  }

  const handleContactFarmer = () => {
    // Implement contact farmer feature
    console.log('Contact farmer:', order?.farmer.id)
  }

  const handleLeaveReview = () => {
    router.push(`/dashboard/orders/${orderId}/review`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
        <Link href="/dashboard/orders">
          <Button>
            Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  const canLeaveReview = order.status === 'DELIVERED'
  const canContactFarmer = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(order.status)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link 
          href="/dashboard/orders" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">
              Order #{order.id.slice(0, 8).toUpperCase()} • Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="w-4 h-4 mr-2" />
              Invoice
            </Button>
            {canLeaveReview && (
              <Button onClick={handleLeaveReview}>
                <Star className="w-4 h-4 mr-2" />
                Leave Review
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Order Status</h3>
                <p className="text-sm text-muted-foreground">
                  {getStatusDescription(order.status)}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-8">
                {statusUpdates.map((update, index) => (
                  <div key={index} className="relative pl-12">
                    <div className={`absolute left-6 top-2 -translate-x-1/2 w-3 h-3 rounded-full ${
                      index <= statusUpdates.findIndex(u => u.status === order.status) 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(update.status)}`}>
                          {update.status}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(update.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {update.note && (
                        <p className="text-sm text-muted-foreground">{update.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.deliveryDate && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Order Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex gap-4">
                    {item.product.images[0] && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      {item.product.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {item.product.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                    <Link 
                      href={`/products/${item.product.id}`}
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      View Product
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 pt-8 border-t">
              <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.totalAmount * 0.92).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Shipping Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Delivery Address</h4>
                </div>
                <div className="text-muted-foreground space-y-1">
                  <p>{order.address}</p>
                  <p>{order.city}, {order.zipCode}</p>
                  {order.notes && (
                    <div className="mt-3">
                      <p className="font-medium text-foreground">Delivery Notes:</p>
                      <p>{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Contact Information</h4>
                </div>
                <div className="text-muted-foreground space-y-1">
                  <p>{session?.user?.name || 'Customer'}</p>
                  <p>{order.phone}</p>
                  <p>{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Farmer Info & Actions */}
        <div className="space-y-6">
          {/* Farmer Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Farmer Information</h3>
            <div className="flex items-center gap-4 mb-6">
              {order.farmer.image ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={order.farmer.image}
                    alt={order.farmer.farmName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {order.farmer.farmName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="font-semibold">{order.farmer.farmName}</h4>
                {order.farmer.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{order.farmer.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {order.farmer.description && (
              <p className="text-sm text-muted-foreground mb-6">
                {order.farmer.description}
              </p>
            )}

            <div className="space-y-3">
              <Link href={`/farmers/${order.farmer.id}`}>
                <Button variant="outline" className="w-full justify-center">
                  View Farm Profile
                </Button>
              </Link>
              
              {canContactFarmer && (
                <Button 
                  onClick={handleContactFarmer}
                  className="w-full justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Farmer
                </Button>
              )}
            </div>
          </Card>

          {/* Order Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Order Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Printer className="w-4 h-4 mr-2" />
                Print Order Details
              </Button>
              
              {order.status === 'PENDING' && (
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancel Order
                </Button>
              )}
              // In your dashboard/orders/[id]/page.tsx
{order.status === 'DELIVERED' && !order.reviewed && (
  <Button 
    onClick={() => router.push(`/dashboard/orders/${order.id}/review`)}
    variant="outline"
    className="gap-2"
  >
    <MessageSquare className="w-4 h-4" />
    Write Review
  </Button>
)}
              
              <Button variant="outline" className="w-full justify-start">
                Need Help?
              </Button>
            </div>
          </Card>

          {/* Order Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Order Placed</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {order.deliveryDate && (
                <div>
                  <p className="text-sm font-medium">Estimated Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.deliveryDate).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}