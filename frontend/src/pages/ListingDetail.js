import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  MapPin, 
  Clock, 
  Package, 
  Heart, 
  Share2, 
  Phone, 
  Mail,
  Truck,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Load listing by ID from localStorage and mock data
    const mockListings = [
      {
        _id: '1',
        title: 'Fresh Vegetables Bundle',
        description: 'Mixed seasonal vegetables including carrots, broccoli, spinach, and tomatoes. All vegetables are organic, locally sourced, and harvested within the last 24 hours. Perfect for healthy meals and cooking.',
        vendor: { 
          name: 'Green Grocer', 
          businessName: 'Fresh Market',
          phone: '+91 98765 43210',
          email: 'green@freshmarket.com',
          address: '123 Main St, New York, NY 10001',
          rating: 4.8,
          verified: true,
          paymentScanner: '/images/phonepe-qr.jpeg'
        },
        category: 'produce',
        pricing: { totalOriginalPrice: 1500, totalDiscountedPrice: 750 },
        urgency: 'medium',
        location: { 
          address: '123 Main St, New York, NY 10001',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        images: [
          { url: '/images/vegetables-bundle.jpg', isPrimary: true },
          { url: '/images/vegetables-mixed.jpg', isPrimary: false },
          { url: '/images/fresh-produce.jpg', isPrimary: false },
          { url: '/images/organic-vegetables.jpg', isPrimary: false }
        ],
        foodItems: [
          { name: 'Carrots', quantity: '2', unit: 'kg', originalPrice: 60, discountedPrice: 40, expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
          { name: 'Broccoli', quantity: '1', unit: 'kg', originalPrice: 80, discountedPrice: 50, expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
          { name: 'Spinach', quantity: '500', unit: 'g', originalPrice: 40, discountedPrice: 25, expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
          { name: 'Tomatoes', quantity: '1', unit: 'kg', originalPrice: 60, discountedPrice: 35, expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(),
        foodSafety: {
          haccpCompliant: true,
          iso22000Compliant: false,
          handlingInstructions: 'Keep refrigerated, wash before use'
        },
        logistics: {
          type: 'pickup',
          pickupInstructions: 'Available for pickup between 9 AM - 6 PM'
        }
      },
      {
        _id: '2',
        title: 'Baked Goods Assortment',
        description: 'Fresh bread, pastries, and cakes from today\'s batch. All items are made with premium ingredients and traditional baking methods. Includes sourdough bread, croissants, muffins, and a special cake of the day.',
        vendor: { 
          name: 'Sweet Bakery', 
          businessName: 'Sweet Bakery',
          phone: '+91 98765 43211',
          email: 'hello@sweetbakery.com',
          address: '456 Oak Ave, New York, NY 10002',
          rating: 4.9,
          verified: true,
          paymentScanner: '/images/phonepe-qr.jpeg'
        },
        category: 'bakery',
        pricing: { totalOriginalPrice: 2000, totalDiscountedPrice: 1000 },
        urgency: 'high',
        location: { 
          address: '456 Oak Ave, New York, NY 10002',
          coordinates: { lat: 40.7260, lng: -73.9897 }
        },
        images: [
          { url: '/images/baked-goods.jpg', isPrimary: true },
          { url: '/images/fresh-bread.jpg', isPrimary: false },
          { url: '/images/pastries.jpg', isPrimary: false }
        ],
        foodItems: [
          { name: 'Sourdough Bread', quantity: '2', unit: 'loaves', originalPrice: 120, discountedPrice: 80, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Croissants', quantity: '6', unit: 'pieces', originalPrice: 180, discountedPrice: 120, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Muffins', quantity: '12', unit: 'pieces', originalPrice: 240, discountedPrice: 150, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Special Cake', quantity: '1', unit: 'whole', originalPrice: 600, discountedPrice: 350, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(),
        foodSafety: {
          haccpCompliant: true,
          iso22000Compliant: true,
          handlingInstructions: 'Store in airtight container, consume within 24 hours'
        },
        logistics: {
          type: 'pickup',
          pickupInstructions: 'Fresh items available from 7 AM - 10 AM'
        }
      },
      {
        _id: '3',
        title: 'Organic Dairy Products',
        description: 'Fresh milk, cheese, and yogurt from local farm. All products are organic, hormone-free, and made from grass-fed cows. Perfect for health-conscious consumers who want the best quality dairy products.',
        vendor: { 
          name: 'Happy Farms', 
          businessName: 'Happy Farms Dairy',
          phone: '+91 98765 43212',
          email: 'info@happyfarms.com',
          address: '789 Pine Rd, New York, NY 10003',
          rating: 4.7,
          verified: true,
          paymentScanner: '/images/phonepe-qr.jpeg'
        },
        category: 'dairy',
        pricing: { totalOriginalPrice: 1200, totalDiscountedPrice: 600 },
        urgency: 'medium',
        location: { 
          address: '789 Pine Rd, New York, NY 10003',
          coordinates: { lat: 40.7489, lng: -73.9680 }
        },
        images: [
          { url: '/images/dairy-products.jpg', isPrimary: true },
          { url: '/images/fresh-milk.jpg', isPrimary: false },
          { url: '/images/cheese.jpg', isPrimary: false }
        ],
        foodItems: [
          { name: 'Fresh Milk', quantity: '5', unit: 'liters', originalPrice: 150, discountedPrice: 100, expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
          { name: 'Cheddar Cheese', quantity: '1', unit: 'kg', originalPrice: 400, discountedPrice: 250, expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          { name: 'Greek Yogurt', quantity: '1', unit: 'kg', originalPrice: 200, discountedPrice: 120, expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
          { name: 'Butter', quantity: '500', unit: 'g', originalPrice: 150, discountedPrice: 80, expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(),
        foodSafety: {
          haccpCompliant: true,
          iso22000Compliant: false,
          handlingInstructions: 'Keep refrigerated at 4°C or below'
        },
        logistics: {
          type: 'pickup',
          pickupInstructions: 'Available for pickup 24/7 at farm gate'
        }
      },
      {
        _id: '4',
        title: 'Fresh Seafood Selection',
        description: 'Today\'s catch of fish and prawns from local waters. All seafood is caught within the last 12 hours, sustainably sourced, and handled with care to maintain maximum freshness.',
        vendor: { 
          name: 'Ocean Fresh', 
          businessName: 'Ocean Fresh Seafood',
          phone: '+91 98765 43213',
          email: 'catch@oceanfresh.com',
          address: '321 Harbor St, New York, NY 10004',
          rating: 4.6,
          verified: true,
          paymentScanner: '/images/phonepe-qr.jpeg'
        },
        category: 'seafood',
        pricing: { totalOriginalPrice: 3000, totalDiscountedPrice: 1800 },
        urgency: 'urgent',
        location: { 
          address: '321 Harbor St, New York, NY 10004',
          coordinates: { lat: 40.7580, lng: -74.0208 }
        },
        images: [
          { url: '/images/seafood-fresh.jpg', isPrimary: true },
          { url: '/images/fresh-fish.jpg', isPrimary: false },
          { url: '/images/prawns.jpg', isPrimary: false }
        ],
        foodItems: [
          { name: 'Salmon', quantity: '2', unit: 'kg', originalPrice: 1200, discountedPrice: 800, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Tuna', quantity: '1', unit: 'kg', originalPrice: 800, discountedPrice: 500, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Prawns', quantity: '500', unit: 'g', originalPrice: 600, discountedPrice: 350, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Mackerel', quantity: '1', unit: 'kg', originalPrice: 400, discountedPrice: 150, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(),
        foodSafety: {
          haccpCompliant: true,
          iso22000Compliant: true,
          handlingInstructions: 'Keep on ice, consume within 24 hours'
        },
        logistics: {
          type: 'pickup',
          pickupInstructions: 'Available for pickup 6 AM - 10 AM daily'
        }
      },
      {
        _id: '5',
        title: 'Prepared Meals Package',
        description: 'Ready-to-eat meals including pasta, salads, and sandwiches. All meals are prepared fresh daily by professional chefs using high-quality ingredients. Perfect for busy professionals and families.',
        vendor: { 
          name: 'Quick Meals', 
          businessName: 'Quick Kitchen',
          phone: '+91 98765 43214',
          email: 'orders@quickkitchen.com',
          address: '654 Food Court, New York, NY 10005',
          rating: 4.5,
          verified: true,
          paymentScanner: '/images/phonepe-qr.jpeg'
        },
        category: 'prepared',
        pricing: { totalOriginalPrice: 2500, totalDiscountedPrice: 1250 },
        urgency: 'high',
        location: { 
          address: '654 Food Court, New York, NY 10005',
          coordinates: { lat: 40.7614, lng: -73.9776 }
        },
        images: [
          { url: '/images/prepared-meals.jpg', isPrimary: true },
          { url: '/images/pasta-dish.jpg', isPrimary: false },
          { url: '/images/fresh-salad.jpg', isPrimary: false }
        ],
        foodItems: [
          { name: 'Pasta Alfredo', quantity: '2', unit: 'servings', originalPrice: 300, discountedPrice: 180, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Caesar Salad', quantity: '2', unit: 'servings', originalPrice: 200, discountedPrice: 120, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Club Sandwich', quantity: '4', unit: 'pieces', originalPrice: 400, discountedPrice: 250, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
          { name: 'Soup of the Day', quantity: '1', unit: 'liter', originalPrice: 150, discountedPrice: 80, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(),
        foodSafety: {
          haccpCompliant: true,
          iso22000Compliant: false,
          handlingInstructions: 'Reheat to 75°C before consumption'
        },
        logistics: {
          type: 'delivery',
          pickupInstructions: 'Delivery available within 5km radius'
        }
      },
      {
        _id: '6',
        title: 'Fresh Fruits Basket',
        description: 'Seasonal fruits including apples, oranges, bananas, and berries. All fruits are hand-picked at peak ripeness, organic when possible, and perfect for healthy snacking or making fresh juices.',
        vendor: { 
          name: 'Fruit Haven', 
          businessName: 'Fruit Haven',
          phone: '+91 98765 43215',
          email: 'fresh@fruithaven.com',
          address: '987 Orchard Ln, New York, NY 10006',
          rating: 4.8,
          verified: true,
          paymentScanner: '/images/phonepe-qr.jpeg'
        },
        category: 'produce',
        pricing: { totalOriginalPrice: 1800, totalDiscountedPrice: 900 },
        urgency: 'low',
        location: { 
          address: '987 Orchard Ln, New York, NY 10006',
          coordinates: { lat: 40.7831, lng: -73.9712 }
        },
        images: [
          { url: '/images/fruits-basket.jpg', isPrimary: true },
          { url: '/images/mixed-fruits.jpg', isPrimary: false },
          { url: '/images/fresh-berries.jpg', isPrimary: false }
        ],
        foodItems: [
          { name: 'Apples', quantity: '2', unit: 'kg', originalPrice: 160, discountedPrice: 100, expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
          { name: 'Oranges', quantity: '2', unit: 'kg', originalPrice: 120, discountedPrice: 80, expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
          { name: 'Bananas', quantity: '1', unit: 'kg', originalPrice: 60, discountedPrice: 40, expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
          { name: 'Mixed Berries', quantity: '500', unit: 'g', originalPrice: 400, discountedPrice: 200, expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
        ],
        createdAt: new Date(),
        foodSafety: {
          haccpCompliant: true,
          iso22000Compliant: false,
          handlingInstructions: 'Wash before consumption, store in refrigerator'
        },
        logistics: {
          type: 'pickup',
          pickupInstructions: 'Available for pickup 8 AM - 7 PM'
        }
      }
    ];

    try {
      // Load new listings from localStorage
      const savedListings = JSON.parse(localStorage.getItem('newListings') || '[]');
      
      // Validate and fix new listings structure
      const validListings = savedListings.map(listing => {
        // Ensure listing has all required fields
        return {
          _id: listing._id || Date.now().toString(),
          title: listing.title || 'Untitled Listing',
          description: listing.description || 'No description available',
          vendor: {
            name: listing.vendor?.name || 'Unknown Vendor',
            businessName: listing.vendor?.businessName || listing.vendor?.name || 'Unknown Business',
            phone: listing.vendor?.phone || '+91 00000 00000',
            email: listing.vendor?.email || 'vendor@example.com',
            address: listing.vendor?.address || 'No address provided',
            rating: listing.vendor?.rating || 4.0,
            verified: listing.vendor?.verified || false,
            paymentScanner: listing.vendor?.paymentScanner || '/images/phonepe-qr.jpeg'
          },
          category: listing.category || 'other',
          pricing: {
            totalOriginalPrice: listing.pricing?.totalOriginalPrice || 0,
            totalDiscountedPrice: listing.pricing?.totalDiscountedPrice || 0
          },
          urgency: listing.urgency || 'medium',
          location: {
            address: listing.location?.address || 'No address provided',
            coordinates: listing.location?.coordinates || { lat: 0, lng: 0 }
          },
          images: listing.images && listing.images.length > 0 
            ? listing.images 
            : [{ url: '/images/placeholder.jpg', isPrimary: true }],
          foodItems: listing.foodItems && listing.foodItems.length > 0
            ? listing.foodItems.map(item => ({
                name: item.name || 'Unknown Item',
                quantity: item.quantity || '1',
                unit: item.unit || 'pieces',
                originalPrice: item.originalPrice || 0,
                discountedPrice: item.discountedPrice || 0,
                expiryDate: item.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              }))
            : [{
                name: 'Default Item',
                quantity: '1',
                unit: 'pieces',
                originalPrice: 100,
                discountedPrice: 50,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              }],
          createdAt: listing.createdAt || new Date(),
          foodSafety: {
            haccpCompliant: listing.foodSafety?.haccpCompliant || false,
            iso22000Compliant: listing.foodSafety?.iso22000Compliant || false,
            handlingInstructions: listing.foodSafety?.handlingInstructions || 'Handle with care'
          },
          logistics: {
            type: listing.logistics?.type || 'pickup',
            pickupInstructions: listing.logistics?.pickupInstructions || 'Contact vendor for pickup details'
          }
        };
      });
      
      const allListings = [...validListings, ...mockListings];
      
      // Find specific listing by ID
      const foundListing = allListings.find(listing => listing._id === id);
      
      if (foundListing) {
        setListing(foundListing);
      } else {
        // Handle case where listing is not found
        setListing(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading listing:', error);
      setLoading(false);
      // Set fallback to prevent infinite loading
      setListing(null);
    }
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(listing, quantity);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to purchase');
      return;
    }
    // Navigate to payment page with listing and quantity
    setTimeout(() => {
      window.location.href = `/payment?listing=${encodeURIComponent(JSON.stringify(listing))}&quantity=${quantity}`;
    }, 500);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getUrgencyClass = (urgency) => {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return classes[urgency] || 'bg-gray-100 text-gray-800';
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
            <p className="text-gray-600">Loading listing details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
            <p className="text-gray-600 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
            <Link to="/marketplace" className="btn btn-primary">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/marketplace" className="text-gray-500 hover:text-gray-700">
                Marketplace
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900 font-medium">{listing.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {listing.images?.slice(0, 2).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`${listing.title} - ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyClass(listing.urgency)}`}>
                          {listing.urgency.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {listing.images?.length > 2 && (
                <div className="grid grid-cols-3 gap-2 p-4 pt-0">
                  {listing.images.slice(2, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`${listing.title} - ${index + 3}`}
                      className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <p className="text-gray-600">{listing.description}</p>
                </div>
                <button
                  onClick={handleFavorite}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">{listing.location.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    Expires in {listing.foodItems && listing.foodItems[0] && listing.foodItems[0].expiryDate 
                      ? Math.ceil((new Date(listing.foodItems[0].expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) 
                      : 7} days
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Food Items</h3>
                <div className="space-y-3">
                  {listing.foodItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">₹{item.discountedPrice}</span>
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        </div>
                        <div className="text-xs text-green-600">
                          {getDiscountPercentage(item.originalPrice, item.discountedPrice)}% OFF
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Safety & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Food Safety
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className={`w-4 h-4 mr-2 ${listing.foodSafety.haccpCompliant ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm">HACCP Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className={`w-4 h-4 mr-2 ${listing.foodSafety.iso22000Compliant ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="text-sm">ISO 22000 Compliant</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Handling:</strong> {listing.foodSafety.handlingInstructions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-600" />
                  Logistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm capitalize">{listing.logistics.type}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Instructions:</strong> {listing.logistics.pickupInstructions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendor Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-gray-600">
                    {listing.vendor.businessName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{listing.vendor.businessName}</h4>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600">⭐ {listing.vendor.rating}</span>
                    {listing.vendor.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-600 ml-1" />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {listing.vendor.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {listing.vendor.email}
                </div>
              </div>
            </div>

            {/* Pricing & Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{listing.pricing.totalDiscountedPrice}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{listing.pricing.totalOriginalPrice}
                  </span>
                </div>
                <div className="text-green-600 font-medium">
                  {getDiscountPercentage(listing.pricing.totalOriginalPrice, listing.pricing.totalDiscountedPrice)}% OFF
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="flex-1 px-3 py-2 border-t border-b border-gray-300 text-center"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full btn btn-primary py-3"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full btn btn-outline py-3"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleShare}
                  className="w-full btn btn-secondary py-3 flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
