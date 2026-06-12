// app/dashboard/farmer/analytics/page.tsx
'use client'

import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  Filter,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock,
  Target
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '12m'>('30d')

  // Mock data - replace with API call
  const metrics = {
    revenue: {
      current: 12450,
      previous: 10890,
      growth: 14.3
    },
    orders: {
      current: 342,
      previous: 298,
      growth: 14.8
    },
    customers: {
      current: 156,
      previous: 128,
      growth: 21.9
    },
    products: {
      current: 24,
      previous: 18,
      growth: 33.3
    }
  }

  const topProducts = [
    { name: 'Organic Tomatoes', sales: 234, revenue: 1245.50, growth: 23 },
    { name: 'Fresh Eggs', sales: 189, revenue: 1125.00, growth: 15 },
    { name: 'Raw Honey', sales: 156, revenue: 2025.00, growth: 42 },
    { name: 'Grass-fed Beef', sales: 98, revenue: 2450.00, growth: 8 }
  ]

  const categories = [
    { name: 'Vegetables', revenue: 4560, percentage: 36 },
    { name: 'Meat', revenue: 3240, percentage: 26 },
    { name: 'Dairy', revenue: 2450, percentage: 19 },
    { name: 'Honey', revenue: 2100, percentage: 17 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your farm's performance and growth metrics
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border p-1">
            {(['7d', '30d', '90d', '12m'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeframe === t 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                {t === '12m' ? '12M' : t}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-primary opacity-50" />
            <div className={`flex items-center gap-1 ${metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.revenue.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(metrics.revenue.growth)}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">${metrics.revenue.current.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">vs ${metrics.revenue.previous.toLocaleString()} previous period</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600 opacity-50" />
            <div className={`flex items-center gap-1 ${metrics.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.orders.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(metrics.orders.growth)}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold mt-1">{metrics.orders.current.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">vs {metrics.orders.previous} previous period</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600 opacity-50" />
            <div className={`flex items-center gap-1 ${metrics.customers.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.customers.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(metrics.customers.growth)}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Active Customers</p>
          <p className="text-2xl font-bold mt-1">{metrics.customers.current}</p>
          <p className="text-xs text-muted-foreground mt-2">vs {metrics.customers.previous} previous period</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-emerald-600 opacity-50" />
            <div className={`flex items-center gap-1 ${metrics.products.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.products.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(metrics.products.growth)}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Active Products</p>
          <p className="text-2xl font-bold mt-1">{metrics.products.current}</p>
          <p className="text-xs text-muted-foreground mt-2">vs {metrics.products.previous} previous period</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <LineChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive revenue chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">Showing {timeframe} revenue data</p>
            </div>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Category</h2>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{category.name}</span>
                  <span className="font-semibold">${category.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{category.percentage}% of total</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t text-center">
            <Button variant="outline" size="sm">View Detailed Analysis</Button>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Top Performing Products</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Units Sold</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Growth</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.name} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-right">{product.sales} units</td>
                  <td className="py-3 px-4 text-right font-semibold">${product.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {product.growth}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <p className="text-xl font-bold">4.8/5.0</p>
              <p className="text-xs text-green-600">↑ 0.3 from last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
              <p className="text-xl font-bold">2.4 days</p>
              <p className="text-xs text-green-600">↓ 0.5 days faster</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-xl font-bold">3.2%</p>
              <p className="text-xs text-green-600">↑ 0.4% improvement</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-sm text-muted-foreground">Repeat Customers</p>
              <p className="text-xl font-bold">68%</p>
              <p className="text-xs text-green-600">↑ 5% retention</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}