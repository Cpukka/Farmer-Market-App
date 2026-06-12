import { Button } from '../components/ui/Button'
import { 
  Leaf, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Globe,
  CheckCircle,
  Truck,
  Shield
} from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: '/images/team/sarah.jpg' },
    { name: 'Michael Chen', role: 'Head of Operations', image: '/images/team/michael.jpg' },
    { name: 'Emma Rodriguez', role: 'Farmer Relations', image: '/images/team/emma.jpg' },
    { name: 'David Wilson', role: 'Technology Director', image: '/images/team/david.jpg' },
  ]

  const values = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Sustainability',
      description: 'Promoting regenerative farming and reducing food waste.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Community',
      description: 'Building strong connections between farmers and consumers.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Transparency',
      description: 'Clear sourcing information and fair pricing for all.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Local Focus',
      description: 'Supporting local economies and reducing carbon footprint.'
    }
  ]

  const milestones = [
    { year: '2020', event: 'FarmConnect founded' },
    { year: '2021', event: 'First 50 farmers joined' },
    { year: '2022', event: 'Expanded to 3 states' },
    { year: '2023', event: '10,000+ happy customers' },
    { year: '2024', event: 'Launched mobile app' },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting communities with local farmers to create a sustainable, transparent food system.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            To empower local farmers and provide communities with access to fresh, 
            sustainably grown food while building a transparent and fair food system.
          </p>
          <p className="text-muted-foreground">
            We believe that everyone should know where their food comes from and 
            have access to high-quality, nutritious produce.
          </p>
        </div>

        <div className="card p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground mb-4">
            To create a world where every community has direct access to local farmers, 
            reducing food miles and strengthening local economies.
          </p>
          <p className="text-muted-foreground">
            We envision a future where sustainable farming is the norm and consumers 
            have meaningful connections with the people who grow their food.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6">How It All Began</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                FarmConnect was founded in 2020 by Sarah Johnson, a third-generation 
                farmer who saw the challenges local farmers faced in reaching consumers 
                directly.
              </p>
              <p className="text-muted-foreground">
                After years of watching middlemen take larger shares while farmers 
                struggled to make ends meet, Sarah decided to create a platform that 
                would connect farmers directly with their communities.
              </p>
              <p className="text-muted-foreground">
                What started as a small farmers' market app has grown into a thriving 
                community of farmers and food lovers across multiple states, all united 
                by a common goal: better food for all.
              </p>
            </div>
          </div>
          <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/images/about/farm-story.jpg"
              alt="Farm story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">250+</div>
            <p className="text-muted-foreground">Local Farmers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10k+</div>
            <p className="text-muted-foreground">Happy Families</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50k+</div>
            <p className="text-muted-foreground">Products Delivered</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">85%</div>
            <p className="text-muted-foreground">Reduced Food Miles</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block"></div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="md:w-1/2 text-center md:text-right md:pr-8">
                  {index % 2 === 0 && (
                    <>
                      <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </>
                  )}
                </div>
                <div className="w-4 h-4 bg-primary rounded-full my-4 md:my-0"></div>
                <div className="md:w-1/2 text-center md:text-left md:pl-8">
                  {index % 2 !== 0 && (
                    <>
                      <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Whether you're a farmer looking to reach more customers or a food lover 
          seeking fresh, local produce, we'd love to have you join our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            Shop Fresh Produce
          </Button>
          <Button size="lg" variant="outline">
            Become a Farmer Partner
          </Button>
        </div>
      </div>
    </div>
  )
}