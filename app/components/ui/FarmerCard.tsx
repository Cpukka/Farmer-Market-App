import { MapPin, Star, TrendingUp } from 'lucide-react'
import { Button } from './Button'
import Image from 'next/image'
import Link from 'next/link'

interface FarmerCardProps {
  farmer: {
    id: number | string
    name: string
    location: string
    rating: number
    image: string
    description: string
    products: string[]
  }
}

export default function FarmerCard({ farmer }: FarmerCardProps) {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={farmer.image}
          alt={farmer.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{farmer.name}</h3>
          <div className="flex items-center text-white/90">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{farmer.location}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
          <span className="font-semibold">{farmer.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-muted-foreground mb-4 line-clamp-2">{farmer.description}</p>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Products</h4>
          <div className="flex flex-wrap gap-2">
            {farmer.products.slice(0, 3).map((product, index) => (
              <span
                key={index}
                className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full"
              >
                {product}
              </span>
            ))}
            {farmer.products.length > 3 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{farmer.products.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Link href={`/farmers/${farmer.id}`}>
            <Button variant="outline" size="sm">
              View Farm
            </Button>
          </Link>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}