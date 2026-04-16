const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');
const { sendOrderNotification } = require('../utils/socket');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders for current user
// @access  Private
router.get('/', protect, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled', 'refunded'])
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

    // Build filter based on user role
    let filter = {};
    
    if (req.user.role === 'consumer') {
      filter.consumer = req.user._id;
    } else if (req.user.role === 'vendor') {
      filter.vendor = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admin can see all orders
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate('consumer', 'name email phone')
      .populate('vendor', 'name businessInfo businessName')
      .populate('listing', 'title images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumer', 'name email phone address')
      .populate('vendor', 'name businessInfo businessName address')
      .populate('listing', 'title description images location');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        order.consumer._id.toString() !== req.user._id.toString() && 
        order.vendor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Consumer only)
router.post('/', protect, authorize('consumer'), [
  body('listingId').isMongoId().withMessage('Valid listing ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.foodItemId').notEmpty().withMessage('Food item ID is required'),
  body('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be positive'),
  body('logistics.type').isIn(['pickup', 'delivery']).withMessage('Logistics type must be pickup or delivery'),
  body('logistics.pickupTimeSlot.start').optional().isISO8601(),
  body('logistics.pickupTimeSlot.end').optional().isISO8601(),
  body('payment.method').isIn(['card', 'cash', 'digital_wallet']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { listingId, items, logistics, payment } = req.body;

    // Get listing
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!listing.isValid()) {
      return res.status(400).json({ message: 'Listing is no longer available' });
    }

    // Check if requested quantity is available
    const totalRequestedQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalRequestedQuantity > listing.availability.availableQuantity) {
      return res.status(400).json({ message: 'Requested quantity exceeds available quantity' });
    }

    // Calculate pricing
    let subtotal = 0;
    let originalSubtotal = 0;
    
    const orderItems = items.map(item => {
      const foodItem = listing.foodItems.find(fi => fi._id.toString() === item.foodItemId);
      
      if (!foodItem) {
        throw new Error(`Food item ${item.foodItemId} not found in listing`);
      }

      const itemTotal = foodItem.discountedPrice * item.quantity;
      const itemOriginalTotal = foodItem.originalPrice * item.quantity;
      
      subtotal += itemTotal;
      originalSubtotal += itemOriginalTotal;

      return {
        foodItemId: item.foodItemId,
        name: foodItem.name,
        quantity: item.quantity,
        unit: foodItem.unit,
        unitPrice: foodItem.discountedPrice,
        totalPrice: itemTotal
      };
    });

    // Calculate additional fees
    let deliveryFee = 0;
    
    if (logistics.type === 'delivery' && listing.logistics.deliveryAvailable) {
      deliveryFee = listing.logistics.deliveryFee || 0;
      
      // Check for free delivery
      if (listing.logistics.freeDeliveryMinOrder && subtotal >= listing.logistics.freeDeliveryMinOrder) {
        deliveryFee = 0;
      }
    }

    const serviceFee = Math.round(subtotal * 0.05 * 100) / 100; // 5% service fee
    const tax = Math.round((subtotal + serviceFee) * 0.08 * 100) / 100; // 8% tax
    const total = subtotal + deliveryFee + serviceFee + tax;
    const savingsAmount = originalSubtotal - subtotal;
    const savingsPercentage = Math.round((savingsAmount / originalSubtotal) * 100);

    // Create order
    const order = new Order({
      consumer: req.user._id,
      vendor: listing.vendor,
      listing: listingId,
      items: orderItems,
      pricing: {
        subtotal,
        deliveryFee,
        serviceFee,
        tax,
        total,
        originalTotal: originalSubtotal,
        savingsAmount,
        savingsPercentage
      },
      logistics,
      payment: {
        method: payment.method,
        status: 'pending'
      }
    });

    // Calculate impact
    order.calculateImpact();

    await order.save();

    // Send real-time notification
    sendOrderNotification(order, 'order_created');

    // Update listing availability
    listing.availability.availableQuantity -= totalRequestedQuantity;
    
    if (listing.availability.availableQuantity <= 0) {
      listing.status = 'sold_out';
    }
    
    await listing.save();

    // Populate related data for response
    await order.populate('consumer', 'name email phone');
    await order.populate('vendor', 'name businessInfo businessName');
    await order.populate('listing', 'title images');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Vendor or Admin)
router.put('/:id/status', protect, authorize('vendor', 'admin'), [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled', 'refunded']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const { status } = req.body;

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['picked_up', 'delivered', 'cancelled'],
      'picked_up': ['delivered'],
      'delivered': [],
      'cancelled': ['refunded'],
      'refunded': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${order.status} to ${status}` 
      });
    }

    // Update status
    order.status = status;

    // Add notification
    order.notifications.push({
      type: `order_${status}`,
      message: `Order status updated to ${status}`,
      recipient: order.consumer
    });

    // Update payment status if delivered
    if (status === 'delivered') {
      order.payment.status = 'paid';
      order.payment.paidAt = new Date();
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel an order
// @access  Private
router.post('/:id/cancel', protect, [
  body('reason').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    const isAuthorized = req.user.role === 'admin' || 
                        order.consumer.toString() === req.user._id.toString() || 
                        order.vendor.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    
    // Add cancellation notification
    order.notifications.push({
      type: 'order_cancelled',
      message: `Order cancelled${req.body.reason ? ': ' + req.body.reason : ''}`,
      recipient: order.consumer === req.user._id ? order.vendor : order.consumer
    });

    await order.save();

    // Restore listing availability
    const listing = await Listing.findById(order.listing);
    if (listing) {
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
      listing.availability.availableQuantity += totalQuantity;
      
      if (listing.status === 'sold_out') {
        listing.status = 'active';
      }
      
      await listing.save();
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

// @route   POST /api/orders/:id/review
// @desc    Add review to order
// @access  Private
router.post('/:id/review', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    const { rating, comment } = req.body;

    // Determine review type based on user role
    if (req.user.role === 'consumer') {
      if (order.consumer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to review this order' });
      }
      
      order.reviews.consumer = {
        rating,
        comment,
        createdAt: new Date()
      };
    } else if (req.user.role === 'vendor') {
      if (order.vendor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to review this order' });
      }
      
      order.reviews.vendor = {
        rating,
        comment,
        createdAt: new Date()
      };
    }

    await order.save();

    res.json({
      message: 'Review added successfully',
      order
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
});

module.exports = router;
