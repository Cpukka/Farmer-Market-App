// app/components/layout/Header.tsx - Fixed version with visible nav
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '../../components/ui/Button'
import ThemeToggle from '../../components/ui/ThemeToggle'
import { 
  Menu, X, ShoppingCart, User, Leaf, Heart, Home, Package, 
  Users, Info, MessageSquare, Sprout, UserPlus, ChevronDown,
  Settings, LogOut
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCart } from '../../contexts/CartContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()
  const { itemCount, isLoading } = useCart()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Main navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { href: '/farmers', label: 'Farmers', icon: <Users className="w-4 h-4" /> },
    { href: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { href: '/contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" /> },
  ]

  // Conditional items based on user role
  const conditionalItems = session?.user?.role !== 'FARMER' 
    ? [{ href: '/become-farmer', label: 'Become a Farmer', icon: <Sprout className="w-4 h-4" /> }]
    : []

  const userNavItems = [
    { href: '/favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
  ]

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
    
    return `flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary whitespace-nowrap rounded-lg px-3 py-2 ${
      isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:bg-muted/50'
    }`
  }

  const isBecomeFarmerPage = pathname === '/become-farmer'

  return (
    <nav className={`
      sticky top-0 z-50 w-full transition-all duration-300
      ${isScrolled ? 'border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm' : 'bg-background border-b'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-linear-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline-block bg-linear-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              FarmConnect
            </span>
          </Link>

          {/* Desktop Navigation - Always visible on md and up */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="inline lg:hidden">{item.label.charAt(0)}</span>
              </Link>
            ))}
            
            {/* Conditional items */}
            {conditionalItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary rounded-lg px-3 py-2 ${
                  isBecomeFarmerPage 
                    ? 'text-primary bg-primary/10' 
                    : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="inline lg:hidden">Farm</span>
              </Link>
            ))}
            
            {/* User specific items */}
            {userNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="inline lg:hidden">❤️</span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-2 flex-shrink-0">
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
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Actions - Desktop */}
            {session ? (
              <div className="hidden md:flex items-center gap-2">
                {/* Farmer Dashboard Button - Only for farmers */}
                {session.user?.role === 'FARMER' && (
                  <Link href="/dashboard/farmer">
                    <Button variant="default" size="sm" className="gap-2 bg-linear-to-r from-primary to-emerald-600 hover:opacity-90">
                      <Sprout className="w-4 h-4" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Button>
                  </Link>
                )}
                
                {/* User menu dropdown */}
                <div className="relative group">
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {session.user?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                  <div className="absolute right-0 top-full mt-1 w-56 bg-background border rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-medium text-sm truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {session.user?.role}
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/become-farmer">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden xl:inline">For Farmers</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-linear-to-r from-primary to-emerald-600 hover:opacity-90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 bg-background">
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex-1 py-4">
                <div className="space-y-1 px-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
                    Menu
                  </p>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        pathname === item.href 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  
                  {conditionalItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        pathname === item.href 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  
                  {userNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        pathname === item.href 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* User Section for Mobile */}
                <div className="border-t mt-6 pt-6 px-4">
                  {session ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {session.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{session.user?.name}</p>
                          <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                            {session.user?.role}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg bg-primary/10 text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus className="w-5 h-5" />
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}