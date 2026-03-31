const express = require('express');
const { query } = require('express-validator');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get analytics dashboard data
// @access  Private (Admin only)
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '30'; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Basic counts
    const [
      totalUsers,
      totalVendors,
      totalListings,
      activeListings,
      totalOrders,
      completedOrders
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ role: 'vendor', createdAt: { $gte: startDate } }),
      Listing.countDocuments({ createdAt: { $gte: startDate } }),
      Listing.countDocuments({ status: 'active' }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({ status: 'delivered', createdAt: { $gte: startDate } })
    ]);

    // Revenue and savings
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalSavings: { $sum: '$pricing.savingsAmount' },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      }
    ]);

    // Environmental impact
    const impactData = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          foodSavedKg: { $sum: '$impact.foodSavedKg' },
          co2SavedKg: { $sum: '$impact.co2SavedKg' },
          waterSavedLiters: { $sum: '$impact.waterSavedLiters' }
        }
      }
    ]);

    // Category trends
    const categoryData = await Listing.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: '$pricing.totalDiscountedPrice' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Daily trends
    const dailyTrends = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' },
          foodSaved: { $sum: '$impact.foodSavedKg' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top vendors
    const topVendors = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$vendor',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          foodSaved: { $sum: '$impact.foodSavedKg' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      },
      { $unwind: '$vendorInfo' },
      {
        $project: {
          vendorName: '$vendorInfo.name',
          businessName: '$vendorInfo.businessInfo.businessName',
          totalOrders: 1,
          totalRevenue: 1,
          foodSaved: 1
        }
      }
    ]);

    // Urgency distribution
    const urgencyData = await Listing.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$urgency',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      summary: {
        totalUsers,
        totalVendors,
        totalListings,
        activeListings,
        totalOrders,
        completedOrders,
        revenue: revenueData[0] || { totalRevenue: 0, totalSavings: 0, avgOrderValue: 0 },
        impact: impactData[0] || { foodSavedKg: 0, co2SavedKg: 0, waterSavedLiters: 0 }
      },
      trends: {
        categories: categoryData,
        daily: dailyTrends,
        urgency: urgencyData
      },
      topVendors
    });
  } catch (error) {
    console.error('Get analytics dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics data' });
  }
});

