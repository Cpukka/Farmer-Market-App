// app/page.tsx - Enhanced Homepage
'use client'

import { useState, useEffect } from 'react'
import FarmerCard from './components/ui/FarmerCard'
import ProductCard from './components/ui/ProductCard'
import SearchBar from './components/ui/SearchBar'
import { Button } from './components/ui/Button'
import { ArrowRight, Leaf, Truck, Shield, Star, UserPlus, Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual API calls
const featuredFarmers = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: 'Springfield, CA',
    rating: 4.8,
    image: '/images/farmers/farm1.jpg',
    description: 'Organic vegetables and fruits',
    products: ['Vegetables', 'Fruits', 'Herbs'],
    totalProducts: 24,
    totalReviews: 128
  },
  {
    id: 2,
    name: 'Sunny Meadows',
    location: 'Riverside, TX',
    rating: 4.9,
    image: '/images/farmers/farm2.jpg',
    description: 'Fresh dairy and eggs',
    products: ['Dairy', 'Eggs', 'Honey'],
    totalProducts: 18,
    totalReviews: 94
  },
  {
    id: 3,
    name: 'Heritage Farm',
    location: 'Willow Creek, OR',
    rating: 4.7,
    image: '/images/farmers/farm3.jpg',
    description: 'Grass-fed beef and poultry',
    products: ['Meat', 'Poultry', 'Eggs'],
    totalProducts: 32,
    totalReviews: 156
  }
]

