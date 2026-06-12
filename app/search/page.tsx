'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import  ProductCard  from '../components/ui/ProductCard'
import  FarmerCard  from '../components/ui/FarmerCard'
import { 
  Search,
  Filter,
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Package,
  Users,
  Check
} from 'lucide-react'

// Mock data - replace with API calls
const allProducts = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 3.99,
    unit: 'lb',
    image: '/images/products/tomatoes.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Fresh Eggs',
    price: 5.99,
    unit: 'dozen',
    image: '/images/products/eggs.jpg',
    farmer: 'Sunny Meadows',
    category: 'Dairy & Eggs',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Honey Jar',
    price: 12.99,
    unit: '16oz',
    image: '/images/products/honey.jpg',
    farmer: 'Sunny Meadows',
    category: 'Sweeteners',
    rating: 4.9
  },
  {
    id: 4,
    name: 'Grass-fed Beef',
    price: 24.99,
    unit: 'lb',
    image: '/images/products/beef.jpg',
    farmer: 'Heritage Farm',
    category: 'Meat',
    rating: 4.7
  },
  {
    id: 5,
    name: 'Organic Kale',
    price: 2.99,
    unit: 'bunch',
    image: '/images/products/kale.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.3
  },
  {
    id: 6,
    name: 'Fresh Milk',
    price: 4.99,
    unit: 'gallon',
    image: '/images/products/milk.jpg',
    farmer: 'Sunny Meadows',
    category: 'Dairy & Eggs',
    rating: 4.6
  },
  {
    id: 7,
    name: 'Organic Apples',
    price: 2.49,
    unit: 'lb',
    image: '/images/products/apples.jpg',
    farmer: 'Green Valley Farm',
    category: 'Fruits',
    rating: 4.4
  },
  {
    id: 8,
    name: 'Free-range Chicken',
    price: 8.99,
    unit: 'lb',
    image: '/images/products/chicken.jpg',
    farmer: 'Heritage Farm',
    category: 'Meat',
    rating: 4.8
  },
]

const allFarmers = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: 'Springfield, CA',
    rating: 4.8,
    image: '/images/farmers/farm1.jpg',
    description: 'Organic vegetables and fruits',
    products: ['Vegetables', 'Fruits', 'Herbs']
  },
  {
    id: 2,
    name: 'Sunny Meadows',
    location: 'Riverside, TX',
    rating: 4.9,
    image: '/images/farmers/farm2.jpg',
    description: 'Fresh dairy and eggs',
    products: ['Dairy', 'Eggs', 'Honey']
  },
  {
    id: 3,
    name: 'Heritage Farm',
    location: 'Willow Creek, OR',
    rating: 4.7,
    image: '/images/farmers/farm3.jpg',
    description: 'Grass-fed beef and poultry',
    products: ['Meat', 'Poultry', 'Eggs']
  },
]

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Herbs & Spices',
  'Organic',
  'Local',
  'Seasonal'
]

const sortOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
  { id: 'popular', label: 'Most Popular' }
]

