'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'

export default function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="search"
            placeholder="Search for fresh produce, farmers, or markets..."
            className="pl-10 pr-4 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="px-8">
          Search
        </Button>
      </div>
    </form>
  )
}