// app/dashboard/products/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  ChevronDown,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  stock: number
  status: 'active' | 'draft' | 'out_of_stock'
  createdAt: string
  totalSales: number
  rating: number
  reviews: number
}

export default function ProductsPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'out_of_stock'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Mock data - replace with API call
  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      description: 'Fresh organic tomatoes grown without pesticides',
      price: 3.99,
      originalPrice: 4.99,
      category: 'Vegetables',
      image: '/images/products/tomatoes.jpg',
      stock: 50,
      status: 'active',
      createdAt: '2024-01-01',
      totalSales: 234,
      rating: 4.8,
      reviews: 45
    },
    {
      id: '2',
      name: 'Fresh Eggs',
      description: 'Farm-fresh eggs from free-range chickens',
      price: 5.99,
      category: 'Dairy & Eggs',
      image: '/images/products/eggs.jpg',
      stock: 30,
      status: 'active',
      createdAt: '2024-01-05',
      totalSales: 189,
      rating: 4.9,
      reviews: 67
    },
    {
      id: '3',
      name: 'Raw Honey',
      description: 'Pure raw honey from local flowers',
      price: 12.99,
      originalPrice: 15.99,
      category: 'Sweeteners',
      image: '/images/products/honey.jpg',
      stock: 0,
      status: 'out_of_stock',
      createdAt: '2024-01-10',
      totalSales: 156,
      rating: 4.7,
      reviews: 34
    },
    {
      id: '4',
      name: 'Grass-fed Beef',
      description: 'Premium grass-fed beef from local farm',
      price: 24.99,
      category: 'Meat',
      image: '/images/products/beef.jpg',
      stock: 15,
      status: 'active',
      createdAt: '2024-01-12',
      totalSales: 98,
      rating: 4.9,
      reviews: 23
    }
  ]

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle, text: 'Active' }
      case 'draft':
        return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: AlertCircle, text: 'Draft' }
      case 'out_of_stock':
        return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: XCircle, text: 'Out of Stock' }
    }
  }

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalSales: products.reduce((acc, p) => acc + p.totalSales, 0),
    totalRevenue: products.reduce((acc, p) => acc + (p.totalSales * p.price), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product listings and inventory
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2 bg-linear-to-r from-primary to-emerald-600">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats.activeProducts}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold mt-1">{stats.totalSales}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-2 focus:outline-primary/20"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border rounded-lg bg-background focus:outline-2 focus:outline-primary/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background focus:outline-2 focus:outline-primary/20"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first product'}
          </p>
          {!searchTerm && (
            <Link href="/dashboard/products/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const StatusBadge = getStatusBadge(product.status)
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all group">
                {/* Product Image */}
                <div className="relative h-48 bg-muted">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${StatusBadge.color}`}>
                      <StatusBadge.icon className="w-3 h-3" />
                      {StatusBadge.text}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${product.id}`} className="hover:underline flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                    </Link>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Stock: {product.stock} units
                    </span>
                    <span className="text-muted-foreground">
                      Sold: {product.totalSales}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Link href={`/dashboard/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
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

// Add missing import
import { Star } from 'lucide-react'