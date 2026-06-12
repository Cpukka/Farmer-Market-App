// app/dashboard/farmer/earnings/page.tsx
'use client'

import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  ChevronDown,
  Wallet,
  Banknote,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Send
} from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  type: 'sale' | 'withdrawal' | 'refund'
  orderId?: string
}

interface EarningSummary {
  totalEarnings: number
  pendingEarnings: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  totalWithdrawn: number
  availableBalance: number
}

export default function EarningsPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month')
  const [selectedPeriod, setSelectedPeriod] = useState('this-month')

  // Mock data - replace with API call
  const summary: EarningSummary = {
    totalEarnings: 12450.75,
    pendingEarnings: 2340.50,
    thisMonthEarnings: 4560.25,
    lastMonthEarnings: 3890.00,
    totalWithdrawn: 8500.00,
    availableBalance: 3950.75
  }

  const transactions: Transaction[] = [
    {
      id: 'TRX-001',
      date: '2024-01-15',
      description: 'Order #12345 - Organic Tomatoes',
      amount: 245.50,
      status: 'completed',
      type: 'sale',
      orderId: '12345'
    },
    {
      id: 'TRX-002',
      date: '2024-01-14',
      description: 'Order #12344 - Fresh Eggs (12 doz)',
      amount: 187.25,
      status: 'completed',
      type: 'sale',
      orderId: '12344'
    },
    {
      id: 'TRX-003',
      date: '2024-01-12',
      description: 'Withdrawal to Bank Account',
      amount: -500.00,
      status: 'completed',
      type: 'withdrawal'
    },
    {
      id: 'TRX-004',
      date: '2024-01-10',
      description: 'Order #12340 - Raw Honey (15 jars)',
      amount: 324.00,
      status: 'pending',
      type: 'sale',
      orderId: '12340'
    },
    {
      id: 'TRX-005',
      date: '2024-01-08',
      description: 'Refund - Order #12338',
      amount: -45.99,
      status: 'completed',
      type: 'refund',
      orderId: '12338'
    }
  ]

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'sale':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'withdrawal':
        return <Send className="w-4 h-4 text-blue-600" />
      case 'refund':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const calculateGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(growth).toFixed(1),
      isPositive: growth > 0
    }
  }

  const monthlyGrowth = calculateGrowth(summary.thisMonthEarnings, summary.lastMonthEarnings)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-muted-foreground mt-1">
            Track your sales, withdrawals, and total revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-linear-to-r from-primary to-emerald-600">
            <Wallet className="w-4 h-4" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-linear-to-br from-primary/5 to-emerald-600/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-4xl font-bold mt-1">${summary.availableBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Earnings</p>
              <p className="font-semibold">${summary.totalEarnings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Pending</p>
              <p className="font-semibold text-yellow-600">${summary.pendingEarnings.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Withdrawn</p>
              <p className="font-semibold">${summary.totalWithdrawn.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold mt-1">${summary.thisMonthEarnings.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-1 ${monthlyGrowth.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyGrowth.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{monthlyGrowth.percentage}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">vs last month (${summary.lastMonthEarnings.toLocaleString()})</p>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-xl font-bold mt-1">$8,450.25</p>
            </div>
            <Banknote className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Order</p>
              <p className="text-xl font-bold mt-1">$48.50</p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Payouts</p>
              <p className="text-xl font-bold mt-1 text-yellow-600">${summary.pendingEarnings.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold mt-1">342</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Earnings Chart Placeholder */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Earnings Overview</h2>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((t) => (
              <Button
                key={t}
                variant={timeframe === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive chart will be displayed here</p>
            <p className="text-sm text-muted-foreground">Showing {timeframe}ly earnings data</p>
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
               </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm">{transaction.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(transaction.type)}
                      <span className="text-sm capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" className="gap-2">
            View All Transactions
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}