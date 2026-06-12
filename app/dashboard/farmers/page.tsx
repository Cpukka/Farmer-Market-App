// app/dashboard/farmer/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  MessageSquare,
  BarChart3,
  PackageOpen,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface FarmerStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalProducts: number
  averageRating: number
  reviewsCount: number
  thisMonthRevenue: number
  revenueChange: number
  ordersChange: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  itemsCount: number
}

interface RecentReview {
  id: string
  customerName: string
  rating: number
  comment: string
  productName: string
  createdAt: string
  hasResponse: boolean
}

export default function FarmerDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<FarmerStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Check if user is a farmer
    if (status === 'authenticated' && session?.user?.role !== 'FARMER') {
      router.push('/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetchFarmerDashboardData()
    }
  }, [status, router, session])

  const fetchFarmerDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch farmer dashboard data
      const response = await fetch('/api/farmer/dashboard')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
        setRecentReviews(data.recentReviews || [])
      }
      
    } catch (error) {
      console.error('Failed to fetch farmer dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading farmer dashboard...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />
      case 'SHIPPED':
        return <PackageOpen className="w-4 h-4" />
      case 'PROCESSING':
      case 'CONFIRMED':
        return <Clock className="w-4 h-4" />
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const statsData = stats ? [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}%`,
      trend: stats.revenueChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'bg-purple-500',
      description: 'This month'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}%`,
      trend: stats.ordersChange >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      description: 'Lifetime'
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-green-500',
      description: 'In inventory'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'bg-yellow-500',
      description: `Based on ${stats.reviewsCount} reviews`
    }
  ] : []

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, Farmer {session?.user?.name}!
            </h1>
            <p className="text-white/90 mt-2">
              Manage your farm operations, track orders, and grow your business.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/farmer/products/new">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
                <Package className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
            <Link href="/dashboard/farmer/analytics">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {'change' in stat && (
              <div className="flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-2">from last month</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <div className="flex gap-2">
              <Link href="/dashboard/farmer/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
              <Link href="/dashboard/farmer/orders?status=PENDING">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  {stats?.pendingOrders || 0} Pending
                </Button>
              </Link>
            </div>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start promoting your products to get orders
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/dashboard/farmer/orders/${order.id}`}
                          className="font-medium hover:text-primary"
                        >
                          #{order.orderNumber}
                        </Link>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} • {order.itemsCount} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions & Reviews */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/farmer/products/new">
                <Button className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
              <Link href="/dashboard/farmer/products">
                <Button variant="outline" className="w-full justify-start">
                  <PackageOpen className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/dashboard/farmer/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </Link>
              <Link href="/dashboard/farmer/reviews">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Manage Reviews
                </Button>
              </Link>
              <Link href="/dashboard/farmer/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Farm Profile
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Reviews */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Reviews</h3>
              <Link href="/dashboard/farmer/reviews">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            {recentReviews.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.customerName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {review.comment}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        On: {review.productName}
                      </span>
                      {!review.hasResponse && (
                        <Button size="sm" variant="ghost" className="text-xs">
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Stats Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Completed Orders</p>
            <p className="text-2xl font-bold mt-2">24</p>
            <p className="text-sm text-green-500 mt-1">+12% from last month</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">New Customers</p>
            <p className="text-2xl font-bold mt-2">18</p>
            <p className="text-sm text-green-500 mt-1">+8% from last month</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
            <p className="text-2xl font-bold mt-2">$45.20</p>
            <p className="text-sm text-green-500 mt-1">+5% from last month</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-muted-foreground">Response Rate</p>
            <p className="text-2xl font-bold mt-2">92%</p>
            <p className="text-sm text-green-500 mt-1">+3% from last month</p>
          </div>
        </div>
      </Card>
    </div>
  )
}