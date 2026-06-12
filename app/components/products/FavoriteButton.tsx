// app/components/products/FavoriteButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '../ui/Button'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  productId: string
  size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({ 
  productId, 
  size = 'md' 
}: FavoriteButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchFavoriteStatus()
    }
  }, [session, productId])

  const fetchFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/products/status?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      console.error('Failed to fetch favorite status:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + window.location.pathname)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/favorites/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.favorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${sizeClasses[size]} rounded-full p-0 ${
        isFavorite 
          ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/30 dark:text-red-400'
          : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-white hover:text-gray-600 dark:bg-gray-800/80 dark:text-gray-500'
      } transition-all hover:scale-105 active:scale-95`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isLoading ? (
        <div className={`${iconSizes[size]} animate-spin rounded-full border-b-2 border-current`} />
      ) : (
        <Heart className={`${iconSizes[size]} ${isFavorite ? 'fill-current' : ''}`} />
      )}
    </Button>
  )
}