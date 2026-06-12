interface ImagePlaceholderProps {
  type: 'product' | 'farmer' | 'avatar' | 'banner'
  text?: string
  className?: string
}

export function ImagePlaceholder({ type, text, className = '' }: ImagePlaceholderProps) {
  const getDimensions = () => {
    switch (type) {
      case 'product': return { width: 300, height: 300 }
      case 'farmer': return { width: 400, height: 300 }
      case 'banner': return { width: 1200, height: 400 }
      case 'avatar': return { width: 200, height: 200 }
      default: return { width: 300, height: 300 }
    }
  }

  const getColors = () => {
    switch (type) {
      case 'product': return { bg: '#fbbf24', text: '#000000' }
      case 'farmer': return { bg: '#4ade80', text: '#ffffff' }
      case 'banner': return { bg: '#10b981', text: '#ffffff' }
      case 'avatar': return { bg: '#3b82f6', text: '#ffffff' }
      default: return { bg: '#9ca3af', text: '#ffffff' }
    }
  }

  const { width, height } = getDimensions()
  const { bg, text: textColor } = getColors()
  const displayText = text || type.toUpperCase()

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: bg,
        color: textColor,
      }}
    >
      <span className="font-bold text-center p-4">
        {displayText}
      </span>
    </div>
  )
}