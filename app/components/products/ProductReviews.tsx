// app/components/products/ProductReviews.tsx
'use client'

import { useState, useEffect } from 'react'
import { ReviewCard } from '../reviews/ReviewCard'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  MessageSquare,
  Star,
  AlertCircle
} from 'lucide-react'

interface ProductReviewsProps {
  productId: string
  productName: string
  farmerName?: string
}

export function ProductReviews({ productId, productName, farmerName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: [0, 0, 0, 0, 0]
  })
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent')

  useEffect(() => {
    fetchReviews()
  }, [productId, sortBy])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&limit=10&sort=${sortBy}`)
      const data = await response.json()
      setReviews(data.reviews)
      
      // Calculate stats
      if (data.reviews.length > 0) {
        const avg = data.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / data.reviews.length
        const counts = [0, 0, 0, 0, 0]
        data.reviews.forEach((r: any) => counts[5 - r.rating]++)
        
        setStats({
          averageRating: avg,
          totalReviews: data.reviews.length,
          ratingCounts: counts
        })
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      })
      // Refresh reviews
      fetchReviews()
    } catch (error) {
      console.error('Failed to mark as helpful:', error)
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading reviews...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground mb-6">
          Be the first to review "{productName}"
        </p>
        <Button>
          Write First Review
        </Button>
      </div>
    )
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <p className="text-muted-foreground">
            {stats.totalReviews} reviews • {stats.averageRating.toFixed(1)} average rating
          </p>
        </div>
        
        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-muted/30 p-6 rounded-lg text-center">
          <div className="text-4xl font-bold mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={stats.averageRating} size="lg" />
          <p className="text-sm text-muted-foreground mt-2">
            {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        
        <div className="md:col-span-2 space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingCounts[5 - rating]
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm w-12 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={{
              id: review.id,
              user: {
                name: review.user.name,
                avatar: review.user.image
              },
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              images: review.images,
              helpful: review.helpfulCount || 0,
              verified: review.verified,
              createdAt: review.createdAt,
              productName: review.product?.name,
              farmerName: farmerName
            }}
            onHelpfulClick={handleHelpfulClick}
            showActions={true}
          />
        ))}
      </div>

      {/* Show More/Less */}
      {reviews.length > 3 && (
        <div className="text-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All {reviews.length} Reviews
              </>
            )}
          </Button>
        </div>
      )}

      {/* Review Guidelines */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Review Guidelines</h4>
            <p className="text-sm text-muted-foreground">
              We value authentic feedback. Please ensure your review is honest, specific, and helpful to other customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}