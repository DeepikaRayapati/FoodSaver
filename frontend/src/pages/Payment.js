import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, Smartphone, Copy, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('scanner');
  const [listing, setListing] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (location.state?.listing) {
      setListing(location.state.listing);
      setQuantity(location.state.quantity || 1);
    } else {
      const urlParams = new URLSearchParams(location.search);
      const listingParam = urlParams.get('listing');
      const quantityParam = urlParams.get('quantity');
      
      if (listingParam) {
        try {
          const parsedListing = JSON.parse(decodeURIComponent(listingParam));
          setListing(parsedListing);
          setQuantity(parseInt(quantityParam) || 1);
        } catch (error) {
          navigate('/marketplace');
          toast.error('Invalid product data');
        }
      } else {
        navigate('/marketplace');
        toast.error('No product selected for payment');
      }
    }
  }, [location, navigate]);

  if (!listing) return null;

  const vendorPaymentDetails = {
    vendorName: listing.vendor?.businessName || listing.vendor?.name,
    scannerImage: listing.vendor?.paymentScanner || '/images/phonepe-qr.jpeg', // Updated to use PhonePe QR with correct extension
    upiId: 'rayapatideepika15@ybl', // Updated UPI ID from user input context if available or generic
    phoneNumber: '+91 98765 43210',
    bankDetails: {
      accountName: listing.vendor?.businessName || listing.vendor?.name,
      accountNumber: 'XXXX XXXX XXXX 1234',
      bankName: 'State Bank of India',
      ifscCode: 'SBIN0001234'
    }
  };

  const totalPrice = (listing.pricing?.totalDiscountedPrice || listing.pricing?.totalOriginalPrice || 0) * quantity;
  const serviceFee = Math.round(totalPrice * 0.05);
  const tax = Math.round(totalPrice * 0.08);
  const finalTotal = totalPrice + serviceFee + tax;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => setCopied(''), 2000);
  };

  const handlePaymentConfirmation = () => {
    toast.success('Payment successful! Redirecting to order confirmation...');
    setTimeout(() => {
      navigate('/order-confirmation', { 
        state: { 
          orderDetails: {
            listing,
            quantity,
            totalPrice,
            serviceFee,
            tax,
            finalTotal,
            paymentMethod: selectedPaymentMethod
          }
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Product
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Pay securely to {vendorPaymentDetails.vendorName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <img src={listing.images?.[0]?.url || '/images/placeholder.jpg'} alt={listing.title} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{listing.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Quantity: {quantity}</span>
                    <span className="font-medium">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee (5%)</span>
                  <span className="font-medium">₹{serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">₹{tax}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <button onClick={() => setSelectedPaymentMethod('scanner')} className={`p-4 border-2 rounded-lg ${selectedPaymentMethod === 'scanner' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <QrCode className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">QR Code</span>
                </button>
                <button onClick={() => setSelectedPaymentMethod('upi')} className={`p-4 border-2 rounded-lg ${selectedPaymentMethod === 'upi' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <Smartphone className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">UPI</span>
                </button>
                <button onClick={() => setSelectedPaymentMethod('cod')} className={`p-4 border-2 rounded-lg ${selectedPaymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <Banknote className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium text-center">Cash on Delivery</span>
                </button>
                <button onClick={() => setSelectedPaymentMethod('bank')} className={`p-4 border-2 rounded-lg ${selectedPaymentMethod === 'bank' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </button>
              </div>

              {selectedPaymentMethod === 'cod' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Banknote className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-medium text-orange-900 mb-2">Cash on Delivery Selected</h3>
                  <p className="text-sm text-orange-700">Please pay the amount to the delivery partner or at the pickup location.</p>
                </div>
              )}

              {selectedPaymentMethod === 'scanner' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Scan QR Code to Pay
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <img src={vendorPaymentDetails.scannerImage} alt="Payment QR Code" className="w-48 h-48 object-contain bg-white p-2 rounded-lg" />
                  </div>
                  <p className="text-sm text-blue-700 text-center">Scan this QR code with any payment app to complete the transaction</p>
                </div>
              )}

              {selectedPaymentMethod === 'upi' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-3 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    UPI Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">UPI ID</p>
                        <p className="text-lg font-mono">{vendorPaymentDetails.upiId}</p>
                      </div>
                      <button onClick={() => copyToClipboard(vendorPaymentDetails.upiId, 'UPI ID')} className="p-2 text-gray-500">
                        {copied === 'UPI ID' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone Number</p>
                        <p className="text-lg font-mono">{vendorPaymentDetails.phoneNumber}</p>
                      </div>
                      <button onClick={() => copyToClipboard(vendorPaymentDetails.phoneNumber, 'Phone Number')} className="p-2 text-gray-500">
                        {copied === 'Phone Number' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'bank' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-3 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Bank Transfer Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Name</p>
                        <p className="text-lg">{vendorPaymentDetails.bankDetails.accountName}</p>
                      </div>
                      <button onClick={() => copyToClipboard(vendorPaymentDetails.bankDetails.accountName, 'Account Name')} className="p-2 text-gray-500">
                        {copied === 'Account Name' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Number</p>
                        <p className="text-lg font-mono">{vendorPaymentDetails.bankDetails.accountNumber}</p>
                      </div>
                      <button onClick={() => copyToClipboard(vendorPaymentDetails.bankDetails.accountNumber, 'Account Number')} className="p-2 text-gray-500">
                        {copied === 'Account Number' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bank Name</p>
                        <p className="text-lg">{vendorPaymentDetails.bankDetails.bankName}</p>
                      </div>
                      <button onClick={() => copyToClipboard(vendorPaymentDetails.bankDetails.bankName, 'Bank Name')} className="p-2 text-gray-500">
                        {copied === 'Bank Name' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">IFSC Code</p>
                        <p className="text-lg font-mono">{vendorPaymentDetails.bankDetails.ifscCode}</p>
                      </div>
                      <button onClick={() => copyToClipboard(vendorPaymentDetails.bankDetails.ifscCode, 'IFSC Code')} className="p-2 text-gray-500">
                        {copied === 'IFSC Code' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-3">Vendor Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium">{vendorPaymentDetails.vendorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium capitalize">{listing.category}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-2">Payment Instructions</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Complete payment using any method</li>
                    <li>• Include order ID in reference</li>
                    <li>• Confirmation takes 2-3 minutes</li>
                    <li>• You'll receive email confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            <button onClick={handlePaymentConfirmation} className="w-full btn btn-primary py-3 text-lg font-medium">
              I Have Completed Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
