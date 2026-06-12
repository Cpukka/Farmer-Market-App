// app/components/LayoutWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from './layout/Header'
import Footer from './ui/Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Check if current route is in dashboard (excludes footer)
  const isDashboard = pathname?.startsWith('/dashboard')
  
  return (
    <>
      <Header />
      <main className={`flex-1 ${isDashboard ? '' : 'container mx-auto px-4 py-8'}`}>
        {children}
      </main>
      {/* Only show footer on non-dashboard pages */}
      {!isDashboard && <Footer />}
    </>
  )
}