import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Heart } from 'lucide-react';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]); // Store all listings
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    urgency: '',
    search: ''
  });

  // Load listings from localStorage and mock data
  useEffect(() => {
    const mockListings = [
      {
        _id: '1',
        title: 'Fresh Vegetables Bundle',
        description: 'Mixed seasonal vegetables including carrots, broccoli, and spinach',
        vendor: { name: 'Green Grocer', businessName: 'Fresh Market' },
        category: 'produce',
        pricing: { totalOriginalPrice: 1500, totalDiscountedPrice: 750 },
        urgency: 'medium',
        location: { address: '123 Main St, City' },
        images: [{ url: '/images/vegetables-bundle.jpg', isPrimary: true }],
        foodItems: [{ expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }]
      },
      {
        _id: '2',
        title: 'Baked Goods Assortment',
        description: 'Fresh bread, pastries, and cakes from today\'s batch',
        vendor: { name: 'Sweet Bakery', businessName: 'Sweet Bakery' },
        category: 'bakery',
        pricing: { totalOriginalPrice: 2000, totalDiscountedPrice: 1000 },
        urgency: 'high',
        location: { address: '456 Oak Ave, City' },
        images: [{ url: '/images/baked-goods.jpg', isPrimary: true }],
        foodItems: [{ expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }]
      },
      {
        _id: '3',
        title: 'Organic Dairy Products',
        description: 'Fresh milk, cheese, and yogurt from local farm',
        vendor: { name: 'Happy Farms', businessName: 'Happy Farms Dairy' },
        category: 'dairy',
        pricing: { totalOriginalPrice: 1200, totalDiscountedPrice: 600 },
        urgency: 'medium',
        location: { address: '789 Pine Rd, City' },
        images: [{ url: '/images/dairy-products.jpg', isPrimary: true }],
        foodItems: [{ expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }]
      },
      {
        _id: '4',
        title: 'Fresh Seafood Selection',
        description: 'Today\'s catch of fish and prawns from local waters',
        vendor: { name: 'Ocean Fresh', businessName: 'Ocean Fresh Seafood' },
        category: 'seafood',
        pricing: { totalOriginalPrice: 3000, totalDiscountedPrice: 1800 },
        urgency: 'urgent',
        location: { address: '321 Harbor St, City' },
        images: [{ url: '/images/seafood-fresh.jpg', isPrimary: true }],
        foodItems: [{ expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }]
      },
      {
        _id: '5',
        title: 'Prepared Meals Package',
        description: 'Ready-to-eat meals including pasta, salads, and sandwiches',
        vendor: { name: 'Quick Meals', businessName: 'Quick Kitchen' },
        category: 'prepared',
        pricing: { totalOriginalPrice: 2500, totalDiscountedPrice: 1250 },
        urgency: 'high',
        location: { address: '654 Food Court, City' },
        images: [{ url: '/images/prepared-meals.jpg', isPrimary: true }],
        foodItems: [{ expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }]
      },
      {
        _id: '6',
        title: 'Fresh Fruits Basket',
        description: 'Seasonal fruits including apples, oranges, and bananas',
        vendor: { name: 'Fruit Haven', businessName: 'Fruit Haven' },
        category: 'produce',
        pricing: { totalOriginalPrice: 1800, totalDiscountedPrice: 900 },
        urgency: 'low',
        location: { address: '987 Orchard Ln, City' },
        images: [{ url: '/images/fruits-basket.jpg', isPrimary: true }],
        foodItems: [{ expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) }]
      }
    ];

    // Load new listings from localStorage
    const savedListings = JSON.parse(localStorage.getItem('newListings') || '[]');
    const combinedListings = [...savedListings, ...mockListings];
    
    setAllListings(combinedListings);
    setListings(combinedListings);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = allListings;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        listing.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(listing => listing.category === filters.category);
    }

    // Apply urgency filter
    if (filters.urgency) {
      filtered = filtered.filter(listing => listing.urgency === filters.urgency);
    }

    setListings(filtered);
  }, [filters, allListings]);

  // Listen for storage changes to refresh listings
  useEffect(() => {
    const handleStorageChange = () => {
      const savedListings = JSON.parse(localStorage.getItem('newListings') || '[]');
      const mockListings = [
        {
          _id: '1',
          title: 'Fresh Vegetables Bundle',
          description: 'Mixed seasonal vegetables including carrots, broccoli, and spinach',
          vendor: { name: 'Green Grocer', businessName: 'Fresh Market' },
          category: 'produce',
          pricing: { totalOriginalPrice: 1500, totalDiscountedPrice: 750 },
          urgency: 'medium',
          location: { address: '123 Main St, City' },
          images: [{ url: '/images/vegetables-bundle.jpg', isPrimary: true }],
          foodItems: [{ expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }]
        },
        {
          _id: '2',
          title: 'Baked Goods Assortment',
          description: 'Fresh bread, pastries, and cakes from today\'s batch',
          vendor: { name: 'Sweet Bakery', businessName: 'Sweet Bakery' },
          category: 'bakery',
          pricing: { totalOriginalPrice: 2000, totalDiscountedPrice: 1000 },
          urgency: 'high',
          location: { address: '456 Oak Ave, City' },
          images: [{ url: '/images/baked-goods.jpg', isPrimary: true }],
          foodItems: [{ expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }]
        },
        {
          _id: '3',
          title: 'Organic Dairy Products',
          description: 'Fresh milk, cheese, and yogurt from local farm',
          vendor: { name: 'Happy Farms', businessName: 'Happy Farms Dairy' },
          category: 'dairy',
          pricing: { totalOriginalPrice: 1200, totalDiscountedPrice: 600 },
          urgency: 'medium',
          location: { address: '789 Pine Rd, City' },
          images: [{ url: '/images/dairy-products.jpg', isPrimary: true }],
          foodItems: [{ expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }]
        },
        {
          _id: '4',
          title: 'Fresh Seafood Selection',
          description: 'Today\'s catch of fish and prawns from local waters',
          vendor: { name: 'Ocean Fresh', businessName: 'Ocean Fresh Seafood' },
          category: 'seafood',
          pricing: { totalOriginalPrice: 3000, totalDiscountedPrice: 1800 },
          urgency: 'urgent',
          location: { address: '321 Harbor St, City' },
          images: [{ url: '/images/seafood-fresh.jpg', isPrimary: true }],
          foodItems: [{ expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }]
        },
        {
          _id: '5',
          title: 'Prepared Meals Package',
          description: 'Ready-to-eat meals including pasta, salads, and sandwiches',
          vendor: { name: 'Quick Meals', businessName: 'Quick Kitchen' },
          category: 'prepared',
          pricing: { totalOriginalPrice: 2500, totalDiscountedPrice: 1250 },
          urgency: 'high',
          location: { address: '654 Food Court, City' },
          images: [{ url: '/images/prepared-meals.jpg', isPrimary: true }],
          foodItems: [{ expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }]
        },
        {
          _id: '6',
          title: 'Fresh Fruits Basket',
          description: 'Seasonal fruits including apples, oranges, and bananas',
          vendor: { name: 'Fruit Haven', businessName: 'Fruit Haven' },
          category: 'produce',
          pricing: { totalOriginalPrice: 1800, totalDiscountedPrice: 900 },
          urgency: 'low',
          location: { address: '987 Orchard Ln, City' },
          images: [{ url: '/images/fruits-basket.jpg', isPrimary: true }],
          foodItems: [{ expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) }]
        }
      ];
      const combinedListings = [...savedListings, ...mockListings];
      setAllListings(combinedListings);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('newListing', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('newListing', handleStorageChange);
    };
  }, []);

  const getUrgencyClass = (urgency) => {
    const classes = {
      low: 'urgency-low',
      medium: 'urgency-medium',
      high: 'urgency-high',
      urgent: 'urgency-urgent'
    };
    return classes[urgency] || 'urgency-medium';
  };

  const getDiscountPercentage = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Food Marketplace</h1>
          <p className="text-gray-600">Discover great deals on quality food while reducing waste</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for food items..."
                  className="input-field pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="produce">Produce</option>
              <option value="meat">Meat</option>
              <option value="dairy">Dairy</option>
              <option value="bakery">Bakery</option>
              <option value="seafood">Seafood</option>
              <option value="prepared">Prepared Foods</option>
            </select>
            <select
              className="input-field"
              value={filters.urgency}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            >
              <option value="">All Urgency Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="card hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative mb-4">
                <img
                  src={listing.images[0]?.url || '/api/placeholder/300/200'}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={getUrgencyClass(listing.urgency)}>
                    {listing.urgency.toUpperCase()}
                  </span>
                </div>
                <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location.address}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Expires in {Math.ceil((listing.foodItems[0].expiryDate - new Date()) / (1000 * 60 * 60 * 24))} days
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{listing.pricing.totalDiscountedPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{listing.pricing.totalOriginalPrice}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {getDiscountPercentage(listing.pricing.totalOriginalPrice, listing.pricing.totalDiscountedPrice)}% OFF
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">by</div>
                    <div className="text-sm font-medium">{listing.vendor.businessName}</div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Link
                    to={`/listing/${listing._id}`}
                    className="flex-1 btn btn-primary text-sm py-2"
                  >
                    View Details
                  </Link>
                  <button className="btn btn-outline px-4 py-2">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
