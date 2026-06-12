'use client'

import { useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '../../components/ui/Button'
import { ReviewCard } from '../../components/reviews/ReviewCard'
import { StarRating } from '../../components/ui/StarRating'
import { ProductReviews } from '@/app/components/products/ProductReviews'
import { 
  Star, 
  Truck, 
  Shield, 
  Leaf, 
  Clock, 
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  MapPin,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with API call
const product = {
  id: 1,
  name: 'Organic Tomatoes',
  price: 3.99,
  unit: 'lb',
  image: '/images/products/tomatoes.jpg',
  farmer: {
    id: 1,
    name: 'Green Valley Farm',
    location: 'Springfield, CA',
    rating: 4.8
  },
  category: 'Vegetables',
  rating: 4.5,
  totalReviews: 89,
  description: 'Fresh, ripe organic tomatoes grown using sustainable farming practices. Picked at peak ripeness for maximum flavor and nutrition.',
  details: [
    'Certified organic',
    'Non-GMO',
    'Pesticide-free',
    'Heirloom variety',
    'Rich in lycopene and vitamin C'
  ],
  storage: 'Store at room temperature away from direct sunlight. Refrigerate only when fully ripe.',
  nutrition: 'High in vitamins A, C, and K, potassium, and antioxidants.',
  images: [
    '/images/products/tomatoes.jpg',
    '/images/products/tomatoes2.jpg',
    '/images/products/tomatoes3.jpg'
  ],
  stock: 50,
  minOrder: 1,
  maxOrder: 20
}

const relatedProducts = [
  {
    id: 2,
    name: 'Organic Cherry Tomatoes',
    price: 4.99,
    unit: 'pint',
    image: '/images/products/cherry-tomatoes.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Organic Basil',
    price: 2.99,
    unit: 'bunch',
    image: '/images/products/basil.jpg',
    farmer: 'Green Valley Farm',
    category: 'Herbs',
    rating: 4.8
  },
  {
    id: 4,
    name: 'Organic Garlic',
    price: 1.99,
    unit: 'bulb',
    image: '/images/products/garlic.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.6
  },
]

const reviews = [
  {
    id: 1,
    user: {
      name: 'Maria S.',
      avatar: '/images/avatars/default.jpg'
    },
    rating: 5,
    title: 'Best tomatoes ever!',
    comment: 'These were incredibly fresh and flavorful. Perfect for salads and sauces.',
    images: ['/images/products/tomatoes.jpg'],
    helpful: 12,
    verified: true,
    createdAt: '2024-01-15',
    productName: 'Organic Tomatoes'
  },
  {
    id: 2,
    user: {
      name: 'James K.',
      avatar: '/images/avatars/default.jpg'
    },
    rating: 4,
    title: 'Great quality',
    comment: 'Fresh eggs with bright orange yolks. Delivery was prompt.',
    images: [],
    helpful: 5,
    verified: true,
    createdAt: '2024-01-08',
    productName: 'Organic Tomatoes'
  },
  {
    id: 3,
    user: {
      name: 'Lisa M.',
      avatar: '/images/avatars/default.jpg'
    },
    rating: 5,
    title: 'Tastes like childhood',
    comment: 'Tastes just like tomatoes from my childhood garden! So much better than store-bought.',
    images: [],
    helpful: 8,
    verified: true,
    createdAt: '2024-01-05',
    productName: 'Organic Tomatoes'
  },
]

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = params
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // For demo purposes
  if (parseInt(id) > 10) {
    notFound()
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} ${product.unit} of ${product.name} to cart`)
    // Show success message, update cart context, etc.
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'storage', label: 'Storage' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'reviews', label: `Reviews (${product.totalReviews})` }
  ]

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/products/vegetables" className="hover:text-primary">Vegetables</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-foreground truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite 
                    ? 'bg-red-500/20 text-red-500' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full backdrop-blur-sm bg-white/20 text-white hover:bg-white/30">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index 
                    ? 'border-primary' 
                    : 'border-transparent hover:border-muted-foreground/50'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Farmer Info */}
          <Link 
            href={`/farmers/${product.farmer.id}`} 
            className="inline-flex items-center hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <span className="text-sm font-semibold text-primary">GV</span>
            </div>
            <div>
              <p className="font-medium">{product.farmer.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {product.farmer.location}
                <span className="mx-2">•</span>
                <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                {product.farmer.rating}
              </div>
            </div>
          </Link>

          {/* Product Title & Rating */}
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <StarRating rating={product.rating} size="md" readOnly />
                <span className="ml-2 font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.totalReviews} reviews)
                </span>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-4xl font-bold text-primary">
              ${product.price.toFixed(2)}
              <span className="text-lg text-muted-foreground ml-2">/{product.unit}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              In stock: {product.stock} {product.unit}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            <div className="space-y-2">
              {product.details.map((detail, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
          

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                    disabled={quantity <= product.minOrder}
                    className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.maxOrder, quantity + 1))}
                    disabled={quantity >= product.maxOrder}
                    className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Min: {product.minOrder} {product.unit} • Max: {product.maxOrder} {product.unit}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 gap-2"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="outline" 
                className="flex-1"
                size="lg"
              >
                Buy Now
              </Button>
            </div>

            <div className="text-sm">
              Total: <span className="font-semibold">${(product.price * quantity).toFixed(2)}</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center">
              <Truck className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-sm text-muted-foreground">On orders over $35</p>
              </div>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Quality Guarantee</p>
                <p className="text-sm text-muted-foreground">100% satisfaction</p>
              </div>
            </div>
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Certified Organic</p>
                <p className="text-sm text-muted-foreground">USDA approved</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Fresh Daily</p>
                <p className="text-sm text-muted-foreground">Harvested same day</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Tabs */}
      <div className="space-y-6">
        <div className="border-b">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 whitespace-nowrap font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>
            <div>
              <h4 className="font-semibold text-lg mb-2">Storage Instructions:</h4>
              <p className="text-muted-foreground">{product.storage}</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Nutritional Information:</h4>
              <p className="text-muted-foreground">{product.nutrition}</p>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Storage & Handling</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <p className="text-muted-foreground mb-4">{product.storage}</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Store at room temperature (65-75°F / 18-24°C)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Keep away from direct sunlight</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Refrigerate only when fully ripe to extend shelf life</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Best consumed within 5-7 days of delivery</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Nutrition Facts</h3>
            <div className="border rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Calories</span>
                  <span>18 kcal</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Protein</span>
                  <span>0.9g</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Carbohydrates</span>
                  <span>3.9g</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Fiber</span>
                  <span>1.2g</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Vitamin C</span>
                  <span>14 mg (23% DV)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Potassium</span>
                  <span>237 mg</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                *Percent Daily Values are based on a 2,000 calorie diet.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <StarRating rating={product.rating} size="md" readOnly />
                    <span className="ml-2 text-2xl font-bold">{product.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">/5</span>
                  </div>
                  <span className="text-muted-foreground">
                    Based on {product.totalReviews} reviews
                  </span>
                </div>
              </div>
              <Button onClick={() => router.push('/reviews')}>
                Write a Review
              </Button>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  compact 
                />
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => router.push('/reviews')}>
                View All Reviews
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div>
        <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">{relatedProduct.name}</h4>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-primary">
                    ${relatedProduct.price.toFixed(2)}
                    <span className="text-sm text-muted-foreground">/{relatedProduct.unit}</span>
                  </p>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}