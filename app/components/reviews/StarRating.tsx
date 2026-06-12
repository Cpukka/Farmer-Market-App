// app/components/ui/StarRating.tsx
'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({ 
  rating, 
  size = 'md', 
  showNumber = false,
  interactive = false,
  onRatingChange 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (star: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(star)
    }
  }

  const handleMouseEnter = (star: number) => {
    if (interactive) {
      setHoverRating(star)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`focus:outline-none disabled:cursor-default ${sizeClasses[size]}`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                star <= displayRating
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}