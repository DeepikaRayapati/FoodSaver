import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Upload, Camera, MapPin, Clock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'consumer',
    address: {
      street: '',
      city: '',
      zipCode: '',
      coordinates: { lat: '', lng: '' }
    },
    businessInfo: {
      businessName: '',
      businessType: 'restaurant',
      licenseNumber: '',
      description: '',
      website: '',
      foundedYear: '',
      operatingHours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '22:00', closed: false },
        saturday: { open: '09:00', close: '22:00', closed: false },
        sunday: { open: '09:00', close: '22:00', closed: true }
      },
      paymentMethods: {
        upi: { enabled: true, upiId: '', qrCode: null },
        bankTransfer: { enabled: false, accountNumber: '', ifsc: '', bankName: '' },
        cash: { enabled: true }
      },
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: ''
      }
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCodePreview, setQrCodePreview] = useState(null);
  const [shopImages, setShopImages] = useState([]);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('QR code image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          businessInfo: {
            ...prev.businessInfo,
            paymentMethods: {
              ...prev.businessInfo.paymentMethods,
              upi: {
                ...prev.businessInfo.paymentMethods.upi,
                qrCode: reader.result
              }
            }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShopImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      preview: true
    }));
    setShopImages(prev => [...prev, ...newImages]);
  };

  const removeShopImage = (index) => {
    setShopImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      // Only include business info for vendors
      if (registrationData.role !== 'vendor') {
        delete registrationData.businessInfo;
      }

      // Check for duplicate business name and license before submission
      if (registrationData.role === 'vendor' && registrationData.businessInfo) {
        // This would ideally be an API call to check duplicates
        // For now, we'll let the backend handle it
      }

      const result = await register(registrationData);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        // Handle specific duplicate errors
        if (result.error?.includes('already exists') || result.error?.includes('already registered')) {
          toast.error(result.error);
        } else {
          toast.error(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">FS</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your FoodSaver account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the community fighting food waste
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="consumer"
                    checked={formData.role === 'consumer'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50">
                    <User className="w-6 h-6 mx-auto mb-2 text-gray-600 peer-checked:text-green-600" />
                    <div className="text-center font-medium">Consumer</div>
                    <div className="text-xs text-gray-500 text-center">Buy food at great prices</div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    checked={formData.role === 'vendor'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="p-4 border-2 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50">
                    <Building className="w-6 h-6 mx-auto mb-2 text-gray-600 peer-checked:text-green-600" />
                    <div className="text-center font-medium">Vendor</div>
                    <div className="text-xs text-gray-500 text-center">List surplus food</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="input-field pl-10"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input-field pl-10"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="input-field pl-10"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pl-10 pr-10"
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="address.street"
                    placeholder="Street Address"
                    className="input-field"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="address.zipCode"
                    placeholder="ZIP Code"
                    className="input-field"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  className="input-field"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Business Information (for vendors) */}
            {formData.role === 'vendor' && (
              <div className="border-t pt-6 space-y-8">
                <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
                
                {/* Basic Business Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      name="businessInfo.businessName"
                      type="text"
                      required
                      className="input-field mt-1"
                      placeholder="Restaurant Name"
                      value={formData.businessInfo.businessName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                      Business Type *
                    </label>
                    <select
                      id="businessType"
                      name="businessInfo.businessType"
                      required
                      className="input-field mt-1"
                      value={formData.businessInfo.businessType}
                      onChange={handleChange}
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="bakery">Bakery</option>
                      <option value="grocery">Grocery Store</option>
                      <option value="catering">Catering Service</option>
                      <option value="hotel">Hotel</option>
                      <option value="cafe">Cafe</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                      License Number *
                    </label>
                    <input
                      id="licenseNumber"
                      name="businessInfo.licenseNumber"
                      type="text"
                      required
                      className="input-field mt-1"
                      placeholder="Business License Number"
                      value={formData.businessInfo.licenseNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                      Founded Year
                    </label>
                    <input
                      id="foundedYear"
                      name="businessInfo.foundedYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="input-field mt-1"
                      placeholder="2020"
                      value={formData.businessInfo.foundedYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Business Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="businessInfo.description"
                    rows={3}
                    className="input-field mt-1"
                    placeholder="Tell us about your business, cuisine, and what makes you special..."
                    value={formData.businessInfo.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    id="website"
                    name="businessInfo.website"
                    type="url"
                    className="input-field mt-1"
                    placeholder="https://your-website.com"
                    value={formData.businessInfo.website}
                    onChange={handleChange}
                  />
                </div>

                {/* Shop Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="shopImages" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload shop images
                          </span>
                          <input
                            id="shopImages"
                            name="shopImages"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleShopImagesUpload}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB each
                          </p>
                        </label>
                      </div>
                    </div>
                    
                    {shopImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {shopImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.url}
                              alt={`Shop ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeShopImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Operating Hours
                  </label>
                  <div className="space-y-2">
                    {Object.entries(formData.businessInfo.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={`businessInfo.operatingHours.${day}.closed`}
                          checked={hours.closed}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="w-20 capitalize text-sm">{day}</span>
                        <input
                          type="time"
                          name={`businessInfo.operatingHours.${day}.open`}
                          value={hours.open}
                          onChange={handleChange}
                          disabled={hours.closed}
                          className="text-sm border rounded px-2 py-1"
                        />
                        <span className="text-sm">to</span>
                        <input
                          type="time"
                          name={`businessInfo.operatingHours.${day}.close`}
                          value={hours.close}
                          onChange={handleChange}
                          disabled={hours.closed}
                          className="text-sm border rounded px-2 py-1"
                        />
                        {hours.closed && <span className="text-sm text-gray-500">Closed</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Payment Methods
                  </label>
                  <div className="space-y-4">
                    {/* UPI Payment */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          name="businessInfo.paymentMethods.upi.enabled"
                          checked={formData.businessInfo.paymentMethods.upi.enabled}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label className="ml-2 text-sm font-medium">UPI Payments</label>
                      </div>
                      
                      {formData.businessInfo.paymentMethods.upi.enabled && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600">UPI ID</label>
                            <input
                              type="text"
                              name="businessInfo.paymentMethods.upi.upiId"
                              placeholder="your-business@upi"
                              className="input-field text-sm"
                              value={formData.businessInfo.paymentMethods.upi.upiId}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">QR Code Scanner</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <div className="text-center">
                                <Camera className="mx-auto h-8 w-8 text-gray-400" />
                                <label htmlFor="qrCode" className="cursor-pointer">
                                  <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Upload QR Code
                                  </span>
                                  <input
                                    id="qrCode"
                                    name="qrCode"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleQrCodeUpload}
                                  />
                                  <p className="mt-1 text-xs text-gray-500">
                                    Upload your UPI QR code image
                                  </p>
                                </label>
                              </div>
                              
                              {qrCodePreview && (
                                <div className="mt-3 flex justify-center">
                                  <img
                                    src={qrCodePreview}
                                    alt="QR Code"
                                    className="w-32 h-32 object-contain border rounded"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bank Transfer */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          name="businessInfo.paymentMethods.bankTransfer.enabled"
                          checked={formData.businessInfo.paymentMethods.bankTransfer.enabled}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label className="ml-2 text-sm font-medium">Bank Transfer</label>
                      </div>
                      
                      {formData.businessInfo.paymentMethods.bankTransfer.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            name="businessInfo.paymentMethods.bankTransfer.bankName"
                            placeholder="Bank Name"
                            className="input-field text-sm"
                            value={formData.businessInfo.paymentMethods.bankTransfer.bankName}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="businessInfo.paymentMethods.bankTransfer.accountNumber"
                            placeholder="Account Number"
                            className="input-field text-sm"
                            value={formData.businessInfo.paymentMethods.bankTransfer.accountNumber}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="businessInfo.paymentMethods.bankTransfer.ifsc"
                            placeholder="IFSC Code"
                            className="input-field text-sm"
                            value={formData.businessInfo.paymentMethods.bankTransfer.ifsc}
                            onChange={handleChange}
                          />
                        </div>
                      )}
                    </div>

                    {/* Cash on Delivery */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="businessInfo.paymentMethods.cash.enabled"
                        checked={formData.businessInfo.paymentMethods.cash.enabled}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label className="ml-2 text-sm font-medium">Cash on Delivery</label>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="businessInfo.socialMedia.facebook"
                      placeholder="Facebook URL"
                      className="input-field text-sm"
                      value={formData.businessInfo.socialMedia.facebook}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="businessInfo.socialMedia.instagram"
                      placeholder="Instagram URL"
                      className="input-field text-sm"
                      value={formData.businessInfo.socialMedia.instagram}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="businessInfo.socialMedia.twitter"
                      placeholder="Twitter URL"
                      className="input-field text-sm"
                      value={formData.businessInfo.socialMedia.twitter}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-4 h-4 mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
