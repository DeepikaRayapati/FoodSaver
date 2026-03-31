const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
require('dotenv').config();

const sampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@foodsaver.com',
      password: 'admin123',
      phone: '+1234567890',
      role: 'admin',
      isVerified: true
    });
    await admin.save();

    // Create vendors
    const vendors = [
      {
        name: 'Green Grocer',
        email: 'green@foodsaver.com',
        password: 'vendor123',
        phone: '+1234567891',
        role: 'vendor',
        businessInfo: {
          businessName: 'Fresh Market',
          businessType: 'grocery',
          licenseNumber: 'VG-001'
        },
        address: {
          street: '123 Main St',
          city: 'New York',
          zipCode: '10001',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        isVerified: true
      },
      {
        name: 'Sweet Bakery',
        email: 'bakery@foodsaver.com',
        password: 'vendor123',
        phone: '+1234567892',
        role: 'vendor',
        businessInfo: {
          businessName: 'Sweet Bakery',
          businessType: 'bakery',
          licenseNumber: 'VB-002'
        },
        address: {
          street: '456 Oak Ave',
          city: 'New York',
          zipCode: '10002',
          coordinates: { lat: 40.7260, lng: -73.9897 }
        },
        isVerified: true
      }
    ];

    const createdVendors = await User.create(vendors);

    // Create consumers
    const consumers = [
      {
        name: 'John Doe',
        email: 'john@foodsaver.com',
        password: 'consumer123',
        phone: '+1234567893',
        role: 'consumer',
        address: {
          street: '789 Pine St',
          city: 'New York',
          zipCode: '10003',
          coordinates: { lat: 40.7195, lng: -73.9924 }
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@foodsaver.com',
        password: 'consumer123',
        phone: '+1234567894',
        role: 'consumer',
        address: {
          street: '321 Elm St',
          city: 'New York',
          zipCode: '10004',
          coordinates: { lat: 40.7033, lng: -73.9892 }
        }
      }
    ];

    await User.create(consumers);

    // Create listings
    const listings = [
      {
        title: 'Fresh Vegetables Bundle',
        description: 'Mixed seasonal vegetables including carrots, broccoli, spinach, and tomatoes',
        vendor: createdVendors[0]._id,
        category: 'produce',
        foodItems: [
          {
            name: 'Carrots',
            quantity: 5,
            unit: 'kg',
            originalPrice: 750,
            discountedPrice: 400,
            expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          },
          {
            name: 'Broccoli',
            quantity: 3,
            unit: 'kg',
            originalPrice: 600,
            discountedPrice: 350,
            expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          }
        ],
        pricing: {
          totalOriginalPrice: 1350,
          totalDiscountedPrice: 750
        },
        availability: {
          totalQuantity: 8,
          availableQuantity: 8
        },
        location: {
          address: '123 Main St, New York, NY 10001',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        urgency: 'medium'
      },
      {
        title: 'Baked Goods Assortment',
        description: 'Fresh bread, pastries, and cakes from today\'s batch',
        vendor: createdVendors[1]._id,
        category: 'bakery',
        foodItems: [
          {
            name: 'Whole Wheat Bread',
            quantity: 10,
            unit: 'pieces',
            originalPrice: 1500,
            discountedPrice: 750,
            expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          }
        ],
        pricing: {
          totalOriginalPrice: 1500,
          totalDiscountedPrice: 750
        },
        availability: {
          totalQuantity: 10,
          availableQuantity: 10
        },
        location: {
          address: '456 Oak Ave, New York, NY 10002',
          coordinates: { lat: 40.7260, lng: -73.9897 }
        },
        urgency: 'high'
      }
    ];

    await Listing.create(listings);

    console.log('Sample data created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    sampleData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
