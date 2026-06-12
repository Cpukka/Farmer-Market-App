// app/reviews/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ReviewForm } from '@/app/components/reviews/ReviewForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

export default function NewReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  
  const [product, setProduct] = useState<any>(null)
  const [farmer, setFarmer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const productId = searchParams.get('productId')
  const farmerId = searchParams.get('farmerId')
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/reviews/new?${searchParams.toString()}`)
      return
    }

    if (status === 'authenticated') {
      fetchReviewData()
    }
  }, [status, productId, farmerId])

  const fetchReviewData = async () => {
    try {
      if (productId) {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const productData = await response.json()
          setProduct(productData)
        }
      } else if (farmerId) {
        const response = await fetch(`/api/farmers/${farmerId}`)
        if (response.ok) {
          const farmerData = await response.json()
          setFarmer(farmerData)
        }
      }
    } catch (error) {
      console.error('Error fetching review data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (data: any) => {
    setSubmitting(true)
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
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          images: imageUrls,
          productId,
          farmerId,
          orderId
        })
      })

      if (reviewResponse.ok) {
        const review = await reviewResponse.json()
        
        // Redirect based on what was reviewed
        if (productId) {
          router.push(`/products/${productId}?reviewed=true`)
        } else if (farmerId) {
          router.push(`/farmers/${farmerId}?reviewed=true`)
        } else if (orderId) {
          router.push(`/dashboard/orders/${orderId}?reviewed=true`)
        } else {
          router.push('/reviews?submitted=true')
        }
      } else {
        throw new Error('Failed to submit review')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Write a Review</h1>
        <p className="text-muted-foreground mt-2">
          Share your experience to help others make informed decisions
        </p>
      </div>

      {/* Review Form */}
      <div className="space-y-6">
        {/* What You're Reviewing */}
        {(product || farmer) && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  {product?.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {farmer?.image && (
                    <img
                      src={farmer.image}
                      alt={farmer.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {product?.name || farmer?.farmName || farmer?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product 
                      ? `Product from ${product.farmer?.name || 'Unknown Farmer'}`
                      : farmer
                      ? `Farmer from ${farmer.location || 'Unknown Location'}`
                      : ''
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
            <CardDescription>
              Be honest and specific about your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewForm
              productId={productId || undefined}
              productName={product?.name}
              farmerId={farmerId || undefined}
              farmerName={farmer?.farmName || farmer?.name}
              onSubmit={handleSubmitReview}
              onCancel={() => router.back()}
              isLoading={submitting}
            />
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Review Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              To ensure helpful and authentic reviews, please follow these guidelines:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                </div>
                <span>Share specific details about your experience</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                </div>
                <span>Include photos of the actual product received</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-600 dark:text-red-400 text-xs">✗</span>
                </div>
                <span>Don't include personal information or contact details</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-600 dark:text-red-400 text-xs">✗</span>
                </div>
                <span>Don't use offensive language or make personal attacks</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}