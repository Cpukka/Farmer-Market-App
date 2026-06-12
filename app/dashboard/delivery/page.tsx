// app/dashboard/farmer/delivery/page.tsx
'use client'

import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package,
  Phone,
  Mail,
  Navigation,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface Delivery {
  id: string
  orderId: string
  customerName: string
  customerAddress: string
  customerPhone: string
  items: number
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'
  estimatedDelivery: string
  actualDelivery?: string
  specialInstructions?: string
}

export default function DeliveryPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - replace with API call
  const deliveries: Delivery[] = [
    {
      id: 'DEL-001',
      orderId: 'ORD-12345',
      customerName: 'Sarah Johnson',
      customerAddress: '123 Main St, Springfield, IL 62701',
      customerPhone: '(555) 123-4567',
      items: 5,
      status: 'in_transit',
      estimatedDelivery: '2024-01-16T14:00:00',
      specialInstructions: 'Leave at back door'
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-12346',
      customerName: 'Michael Chen',
      customerAddress: '456 Oak Ave, Springfield, IL 62702',
      customerPhone: '(555) 234-5678',
      items: 3,
      status: 'pending',
      estimatedDelivery: '2024-01-16T16:30:00'
    },
    {
      id: 'DEL-003',
      orderId: 'ORD-12347',
      customerName: 'Emma Wilson',
      customerAddress: '789 Pine Rd, Springfield, IL 62703',
      customerPhone: '(555) 345-6789',
      items: 8,
      status: 'delivered',
      estimatedDelivery: '2024-01-15T10:00:00',
      actualDelivery: '2024-01-15T09:45:00'
    },
    {
      id: 'DEL-004',
      orderId: 'ORD-12348',
      customerName: 'James Brown',
      customerAddress: '321 Elm St, Springfield, IL 62704',
      customerPhone: '(555) 456-7890',
      items: 2,
      status: 'confirmed',
      estimatedDelivery: '2024-01-17T11:00:00'
    }
  ]

  const getStatusBadge = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock, text: 'Pending' }
      case 'confirmed':
        return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: CheckCircle, text: 'Confirmed' }
      case 'in_transit':
        return { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: Truck, text: 'In Transit' }
      case 'delivered':
        return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, text: 'Delivered' }
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, text: 'Cancelled' }
    }
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesFilter = filter === 'all' || delivery.status === filter
    const matchesSearch = delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: deliveries.length,
    inTransit: deliveries.filter(d => d.status === 'in_transit').length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    todayDeliveries: deliveries.filter(d => {
      const today = new Date().toDateString()
      const deliveryDate = new Date(d.estimatedDelivery).toDateString()
      return deliveryDate === today
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your product deliveries
          </p>
        </div>
        <Button className="gap-2 bg-linear-to-r from-primary to-emerald-600">
          <Navigation className="w-4 h-4" />
          Optimize Route
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <p className="text-sm text-muted-foreground mt-1">Total Deliveries</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.inTransit}</div>
          <p className="text-sm text-muted-foreground mt-1">In Transit</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <p className="text-sm text-muted-foreground mt-1">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          <p className="text-sm text-muted-foreground mt-1">Delivered</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.todayDeliveries}</div>
          <p className="text-sm text-muted-foreground mt-1">Today's Schedule</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-2 focus:outline-primary/20"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'in_transit', 'delivered'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status === 'in_transit' ? 'In Transit' : status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <Card className="p-12 text-center">
          <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No deliveries found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try a different search term' : 'No deliveries scheduled'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => {
            const StatusBadge = getStatusBadge(delivery.status)
            const estimatedTime = new Date(delivery.estimatedDelivery)
            const isToday = estimatedTime.toDateString() === new Date().toDateString()
            
            return (
              <Card key={delivery.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Delivery Status Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${StatusBadge.color.replace('text-', 'bg-').replace('dark:', '')}20`}>
                      <StatusBadge.icon className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{delivery.customerName}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${StatusBadge.color}`}>
                            <StatusBadge.icon className="w-3 h-3" />
                            {StatusBadge.text}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Order #{delivery.orderId}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/delivery/${delivery.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Track
                          </Button>
                        </Link>
                        {delivery.status === 'pending' && (
                          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Address */}
                      <div className="flex gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Delivery Address</p>
                          <p className="text-sm text-muted-foreground">{delivery.customerAddress}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Contact Number</p>
                          <p className="text-sm text-muted-foreground">{delivery.customerPhone}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex gap-2">
                        <Package className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Items</p>
                          <p className="text-sm text-muted-foreground">{delivery.items} products</p>
                        </div>
                      </div>

                      {/* Delivery Time */}
                      <div className="flex gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            {delivery.status === 'delivered' ? 'Delivered' : 'Estimated Delivery'}
                          </p>
                          <p className={`text-sm ${isToday && delivery.status !== 'delivered' ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                            {estimatedTime.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })} at {estimatedTime.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit' 
                            })}
                            {isToday && delivery.status !== 'delivered' && ' (Today)'}
                          </p>
                          {delivery.actualDelivery && (
                            <p className="text-xs text-green-600">
                              Delivered at {new Date(delivery.actualDelivery).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {delivery.specialInstructions && (
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Special Instructions</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">{delivery.specialInstructions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}