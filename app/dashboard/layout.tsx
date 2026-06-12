// app/dashboard/layout.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Menu, Bell, Search, Sun, Moon, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
    // Load sidebar state from localStorage after mount
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true')
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSidebarToggle = useCallback(() => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }, [isSidebarCollapsed])

  if (status === 'loading' || !isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Top Navigation Bar */}
      <div className={`
        fixed top-0 right-0 z-20
        bg-background/80 backdrop-blur-md border-b
        transition-all duration-300
        ${isSidebarCollapsed ? 'lg:left-16' : 'lg:left-64'}
        left-0
      `}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page Title */}
            <h1 className="text-lg font-semibold lg:hidden">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search - Desktop */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="search"
                placeholder="Search..."
                className="w-80 pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-2 focus:outline-primary/20"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar - Mobile */}
            <Link 
              href="/dashboard/settings"
              className="lg:hidden w-8 h-8 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center"
            >
              <span className="text-white text-sm font-semibold">
                {session?.user?.name?.charAt(0) || 'U'}
              </span>
            </Link>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="search"
              placeholder="Search dashboard..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-2 focus:outline-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Fixed spacing to prevent overlap */}
      <main className="pt-16">
        <div className={`
          transition-all duration-300
          ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
          pl-0
        `}>
          <div className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}