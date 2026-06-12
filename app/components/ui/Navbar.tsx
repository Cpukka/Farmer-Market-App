// app/components/layout/Header.tsx - CLEANED with no duplicates
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './Button'
import ThemeToggle from './ThemeToggle'
import { Menu, X, ShoppingCart, User, Leaf, Heart, Home, Package, Users, Info, MessageSquare, Sprout } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const { itemCount, isLoading } = useCart()

  // Main navigation items - ONLY basic site sections
  const mainNavItems = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { href: '/farmers', label: 'Farmers', icon: <Users className="w-4 h-4" /> },
    { href: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  // User navigation items
  const userNavItems = [
    { href: '/favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
  ]

  // Check if user is not a farmer to show the "For Farmers" button
  const showForFarmersButton = session?.user?.role !== 'FARMER'
  const isBecomeFarmerPage = pathname === '/become-farmer'

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href || 
                    (href !== '/' && pathname.startsWith(href))
    
    return `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md ${
      isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/50'
    }`
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">FarmConnect</span>
            <span className="font-bold text-xl sm:hidden">FC</span>
          </Link>

          {/* Desktop Navigation - Main Items */}
          <div className="hidden lg:flex items-center space-x-1 flex-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
                <span className="xl:hidden">{item.label}</span>
              </Link>
            ))}
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* "For Farmers" Button - Only show for non-farmers */}
            {showForFarmersButton && (
              <Link href="/become-farmer">
                <Button 
                  variant={isBecomeFarmerPage ? "default" : "outline"}
                  size="sm"
                  className="gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700"
                >
                  <Sprout className="w-4 h-4" />
                  <span className="hidden lg:inline">For Farmers</span>
                  <span className="lg:hidden">Farmers</span>
                </Button>
              </Link>
            )}
            
            {/* User Nav Items */}
            {userNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {/* Cart Icon */}
            {isLoading ? (
              <div className="relative p-2">
                <ShoppingCart className="w-5 h-5 opacity-50" />
              </div>
            ) : (
              <Link 
                href="/cart" 
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                title={`Cart (${itemCount} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Actions */}
            {session ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* Show "Farmer Dashboard" for farmers, else user menu */}
                {session.user?.role === 'FARMER' ? (
                  <Link href="/dashboard/farmer">
                    <Button variant="secondary" size="sm" className="gap-2 bg-green-50 text-green-700 hover:bg-green-100">
                      <Sprout className="w-4 h-4" />
                      <span className="hidden lg:inline">Farmer Dashboard</span>
                      <span className="lg:hidden">Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <div className="relative group">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">
                        {session.user?.name?.split(' ')[0] || 'Account'}
                      </span>
                    </Button>
                    <div className="absolute right-0 top-full mt-1 w-56 bg-background border rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium text-sm truncate">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{session.user?.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {session.user?.role}
                        </span>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <div className="border-t my-2" />
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors text-red-600"
                      >
                        <X className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="px-4">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="px-4">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="space-y-3">
              {/* Main Navigation */}
              <div className="grid grid-cols-2 gap-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="mt-1">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* "For Farmers" Button in mobile */}
              {showForFarmersButton && (
                <Link
                  href="/become-farmer"
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                    isBecomeFarmerPage
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Sprout className="w-4 h-4" />
                  For Farmers
                </Link>
              )}

              {/* User Nav Items */}
              {userNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* User Links */}
              {session ? (
                <>
                  <div className="border-t pt-4 mt-4">
                    <div className="px-4 py-3 bg-muted/30 rounded-lg mb-3">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{session.user?.email}</p>
                      <span className="inline-block mt-2 px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full">
                        {session.user?.role}
                      </span>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    
                    {session.user?.role === 'FARMER' && (
                      <Link
                        href="/dashboard/farmer"
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted rounded-lg transition-colors text-green-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Sprout className="w-4 h-4" />
                        Farmer Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t my-2" />
                    
                    <button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted rounded-lg transition-colors text-red-600"
                    >
                      <X className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t pt-4 mt-4">
                  <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Account
                  </h3>
                  <div className="grid grid-cols-2 gap-3 px-4">
                    <Link
                      href="/auth/signin"
                      className="text-center px-4 py-3 text-sm border rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-center px-4 py-3 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}