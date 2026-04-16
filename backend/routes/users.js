const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['consumer', 'vendor', 'admin']),
  query('search').optional().isLength({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get additional stats based on role
    let stats = {};
    
    if (user.role === 'vendor') {
      const listingStats = await Listing.aggregate([
        { $match: { vendor: user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$pricing.totalDiscountedPrice' }
          }
        }
      ]);
      
      stats.listings = listingStats;
    }

    if (user.role === 'consumer') {
      const orderStats = await Order.aggregate([
        { $match: { consumer: user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' },
            totalSaved: { $sum: '$pricing.savingsAmount' }
          }
        }
      ]);
      
      stats.orders = orderStats;
    }

    res.json({
      user: user.toPublicJSON(),
      stats
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { isActive, isVerified } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    await user.save();

    res.json({
      message: 'User status updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// @route   GET /api/users/dashboard/stats
// @desc    Get dashboard statistics for current user
// @access  Private
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      // Admin statistics
      const totalUsers = await User.countDocuments();
      const totalVendors = await User.countDocuments({ role: 'vendor' });
      const totalConsumers = await User.countDocuments({ role: 'consumer' });
      const totalListings = await Listing.countDocuments();
      const activeListings = await Listing.countDocuments({ status: 'active' });
      const totalOrders = await Order.countDocuments();

      // Calculate environmental impact
      const impactData = await Order.aggregate([
        { $match: { status: 'delivered' } },
        {
          $group: {
            _id: null,
            totalFoodSaved: { $sum: '$impact.foodSavedKg' },
            totalCO2Saved: { $sum: '$impact.co2SavedKg' },
            totalWaterSaved: { $sum: '$impact.waterSavedLiters' },
            totalMoneySaved: { $sum: '$impact.moneySaved' }
          }
        }
      ]);

      stats = {
        users: { total: totalUsers, vendors: totalVendors, consumers: totalConsumers },
        listings: { total: totalListings, active: activeListings },
        orders: { total: totalOrders },
        impact: impactData[0] || { totalFoodSaved: 0, totalCO2Saved: 0, totalWaterSaved: 0, totalMoneySaved: 0 }
      };
    } else if (req.user.role === 'vendor') {
      // Vendor statistics
      const listingStats = await Listing.aggregate([
        { $match: { vendor: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$pricing.totalDiscountedPrice' }
          }
        }
      ]);

      const orderStats = await Order.aggregate([
        { $match: { vendor: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$pricing.total' }
          }
        }
      ]);

      const recentListings = await Listing.find({ vendor: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status pricing.totalDiscountedPrice createdAt');

      stats = {
        listings: listingStats,
        orders: orderStats,
        recentListings
      };
    } else if (req.user.role === 'consumer') {
      // Consumer statistics
      const orderStats = await Order.aggregate([
        { $match: { consumer: req.user._id } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' },
            totalSaved: { $sum: '$pricing.savingsAmount' }
          }
        }
      ]);

      const favoriteCategories = await Listing.aggregate([
        { $match: { favorites: req.user._id } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      const recentOrders = await Order.find({ consumer: req.user._id })
        .populate('listing', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('orderNumber status pricing.total createdAt listing');

      stats = {
        orders: orderStats,
        favoriteCategories,
        recentOrders
      };
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics' });
  }
});

module.exports = router;
