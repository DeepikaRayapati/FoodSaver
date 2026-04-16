import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Trash2, 
  ArrowRight,
  Package,
  Clock,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getCartSavings,
    getCartCount,
    getServiceFee,
    getTax,
    getFinalTotal
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Navigate to checkout
    navigate('/checkout');
  };

  const getUrgencyClass = (urgency) => {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return classes[urgency] || classes.medium;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Start adding some delicious food items to your cart!</p>
            <Link
              to="/marketplace"
              className="btn btn-primary inline-flex items-center"
            >
              Browse Marketplace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.listingId} className="card">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.vendor}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyClass(item.urgency)}`}>
                            {item.urgency}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.listingId)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex justify-between items-end">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Qty:</label>
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.listingId, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border-0 focus:ring-0"
                            min="1"
                          />
                          <button
                            onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ₹{item.price * item.quantity}
                          </span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>
                        {item.originalPrice > item.price && (
                          <div className="text-xs text-green-600">
                            Save ₹{(item.originalPrice - item.price) * item.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="btn btn-outline flex items-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee (5%)</span>
                  <span>₹{getServiceFee()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>₹{getTax()}</span>
                </div>

                {getCartSavings() > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Total Savings</span>
                    <span>-₹{getCartSavings()}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">₹{getFinalTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Urgency Alert */}
              {items.some(item => item.urgency === 'urgent' || item.urgency === 'high') && (
                <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-orange-900">Urgent Items!</div>
                      <div className="text-xs text-orange-700">
                        Some items expire soon. Complete your order quickly.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Info */}
              {!user && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-900">
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                      Login
                    </Link>
                    {' '}to get member benefits and faster checkout!
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Package className="w-6 h-6 text-green-600 mb-1" />
                    <span className="text-xs text-gray-600">Secure Packaging</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="text-xs text-gray-600">Quick Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            to="/marketplace"
            className="btn btn-outline inline-flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
