import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import AuthBackground from '../components/auth/AuthBackground'

export const metadata: Metadata = {
  title: 'Farmer Market - Authentication',
  description: 'Sign in or create an account to access Farmer Market',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Background decorative elements */}
      <AuthBackground />
      
      {/* Back to home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to home
        </Link>
      </div>

      {/* Logo/Header */}
      <div className="absolute top-6 right-6 z-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            Farmer Market
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex min-h-screen">
          {/* Left side - Illustration/Info */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-2/3 bg-linear-to-br from-primary/5 to-green-100 dark:from-primary/10 dark:to-green-950/30 flex-col justify-center p-12">
            <div className="max-w-lg mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                  Join Our Community of Farmers & Food Lovers
                </h1>
                <p className="text-lg text-muted-foreground">
                  Connect with local farmers, discover fresh produce, and support sustainable agriculture in your community.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Fresh Local Produce</h3>
                    <p className="text-muted-foreground">
                      Access farm-fresh fruits, vegetables, dairy, and more directly from local producers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Support Local Farmers</h3>
                    <p className="text-muted-foreground">
                      Your purchases directly support local agriculture and help sustain farming communities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Secure & Easy</h3>
                    <p className="text-muted-foreground">
                      Enjoy a secure shopping experience with easy checkout and order tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  "As a farmer, this platform has transformed how I connect with customers. The support has been incredible!""
                </p>
                <p className="text-sm font-medium mt-2">— Sarah Johnson, Organic Farm Owner</p>
              </div>
            </div>
          </div>

          {/* Right side - Authentication forms */}
          <div className="w-full lg:w-1/2 xl:w-1/3">
            <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
              <div className="w-full max-w-md">
                {children}
                
                {/* Footer links */}
                <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
                  <p>
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                  <p className="mt-2">
                    Need help?{' '}
                    <Link href="/contact" className="text-primary hover:text-primary/80 font-medium">
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}