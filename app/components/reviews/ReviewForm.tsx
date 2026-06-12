'use client'

import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { StarRating } from '../../components/ui/StarRating'
import { ImagePlus, X, Upload } from 'lucide-react'
import Image from 'next/image'

interface ReviewFormProps {
  productId?: string
  productName?: string
  farmerId?: string
  farmerName?: string
  onSubmit: (data: ReviewFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  initialData?: Partial<ReviewFormData>
}

export interface ReviewFormData {
  rating: number
  title: string
  comment: string
  images: File[]
}

export function ReviewForm({
  productId,
  productName,
  farmerId,
  farmerName,
  onSubmit,
  onCancel,
  isLoading = false,
  initialData
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: initialData?.rating || 0,
    title: initialData?.title || '',
    comment: initialData?.comment || '',
    images: initialData?.images || []
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 4) {
      alert('Maximum 4 images allowed')
      return
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.rating === 0) {
      alert('Please select a rating')
      return
    }
    if (formData.comment.trim().length < 10) {
      alert('Please write a more detailed review (minimum 10 characters)')
      return
    }
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* What are you reviewing? */}
      {(productName || farmerName) && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="font-medium mb-1">You're reviewing:</p>
          <p className="text-primary">
            {productName ? `Product: ${productName}` : `Farmer: ${farmerName}`}
          </p>
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Overall Rating *
        </label>
        <div className="flex items-center gap-4">
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            size="lg"
            showNumber
          />
          <span className="text-sm text-muted-foreground">
            {formData.rating === 0 ? 'Select your rating' : 
             formData.rating === 1 ? 'Poor' :
             formData.rating === 2 ? 'Fair' :
             formData.rating === 3 ? 'Good' :
             formData.rating === 4 ? 'Very Good' : 'Excellent'}
          </span>
        </div>
      </div>

      {/* Review Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Review Title (Optional)
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      {/* Review Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Your Review *
          <span className="text-muted-foreground font-normal ml-1">
            (Minimum 10 characters)
          </span>
        </label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Share details of your experience with this product or farmer..."
          rows={5}
          className="resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-muted-foreground">
            {formData.comment.length} characters
          </span>
          {formData.comment.length < 10 && (
            <span className="text-sm text-red-500">
              Minimum 10 characters required
            </span>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Add Photos (Optional)
          <span className="text-muted-foreground font-normal ml-1">
            Maximum 4 images
          </span>
        </label>
        <div className="space-y-4">
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {formData.images.length < 4 && (
            <div>
              <input
                type="file"
                id="review-images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="review-images">
                <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload Images</span>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Tips for Writing a Good Review */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          Tips for writing a helpful review:
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Describe your experience with the product or farmer</li>
          <li>• Mention quality, freshness, and delivery experience</li>
          <li>• Include photos to help others make decisions</li>
          <li>• Be honest and specific about what you liked or didn't like</li>
        </ul>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}