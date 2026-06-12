'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Package,
  Calendar,
  DollarSign,
  Truck,
  Search,
  Filter,
  Download,
  Eye,
  Star
} from 'lucide-react'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const orders = [
    {
      id: 'ORD-789012',
      date: 'Jan 15, 2024',
      total: 45.97,
      status: 'Delivered',
      items: [
        { name: 'Organic Tomatoes', quantity: 2, price: 3.99 },
        { name: 'Fresh Eggs', quantity: 1, price: 5.99 },
        { name: 'Mixed Greens', quantity: 1, price: 4.99 },
      ],
      farmer: 'Green Valley Farm',
      deliveryDate: 'Jan 17, 2024',
      trackingNumber: 'TRK-78901234'
    },
    {
      id: 'ORD-789011',
      date: 'Jan 8, 2024',
      total: 28.99,
      status: 'Delivered',
      items: [
        { name: 'Honey Jar', quantity: 1, price: 12.99 },
        { name: 'Organic Apples', quantity: 2, price: 8.00 },
      ],
      farmer: 'Sunny Meadows',
      deliveryDate: 'Jan 10, 2024',
      trackingNumber: 'TRK-78901123'
    },
    {
      id: 'ORD-789010',
      date: 'Jan 2, 2024',
      total: 67.45,
      status: 'Processing',
      items: [
        { name: 'Grass-fed Beef', quantity: 2, price: 24.99 },
        { name: 'Fresh Milk', quantity: 1, price: 4.99 },
        { name: 'Organic Carrots', quantity: 2, price: 5.98 },
      ],
      farmer: 'Heritage Farm',
      deliveryDate: 'Jan 5, 2024',
      trackingNumber: 'TRK-78901012'
    },
    {
      id: 'ORD-789009',
      date: 'Dec 28, 2023',
      total: 32.50,
      status: 'Delivered',
      items: [
        { name: 'Free-range Chicken', quantity: 1, price: 8.99 },
        { name: 'Organic Basil', quantity: 2, price: 5.98 },
      ],
      farmer: 'Green Valley Farm',
      deliveryDate: 'Dec 30, 2023',
      trackingNumber: 'TRK-78900901'
    },
    {
      id: 'ORD-789008',
      date: 'Dec 22, 2023',
      total: 56.75,
      status: 'Delivered',
      items: [
        { name: 'Holiday Ham', quantity: 1, price: 29.99 },
        { name: 'Fresh Eggs', quantity: 2, price: 11.98 },
        { name: 'Mixed Greens', quantity: 2, price: 9.98 },
      ],
      farmer: 'Sunny Meadows',
      deliveryDate: 'Dec 24, 2023',
      trackingNumber: 'TRK-78900890'
    },
  ]

  const statusColors = {
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          View and track all your orders in one place
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">$423.75</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="search"
                placeholder="Search orders by ID, farmer, or product..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{order.id}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Ordered: {order.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Delivery: {order.deliveryDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      Farmer: {order.farmer}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                <Button className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                {order.status === 'Delivered' && (
                  <Button variant="outline" className="gap-2">
                    <Star className="w-4 h-4" />
                    Leave Review
                  </Button>
                )}
                {order.status === 'Processing' && (
                  <Button variant="outline" className="gap-2">
                    <Truck className="w-4 h-4" />
                    Track Order
                  </Button>
                )}
                <Button variant="outline" className="gap-2">
                  Reorder
                </Button>
                <div className="ml-auto">
                  <p className="text-sm text-muted-foreground">
                    Tracking: {order.trackingNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="default" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  )
}