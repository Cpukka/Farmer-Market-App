import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Leaf } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    Marketplace: [
      { label: 'Browse Products', href: '/products' },
      { label: 'Find Farmers', href: '/farmers' },
      { label: 'Categories', href: '/categories' },
      { label: 'Featured', href: '/featured' },
    ],
    Farmers: [
      { label: 'Sell on FarmConnect', href: '/farmers/signup' },
      { label: 'Farmer Resources', href: '/resources' },
      { label: 'Success Stories', href: '/success-stories' },
      { label: 'Farmer Dashboard', href: '/dashboard' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Press', href: '/press' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ]

  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl">FarmConnect</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Connecting local farmers with communities. Fresh, organic produce delivered straight from farm to your table.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for fresh updates
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-1 md:w-64"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Farmer Market Connect. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}