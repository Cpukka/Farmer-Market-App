'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  maxStars?: number
  showNumber?: boolean
  className?: string
}

export function StarRating({
  rating,
  onRatingChange,
  size = 'md',
  readOnly = false,
  maxStars = 5,
  showNumber = false,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (value: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (!readOnly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex" onMouseLeave={handleMouseLeave}>
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              disabled={readOnly}
              className={cn(
                'transition-transform hover:scale-110 disabled:cursor-default',
                readOnly && 'cursor-default'
              )}
              aria-label={`Rate ${starValue} out of ${maxStars} stars`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  starValue <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                )}
              />
            </button>
          )
        })}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}