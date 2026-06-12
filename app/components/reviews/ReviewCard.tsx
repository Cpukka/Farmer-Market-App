// app/components/reviews/ReviewCard.tsx
'use client'

import { useState } from 'react'
import { StarRating } from '../ui/StarRating'
import { 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle,
  Image as ImageIcon,
  User,
  MoreVertical,
  Flag
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/Button'

interface ReviewCardProps {
  review: {
    id: string
    user: {
      name: string
      avatar?: string
    }
    rating: number
    title?: string
    comment: string
    images?: string[]
    helpful: number
    verified: boolean
    createdAt: string
    productName?: string
    farmerName?: string
    farmerResponse?: string
  }
  onHelpfulClick?: (reviewId: string) => void
  onReplyClick?: (reviewId: string) => void
  onReportClick?: (reviewId: string) => void
  showActions?: boolean
  compact?: boolean
  userHasVoted?: boolean
  isUserReview?: boolean
  onEditClick?: (reviewId: string) => void
  onDeleteClick?: (reviewId: string) => void
}

export function ReviewCard({
  review,
  onHelpfulClick,
  onReplyClick,
  onReportClick,
  showActions = true,
  compact = false,
  userHasVoted = false,
  isUserReview = false,
  onEditClick,
  onDeleteClick
}: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(userHasVoted)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleHelpfulClick = () => {
    if (!isHelpful) {
      setIsHelpful(true)
      setHelpfulCount(prev => prev + 1)
      onHelpfulClick?.(review.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // For compact view
  if (compact) {
    return (
      <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
              {review.user.avatar ? (
                <Image
                  src={review.user.avatar}
                  alt={review.user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <span className="font-semibold text-primary">
                    {review.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{review.user.name}</h4>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <StarRating rating={review.rating} size="sm" />
                <span>•</span>
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {review.title && (
          <h5 className="font-semibold text-lg mb-2">{review.title}</h5>
        )}

        <p className="text-muted-foreground mb-4 line-clamp-2">{review.comment}</p>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {review.images.slice(0, 2).map((image, index) => (
              <div key={index} className="relative w-16 h-16 rounded overflow-hidden">
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {review.images.length > 2 && (
              <div className="relative w-16 h-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">+{review.images.length - 2}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleHelpfulClick}
              className={`flex items-center gap-1 ${
                isHelpful ? 'text-primary' : 'hover:text-foreground'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
              {helpfulCount}
            </button>
          </div>
          <span>{review.rating}/5</span>
        </div>
      </div>
    )
  }

  // Full view
  return (
    <div className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
            {review.user.avatar ? (
              <Image
                src={review.user.avatar}
                alt={review.user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="font-semibold text-lg text-primary">
                  {review.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg">{review.user.name}</h4>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <StarRating rating={review.rating} size="sm" />
              <span>•</span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-lg shadow-lg py-1 z-10">
              {isUserReview ? (
                <>
                  <button
                    type="button"
                    onClick={() => onEditClick?.(review.id)}
                    className="w-full px-4 py-2 text-left hover:bg-muted text-sm"
                  >
                    Edit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteClick?.(review.id)}
                    className="w-full px-4 py-2 text-left hover:bg-muted text-sm text-red-500"
                  >
                    Delete Review
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onReportClick?.(review.id)}
                  className="w-full px-4 py-2 text-left hover:bg-muted text-sm text-red-500 flex items-center gap-2"
                >
                  <Flag className="w-3 h-3" />
                  Report Review
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product/Farmer Info */}
      {(review.productName || review.farmerName) && (
        <div className="mb-4 text-sm text-muted-foreground">
          {review.productName && (
            <span>Product: <span className="font-medium">{review.productName}</span></span>
          )}
          {review.farmerName && (
            <span className={review.productName ? 'ml-4' : ''}>
              Farmer: <span className="font-medium">{review.farmerName}</span>
            </span>
          )}
        </div>
      )}

      {/* Title */}
      {review.title && (
        <h5 className="font-semibold text-xl mb-3">{review.title}</h5>
      )}

      {/* Comment */}
      <p className="text-foreground mb-4 whitespace-pre-wrap">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {review.images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSelectedImageIndex(index)
                  setShowImageModal(true)
                }}
                className="relative w-20 h-20 rounded-lg overflow-hidden border hover:border-primary transition-colors"
              >
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          {review.images.length > 4 && (
            <p className="text-sm text-muted-foreground mt-2">
              Click images to view larger
            </p>
          )}
        </div>
      )}

      {/* Farmer Response */}
      {review.farmerResponse && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <p className="font-medium">Farmer's Response</p>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{review.farmerResponse}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleHelpfulClick}
              disabled={isHelpful}
              className={`flex items-center gap-2 text-sm ${
                isHelpful 
                  ? 'text-primary cursor-default' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
              Helpful ({helpfulCount})
            </button>
            {onReplyClick && (
              <button
                type="button"
                onClick={() => onReplyClick(review.id)}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Reply
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && review.images && review.images[selectedImageIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={review.images[selectedImageIndex]}
              alt="Review image"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="flex justify-center gap-2 mt-4">
              {review.images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === selectedImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}