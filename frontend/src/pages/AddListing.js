import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, X, Camera, MapPin, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const AddListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'produce',
    foodItems: [{
      name: '',
      quantity: '',
      unit: 'kg',
      originalPrice: '',
      discountedPrice: '',
      expiryDate: ''
    }],
    location: {
      address: '',
      coordinates: {
        lat: '',
        lng: ''
      }
    },
    availability: {
      totalQuantity: '',
      availableQuantity: ''
    },
    logistics: {
      type: 'pickup',
      pickupInstructions: ''
    },
    foodSafety: {
      haccpCompliant: false,
      iso22000Compliant: false,
      handlingInstructions: ''
    }
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'produce', label: 'Produce' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'meat', label: 'Meat' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'prepared', label: 'Prepared Foods' },
    { value: 'canned', label: 'Canned Goods' },
    { value: 'dry', label: 'Dry Goods' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'other', label: 'Other' }
  ];

  const units = ['kg', 'lbs', 'pieces', 'liters', 'gallons', 'boxes'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts[0] === 'foodItems') {
        const index = parseInt(parts[1]);
        const field = parts[2];
        const updatedFoodItems = [...formData.foodItems];
        updatedFoodItems[index][field] = value;
        setFormData(prev => ({
          ...prev,
          foodItems: updatedFoodItems
        }));
      } else {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addFoodItem = () => {
    setFormData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, {
        name: '',
        quantity: '',
        unit: 'kg',
        originalPrice: '',
        discountedPrice: '',
        expiryDate: ''
      }]
    }));
  };

  const removeFoodItem = (index) => {
    if (formData.foodItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        foodItems: prev.foodItems.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      preview: true
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create new listing object
      const newListing = {
        _id: Date.now().toString(), // Use timestamp as ID
        title: formData.title,
        description: formData.description,
        category: formData.category,
        vendor: {
          name: user.name,
          businessName: user.businessInfo?.businessName || user.name
        },
        pricing: {
          totalOriginalPrice: formData.foodItems.reduce((sum, item) => sum + parseFloat(item.originalPrice || 0), 0),
          totalDiscountedPrice: formData.foodItems.reduce((sum, item) => sum + parseFloat(item.discountedPrice || 0), 0)
        },
        urgency: 'medium', // Default urgency
        location: {
          address: formData.location.address
        },
        images: images.map(img => ({ url: img.url, isPrimary: true })),
        foodItems: formData.foodItems,
        createdAt: new Date()
      };

      // Save to localStorage
      const savedListings = JSON.parse(localStorage.getItem('newListings') || '[]');
      savedListings.push(newListing);
      localStorage.setItem('newListings', JSON.stringify(savedListings));

      // Trigger custom event to notify marketplace
      window.dispatchEvent(new Event('newListing'));

      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Listing created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Food Listing</h1>
          <p className="text-gray-600 mt-2">List your surplus food to reduce waste and earn revenue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field"
                  placeholder="e.g., Fresh Vegetables Bundle"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="input-field"
                placeholder="Describe your food items, quality, and any special handling instructions..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Food Items */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Food Items</h2>
              <button
                type="button"
                onClick={addFoodItem}
                className="btn btn-outline flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            {formData.foodItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Item {index + 1}</h3>
                  {formData.foodItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFoodItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name={`foodItems.${index}.name`}
                      required
                      className="input-field"
                      placeholder="e.g., Carrots"
                      value={item.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name={`foodItems.${index}.quantity`}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="e.g., 5"
                      value={item.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <select
                      name={`foodItems.${index}.unit`}
                      required
                      className="input-field"
                      value={item.unit}
                      onChange={handleChange}
                    >
                      {units.map(unit => (
                    <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (₹) *
                    </label>
                    <input
                      type="number"
                      name={`foodItems.${index}.originalPrice`}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="e.g., 150"
                      value={item.originalPrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discounted Price (₹) *
                    </label>
                    <input
                      type="number"
                      name={`foodItems.${index}.discountedPrice`}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="e.g., 75"
                      value={item.discountedPrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name={`foodItems.${index}.expiryDate`}
                      required
                      className="input-field"
                      value={item.expiryDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Pickup Location</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  required
                  className="input-field"
                  placeholder="Enter pickup address"
                  value={formData.location.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="location.coordinates.lat"
                    step="any"
                    className="input-field"
                    placeholder="e.g., 28.6139"
                    value={formData.location.coordinates.lat}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="location.coordinates.lng"
                    step="any"
                    className="input-field"
                    placeholder="e.g., 77.2090"
                    value={formData.location.coordinates.lng}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Food Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Images
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Upload up to 5 images (JPG, PNG, max 5MB each)
              </p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/dashboard"
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
