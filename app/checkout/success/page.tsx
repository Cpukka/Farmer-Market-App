// app/checkout/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { 
  CheckCircle, 
  Truck, 
  Mail, 
  Calendar, 
  Package, 
  Home, 
  ArrowLeft,
  Download,
  Printer,
  Share2
} from 'lucide-react';

interface OrderItem {
  id: string;
  product: {
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  estimatedDelivery?: string;
  farmer: {
    farmName: string;
  };
  items: OrderItem[];
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId, session, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      
      if (data.order) {
        // Format order data
        const formattedOrder: OrderDetails = {
          id: data.order.id,
          orderNumber: `ORD-${data.order.id.slice(0, 8).toUpperCase()}`,
          totalAmount: data.order.totalAmount,
          status: data.order.status,
          createdAt: data.order.createdAt,
          farmer: data.order.farmer,
          items: data.order.items,
          estimatedDelivery: getEstimatedDelivery(data.order.createdAt),
        };
        
        setOrder(formattedOrder);
      } else {
        throw new Error('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error instanceof Error ? error.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedDelivery = (createdAt: string): string => {
    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 business days
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareOrder = () => {
    if (navigator.share && order) {
      navigator.share({
        title: `My Order #${order.orderNumber}`,
        text: `I just ordered from ${order.farmer.farmName} on FarmConnect!`,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  const handleDownloadInvoice = async () => {
    // In a real app, you'd generate and download a PDF
    console.log('Downloading invoice for order:', orderId);
    // For now, we'll just show an alert
    alert('Invoice download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Unable to Load Order</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The order details could not be loaded.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/orders">
              <Button>
                View My Orders
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Return Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you for your order. We&apos;re preparing it for delivery.
          </p>
          <div className="inline-flex items-center gap-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-medium">
              Order #: <span className="font-bold">{order.orderNumber}</span>
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-sm">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Order Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Status</p>
                    <p className="font-semibold capitalize">{order.status.toLowerCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold">{order.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Method</p>
                    <p className="font-semibold">Standard Delivery</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confirmation Email</p>
                    <p className="font-semibold">Sent to {session?.user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Order Items ({order.items.length})</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {item.product.images?.[0] && (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.totalAmount * 0.92).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${(order.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Farmer Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Farmer Information</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {order.farmer.farmName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{order.farmer.farmName}</h3>
                <p className="text-sm text-muted-foreground">
                  Your order is being prepared by {order.farmer.farmName}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Actions & Next Steps */}
        <div className="space-y-6">
          {/* Order Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Order Actions</h2>
            <div className="space-y-3">
              <Button 
                onClick={handleDownloadInvoice}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              
              <Button 
                onClick={handlePrintReceipt}
                variant="outline"
                className="w-full justify-start"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              
              <Button 
                onClick={handleShareOrder}
                variant="outline"
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Order
              </Button>
            </div>
          </Card>

          {/* What's Next */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">What's Next</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Order Confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation shortly
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Order Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    The farmer is preparing your order
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Expect delivery by {order.estimatedDelivery}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Leave a Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your experience after delivery
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Continue Shopping */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Continue Shopping</h2>
            <div className="space-y-3">
              <Link href="/dashboard/orders" className="block">
                <Button className="w-full">
                  View Order Details
                </Button>
              </Link>
              
              <Link href="/products" className="block">
                <Button variant="outline" className="w-full">
                  Browse More Products
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Return to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Need help with your order?{' '}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}