const featuredProducts = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 3.99,
    unit: 'lb',
    image: '/images/products/tomatoes.jpg',
    farmer: 'Green Valley Farm',
    farmerId: 'farm-green-valley',
    category: 'Vegetables',
    rating: 4.5,
    stock: 50,
    isFavorite: false
  },
  {
    id: 2,
    name: 'Fresh Eggs',
    price: 5.99,
    unit: 'dozen',
    image: '/images/products/eggs.jpg',
    farmer: 'Sunny Meadows',
    farmerId: 'farm-sunny-meadows',
    category: 'Dairy & Eggs',
    rating: 4.8,
    stock: 30,
    isFavorite: true
  },
  {
    id: 3,
    name: 'Honey Jar',
    price: 12.99,
    unit: '16oz',
    image: '/images/products/honey.jpg',
    farmer: 'Sunny Meadows',
    farmerId: 'farm-sunny-meadows',
    category: 'Sweeteners',
    rating: 4.9,
    stock: 20,
    isFavorite: false
  },
  {
    id: 4,
    name: 'Grass-fed Beef',
    price: 24.99,
    unit: 'lb',
    image: '/images/products/beef.jpg',
    farmer: 'Heritage Farm',
    farmerId: 'farm-heritage',
    category: 'Meat',
    rating: 4.7,
    stock: 15,
    isFavorite: true
  }
]

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Home Cook',
    content: 'The quality of produce is outstanding! I love supporting local farmers and getting fresh food delivered to my door.',
    rating: 5,
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Restaurant Owner',
    content: 'As a chef, ingredient quality is everything. FarmConnect delivers the freshest produce directly from trusted local farms.',
    rating: 5,
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Health Enthusiast',
    content: 'Knowing exactly where my food comes from gives me peace of mind. The farmers are amazing and their stories inspire me!',
    rating: 5,
    avatar: 'EW'
  }
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState({
    farmers: 156,
    products: 1248,
    customers: 12500,
    orders: 34500
  })

  // Fetch stats on mount (mock for now)
  useEffect(() => {
    // In real implementation, fetch from API
    // fetch('/api/stats').then(...)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // In real implementation, navigate to search results
    if (query.trim()) {
      // router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-linear-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20" />
        <div className="relative text-center py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Fresh from{' '}
              <span className="text-primary bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                Farm
              </span>{' '}
              to Your{' '}
              <span className="text-primary bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
                Table
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect directly with local farmers. Buy fresh, organic produce while supporting your local community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="gap-2 bg-green-600 hover:bg-green-700">
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/become-farmer">
                <Button size="lg" variant="outline" className="gap-2 border-green-600 text-green-600 hover:bg-green-50">
                  <UserPlus className="w-5 h-5" />
                  Become a Farmer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-6 text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{stats.farmers.toLocaleString()}+</div>
          <p className="text-sm text-muted-foreground">Local Farmers</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{stats.products.toLocaleString()}+</div>
          <p className="text-sm text-muted-foreground">Fresh Products</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{stats.customers.toLocaleString()}+</div>
          <p className="text-sm text-muted-foreground">Happy Customers</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2">{stats.orders.toLocaleString()}+</div>
          <p className="text-sm text-muted-foreground">Orders Delivered</p>
        </div>
      </div>

      {/* Search Section */}
      <section>
        <div className="max-w-2xl mx-auto">
          <SearchBar 
            placeholder="Search for fresh produce, farmers, or categories..."
            value={searchQuery}
            onChange={handleSearch}
            onSearch={() => {
              if (searchQuery.trim()) {
                // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
              }
            }}
          />
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button variant="ghost" size="sm" className="text-xs">
              🥦 Vegetables
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              🍓 Fruits
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              🥚 Dairy & Eggs
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              🥩 Meat
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              🍯 Honey & Spreads
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center hover:shadow-lg hover:scale-[1.02] transition-transform">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">100% Organic & Local</h3>
          <p className="text-muted-foreground">All products are certified organic and sourced directly from local farms</p>
        </div>
        <div className="card p-6 text-center hover:shadow-lg hover:scale-[1.02] transition-transform">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast Fresh Delivery</h3>
          <p className="text-muted-foreground">Farm-fresh deliveries within 24 hours. Straight from harvest to your door</p>
        </div>
        <div className="card p-6 text-center hover:shadow-lg hover:scale-[1.02] transition-transform">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure & Easy Payments</h3>
          <p className="text-muted-foreground">Safe transactions with multiple payment options. Your security is our priority</p>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Fresh picks from our local farmers</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/become-farmer">
            <Button variant="ghost" className="gap-2 text-green-600 hover:text-green-700">
              <UserPlus className="w-4 h-4" />
              Sell your products on FarmConnect
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Farmers */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Meet Our Farmers</h2>
            <p className="text-muted-foreground">Connect directly with the people who grow your food</p>
          </div>
          <Link href="/farmers">
            <Button variant="outline" className="gap-2">
              View All Farmers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFarmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/become-farmer">
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4" />
              Join as a Farmer
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">How FarmConnect Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Browse & Select</h3>
              <p className="text-muted-foreground">
                Explore fresh products from local farmers in your area
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Order & Pay</h3>
              <p className="text-muted-foreground">
                Add to cart and checkout securely with multiple payment options
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Receive Fresh</h3>
              <p className="text-muted-foreground">
                Get farm-fresh delivery or schedule pickup. Enjoy quality produce!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">What Our Community Says</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="font-semibold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Become Farmer CTA */}
      <section className="bg-linear-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Farm Business?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are increasing their profits and building direct relationships with customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-farmer">
              <Button size="lg" className="bg-white text-green-700 hover:bg-white/90 gap-2">
                <UserPlus className="w-5 h-5" />
                Apply as a Farmer
              </Button>
            </Link>
            <Link href="/farmers">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn About Our Farmers
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-semibold">0% Platform Fees</p>
              <p className="text-white/70">First 3 months</p>
            </div>
            <div>
              <p className="font-semibold">Marketing Support</p>
              <p className="text-white/70">Reach more customers</p>
            </div>
            <div>
              <p className="font-semibold">Easy Setup</p>
              <p className="text-white/70">Get started in minutes</p>
            </div>
            <div>
              <p className="font-semibold">Weekly Payments</p>
              <p className="text-white/70">Get paid on time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-2xl mx-auto text-center border rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-4">Stay Fresh & Updated</h3>
        <p className="text-muted-foreground mb-6">
          Get weekly updates on new farmers, seasonal products, and exclusive offers
        </p>
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button type="submit" className="gap-2">
            <Heart className="w-4 h-4" />
            Subscribe
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          By subscribing, you agree to our Privacy Policy. No spam, ever.
        </p>
      </section>
    </div>
  )
}