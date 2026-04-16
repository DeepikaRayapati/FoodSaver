const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Listing = require('../models/Listing');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['produce', 'dairy', 'bakery', 'meat', 'seafood', 'prepared', 'canned', 'dry', 'frozen', 'other']),
  query('urgency').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('search').optional().isLength({ min: 1, max: 100 }),
  query('lat').optional().isFloat(),
  query('lng').optional().isFloat(),
  query('radius').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { status: 'active' };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.urgency) {
      filter.urgency = req.query.urgency;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Location filter
    if (req.query.lat && req.query.lng && req.query.radius) {
      filter['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(req.query.lng), parseFloat(req.query.lat)],
            parseFloat(req.query.radius) / 3963.2 // Convert miles to radians
          ]
        }
      };
    }

    // Expiry filter - show items expiring soon
    if (req.query.expiringSoon) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      filter['foodItems.expiryDate'] = { $lte: tomorrow };
    }

    // Build query
    let query = Listing.find(filter)
      .populate('vendor', 'name businessInfo businessName')
      .sort({ urgency: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Execute query
    const listings = await query.exec();
    const total = await Listing.countDocuments(filter);

    // Format response
    const formattedListings = listings.map(listing => ({
      ...listing.toObject(),
      isFavorited: req.user && listing.favorites.includes(req.user._id)
    }));

    res.json({
      listings: formattedListings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error while fetching listings' });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('vendor', 'name businessInfo businessName phone address');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment view count
    await Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Check if favorited by current user
    const isFavorited = req.user && listing.favorites.includes(req.user._id);

    res.json({
      listing: {
        ...listing.toObject(),
        isFavorited
      }
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error while fetching listing' });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private (Vendor only)
router.post('/', protect, authorize('vendor', 'admin'), [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['produce', 'dairy', 'bakery', 'meat', 'seafood', 'prepared', 'canned', 'dry', 'frozen', 'other']),
  body('foodItems').isArray({ min: 1 }).withMessage('At least one food item is required'),
  body('foodItems.*.name').notEmpty().withMessage('Food item name is required'),
  body('foodItems.*.quantity').isFloat({ min: 0 }).withMessage('Quantity must be positive'),
  body('foodItems.*.unit').isIn(['kg', 'lbs', 'pieces', 'liters', 'gallons', 'boxes']),
  body('foodItems.*.originalPrice').isFloat({ min: 0 }).withMessage('Original price must be positive'),
  body('foodItems.*.discountedPrice').isFloat({ min: 0 }).withMessage('Discounted price must be positive'),
  body('foodItems.*.expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.coordinates.lat').isFloat().withMessage('Valid latitude is required'),
  body('location.coordinates.lng').isFloat().withMessage('Valid longitude is required'),
  body('availability.totalQuantity').isFloat({ min: 0 }).withMessage('Total quantity must be positive'),
  body('availability.availableQuantity').isFloat({ min: 0 }).withMessage('Available quantity must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const listingData = {
      ...req.body,
      vendor: req.user._id
    };

    // Calculate total prices
    const totalOriginalPrice = listingData.foodItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const totalDiscountedPrice = listingData.foodItems.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);

    listingData.pricing = {
      totalOriginalPrice,
      totalDiscountedPrice,
      discountPercentage: Math.round(((totalOriginalPrice - totalDiscountedPrice) / totalOriginalPrice) * 100)
    };

    const listing = new Listing(listingData);
    await listing.save();

    await listing.populate('vendor', 'name businessInfo businessName');

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error while creating listing' });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update a listing
// @access  Private (Vendor owner or Admin)
router.put('/:id', protect, authorize('vendor', 'admin'), [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('status').optional().isIn(['active', 'pending', 'expired', 'sold_out', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && listing.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const allowedUpdates = ['title', 'description', 'status', 'availability', 'pricing', 'urgency'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('vendor', 'name businessInfo businessName');

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error while updating listing' });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
// @access  Private (Vendor owner or Admin)
router.delete('/:id', protect, authorize('vendor', 'admin'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check ownership
    if (req.user.role !== 'admin' && listing.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error while deleting listing' });
  }
});

// @route   POST /api/listings/:id/favorite
// @desc    Add/remove listing from favorites
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const isFavorited = listing.favorites.includes(req.user._id);

    if (isFavorited) {
      // Remove from favorites
      listing.favorites.pull(req.user._id);
      await listing.save();
      res.json({ message: 'Removed from favorites', isFavorited: false });
    } else {
      // Add to favorites
      listing.favorites.push(req.user._id);
      await listing.save();
      res.json({ message: 'Added to favorites', isFavorited: true });
    }
  } catch (error) {
    console.error('Favorite listing error:', error);
    res.status(500).json({ message: 'Server error while updating favorites' });
  }
});

// @route   GET /api/listings/vendor/:vendorId
// @desc    Get listings by vendor
// @access  Public
router.get('/vendor/:vendorId', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { 
      vendor: req.params.vendorId,
      status: 'active'
    };

    const listings = await Listing.find(filter)
      .populate('vendor', 'name businessInfo businessName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get vendor listings error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor listings' });
  }
});

module.exports = router;
