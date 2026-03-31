import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Clear cart on successful order
  React.useEffect(() => {
    clearCart();
  }, []);

  // Get order data from location state or use mock data
  const orderData = location.state?.orderData || {
    orderNumber: 'FS' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    items: [
      {
        title: 'Fresh Vegetables Bundle',
        quantity: 2,
        price: 750,
        vendor: 'Fresh Market'
      }
    ],
    pricing: {
      subtotal: 1500,
      serviceFee: 75,
      tax: 126,
      total: 1701,
      savings: 750
    },
    delivery: {
      type: 'pickup',
      address: null
    },
    payment: {
      method: 'cod',
      status: 'pending'
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'customer@example.com'
    },
    estimatedDelivery: 'Today, 6:00 PM - 8:00 PM'
  };

  const getPaymentMethodDisplay = (method) => {
    const methods = {
      'cod': 'Cash on Delivery',
      'card': 'Credit/Debit Card',
      'upi': 'UPI Payment'
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received it and are preparing your items.
          </p>
          <div className="mt-4">
            <span className="text-lg font-semibold">Order Number: </span>
            <span className="text-lg font-bold text-green-600">{orderData.orderNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Order Items
              </h2>
              
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.vendor}</p>
                      <p className="text-sm text-gray-600">{item.quantity} × ₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                Delivery Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      {orderData.delivery.type === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
                    </div>
                    {orderData.delivery.type === 'pickup' ? (
                      <div className="text-gray-600">
                        <p>Vendor's location</p>
                        <p className="text-sm">Available for pickup today</p>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        <p>{orderData.delivery.address?.street}</p>
                        <p>{orderData.delivery.address?.city}, {orderData.delivery.address?.zipCode}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Estimated {orderData.delivery.type === 'pickup' ? 'Pickup' : 'Delivery'} Time</div>
                    <div className="text-gray-600">
                      {orderData.estimatedDelivery || 'Today, 6:00 PM - 8:00 PM'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="font-medium">Payment Method</div>
                  <div className="text-gray-600">{getPaymentMethodDisplay(orderData.payment.method)}</div>
                </div>
                
                <div>
                  <div className="font-medium">Payment Status</div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {orderData.payment.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                </div>

                {orderData.payment.method === 'cod' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-900">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-xs mt-1">
                        Please have exact amount ready: ₹{orderData.pricing.total}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{orderData.contact.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{orderData.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{orderData.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span>₹{orderData.pricing.serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{orderData.pricing.tax}</span>
                </div>
                {orderData.delivery.type === 'delivery' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₹50</span>
                  </div>
                )}
                {orderData.pricing.savings > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Total Savings</span>
                    <span>-₹{orderData.pricing.savings}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span className="text-green-600">
                      ₹{orderData.pricing.total + (orderData.delivery.type === 'delivery' ? 50 : 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm text-green-900">
                    <div className="font-medium mb-1">What's Next?</div>
                    <div className="text-xs space-y-1">
                      <div>• We'll confirm your order with the vendor</div>
                      <div>• You'll receive pickup/delivery instructions</div>
                      <div>• Track your order status in real-time</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  View Order Status
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                
                <Link
                  to="/marketplace"
                  className="w-full btn btn-outline"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Help Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Need Help?</div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <Phone className="w-4 h-4 inline mr-1" />
                      +91 98765 43210
                    </div>
                    <div className="text-sm">
                      <Mail className="w-4 h-4 inline mr-1" />
                      support@foodsaver.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
