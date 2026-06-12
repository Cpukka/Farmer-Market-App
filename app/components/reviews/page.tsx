'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { ReviewCard } from '../../components/reviews/ReviewCard'
import { ReviewForm } from '../../components/reviews/ReviewForm'
import { CheckCircle } from 'lucide-react'
import { 
  Star,
  MessageSquare,
  ThumbsUp,
  Filter,
  Search,
  TrendingUp,
  Award,
  PenSquare,
  History,
  Image as ImageIcon
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs'

export default function ReviewsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('my-reviews')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

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
    router.push('/login')
    return null
  }

  // Mock data - replace with API calls
  const userReviews = [
    {
      id: '1',
      user: { name: 'You', avatar: session?.user?.image },
      rating: 5,
      title: 'Best tomatoes ever!',
      comment: 'These were incredibly fresh and flavorful. Perfect for salads and sauces.',
      images: ['/images/products/tomatoes.jpg'],
      helpful: 12,
      verified: true,
      createdAt: '2024-01-15',
      productName: 'Organic Tomatoes',
      farmerName: 'Green Valley Farm'
    },
    {
      id: '2',
      user: { name: 'You', avatar: session?.user?.image },
      rating: 4,
      title: 'Good quality eggs',
      comment: 'Fresh eggs with bright orange yolks. Delivery was prompt.',
      images: [],
      helpful: 5,
      verified: true,
      createdAt: '2024-01-08',
      productName: 'Fresh Eggs',
      farmerName: 'Sunny Meadows'
    }
  ]

  const pendingReviews = [
    {
      id: '101',
      productName: 'Grass-fed Beef',
      farmerName: 'Heritage Farm',
      orderId: 'ORD-789010',
      orderDate: '2024-01-02',
      deliveredDate: '2024-01-05'
    },
    {
      id: '102',
      productName: 'Organic Basil',
      farmerName: 'Green Valley Farm',
      orderId: 'ORD-789009',
      orderDate: '2023-12-28',
      deliveredDate: '2023-12-30'
    }
  ]

  const helpfulReviews = [
    {
      id: '201',
      user: { name: 'Sarah M.', avatar: '/images/avatars/sarah.jpg' },
      rating: 5,
      title: 'Perfect for meal prep',
      comment: 'The mixed greens stay fresh all week. Great quality and value.',
      images: ['/images/products/greens.jpg'],
      helpful: 24,
      verified: true,
      createdAt: '2024-01-10',
      productName: 'Mixed Greens',
      farmerName: 'Green Valley Farm'
    },
    {
      id: '202',
      user: { name: 'Michael T.', avatar: '/images/avatars/michael.jpg' },
      rating: 4,
      title: 'Sweet and crunchy',
      comment: 'Carrots were very fresh and had great flavor. Kids loved them!',
      images: ['/images/products/carrots.jpg'],
      helpful: 18,
      verified: true,
      createdAt: '2024-01-05',
      productName: 'Organic Carrots',
      farmerName: 'River Bend Farm'
    }
  ]

  const reviewStats = {
    totalReviews: 8,
    averageRating: 4.6,
    helpfulVotes: 47,
    reviewsWithPhotos: 3
  }

  const handleSubmitReview = async (data: any) => {
    // Simulate API call
    console.log('Submitting review:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowReviewForm(false)
    // Refresh reviews
  }

  const handleHelpfulClick = (reviewId: string) => {
    console.log('Marked review as helpful:', reviewId)
    // Implement API call
  }

  const handleWriteReview = (productId?: string) => {
    setSelectedProduct(productId || null)
    setShowReviewForm(true)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Reviews</p>
                <p className="text-2xl font-bold">{reviewStats.totalReviews}</p>
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
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-2xl font-bold">{reviewStats.averageRating}/5</p>
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
                <p className="text-2xl font-bold">{reviewStats.helpfulVotes}</p>
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
                <p className="text-2xl font-bold">{reviewStats.reviewsWithPhotos}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
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
              <Button onClick={() => handleWriteReview()} className="gap-2">
                <PenSquare className="w-4 h-4" />
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Your honest review helps other customers make better decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
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
              Pending Reviews
            </TabsTrigger>
            <TabsTrigger value="helpful" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Most Helpful
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2">
              <Award className="w-4 h-4" />
              Recent Reviews
            </TabsTrigger>
            <TabsTrigger value="with-photos" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              With Photos
            </TabsTrigger>
          </TabsList>

          {/* My Reviews Tab */}
          <TabsContent value="my-reviews" className="space-y-4">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onHelpfulClick={handleHelpfulClick}
                  showActions={false}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't written any reviews. Share your experience with products you've purchased!
                  </p>
                  <Button onClick={() => handleWriteReview()}>
                    Write Your First Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pending Reviews Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingReviews.length > 0 ? (
              pendingReviews.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          From {item.farmerName}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                          <span>Order: {item.orderId}</span>
                          <span>•</span>
                          <span>Delivered: {item.deliveredDate}</span>
                        </div>
                      </div>
                      <Button onClick={() => handleWriteReview(item.productName)}>
                        Write Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    You've reviewed all your recent purchases.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Helpful Reviews Tab */}
          <TabsContent value="helpful" className="space-y-4">
            {helpfulReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpfulClick={handleHelpfulClick}
              />
            ))}
          </TabsContent>

          {/* Recent Reviews Tab */}
          <TabsContent value="recent" className="space-y-4">
            <p className="text-muted-foreground text-center py-8">
              Recent reviews from the community would appear here.
            </p>
          </TabsContent>

          {/* Reviews with Photos Tab */}
          <TabsContent value="with-photos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReviews
                .filter(review => review.images && review.images.length > 0)
                .map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    compact
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Review Guidelines */}
      {!showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Review Guidelines</CardTitle>
            <CardDescription>
              Please follow these guidelines when writing reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Do</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <span>Share your honest experience with the product</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <span>Include photos of the actual product received</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                    </div>
                    <span>Mention freshness, quality, and delivery experience</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Don't</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-xs">✗</span>
                    </div>
                    <span>Include personal information or contact details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-xs">✗</span>
                    </div>
                    <span>Write fake reviews or copy others' reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-600 dark:text-red-400 text-xs">✗</span>
                    </div>
                    <span>Use offensive language or make personal attacks</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}