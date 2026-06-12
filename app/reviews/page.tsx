// app/reviews/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { ReviewCard } from '../components/reviews/ReviewCard'
import { ReviewForm } from '../components/reviews/ReviewForm'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { 
  Star,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Award,
  PenSquare,
  History,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs'
import Link from 'next/link'

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string
  images: string[]
  helpful: number
  verified: boolean
  createdAt: string
  product?: {
    id: string
    name: string
    image: string
  }
  farmer?: {
    id: string
    farmName: string
    image: string
  }
  user: {
    name: string | null
    image: string | null
  }
}

interface PendingReviewItem {
  id: string
  productName: string
  farmerName: string
  orderId: string
  orderDate: string
  deliveredDate: string
  productId?: string
  farmerId?: string
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  helpfulVotes: number
  reviewsWithPhotos: number
  pendingReviews: number
}

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('my-reviews')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [userReviews, setUserReviews] = useState<Review[]>([])
  const [pendingReviews, setPendingReviews] = useState<PendingReviewItem[]>([])
  const [helpfulReviews, setHelpfulReviews] = useState<Review[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [photosReviews, setPhotosReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    helpfulVotes: 0,
    reviewsWithPhotos: 0,
    pendingReviews: 0
  })

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/reviews')
    return null
  }

  // Fetch data when tab changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchData()
    }
  }, [session, activeTab])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch based on active tab
      switch (activeTab) {
        case 'my-reviews':
          await fetchUserReviews()
          break
        case 'pending':
          await fetchPendingReviews()
          break
        case 'helpful':
          await fetchHelpfulReviews()
          break
        case 'recent':
          await fetchRecentReviews()
          break
        case 'with-photos':
          await fetchPhotosReviews()
          break
      }
      
      // Always fetch stats
      await fetchStats()
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setError('Failed to load reviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserReviews = async () => {
    const response = await fetch(`/api/reviews?userId=${session?.user?.id}&limit=20`)
    if (response.ok) {
      const data = await response.json()
      setUserReviews(data.reviews || [])
    } else {
      throw new Error('Failed to fetch user reviews')
    }
  }

  const fetchPendingReviews = async () => {
    // Fetch orders that are delivered but not reviewed
    const response = await fetch(`/api/orders?userId=${session?.user?.id}&status=DELIVERED&reviewed=false`)
    if (response.ok) {
      const data = await response.json()
      const pending = (data.orders || []).map((order: any) => ({
        id: order.id,
        productName: order.items?.[0]?.product?.name || 'Product',
        farmerName: order.items?.[0]?.product?.farmer?.farmName || 'Farmer',
        orderId: order.id.substring(0, 8).toUpperCase(),
        orderDate: new Date(order.createdAt).toISOString().split('T')[0],
        deliveredDate: new Date(order.updatedAt).toISOString().split('T')[0],
        productId: order.items?.[0]?.product?.id,
        farmerId: order.items?.[0]?.product?.farmer?.id
      }))
      setPendingReviews(pending)
    } else {
      throw new Error('Failed to fetch pending reviews')
    }
  }

  const fetchHelpfulReviews = async () => {
    const response = await fetch('/api/reviews?sort=helpful&limit=10')
    if (response.ok) {
      const data = await response.json()
      setHelpfulReviews(data.reviews || [])
    } else {
      throw new Error('Failed to fetch helpful reviews')
    }
  }

  const fetchRecentReviews = async () => {
    const response = await fetch('/api/reviews?sort=recent&limit=20')
    if (response.ok) {
      const data = await response.json()
      setRecentReviews(data.reviews || [])
    } else {
      throw new Error('Failed to fetch recent reviews')
    }
  }

  const fetchPhotosReviews = async () => {
    const response = await fetch('/api/reviews?hasImages=true&limit=20')
    if (response.ok) {
      const data = await response.json()
      setPhotosReviews(data.reviews || [])
    } else {
      throw new Error('Failed to fetch reviews with photos')
    }
  }

  const fetchStats = async () => {
    const response = await fetch(`/api/reviews/stats?userId=${session?.user?.id}`)
    if (response.ok) {
      const data = await response.json()
      setStats(data)
    } else {
      // Fallback to calculating from fetched data
      const total = userReviews.length
      const avgRating = total > 0 
        ? userReviews.reduce((sum, r) => sum + r.rating, 0) / total 
        : 0
      const helpfulVotes = userReviews.reduce((sum, r) => sum + r.helpful, 0)
      const withPhotos = userReviews.filter(r => r.images && r.images.length > 0).length
      const pendingCount = pendingReviews.length
      
      setStats({
        totalReviews: total,
        averageRating: avgRating,
        helpfulVotes,
        reviewsWithPhotos: withPhotos,
        pendingReviews: pendingCount
      })
    }
  }

  const handleSubmitReview = async (data: any) => {
    try {
      // Upload images if any
      let imageUrls: string[] = []
      if (data.images && data.images.length > 0) {
        const formData = new FormData()
        data.images.forEach((file: File) => {
          formData.append('images', file)
        })

        const uploadResponse = await fetch('/api/reviews/upload', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrls = uploadResult.urls
        }
      }

      // Submit review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          images: imageUrls,
          productId: selectedProduct || undefined
        })
      })

      if (response.ok) {
        setShowReviewForm(false)
        setSelectedProduct(null)
        // Refresh data
        fetchData()
        
        // Show success message
        alert('Review submitted successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit review. Please try again.')
    }
  }

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Refresh the current tab
        fetchData()
      } else {
        throw new Error('Failed to mark as helpful')
      }
    } catch (error) {
      console.error('Error marking helpful:', error)
      alert('Failed to mark review as helpful')
    }
  }

  const handleWriteReview = (productId?: string) => {
    if (productId) {
      // Navigate to new review page with product pre-selected
      router.push(`/reviews/new?productId=${productId}`)
    } else {
      setSelectedProduct(productId || null)
      setShowReviewForm(true)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Refresh data
        fetchData()
        alert('Review deleted successfully')
      } else {
        throw new Error('Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const handleEditReview = (reviewId: string) => {
    // Navigate to edit page (you'll need to create this)
    // For now, show alert
    alert('Edit feature coming soon!')
  }

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const renderReviews = (reviews: Review[]) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading reviews...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading reviews</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (reviews.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              {activeTab === 'my-reviews' 
                ? "You haven't written any reviews yet."
                : activeTab === 'pending'
                ? "You don't have any pending reviews."
                : "No reviews to display."
              }
            </p>
            {activeTab === 'my-reviews' && (
              <Button onClick={() => handleWriteReview()} className="mt-4">
                Write Your First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={{
              id: review.id,
              user: {
                name: review.user?.name || 'Anonymous',
                avatar: review.user?.image || undefined
              },
              rating: review.rating,
              title: review.title || undefined,
              comment: review.comment,
              images: review.images,
              helpful: review.helpful,
              verified: review.verified,
              createdAt: review.createdAt,
              productName: review.product?.name,
              farmerName: review.farmer?.farmName
            }}
            onHelpfulClick={handleHelpfulClick}
            onEditClick={handleEditReview}
            onDeleteClick={handleDeleteReview}
            isUserReview={review.user?.name === session?.user?.name}
            showActions={activeTab === 'my-reviews'}
          />
        ))}
      </div>
    )
  }

  const renderPendingReviews = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading pending reviews...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error loading reviews</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (pendingReviews.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              You've reviewed all your recent purchases.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {pendingReviews.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => item.productId && handleViewProduct(item.productId)}
                      className="gap-1"
                    >
                      View Product
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From {item.farmerName}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                    <span>Order: {item.orderId}</span>
                    <span>•</span>
                    <span>Ordered: {item.orderDate}</span>
                    <span>•</span>
                    <span>Delivered: {item.deliveredDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleWriteReview(item.productId)}
                    className="whitespace-nowrap"
                  >
                    Write Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
        <p className="text-muted-foreground">
          Share your experiences and read reviews from other customers
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Reviews</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Helpful Votes</p>
                <p className="text-2xl font-bold">{stats.helpfulVotes}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Photos Shared</p>
                <p className="text-2xl font-bold">{stats.reviewsWithPhotos}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Write Review CTA */}
      {!showReviewForm && (
        <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Share Your Experience</h3>
                <p className="text-muted-foreground">
                  Help other customers by reviewing products you've purchased
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => handleWriteReview()} 
                  className="gap-2"
                  variant="default"
                >
                  <PenSquare className="w-4 h-4" />
                  Write a Review
                </Button>
                <Link href="/products" passHref>
                  <Button variant="outline" className="gap-2">
                    Browse Products
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>
                  Your honest review helps other customers make better decisions
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/reviews/new')}
                className="gap-1"
              >
                Browse Products
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false)
                setSelectedProduct(null)
              }}
              productName={selectedProduct || undefined}
            />
          </CardContent>
        </Card>
      )}

      {/* Reviews Tabs */}
      {!showReviewForm && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="my-reviews" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <History className="w-4 h-4" />
              Pending ({stats.pendingReviews})
            </TabsTrigger>
            <TabsTrigger value="helpful" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Most Helpful
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Award className="w-4 h-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="with-photos" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              With Photos
            </TabsTrigger>
          </TabsList>

          {/* My Reviews Tab */}
          <TabsContent value="my-reviews" className="space-y-4">
            {renderReviews(userReviews)}
          </TabsContent>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending" className="space-y-4">
            {renderPendingReviews()}
          </TabsContent>

          {/* Helpful Reviews Tab */}
          <TabsContent value="helpful" className="space-y-4">
            {renderReviews(helpfulReviews)}
          </TabsContent>

          {/* Recent Reviews Tab */}
          <TabsContent value="recent" className="space-y-4">
            {renderReviews(recentReviews)}
          </TabsContent>

          {/* Reviews with Photos Tab */}
          <TabsContent value="with-photos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photosReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={{
                    id: review.id,
                    user: {
                      name: review.user?.name || 'Anonymous',
                      avatar: review.user?.image || undefined
                    },
                    rating: review.rating,
                    title: review.title || undefined,
                    comment: review.comment,
                    images: review.images,
                    helpful: review.helpful,
                    verified: review.verified,
                    createdAt: review.createdAt,
                    productName: review.product?.name,
                    farmerName: review.farmer?.farmName
                  }}
                  compact
                />
              ))}
            </div>
            {!loading && photosReviews.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews with photos</h3>
                  <p className="text-muted-foreground">
                    Be the first to add photos to your reviews!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Review Guidelines */}
      {!showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Review Guidelines
            </CardTitle>
            <CardDescription>
              Please follow these guidelines when writing reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Do</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                      </div>
                      <span>Share specific details about freshness, quality, and delivery</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                      </div>
                      <span>Include photos of the actual product received</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                      </div>
                      <span>Be honest about both positive and negative experiences</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    Tips for great reviews:
                  </p>
                  <ul className="text-sm text-green-600 dark:text-green-500 mt-2 space-y-1">
                    <li>• Mention how you used the product</li>
                    <li>• Compare with similar products if possible</li>
                    <li>• Note any changes in quality over multiple purchases</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Don't</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-red-600 dark:text-red-400 text-sm">✗</span>
                      </div>
                      <span>Include personal information or contact details</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-red-600 dark:text-red-400 text-sm">✗</span>
                      </div>
                      <span>Write fake reviews or copy others' content</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-red-600 dark:text-red-400 text-sm">✗</span>
                      </div>
                      <span>Use offensive language or make personal attacks</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    Report inappropriate reviews:
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-500 mt-2">
                    If you see a review that violates our guidelines, please report it by clicking the three dots menu on the review.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}