import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Package, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { user } = useAuth();
  const { items, getCartTotal, getCartSavings, getCartCount, getServiceFee, getTax, getFinalTotal } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Delivery Information
    deliveryType: 'pickup',
    deliveryAddress: user?.address?.street || '',
    deliveryCity: user?.address?.city || '',
    deliveryZipCode: user?.address?.zipCode || '',
    deliveryInstructions: '',
    
    // Payment Information
    paymentMethod: 'cod',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
    
    // Order Preferences
    preferredDeliveryTime: '',
    specialInstructions: '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactPhone) {
      newErrors.contactPhone = 'Phone number is required';
    }

    if (formData.deliveryType === 'delivery') {
      if (!formData.deliveryAddress) {
        newErrors.deliveryAddress = 'Delivery address is required';
      }
      if (!formData.deliveryCity) {
        newErrors.deliveryCity = 'City is required';
      }
      if (!formData.deliveryZipCode) {
        newErrors.deliveryZipCode = 'ZIP code is required';
      }
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!formData.cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      if (!formData.cardExpiry) {
        newErrors.cardExpiry = 'Expiry date is required';
      }
      if (!formData.cardCvv) {
        newErrors.cardCvv = 'CVV is required';
      }
    }

    if (formData.paymentMethod === 'upi') {
      if (!formData.upiId) {
        newErrors.upiId = 'UPI ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Mock API call - in real app, this would create the order
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object
      const orderData = {
        items: items.map(item => ({
          listingId: item.listingId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          vendor: item.vendor
        })),
        pricing: {
          subtotal: getCartTotal(),
          serviceFee: getServiceFee(),
          tax: getTax(),
          total: getFinalTotal(),
          savings: getCartSavings()
        },
        delivery: {
          type: formData.deliveryType,
          address: formData.deliveryType === 'delivery' ? {
            street: formData.deliveryAddress,
            city: formData.deliveryCity,
            zipCode: formData.deliveryZipCode
          } : null,
          instructions: formData.deliveryInstructions
        },
        payment: {
          method: formData.paymentMethod,
          status: 'pending'
        },
        contact: {
          phone: formData.contactPhone,
          email: formData.contactEmail
        },
        specialInstructions: formData.specialInstructions,
        preferredDeliveryTime: formData.preferredDeliveryTime
      };

      console.log('Order created:', orderData);

      // Show success message
      toast.success('Order placed successfully!');

      // Navigate to order confirmation
      navigate('/order-confirmation', { state: { orderData } });

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-600 mb-8">Please login to proceed with checkout</p>
            <div className="space-x-4">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/cart" className="btn btn-secondary">
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add items to your cart before checkout</p>
            <Link to="/marketplace" className="btn btn-primary">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="btn btn-outline inline-flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order details</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={formData.deliveryType === 'pickup'}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50">
                        <Package className="w-6 h-6 text-blue-600 mb-2" />
                        <div className="font-medium">Pickup</div>
                        <div className="text-sm text-gray-600">Free • Same day</div>
                      </div>
                    </label>
                    <label className="relative">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={formData.deliveryType === 'delivery'}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50">
                        <Truck className="w-6 h-6 text-blue-600 mb-2" />
                        <div className="font-medium">Delivery</div>
                        <div className="text-sm text-gray-600">₹50 • 2-4 hours</div>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.deliveryType === 'delivery' && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        className={`input-field ${errors.deliveryAddress ? 'border-red-500' : ''}`}
                        placeholder="Street address"
                      />
                      {errors.deliveryAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="deliveryCity"
                          value={formData.deliveryCity}
                          onChange={handleChange}
                          className={`input-field ${errors.deliveryCity ? 'border-red-500' : ''}`}
                          placeholder="City"
                        />
                        {errors.deliveryCity && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="deliveryZipCode"
                          value={formData.deliveryZipCode}
                          onChange={handleChange}
                          className={`input-field ${errors.deliveryZipCode ? 'border-red-500' : ''}`}
                          placeholder="ZIP code"
                        />
                        {errors.deliveryZipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.deliveryZipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    rows={2}
                    className="input-field"
                    placeholder="Any special instructions for delivery/pickup"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI Payment</option>
                  </select>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={`input-field ${errors.cardNumber ? 'border-red-500' : ''}`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className={`input-field ${errors.cardName ? 'border-red-500' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className={`input-field ${errors.cardExpiry ? 'border-red-500' : ''}`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.cardExpiry && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          className={`input-field ${errors.cardCvv ? 'border-red-500' : ''}`}
                          placeholder="123"
                          maxLength="3"
                        />
                        {errors.cardCvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'upi' && (
                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      className={`input-field ${errors.upiId ? 'border-red-500' : ''}`}
                      placeholder="yourname@upi"
                    />
                    {errors.upiId && (
                      <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`input-field ${errors.contactPhone ? 'border-red-500' : ''}`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Delivery Time
                </label>
                <input
                  type="text"
                  name="preferredDeliveryTime"
                  value={formData.preferredDeliveryTime}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., After 6 PM, Weekend only"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Any special requests or dietary requirements"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Items Summary */}
              <div className="space-y-3 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-gray-600">
                        {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 border-t pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
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
                {formData.deliveryType === 'delivery' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₹50</span>
                  </div>
                )}
                {getCartSavings() > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Total Savings</span>
                    <span>-₹{getCartSavings()}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">
                      ₹{getFinalTotal() + (formData.deliveryType === 'delivery' ? 50 : 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span>Secure Payment Processing</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span>Food Safety Guaranteed</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 text-purple-600 mr-2" />
                  <span>Quality Assurance</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              {/* Terms */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                By placing this order, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
