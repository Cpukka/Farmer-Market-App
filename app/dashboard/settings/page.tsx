// app/dashboard/settings/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    location: '',
    bio: '',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    smsNotifications: false,
  })

  const handleProfileSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700 dark:text-green-300">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          <Card className="p-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
              <User className="w-4 h-4" />
              Profile Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <Shield className="w-4 h-4" />
              Privacy & Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
              <CreditCard className="w-4 h-4" />
              Payment Methods
            </button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="pl-10"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="pl-10"
                      placeholder="your@email.com"
                      type="email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">+1</span>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="pl-8"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="pl-10"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-2 focus:outline-primary/20 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications.emailNotifications ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-muted-foreground">Get notified about order status</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, orderUpdates: !notifications.orderUpdates })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications.orderUpdates ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications.orderUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Promotional Emails</p>
                  <p className="text-sm text-muted-foreground">Receive offers and updates</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, promotionalEmails: !notifications.promotionalEmails })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications.promotionalEmails ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications.promotionalEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </Card>

          {/* Password Change */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline" className="w-full">
                Update Password
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleProfileSave}
              disabled={loading}
              className="gap-2 bg-linear-to-r from-primary to-emerald-600"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}