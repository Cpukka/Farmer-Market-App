'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Settings,
  Bell,
  Shield,
  LogOut,
  Edit,
  Check,
  X,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Truck
} from 'lucide-react'
import Image from 'next/image'

type TabType = 'account' | 'orders' | 'addresses' | 'payments' | 'notifications' | 'security'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [isEditing, setIsEditing] = useState(false)

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const [userData, setUserData] = useState({
    name: session?.user?.name || 'John Doe',
    email: session?.user?.email || 'john@example.com',
    phone: '(555) 123-4567',
    avatar: session?.user?.image || '/images/avatars/default.jpg',
    role: session?.user?.role || 'CUSTOMER',
    joinedDate: 'January 15, 2023'
  })

  const [editData, setEditData] = useState({ ...userData })

  const recentOrders = [
    { id: 'ORD-789012', date: 'Jan 15, 2024', total: 45.97, status: 'Delivered', items: 3 },
    { id: 'ORD-789011', date: 'Jan 8, 2024', total: 28.99, status: 'Delivered', items: 2 },
    { id: 'ORD-789010', date: 'Jan 2, 2024', total: 67.45, status: 'Processing', items: 5 },
    { id: 'ORD-789009', date: 'Dec 28, 2023', total: 32.50, status: 'Delivered', items: 2 },
  ]

  const addresses = [
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street',
      city: 'Springfield',
      state: 'CA',
      zip: '12345',
      country: 'United States',
      phone: '(555) 123-4567',
      isDefault: true
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Office Ave',
      city: 'Springfield',
      state: 'CA',
      zip: '12345',
      country: 'United States',
      phone: '(555) 987-6543',
      isDefault: false
    }
  ]

  const paymentMethods = [
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      name: 'Visa ending in 4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      name: 'Mastercard ending in 8888',
      expiry: '08/24',
      isDefault: false
    }
  ]

  const handleSaveProfile = () => {
    setUserData(editData)
    setIsEditing(false)
    // Here you would make an API call to update the user profile
  }

  const handleCancelEdit = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Manage your profile, orders, and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              {/* User Info */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg mb-4">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{userData.name}</h3>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {userData.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Member since {userData.joinedDate}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Sign Out Button */}
              <Button
                variant="outline"
                className="w-full mt-6 gap-2"
                onClick={() => router.push('/api/auth/signout')}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-3">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Check className="w-4 h-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input
                        value={isEditing ? editData.name : userData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input
                        value={isEditing ? editData.email : userData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        disabled={!isEditing}
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input
                        value={isEditing ? editData.phone : userData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        disabled={!isEditing}
                        type="tel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Account Type</label>
                      <div className="flex items-center h-10 px-3 rounded-md border border-input bg-muted">
                        {userData.role === 'FARMER' ? 'Farmer Account' : 'Customer Account'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="card p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Months Active</p>
                  </div>
                  <div className="card p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">$423.75</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive order updates and promotions</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          className="sr-only"
                          defaultChecked
                        />
                        <label
                          htmlFor="email-notifications"
                          className="block h-6 w-12 cursor-pointer rounded-full bg-muted"
                        >
                          <span className="block h-6 w-6 rounded-full bg-primary transform translate-x-6 transition"></span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive delivery updates via SMS</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="sms-notifications"
                          className="sr-only"
                          defaultChecked
                        />
                        <label
                          htmlFor="sms-notifications"
                          className="block h-6 w-12 cursor-pointer rounded-full bg-muted"
                        >
                          <span className="block h-6 w-6 rounded-full bg-primary transform translate-x-6 transition"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order History
                </CardTitle>
                <CardDescription>
                  View and track your recent orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{order.id}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : order.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {order.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {order.items} items
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${order.total.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.status === 'Processing' && (
                            <Button size="sm">
                              Track Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    View All Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Saved Addresses
                    </CardTitle>
                    <CardDescription>
                      Manage your shipping addresses
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className={`border rounded-lg p-4 ${
                      address.isDefault ? 'border-primary bg-primary/5' : ''
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {address.name}
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                Default
                              </span>
                            )}
                          </h3>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} {address.zip}</p>
                        <p>{address.country}</p>
                        <p className="text-muted-foreground">{address.phone}</p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {!address.isDefault && (
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>
                      Manage your saved payment methods
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className={`border rounded-lg p-4 ${
                      method.isDefault ? 'border-primary bg-primary/5' : ''
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                            {method.type === 'visa' ? (
                              <span className="font-bold text-blue-600">VISA</span>
                            ) : (
                              <span className="font-bold text-red-600">MC</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiry}
                              {method.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                                  Default
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transaction History */}
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'TXN-001', date: 'Jan 15, 2024', amount: 45.97, status: 'Completed' },
                      { id: 'TXN-002', date: 'Jan 8, 2024', amount: 28.99, status: 'Completed' },
                      { id: 'TXN-003', date: 'Jan 2, 2024', amount: 67.45, status: 'Pending' },
                    ].map((txn) => (
                      <div key={txn.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{txn.id}</p>
                          <p className="text-sm text-muted-foreground">{txn.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${txn.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{txn.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Order updates', description: 'Get notified about order status changes' },
                      { label: 'Delivery alerts', description: 'Receive delivery time estimates' },
                      { label: 'Promotions & offers', description: 'Get updates on sales and special offers' },
                      { label: 'Farm news', description: 'Updates from your favorite farmers' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`email-${index}`}
                            className="sr-only"
                            defaultChecked={index < 2}
                          />
                          <label
                            htmlFor={`email-${index}`}
                            className="block h-6 w-12 cursor-pointer rounded-full bg-muted"
                          >
                            <span className="block h-6 w-6 rounded-full bg-primary transform translate-x-6 transition"></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Push Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Order ready for pickup', description: 'When your order is ready at the farm' },
                      { label: 'Delivery arriving soon', description: '30 minutes before delivery' },
                      { label: 'Price drop alerts', description: 'When items on your wishlist go on sale' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`push-${index}`}
                            className="sr-only"
                            defaultChecked={index === 0}
                          />
                          <label
                            htmlFor={`push-${index}`}
                            className="block h-6 w-12 cursor-pointer rounded-full bg-muted"
                          >
                            <span className="block h-6 w-6 rounded-full bg-primary transform translate-x-6 transition"></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <Input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input type="password" placeholder="Enter new password" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-factor authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Chrome • Windows • Springfield, CA
                        </p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Log Out
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">
                          iOS • iPhone 14 • Springfield, CA
                        </p>
                        <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4 text-destructive">Danger Zone</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}