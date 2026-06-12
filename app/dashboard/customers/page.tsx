// app/dashboard/farmer/customers/page.tsx
'use client'

import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronDown,
  MessageCircle,
  Download,
  Award
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  averageRating: number
  joinDate: string
  lastOrderDate: string
  favorites: number
  status: 'active' | 'inactive' | 'new'
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'spent' | 'orders'>('recent')

  // Mock data - replace with API call
  const customers: Customer[] = [
    {
      id: 'CUST-001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      location: 'Springfield, IL',
      totalOrders: 12,
      totalSpent: 487.50,
      averageRating: 4.8,
      joinDate: '2023-06-15',
      lastOrderDate: '2024-01-14',
      favorites: 5,
      status: 'active'
    },
    {
      id: 'CUST-002',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '(555) 234-5678',
      location: 'Springfield, IL',
      totalOrders: 8,
      totalSpent: 324.25,
      averageRating: 4.9,
      joinDate: '2023-08-22',
      lastOrderDate: '2024-01-12',
      favorites: 3,
      status: 'active'
    },
    {
      id: 'CUST-003',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '(555) 345-6789',
      location: 'Springfield, IL',
      totalOrders: 15,
      totalSpent: 892.75,
      averageRating: 5.0,
      joinDate: '2023-04-10',
      lastOrderDate: '2024-01-15',
      favorites: 8,
      status: 'active'
    },
    {
      id: 'CUST-004',
      name: 'James Brown',
      email: 'james@example.com',
      phone: '(555) 456-7890',
      location: 'Springfield, IL',
      totalOrders: 3,
      totalSpent: 156.00,
      averageRating: 4.5,
      joinDate: '2023-12-01',
      lastOrderDate: '2024-01-10',
      favorites: 1,
      status: 'new'
    }
  ]

  const filteredCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent
      return b.totalOrders - a.totalOrders
    })

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    newCustomers: customers.filter(c => c.status === 'new').length,
    averageSpent: customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length,
    totalRevenue: customers.reduce((acc, c) => acc + c.totalSpent, 0),
    loyaltyCustomers: customers.filter(c => c.totalOrders >= 10).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and connect with your loyal customers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export List
          </Button>
          <Button className="gap-2 bg-linear-to-r from-primary to-emerald-600">
            <Mail className="w-4 h-4" />
            Send Newsletter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalCustomers}</div>
          <p className="text-sm text-muted-foreground mt-1">Total Customers</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeCustomers}</div>
          <p className="text-sm text-muted-foreground mt-1">Active</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.newCustomers}</div>
          <p className="text-sm text-muted-foreground mt-1">New (30d)</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.loyaltyCustomers}</div>
          <p className="text-sm text-muted-foreground mt-1">Loyal Customers</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">${stats.averageSpent.toFixed(0)}</div>
          <p className="text-sm text-muted-foreground mt-1">Avg. Spent</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers by name, email, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-2 focus:outline-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-lg bg-background focus:outline-2 focus:outline-primary/20"
            >
              <option value="recent">Most Recent</option>
              <option value="spent">Highest Spent</option>
              <option value="orders">Most Orders</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No customers found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Customer Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center">
                    {customer.avatar ? (
                      <Image
                        src={customer.avatar}
                        alt={customer.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {customer.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{customer.name}</h3>
                        {customer.totalOrders >= 10 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs rounded-full">
                            <Award className="w-3 h-3" />
                            Loyal
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Customer since {new Date(customer.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-2 text-primary">
                        <UserPlus className="w-4 h-4" />
                        Offer Deal
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm">{customer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Order</p>
                        <p className="text-sm">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                      <p className="text-xl font-bold">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="text-xl font-bold text-green-600">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-xl font-bold">{customer.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}