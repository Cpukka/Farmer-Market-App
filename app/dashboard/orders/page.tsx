// app/dashboard/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  DollarSign,
  MoreVertical
} from 'lucide-react'

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  farmer: {
    farmName: string;
    image?: string;
  };
  items: Array<{
    product: {
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetchOrders()
  }, [status, pagination.page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let url = `/api/orders?page=${pagination.page}&limit=${pagination.limit}`
      
      if (statusFilter) {
        url += `&status=${statusFilter}`
      }

      const response = await fetch(url)
      const data = await response.json()
      
      setOrders(data.orders || [])
      setPagination(data.pagination || pagination)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'CONFIRMED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search logic
    console.log('Search:', search)
  }

  const handleFilter = (status: string) => {
    setStatusFilter(status === statusFilter ? '' : status)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage all your orders in one place
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="Search orders by ID, farmer, or product..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilter('')}
            >
              All Orders
            </Button>
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={statusFilter === status.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilter(status.value)}
              >
                {status.label}
              </Button>
            ))}
          </div>

          {/* Export Button */}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            {statusFilter 
              ? `No orders with status "${statusFilter}"`
              : "You haven't placed any orders yet."}
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{order.items.length} item(s)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        {item.product.images?.[0] && (
                          <div className="w-10 h-10 rounded-md bg-muted overflow-hidden">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {order.farmer?.farmName?.charAt(0) || 'F'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.farmer?.farmName || 'Unknown Farmer'}</p>
                    <p className="text-xs text-muted-foreground">Farmer</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {order.status === 'DELIVERED' && (
                    <Button size="sm">
                      Leave Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} orders
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum
              if (pagination.pages <= 5) {
                pageNum = i + 1
              } else if (pagination.page <= 3) {
                pageNum = i + 1
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i
              } else {
                pageNum = pagination.page - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}