type ViewType = 'grid' | 'list'
type ResultType = 'all' | 'products' | 'farmers'

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [selectedSort, setSelectedSort] = useState('relevance')
  const [viewType, setViewType] = useState<ViewType>('grid')
  const [resultType, setResultType] = useState<ResultType>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [minRating, setMinRating] = useState(0)
  
  // Filter products based on search criteria
  const filteredProducts = allProducts.filter(product => {
    // Search query filter
    const matchesQuery = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || 
      product.category === selectedCategory
    
    // Price filter
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    // Rating filter
    const matchesRating = product.rating >= minRating
    
    return matchesQuery && matchesCategory && matchesPrice && matchesRating
  })

  const filteredFarmers = allFarmers.filter(farmer => {
    const matchesQuery = searchQuery === '' ||
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRating = farmer.rating >= minRating
    
    return matchesQuery && matchesRating
  })

  const totalResults = filteredProducts.length + filteredFarmers.length

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'All') params.set('category', selectedCategory)
    
    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState(null, '', newUrl)
  }, [searchQuery, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by state updates
  }

  const handleClearFilters = () => {
    setSelectedCategory('All')
    setPriceRange([0, 100])
    setMinRating(0)
    setSelectedSort('relevance')
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse Marketplace'}
          </h1>
          
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="search"
              placeholder="Search for products, farmers, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 py-6 text-lg"
            />
            <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              Search
            </Button>
          </form>

          {searchQuery && (
            <div className="mt-4 text-sm text-muted-foreground">
              Found {totalResults} results for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear all
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Result Type */}
              <div>
                <h3 className="font-medium mb-3">Result Type</h3>
                <div className="space-y-2">
                  {(['all', 'products', 'farmers'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setResultType(type)}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg text-sm ${
                        resultType === type
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {type === 'all' && <Package className="w-4 h-4" />}
                      {type === 'products' && <Package className="w-4 h-4" />}
                      {type === 'farmers' && <Users className="w-4 h-4" />}
                      <span className="capitalize">{type}</span>
                      <span className="ml-auto text-xs opacity-75">
                        {type === 'all' && totalResults}
                        {type === 'products' && filteredProducts.length}
                        {type === 'farmers' && filteredFarmers.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg text-sm ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <h3 className="font-medium mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg text-sm ${
                        minRating === rating
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(rating)
                                ? 'text-yellow-500 fill-current'
                                : i < rating
                                ? 'text-yellow-500 fill-current opacity-50'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2">
                        {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                      </span>
                      {minRating === rating && (
                        <Check className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-medium mb-3">Location</h3>
                <div className="space-y-2">
                  <button className="flex items-center gap-2 w-full p-2 rounded-lg text-sm hover:bg-muted">
                    <MapPin className="w-4 h-4" />
                    <span>Near me</span>
                  </button>
                  <Input
                    placeholder="City or ZIP code"
                    className="w-full text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {resultType === 'all' && 'All Results'}
                {resultType === 'products' && 'Products'}
                {resultType === 'farmers' && 'Farmers'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing {resultType === 'all' ? totalResults : 
                        resultType === 'products' ? filteredProducts.length : 
                        filteredFarmers.length} items
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none bg-background border rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded-l-lg ${
                    viewType === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded-r-lg ${
                    viewType === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 h-full w-80 bg-background shadow-lg p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Same filter content as sidebar */}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-8">
            {/* Products Results */}
            {(resultType === 'all' || resultType === 'products') && (
              <div>
                {resultType === 'all' && (
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Products ({filteredProducts.length})
                  </h3>
                )}
                
                {filteredProducts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No products found</h4>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className={
                    viewType === 'grid' 
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredProducts.map((product) => (
                      viewType === 'grid' ? (
                        <ProductCard key={product.id} product={product} />
                      ) : (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-gray-100">
                                  {/* Image would go here */}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-lg">{product.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      From {product.farmer}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="ml-1 text-sm">{product.rating}</span>
                                  </div>
                                </div>
                                <p className="text-muted-foreground mt-2 line-clamp-2">
                                  {product.category} • {product.unit}
                                </p>
                                <div className="flex justify-between items-center mt-4">
                                  <p className="text-2xl font-bold text-primary">
                                    ${product.price.toFixed(2)}
                                  </p>
                                  <Button size="sm">Add to Cart</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Farmers Results */}
            {(resultType === 'all' || resultType === 'farmers') && (
              <div>
                {resultType === 'all' && (
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Farmers ({filteredFarmers.length})
                  </h3>
                )}
                
                {filteredFarmers.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No farmers found</h4>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className={
                    viewType === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredFarmers.map((farmer) => (
                      viewType === 'grid' ? (
                        <FarmerCard key={farmer.id} farmer={farmer} />
                      ) : (
                        <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                                <div className="absolute inset-0 bg-gray-100">
                                  {/* Image would go here */}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-lg">{farmer.name}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {farmer.location}
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="ml-1 text-sm">{farmer.rating}</span>
                                  </div>
                                </div>
                                <p className="text-muted-foreground mt-2 line-clamp-2">
                                  {farmer.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {farmer.products.slice(0, 3).map((product, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                                    >
                                      {product}
                                    </span>
                                  ))}
                                  {farmer.products.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{farmer.products.length - 3} more
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button size="sm">View Farm</Button>
                                  <Button variant="outline" size="sm">Follow</Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* No Results */}
          {totalResults === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any matches for your search. Try adjusting your filters or search for something else.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleClearFilters}>Clear All Filters</Button>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Browse All Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalResults > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span className="mx-2 text-muted-foreground">...</span>
              <Button variant="outline" size="sm">
                10
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          )}

          {/* Search Tips */}
          {searchQuery && (
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Search Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Try using more general terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Check your spelling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Browse by category instead</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Try searching for farmers by location</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}