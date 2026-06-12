// app/dashboard/orders/[id]/review/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { Textarea } from '../../../../components/ui/Textarea'
import {
  ArrowLeft,
  Star,
  Upload,
  X,
  CheckCircle
} from 'lucide-react'

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const orderId = params.id as string
  
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      alert('Please write a review')
      return
    }

    setSubmitting(true)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          rating,
          title,
          comment,
          images,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push(`/dashboard/orders/${orderId}`)
        }, 2000)
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

  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Review Submitted!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for your feedback. Your review helps other customers and our farmers.
        </p>
        <Button onClick={() => router.push(`/dashboard/orders/${orderId}`)}>
          Back to Order
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/orders/${orderId}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Order
        </Button>
        <h1 className="text-3xl font-bold">Leave a Review</h1>
        <p className="text-muted-foreground mt-2">
          Share your experience with this order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Rating</h3>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {rating === 5 && 'Excellent - Highly recommended!'}
            {rating === 4 && 'Good - Happy with my purchase'}
            {rating === 3 && 'Average - Could be better'}
            {rating === 2 && 'Poor - Not satisfied'}
            {rating === 1 && 'Terrible - Very disappointed'}
          </p>
        </Card>

        {/* Review Title */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Review Title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience (optional)"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            maxLength={100}
          />
        </Card>

        {/* Review Text */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Review</h3>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your experience..."
            className="min-h-37.5"
            required
          />
          <p className="text-sm text-muted-foreground mt-2">
            What did you like about the product? Was it fresh? How was the delivery experience?
          </p>
        </Card>

        {/* Photo Upload (Optional) */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Photos (Optional)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              type="button"
              className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors"
            >
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Add Photo</span>
            </button>
            
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Add photos to show the quality of the products you received
          </p>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/orders/${orderId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  )
}