// @route   GET /api/analytics/vendor/:vendorId
// @desc    Get vendor-specific analytics
// @access  Private (Vendor or Admin)
router.get('/vendor/:vendorId', protect, async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    
    // Check authorization
    if (req.user.role !== 'admin' && req.user._id.toString() !== vendorId) {
      return res.status(403).json({ message: 'Not authorized to view these analytics' });
    }

    const timeRange = req.query.timeRange || '30';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Vendor performance
    const [
      totalListings,
      activeListings,
      soldOutListings,
      totalOrders,
      completedOrders
    ] = await Promise.all([
      Listing.countDocuments({ vendor: vendorId, createdAt: { $gte: startDate } }),
      Listing.countDocuments({ vendor: vendorId, status: 'active' }),
      Listing.countDocuments({ vendor: vendorId, status: 'sold_out' }),
      Order.countDocuments({ vendor: vendorId, createdAt: { $gte: startDate } }),
      Order.countDocuments({ vendor: vendorId, status: 'delivered', createdAt: { $gte: startDate } })
    ]);

    // Revenue and performance
    const performanceData = await Order.aggregate([
      { $match: { vendor: vendorId, status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' },
          totalFoodSaved: { $sum: '$impact.foodSavedKg' },
          avgRating: { $avg: '$reviews.vendor.rating' }
        }
      }
    ]);

    // Category performance
    const categoryPerformance = await Listing.aggregate([
      { $match: { vendor: vendorId, createdAt: { $gte: startDate } } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'listing',
          as: 'orders'
        }
      },
      {
        $group: {
          _id: '$category',
          totalListings: { $sum: 1 },
          soldListings: {
            $sum: {
              $cond: [{ $eq: ['$status', 'sold_out'] }, 1, 0]
            }
          },
          totalOrders: { $size: '$orders' },
          totalRevenue: {
            $sum: {
              $reduce: {
                input: '$orders',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.pricing.total'] }
              }
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Monthly trends
    const monthlyTrends = await Order.aggregate([
      { $match: { vendor: vendorId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' },
          foodSaved: { $sum: '$impact.foodSavedKg' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Customer satisfaction
    const satisfactionData = await Order.aggregate([
      { $match: { vendor: vendorId, status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$reviews.vendor.rating' },
          totalReviews: {
            $sum: {
              $cond: [{ $ne: ['$reviews.vendor.rating', null] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      summary: {
        totalListings,
        activeListings,
        soldOutListings,
        totalOrders,
        completedOrders,
        performance: performanceData[0] || { totalRevenue: 0, avgOrderValue: 0, totalFoodSaved: 0, avgRating: 0 },
        satisfaction: satisfactionData[0] || { avgRating: 0, totalReviews: 0 }
      },
      trends: {
        categories: categoryPerformance,
        monthly: monthlyTrends
      }
    });
  } catch (error) {
    console.error('Get vendor analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching vendor analytics' });
  }
});

// @route   GET /api/analytics/predictions
// @desc    Get AI-powered predictions and insights
// @access  Private (Admin only)
router.get('/predictions', protect, authorize('admin'), async (req, res) => {
  try {
    // Mock AI predictions - in real implementation, this would use actual ML models
    
    // Predict food waste trends
    const wastePrediction = await Listing.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: '$availability.totalQuantity' },
          avgExpiryHours: {
            $avg: {
              $divide: [
                { $subtract: ['$foodItems.0.expiryDate', new Date()] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          }
        }
      }
    ]);

    // Predict high-risk items (likely to expire)
    const highRiskItems = await Listing.find({
      status: 'active',
      'foodItems.expiryDate': {
        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Next 24 hours
      }
    })
    .populate('vendor', 'name businessName')
    .sort({ 'foodItems.expiryDate': 1 })
    .limit(20);

    // Predict demand trends
    const demandPrediction = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      {
        $lookup: {
          from: 'listings',
          localField: 'listing',
          foreignField: '_id',
          as: 'listingInfo'
        }
      },
      { $unwind: '$listingInfo' },
      {
        $group: {
          _id: '$listingInfo.category',
          demand: { $sum: '$items.quantity' },
          avgPrice: { $avg: '$pricing.total' }
        }
      },
      { $sort: { demand: -1 } }
    ]);

    // Generate recommendations
    const recommendations = {
      optimizePricing: wastePrediction
        .filter(cat => cat.avgExpiryHours < 48)
        .map(cat => ({
          category: cat._id,
          recommendation: 'Consider increasing discount for faster sale',
          confidence: 0.8
        })),
      promoteUrgent: highRiskItems.length > 0 ? {
        count: highRiskItems.length,
        recommendation: 'Send urgent notifications for expiring items',
        confidence: 0.9
      } : null,
      inventoryManagement: demandPrediction.slice(0, 3).map(cat => ({
        category: cat._id,
        recommendation: `High demand category - consider increasing inventory`,
        confidence: 0.7
      }))
    };

    res.json({
      predictions: {
        wasteRisk: wastePrediction,
        highRiskItems,
        demandTrends: demandPrediction
      },
      recommendations,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({ message: 'Server error while generating predictions' });
  }
});

// @route   GET /api/analytics/impact
// @desc    Get environmental and social impact metrics
// @access  Public
router.get('/impact', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '30';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Overall impact
    const overallImpact = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalFoodSaved: { $sum: '$impact.foodSavedKg' },
          totalCO2Saved: { $sum: '$impact.co2SavedKg' },
          totalWaterSaved: { $sum: '$impact.waterSavedLiters' },
          totalMoneySaved: { $sum: '$impact.moneySaved' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // Impact by category
    const impactByCategory = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $lookup: {
          from: 'listings',
          localField: 'listing',
          foreignField: '_id',
          as: 'listingInfo'
        }
      },
      { $unwind: '$listingInfo' },
      {
        $group: {
          _id: '$listingInfo.category',
          foodSaved: { $sum: '$impact.foodSavedKg' },
          co2Saved: { $sum: '$impact.co2SavedKg' },
          waterSaved: { $sum: '$impact.waterSavedLiters' },
          moneySaved: { $sum: '$impact.moneySaved' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { foodSaved: -1 } }
    ]);

    // Daily impact trends
    const dailyImpact = await Order.aggregate([
      { $match: { status: 'delivered', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          foodSaved: { $sum: '$impact.foodSavedKg' },
          co2Saved: { $sum: '$impact.co2SavedKg' },
          waterSaved: { $sum: '$impact.waterSavedLiters' },
          moneySaved: { $sum: '$impact.moneySaved' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Milestones
    const totalFoodSavedAllTime = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$impact.foodSavedKg' }
        }
      }
    ]);

    const milestones = {
      foodSaved: Math.floor((totalFoodSavedAllTime[0]?.total || 0) / 100), // Every 100kg
      co2Saved: Math.floor((totalFoodSavedAllTime[0]?.total || 0) * 2.5 / 1000), // Every 1000kg CO2
      orders: Math.floor((totalFoodSavedAllTime[0]?.total || 0) / 10) // Every 10 orders
    };

    res.json({
      summary: overallImpact[0] || {
        totalFoodSaved: 0,
        totalCO2Saved: 0,
        totalWaterSaved: 0,
        totalMoneySaved: 0,
        totalOrders: 0
      },
      breakdown: {
        categories: impactByCategory,
        daily: dailyImpact
      },
      milestones,
      timeRange: `${timeRange} days`
    });
  } catch (error) {
    console.error('Get impact analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching impact data' });
  }
});

module.exports = router;
