// app/components/layout/Sidebar.tsx
'use client'

import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../../components/ui/Button'
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  Truck,
  Wallet,
  X,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Award,
  Gift,
  HelpCircle,
  LifeBuoy
} from 'lucide-react'

// Navigation items for customers
const customerNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart, badge: null },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Star, badge: null },
  { href: '/dashboard/reviews', label: 'Reviews', icon: MessageSquare, badge: null },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, badge: null },
]

// Navigation items for farmers
const farmerNavItems = [
  { href: '/dashboard/farmer', label: 'Overview', icon: LayoutDashboard, badge: null },
  { href: '/dashboard/farmer/orders', label: 'Orders', icon: ShoppingCart, badge: '3' },
  { href: '/dashboard/farmer/products', label: 'Products', icon: Package, badge: null },
  { href: '/dashboard/farmer/customers', label: 'Customers', icon: Users, badge: null },
  { href: '/dashboard/farmer/reviews', label: 'Reviews', icon: MessageSquare, badge: '12' },
  { href: '/dashboard/farmer/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { href: '/dashboard/farmer/delivery', label: 'Delivery', icon: Truck, badge: null },
  { href: '/dashboard/farmer/earnings', label: 'Earnings', icon: Wallet, badge: null },
  { href: '/dashboard/farmer/settings', label: 'Settings', icon: Settings, badge: null },
]

// Bottom navigation items
const bottomNavItems = [
  { href: '/help', label: 'Help Center', icon: HelpCircle },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/rewards', label: 'Rewards', icon: Gift },
]

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

// Sidebar Content Component - Moved outside to avoid ESLint error
function SidebarContent({ 
  isCollapsed, 
  onMobileClose,
  navItems
}: { 
  isCollapsed: boolean; 
  onMobileClose: () => void;
  navItems: typeof customerNavItems;
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-linear-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-linear-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                FarmConnect
              </span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center w-full group">
              <div className="w-8 h-8 bg-linear-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 text-white" />
              </div>
            </Link>
          )}
          
          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="font-semibold text-white text-sm">
                {session?.user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-block px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {session?.user?.role}
                </span>
                {session?.user?.role === 'FARMER' && (
                  <span className="inline-block px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full">
                    Pro
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Main Menu
            </p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link key={item.href} href={item.href} onClick={onMobileClose}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`
                      w-full justify-start relative transition-all duration-200
                      ${isCollapsed ? 'px-2 justify-center' : 'px-3'}
                      ${isActive ? 'bg-linear-to-r from-primary/10 to-emerald-600/10 shadow-sm' : 'hover:bg-muted'}
                    `}
                  >
                    <div className={`relative ${isCollapsed ? '' : 'mr-3'}`}>
                      <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} ${isActive ? 'text-primary' : ''}`} />
                      {item.badge && !isCollapsed && (
                        <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {item.badge && !isCollapsed && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="px-3 mt-6 pt-6 border-t">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Support
            </p>
          )}
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={onMobileClose}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${isCollapsed ? 'px-2 justify-center' : 'px-3'}`}
                >
                  <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
                  {!isCollapsed && item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        {!isCollapsed && (
          <div className="mb-4 p-3 bg-linear-to-r from-primary/5 to-emerald-600/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold">Pro Member</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {session?.user?.role === 'FARMER' 
                ? 'You\'ve earned 500 loyalty points this month!'
                : 'Complete 5 orders to unlock premium benefits'}
            </p>
          </div>
        )}
        
        <Button
          variant="outline"
          className={`
            w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20
            transition-all duration-200
            ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
          `}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && "Logout"}
        </Button>
        
        {!isCollapsed && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            © 2024 FarmConnect
            <br />
            v2.0.0
          </p>
        )}
      </div>
    </div>
  )
}

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const { data: session } = useSession()
  
  const navItems = session?.user?.role === 'FARMER' ? farmerNavItems : customerNavItems

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex fixed left-0 top-0 h-screen
        ${isCollapsed ? 'w-16' : 'w-64'}
        bg-background border-r shadow-sm
        transition-all duration-300 ease-in-out z-30
      `}>
        <SidebarContent 
          isCollapsed={isCollapsed}
          onMobileClose={onMobileClose}
          navItems={navItems}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={onMobileClose}
          />
          <div className={`
            absolute left-0 top-0 bottom-0 w-64
            bg-background shadow-2xl
            animate-in slide-in-from-left duration-300
          `}>
            <SidebarContent 
              isCollapsed={false}
              onMobileClose={onMobileClose}
              navItems={navItems}
            />
          </div>
        </div>
      )}
    </>
  )
}