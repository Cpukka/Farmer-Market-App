export interface User {
  id: string
  email: string
  name: string
  image?: string
  role: 'CUSTOMER' | 'FARMER' | 'ADMIN'
  createdAt: Date
}

export interface Farmer {
  id: string
  userId: string
  farmName: string
  description: string
  location: string
  rating: number
  totalSales: number
  image?: string
  bannerImage?: string
  user: User
  products: Product[]
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  stock: number
  images: string[]
  farmerId: string
  farmer: Farmer
  rating: number
  reviews: Review[]
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  comment: string
  user: User
  createdAt: Date
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  farmerId: string
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  deliveryDate?: Date
  address: string
  city: string
  zipCode: string
  phone: string
  notes?: string
  items: OrderItem[]
  createdAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}