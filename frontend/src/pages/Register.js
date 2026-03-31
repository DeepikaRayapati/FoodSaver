import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, Camera, Upload } from 'lucide-react';
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
      zipCode: ''
    },
    businessInfo: {
      businessName: '',
      businessType: 'restaurant',
      licenseNumber: '',
      paymentScanner: null
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannerPreview, setScannerPreview] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleScannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setScannerPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          businessInfo: {
            ...prev.businessInfo,
            paymentScanner: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
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

      const result = await register(registrationData);
      
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
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
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      name="businessInfo.businessName"
                      type="text"
                      className="input-field mt-1"
                      placeholder="Restaurant Name"
                      value={formData.businessInfo.businessName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      name="businessInfo.businessType"
                      className="input-field mt-1"
                      value={formData.businessInfo.businessType}
                      onChange={handleChange}
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="grocery">Grocery Store</option>
                      <option value="bakery">Bakery</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    Business License Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="businessInfo.licenseNumber"
                    type="text"
                    className="input-field mt-1"
                    placeholder="License #"
                    value={formData.businessInfo.licenseNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Scanner (QR Code/Bar Code)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-green-500 focus:outline-none">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleScannerUpload}
                        />
                        {scannerPreview ? (
                          <div className="relative">
                            <img
                              src={scannerPreview}
                              alt="Payment Scanner"
                              className="h-24 w-24 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-sm">Upload Payment Scanner</span>
                            <span className="text-xs">QR Code or Bar Code</span>
                          </div>
                        )}
                      </label>
                    </div>
                    {scannerPreview && (
                      <div className="flex-1">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-green-800 mb-1">Scanner Uploaded</h4>
                          <p className="text-xs text-green-600">Your payment scanner has been uploaded successfully</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Upload your QR code or bar code for payments (Max size: 5MB)
                  </p>
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
