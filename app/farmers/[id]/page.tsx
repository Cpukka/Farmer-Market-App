import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '../../components/ui/Button'
import ProductCard from '../../components/ui/ProductCard'
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Truck,
  Shield,
  Leaf,
  Calendar,
  Users
} from 'lucide-react'

// Mock data - replace with API call
const farmer = {
  id: 1,
  name: 'Green Valley Farm',
  location: 'Springfield, CA',
  rating: 4.8,
  totalReviews: 124,
  description: 'Family-owned organic farm established in 1995. We specialize in growing seasonal vegetables, fruits, and herbs using sustainable, pesticide-free methods. Our farm is certified organic and follows regenerative agriculture practices to nourish both people and the planet.',
  story: 'Started by the Johnson family over 25 years ago, Green Valley Farm began as a small backyard garden and has grown into a 50-acre organic paradise. We believe in growing food that is good for you and good for the Earth.',
  image: '/images/farmers/farm1.jpg',
  bannerImage: '/images/farmers/banner1.jpg',
  contact: {
    phone: '(555) 123-4567',
    email: 'hello@greenvalleyfarm.com',
    website: 'www.greenvalleyfarm.com'
  },
  delivery: {
    areas: ['Springfield', 'Metro Area', 'County-wide'],
    days: ['Monday', 'Wednesday', 'Friday'],
    time: '9 AM - 5 PM'
  },
  certifications: ['USDA Organic', 'Non-GMO Project Verified', 'Certified Sustainable'],
  products: ['Vegetables', 'Fruits', 'Herbs', 'Microgreens', 'Seasonal Produce']
}

const farmerProducts = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 3.99,
    unit: 'lb',
    image: '/images/products/tomatoes.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.5,
    description: 'Fresh, ripe organic tomatoes picked at peak ripeness'
  },
  {
    id: 2,
    name: 'Mixed Greens',
    price: 5.99,
    unit: 'bag',
    image: '/images/products/greens.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.7,
    description: 'Fresh salad mix with kale, spinach, and arugula'
  },
  {
    id: 3,
    name: 'Organic Carrots',
    price: 2.99,
    unit: 'bunch',
    image: '/images/products/carrots.jpg',
    farmer: 'Green Valley Farm',
    category: 'Vegetables',
    rating: 4.6,
    description: 'Sweet, crunchy organic carrots with tops'
  },
  {
    id: 4,
    name: 'Fresh Basil',
    price: 3.49,
    unit: 'bunch',
    image: '/images/products/basil.jpg',
    farmer: 'Green Valley Farm',
    category: 'Herbs',
    rating: 4.8,
    description: 'Fragrant organic basil perfect for pesto'
  },
]

const reviews = [
  {
    id: 1,
    user: 'Sarah M.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'The best tomatoes I\'ve ever had! So fresh and flavorful. The Johnson family really cares about their produce.'
  },
  {
    id: 2,
    user: 'Michael T.',
    rating: 4,
    date: '1 month ago',
    comment: 'Great quality produce and reliable delivery. The mixed greens are always fresh and last longer than store-bought.'
  },
  {
    id: 3,
    user: 'Jennifer L.',
    rating: 5,
    date: '2 months ago',
    comment: 'Love supporting this local family farm. You can taste the difference in their organic produce!'
  },
]

interface FarmerPageProps {
  params: {
    id: string
  }
}

export default function FarmerProfilePage({ params }: FarmerPageProps) {
  const { id } = params
  
  // For demo purposes, if ID doesn't exist, show not found
  if (parseInt(id) > 6) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Farmer Header */}
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
        <Image
          src={farmer.bannerImage}
          alt={farmer.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{farmer.name}</h1>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{farmer.location}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                <span className="font-bold">{farmer.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">({farmer.totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Farm Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Farm Story */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6">{farmer.description}</p>
            <p className="text-muted-foreground">{farmer.story}</p>
          </div>

          {/* Products */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <Button variant="outline">View All Products</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {farmerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{review.user}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">
              See All Reviews
            </Button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{farmer.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{farmer.contact.email}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{farmer.contact.website}</span>
              </div>
            </div>
            <Button className="w-full mt-4">
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>

          {/* Delivery Info */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">
              <Truck className="w-5 h-5 inline mr-2" />
              Delivery Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>Areas: {farmer.delivery.areas.join(', ')}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>Days: {farmer.delivery.days.join(', ')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>Hours: {farmer.delivery.time}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">
              <Shield className="w-5 h-5 inline mr-2" />
              Certifications
            </h3>
            <div className="space-y-2">
              {farmer.certifications.map((cert) => (
                <div key={cert} className="flex items-center">
                  <Leaf className="w-4 h-4 mr-2 text-green-500" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Products Offered */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Products Offered</h3>
            <div className="flex flex-wrap gap-2">
              {farmer.products.map((product) => (
                <span
                  key={product}
                  className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full"
                >
                  {product}
                </span>
              ))}
            </div>
          </div>

          {/* Follow Farm */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Follow This Farm</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get updates on new products, seasonal offerings, and farm events.
            </p>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Follow Farm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}