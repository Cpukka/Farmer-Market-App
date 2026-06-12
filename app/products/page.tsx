import ProductCard from '../components/ui/ProductCard'
import SearchBar from '../components/ui/SearchBar'
import { Filter, Grid3x3, List } from 'lucide-react'
import { Button } from '../components/ui/Button'

// Mock data - replace with actual API calls
const products = [
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

const categories = [
  'All Categories',
  'Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Bakery',
  'Herbs & Spices',
  'Organic',
]

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Fresh Market Products</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover fresh, locally sourced produce from farmers you can trust
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-4">
        <SearchBar />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All Categories' ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
            <div className="flex border rounded-lg">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-l-none">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
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
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>

      {/* Featured Section */}
      <div className="bg-linear-to-r from-primary/10 to-emerald-100 dark:from-primary/20 dark:to-emerald-900/20 rounded-2xl p-8 mt-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Why Shop With Local Farmers?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Supporting local farmers means fresher produce, reduced carbon footprint, 
            and a stronger community. Every purchase helps sustain local agriculture 
            and ensures fair prices for our hardworking farmers.
          </p>
        </div>
      </div>
    </div>
  )
}