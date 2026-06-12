// app/dashboard/reviews/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Flag, 
  Edit, 
  Trash2,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Review {
  id: string
  productName: string
  productImage: string
  farmerName: string
  rating: number
  comment: string
  date: string
  helpful: number
  verified: boolean
  response?: {
    message: string
    date: string
  }
}

export default function ReviewsPage() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - replace with API call
  const reviews: Review[] = [
    {
      id: '1',
      productName: 'Organic Tomatoes',
      productImage: '/images/products/tomatoes.jpg',
      farmerName: 'Green Valley Farm',
      rating: 5,
      comment: 'Absolutely delicious! The freshest tomatoes I\'ve ever had. Will definitely order again.',
      date: '2024-01-15',
      helpful: 23,
      verified: true,
      response: {
        message: 'Thank you for your wonderful review! We take pride in our organic produce.',
        date: '2024-01-16'
      }
    },
    {
      id: '2',
      productName: 'Fresh Eggs',
      productImage: '/images/products/eggs.jpg',
      farmerName: 'Sunny Meadows',
      rating: 4,
      comment: 'Great quality eggs. The yolks are so orange! Delivery was quick.',
      date: '2024-01-10',
      helpful: 12,
      verified: true
    },
    {
      id: '3',
      productName: 'Raw Honey',
      productImage: '/images/products/honey.jpg',
      farmerName: 'Heritage Farm',
      rating: 5,
      comment: 'Best honey I\'ve ever tasted! You can really taste the flowers from their farm.',
      date: '2024-01-05',
      helpful: 45,
      verified: true,
      response: {
        message: 'We\'re so glad you enjoyed our honey! Our bees work hard to produce the best.',
        date: '2024-01-06'
      }
    }
  ]

  const filteredReviews = reviews.filter(review => {
    if (filter === 'published') return review.response
    if (filter === 'pending') return !review.response
    return true
  }).filter(review => 
    review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Reviews</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to your product reviews
          </p>
        </div>
        <Link href="/products">
          <Button className="gap-2 bg-linear-to-r from-primary to-emerald-600">
            <MessageSquare className="w-4 h-4" />
            Write a Review
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{reviews.length}</div>
          <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0).toFixed(1)}
          </div>
          <div className="flex justify-center mt-1">
            {renderStars(Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {reviews.reduce((acc, r) => acc + r.helpful, 0)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Helpful Votes</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews by product or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-2 focus:outline-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('published')}
            >
              Responded
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending Response
            </Button>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try a different search term' : 'You haven\'t written any reviews yet'}
          </p>
          {!searchTerm && (
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {review.productImage ? (
                      <Image
                        src={review.productImage}
                        alt={review.productName}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <Package className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div>
                      <Link href={`/products/${review.id}`} className="hover:underline">
                        <h3 className="font-semibold text-lg">{review.productName}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">by {review.farmerName}</p>
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {renderStars(review.rating)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>

                  <p className="text-foreground mb-4">{review.comment}</p>

                  {/* Helpful Section */}
                  <div className="flex items-center gap-4 mb-4">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600 transition-colors">
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>

                  {/* Farmer Response */}
                  {review.response && (
                    <div className="bg-muted/30 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{review.farmerName}'s Response</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.response.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.response.message}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Review
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Add missing import
import { Package } from 'lucide-react'