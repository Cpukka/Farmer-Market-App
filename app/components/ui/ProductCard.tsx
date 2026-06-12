// app/components/ui/ProductCard.tsx - Updated with FavoriteButton
'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Eye, Check, Heart } from 'lucide-react'
import { Button } from './Button'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../../contexts/CartContext'
import FavoriteButton from '../products/FavoriteButton'

interface ProductCardProps {
  product: {
    id: number | string
    name: string
    price: number
    unit: string
    image: string
    farmer: string
    category: string
    rating: number
    stock?: number
    farmerId?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    try {
      // Prepare the cart item
      const cartItem = {
        productId: product.id.toString(),
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        farmerId: product.farmerId || `farm-${product.farmer.toLowerCase().replace(/\s+/g, '-')}`,
        farmerName: product.farmer,
        quantity: 1,
        stock: product.stock || 100,
      }

      console.log('🛒 Adding to cart:', cartItem)
      
      // Add to cart using CartContext
      await addItem(cartItem)
      
      // Show success feedback
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
      
    } catch (error) {
      console.error('❌ Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative">
      {/* Favorite Button - Top Right */}
      <div className="absolute top-3 right-3 z-20">
        <FavoriteButton 
          productId={product.id.toString()} 
          size="sm" 
        />
      </div>

      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        {/* Farmer Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/40 to-transparent p-4 pt-8">
          <p className="text-white text-sm font-medium">{product.farmer}</p>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Product Name & Rating */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{product.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
              <span className="mr-2">{product.rating.toFixed(1)}</span>
              <span className="text-xs">•</span>
              <span className="ml-2">{product.stock || 100} in stock</span>
            </div>
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)} 
            <span className="text-sm text-muted-foreground ml-1">/{product.unit}</span>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 gap-2" 
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Link href={`/products/${product.id}`}>
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}