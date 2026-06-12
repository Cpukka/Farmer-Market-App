'use client'

import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      details: ['support@farmconnect.com', 'farmers@farmconnect.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri, 9am-5pm PST'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Office',
      details: ['123 Farm Street', 'Springfield, CA 12345'],
      description: 'Visit by appointment'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Support Hours',
      details: ['Monday - Friday: 9am - 6pm', 'Saturday: 10am - 4pm'],
      description: 'Closed on Sundays'
    }
  ]

  const faqs = [
    {
      question: 'How do I become a farmer on your platform?',
      answer: 'Visit our "Become a Farmer" page and fill out the application form. Our team will review your application and contact you within 3-5 business days.'
    },
    {
      question: 'What are your delivery areas?',
      answer: 'We currently deliver to major metropolitan areas within California, Oregon, and Washington. We\'re expanding to new regions regularly.'
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it. After that, please contact our support team immediately.'
    },
    {
      question: 'Are all products organic?',
      answer: 'All products labeled as "Organic" are certified organic. We also feature conventionally grown produce from local farmers.'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? We're here to help! Reach out to our team or check our FAQ below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contact Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Send us a Message</h2>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Message sent successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your inquiry..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline">
                View All FAQs
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Info */}
        <div className="space-y-6">
          {/* Contact Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-foreground">{detail}</p>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Support Card */}
          <div className="card p-6 bg-primary/5 border-primary/20">
            <AlertCircle className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Need Immediate Help?</h3>
            <p className="text-muted-foreground mb-4">
              For urgent inquiries about your order or account, please call our support line.
            </p>
            <Button className="w-full gap-2">
              <Phone className="w-4 h-4" />
              Call Now: +1 (555) 123-4567
            </Button>
          </div>

          {/* Response Time */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">Response Times</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Support</span>
                <span className="font-medium">Within 24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone Support</span>
                <span className="font-medium">Immediate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Farmer Inquiries</span>
                <span className="font-medium">3-5 business days</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest news about local farmers, seasonal produce, and special offers.
            </p>
            <div className="space-y-2">
              <Input placeholder="Your email address" />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-6">Find Local Farmers</h2>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Interactive map showing local farmers in your area</p>
            <p className="text-sm text-muted-foreground mt-2">
              (Map integration would be implemented here)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}