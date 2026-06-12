// app/dashboard/page.tsx - Enhanced with beautiful design
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Star,
  Heart,
  Share2,
  MoreVertical,
  Download,
  Filter,
  RefreshCw,
  Eye,
  MessageCircle,
  Activity,
  Award,
  Zap,
  Target,
  BarChart,
  PieChart,
  LineChart
} from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  farmer: {
    farmName: string;
  };
  items?: number;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeProducts: number;
  completedOrders: number;
  cancellationRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router, timeframe])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch recent orders
      const ordersResponse = await fetch(`/api/orders?limit=5&timeframe=${timeframe}`)
      const ordersData = await ordersResponse.json()
      setOrders(ordersData.orders || [])
      
      // Fetch stats
      const statsResponse = await fetch(`/api/dashboard/stats?timeframe=${timeframe}`)
      const statsData = await statsResponse.json()
      setStats(statsData)
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 dark:from-green-900/30 dark:to-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800'
      case 'PROCESSING':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
      case 'SHIPPED':
        return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 dark:from-blue-900/30 dark:to-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800'
      case 'CONFIRMED':
        return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 dark:from-purple-900/30 dark:to-purple-900/20 dark:text-purple-200 border-purple-200 dark:border-purple-800'
      case 'CANCELLED':
        return 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 dark:from-red-900/30 dark:to-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800'
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 dark:from-gray-900/30 dark:to-gray-900/20 dark:text-gray-200 border-gray-200 dark:border-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-3 h-3" />
      case 'PROCESSING':
        return <Clock className="w-3 h-3" />
      case 'SHIPPED':
        return <Truck className="w-3 h-3" />
      case 'CANCELLED':
        return <XCircle className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  const statsData = [
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500',
      bgGlow: 'from-emerald-500/20 to-green-500/20',
      description: 'vs last month'
    },
    {
      title: 'Total Orders',
      value: (stats?.totalOrders || 0).toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-500',
      bgGlow: 'from-blue-500/20 to-indigo-500/20',
      description: 'vs last month'
    },
    {
      title: 'Active Products',
      value: (stats?.activeProducts || 0).toLocaleString(),
      change: stats?.activeProducts ? '+2' : '0',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      bgGlow: 'from-purple-500/20 to-pink-500/20',
      description: 'active listings'
    },
    {
      title: 'Pending Orders',
      value: (stats?.pendingOrders || 0).toLocaleString(),
      change: '-3.2%',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgGlow: 'from-orange-500/20 to-red-500/20',
      description: 'need attention'
    }
  ]

  const secondaryStats = [
    {
      label: 'Avg. Order Value',
      value: `$${(stats?.averageOrderValue || 0).toLocaleString()}`,
      icon: BarChart,
      change: '+5.2%'
    },
    {
      label: 'Customer Satisfaction',
      value: `${stats?.customerSatisfaction || 4.8}/5.0`,
      icon: Star,
      change: '+0.3'
    },
    {
      label: 'Completion Rate',
      value: `${((stats?.completedOrders || 0) / (stats?.totalOrders || 1) * 100).toFixed(0)}%`,
      icon: Target,
      change: '+2.1%'
    },
    {
      label: 'Cancellation Rate',
      value: `${(stats?.cancellationRate || 0).toFixed(1)}%`,
      icon: AlertCircle,
      change: '-0.5%'
    }
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Banner with Gradient */}

{/* Welcome Banner with Gradient - Fixed version without problematic SVG */}
<div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-emerald-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
  {/* Simple background pattern instead of SVG */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse delay-1000"></div>
  </div>
  
  <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
    {/* Rest of your content remains the same */}
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
          <span className="text-2xl">
            {session?.user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <p className="text-sm text-white/80">Welcome back,</p>
          <h1 className="text-2xl lg:text-3xl font-bold">{session?.user?.name}</h1>
        </div>
      </div>
      <p className="text-white/90 mt-2 max-w-md">
        {session?.user?.role === 'FARMER' 
          ? '🎉 Your farm is thriving! Here\'s your business at a glance.'
          : '🎯 Track your orders and discover amazing fresh produce from local farmers.'}
      </p>
    </div>
    
    {/* Rest of your buttons remain the same */}
  </div>
</div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div 
            key={stat.title} 
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/80 border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => (
          <Card key={stat.label} className="p-4 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Recent Orders Section */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Recent Orders
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest {orders.length} orders
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
            <Link href="/products">
              <Button className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Farmer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors group">
                    <td className="py-3 px-4">
                      <Link href={`/dashboard/orders/${order.id}`} className="font-mono text-sm text-primary hover:underline">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {order.farmer?.farmName?.charAt(0) || 'F'}
                          </span>
                        </div>
                        <span className="text-sm">{order.farmer?.farmName || 'Unknown Farmer'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{order.items || 3} items</td>
                    <td className="py-3 px-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-muted rounded transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded transition-colors" title="Contact Farmer">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-muted rounded transition-colors" title="Track Order">
                          <Truck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {session?.user?.role === 'FARMER' ? (
              <>
                <Link href="/dashboard/farmer/products/new">
                  <Button className="w-full justify-start bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90">
                    <Package className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </Link>
                <Link href="/dashboard/farmer/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Manage Orders
                  </Button>
                </Link>
                <Link href="/dashboard/farmer/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/dashboard/farmer/earnings">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Earnings Report
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/products">
                  <Button className="w-full justify-start bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Browse Products
                  </Button>
                </Link>
                <Link href="/dashboard/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    My Favorites
                  </Button>
                </Link>
                <Link href="/dashboard/reviews">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>

        {/* Activity Insights */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Activity Insights
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Order Completion</span>
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {stats?.completedOrders || 0}/{stats?.totalOrders || 0}
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${((stats?.completedOrders || 0) / (stats?.totalOrders || 1) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {((stats?.completedOrders || 0) / (stats?.totalOrders || 1) * 100).toFixed(0)}% completion rate
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Customer Rating</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <div className="text-2xl font-bold mb-2">{stats?.customerSatisfaction || 4.8}/5.0</div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(stats?.customerSatisfaction || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on {stats?.totalOrders || 0} orders
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Pro Tip</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.role === 'FARMER' 
                      ? 'List your seasonal products to attract more customers this month!'
                      : 'Complete your profile to get personalized product recommendations!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}