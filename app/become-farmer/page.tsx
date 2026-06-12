// app/become-farmer/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { 
  CheckCircle, 
  DollarSign, 
  Users, 
  BarChart3, 
  Shield, 
  MessageSquare,
  Truck,
  Leaf,
  Clock,
  Mail,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function BecomeFarmerPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      farmName: formData.get('farmName'),
      location: formData.get('location'),
      farmSize: formData.get('farmSize'),
      products: formData.get('products'),
      experience: formData.get('experience'),
      certifications: formData.get('certifications'),
      hearAboutUs: formData.get('hearAboutUs'),
    }

    try {
      const response = await fetch('/api/farmer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setSubmitted(true)
        // Reset form
        ;(e.target as HTMLFormElement).reset()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit application')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: DollarSign,
      title: 'Higher Profits',
      description: 'Sell directly to customers and keep more of your earnings. No middlemen, no hidden fees.'
    },
    {
      icon: Users,
      title: 'Direct Connection',
      description: 'Build relationships with your customers and get valuable feedback on your products.'
    },
    {
      icon: BarChart3,
      title: 'Easy Management',
      description: 'Simple dashboard to manage orders, inventory, and customer communication all in one place.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Get paid securely and on time. We handle payment processing so you can focus on farming.'
    },
    {
      icon: MessageSquare,
      title: 'Marketing Support',
      description: 'We help promote your farm to thousands of local customers looking for fresh produce.'
    },
    {
      icon: Truck,
      title: 'Delivery Tools',
      description: 'Flexible delivery options with route optimization and scheduling tools.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Sign Up',
      description: 'Create your farmer account in minutes'
    },
    {
      number: '2',
      title: 'Add Products',
      description: 'Upload photos and details of your products'
    },
    {
      number: '3',
      title: 'Get Orders',
      description: 'Start receiving orders from local customers'
    },
    {
      number: '4',
      title: 'Deliver & Earn',
      description: 'Deliver fresh products and get paid weekly'
    }
  ]

  const faqs = [
    {
      question: 'How much does it cost to join?',
      answer: "It's free to join and list your products. We only charge a small commission when you make a sale (5% for Standard plan, 3% for Premium plan)."
    },
    {
      question: 'How do I get paid?',
      answer: 'We process payments securely and transfer your earnings to your bank account weekly. You can track all payments in your farmer dashboard.'
    },
    {
      question: 'Who handles delivery?',
      answer: 'You have full control over delivery. You can choose to deliver yourself, use local delivery services, or offer pickup from your farm. We provide tools to manage delivery schedules.'
    },
    {
      question: 'Can I sell both online and at farmers markets?',
      answer: 'Absolutely! Many of our farmers use our platform to complement their farmers market sales. You can sync your inventory so it updates automatically.'
    },
    {
      question: 'What if I have technical questions?',
      answer: 'We offer comprehensive support including email, chat, and phone support for our farmers. We also provide detailed guides and video tutorials.'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-green-600 to-emerald-600 rounded-3xl">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative text-center py-16 px-4 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Grow Your Farm Business with{' '}
            <span className="text-yellow-300">Farmer Market Connect</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join thousands of farmers who are selling directly to customers, increasing their profits,
            and building sustainable businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#apply">
              <Button size="lg" className="bg-white text-green-700 hover:bg-white/90 gap-2">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#benefits">
              <Button size="lg" variant="outline" className="bg-green text-black-700 border-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
          <p className="text-sm text-muted-foreground">Active Farmers</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">$15M+</div>
          <p className="text-sm text-muted-foreground">Total Sales</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">45%</div>
          <p className="text-sm text-muted-foreground">Higher Profits</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">4.8★</div>
          <p className="text-sm text-muted-foreground">Farmer Satisfaction</p>
        </Card>
      </div>

      {/* Benefits */}
      <div id="benefits" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Why Farmers Love Our Platform</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to grow your farm business, all in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-linear-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Simple, Fair Pricing</h2>
          <p className="text-muted-foreground mb-8">
            No setup fees, no monthly subscriptions. We only succeed when you succeed.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
                <div className="text-5xl font-bold text-primary mb-2">$0</div>
                <p className="text-sm text-muted-foreground">First 3 months</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>No platform fees</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Full feature access</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Basic support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Start Free Trial</Button>
            </Card>
            <Card className="p-8 border-2 border-primary relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <div className="text-5xl font-bold text-primary mb-2">5%</div>
                <p className="text-sm text-muted-foreground">Per successful transaction</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>All Free Trial features</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Marketing tools</span>
                </li>
              </ul>
              <Button className="w-full">Choose Standard</Button>
            </Card>
            <Card className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-5xl font-bold text-primary mb-2">3%</div>
                <p className="text-sm text-muted-foreground">Per successful transaction</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>All Standard features</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Featured placement</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Custom storefront</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full">Choose Premium</Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div id="apply" className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Apply to Join Our Farmer Community</h2>
          <p className="text-xl text-muted-foreground">
            Fill out the form below and our team will contact you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Application Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your application. We've received your information and will contact you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Application
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>

              {/* Farm Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Farm Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Farm/Business Name *
                  </label>
                  <input
                    name="farmName"
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Green Valley Farm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location (City, State) *
                    </label>
                    <input
                      name="location"
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Springfield, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Farm Size (acres)
                    </label>
                    <input
                      name="farmSize"
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 10 acres, urban farm, backyard garden"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What products do you grow or produce? *
                  </label>
                  <textarea
                    name="products"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-25"
                    placeholder="List the products you grow or produce (e.g., organic tomatoes, free-range eggs, honey, etc.)"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Years of Farming Experience
                    </label>
                    <select
                      name="experience"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select experience</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Certifications (if any)
                    </label>
                    <input
                      name="certifications"
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., USDA Organic, Certified Naturally Grown"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAboutUs"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="search">Search engine (Google, etc.)</option>
                    <option value="social">Social media</option>
                    <option value="friend">Friend or colleague</option>
                    <option value="market">Farmers market</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="mt-1 rounded"
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    *
                  </label>
                </div>
                
                <div className="flex items-start gap-3">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    className="mt-1 rounded"
                  />
                  <label htmlFor="marketing" className="text-sm">
                    I would like to receive updates, tips, and marketing communications from Farmer Market Connect
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/auth/signup?type=farmer" className="text-primary hover:underline font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
          <p className="text-muted-foreground">
            Our farmer support team is here to help you get started.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted-foreground">farmers@farmermarketconnect.com</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">(800) 123-4567</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium">Hours</p>
            <p className="text-sm text-muted-foreground">Mon-Fri 9am-6pm EST</p>
          </div>
        </div>
      </Card>
    </div>
  )
}