import FarmerCard from '../components/ui/FarmerCard'
import SearchBar from '../components/ui/SearchBar'
import { Button } from '../components/ui/Button'
import { MapPin, Filter, Star } from 'lucide-react'

const farmers = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: 'Springfield, CA',
    rating: 4.8,
    image: '/images/farmers/farm1.jpg',
    description: 'Organic vegetables and fruits grown with sustainable practices. Family-owned since 1995.',
    products: ['Vegetables', 'Fruits', 'Herbs', 'Microgreens']
  },
  {
    id: 2,
    name: 'Sunny Meadows',
    location: 'Riverside, TX',
    rating: 4.9,
    image: '/images/farmers/farm2.jpg',
    description: 'Fresh dairy products, free-range eggs, and raw honey from happy, healthy animals.',
    products: ['Dairy', 'Eggs', 'Honey', 'Poultry']
  },
  {
    id: 3,
    name: 'Heritage Farm',
    location: 'Willow Creek, OR',
    rating: 4.7,
    image: '/images/farmers/farm3.jpg',
    description: 'Grass-fed beef, pasture-raised pork, and free-range poultry. Regenerative farming methods.',
    products: ['Beef', 'Pork', 'Poultry', 'Lamb']
  },
  {
    id: 4,
    name: 'Mountain View Orchard',
    location: 'Blue Ridge, WA',
    rating: 4.6,
    image: '/images/farmers/farm4.jpg',
    description: 'Organic apples, pears, cherries, and berries from high-altitude orchards.',
    products: ['Apples', 'Pears', 'Cherries', 'Berries']
  },
  {
    id: 5,
    name: 'River Bend Farm',
    location: 'Riverdale, CO',
    rating: 4.8,
    image: '/images/farmers/farm5.jpg',
    description: 'Hydroponic lettuce, tomatoes, and herbs grown year-round in our greenhouse.',
    products: ['Lettuce', 'Tomatoes', 'Herbs', 'Peppers']
  },
  {
    id: 6,
    name: 'Prairie Harvest',
    location: 'Great Plains, KS',
    rating: 4.5,
    image: '/images/farmers/farm6.jpg',
    description: 'Ancient grains, heirloom beans, and organic flour. Supporting sustainable agriculture.',
    products: ['Grains', 'Beans', 'Flour', 'Seeds']
  },
]

const categories = ['All Farms', 'Vegetable Farms', 'Fruit Farms', 'Dairy Farms', 'Meat Farms', 'Organic', 'Family-Owned']

export default function FarmersPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Meet Our Farmers</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect directly with local farmers who grow your food with care and passion.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <SearchBar placeholder ="Search for farmers by name, location, or products..." />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={category === 'All Farms' ? 'bg-primary text-primary-foreground' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing {farmers.length} farms</span>
            <Button variant="ghost" size="sm">
              Sort by: Rating
            </Button>
          </div>
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmers.map((farmer) => (
          <FarmerCard key={farmer.id} farmer={farmer} />
        ))}
      </div>

      {/* Why Choose Our Farmers */}
      <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-8 mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Why Choose Our Farmers?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Quality Standards</h3>
              <p className="text-sm text-muted-foreground">All farmers meet our rigorous quality and sustainability standards</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Local & Fresh</h3>
              <p className="text-sm text-muted-foreground">Products come directly from farms within 100 miles of your location</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <div className="text-xl">🤝</div>
              </div>
              <h3 className="font-semibold">Direct Connection</h3>
              <p className="text-sm text-muted-foreground">Chat directly with farmers and learn about their farming practices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Become a Farmer CTA */}
      <div className="text-center border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">Are you a farmer?</h3>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join our community and connect directly with customers who value fresh, local produce.
        </p>
        <Button size="lg">
          Become a Farmer Partner
        </Button>
      </div>
    </div>
  )
}