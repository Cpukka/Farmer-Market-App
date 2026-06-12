// app/favorites/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import FavoriteButton from '../../components/products/FavoriteButton'
import {
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  Package,
  Star,
  Truck
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FavoriteProduct {
  id: string
  name: string
  price: number
  unit: string
  images: string[]
  category: string
  avgRating: number | null
  stock: number
  farmer: {
    farmName: string
    image: string | null
  }
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFavorites()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/favorites/products')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="text-muted-foreground mb-6">
          Sign in to save your favorite products and farmers
        </p>
        <Link href="/auth/signin?callbackUrl=/favorites">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <Card className="text-center p-12">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Save products you love by clicking the heart icon
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={product.images[0] || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <FavoriteButton productId={product.id} size="sm" />
                </div>
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm">
                      {product.avgRating?.toFixed(1) || 'New'}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg font-bold text-primary mb-2">
                  ${product.price.toFixed(2)}/{product.unit}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Truck className="w-4 h-4" />
                  <span>{product.farmer.farmName}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button className="shrink-0">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {favorites.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.farmer.farmName} • {product.category}
                      </p>
                    </div>
                    <FavoriteButton productId={product.id} size="sm" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xl font-bold text-primary">
                        ${product.price.toFixed(2)}/{product.unit}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{product.avgRating?.toFixed(1) || 'No ratings'}</span>
                        <span>•</span>
                        <span>{product.stock} in stock</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {favorites.length > 0 && (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Love what you see?</h3>
          <p className="text-muted-foreground mb-4">
            Add more items to your favorites or start shopping
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/products">
              <Button variant="outline">Browse More Products</Button>
            </Link>
            <Link href="/cart">
              <Button>
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}