const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  consumer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  items: [{
    foodItemId: String,
    name: String,
    quantity: Number,
    unit: String,
    unitPrice: Number,
    totalPrice: Number
  }],
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    originalTotal: Number,
    savingsAmount: Number,
    savingsPercentage: Number
  },
  logistics: {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    pickupTimeSlot: {
      start: Date,
      end: Date
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    trackingNumber: String,
    estimatedDelivery: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'cash', 'digital_wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date,
    refundReason: String
  },
  notifications: [{
    type: {
      type: String,
      enum: ['order_confirmed', 'order_ready', 'order_picked_up', 'order_delivered', 'order_cancelled']
    },
    message: String,
    sentAt: { type: Date, default: Date.now },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  reviews: {
    consumer: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    },
    vendor: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: Date
    }
  },
  foodSafety: {
    qualityChecked: { type: Boolean, default: false },
    temperatureChecked: { type: Boolean, default: false },
    packagingIntact: { type: Boolean, default: false },
    notes: String
  },
  impact: {
    foodSavedKg: Number,
    co2SavedKg: Number,
    waterSavedLiters: Number,
    moneySaved: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ consumer: 1 });
orderSchema.index({ vendor: 1 });
orderSchema.index({ listing: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.orderNumber = `FS-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Calculate impact metrics
orderSchema.methods.calculateImpact = function() {
  // Mock calculations - in real implementation, use actual environmental data
  const totalKg = this.items.reduce((sum, item) => sum + (item.quantity * 0.5), 0); // Rough estimate
  
  this.impact = {
    foodSavedKg: totalKg,
    co2SavedKg: totalKg * 2.5, // Rough CO2 equivalent
    waterSavedLiters: totalKg * 1000, // Rough water usage
    moneySaved: this.pricing.originalTotal ? this.pricing.originalTotal - this.pricing.total : 0
  };
};

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

// Method to get next status
orderSchema.methods.getNextStatus = function() {
  const statusFlow = {
    'pending': 'confirmed',
    'confirmed': 'preparing',
    'preparing': 'ready',
    'ready': this.logistics.type === 'delivery' ? 'delivered' : 'picked_up',
    'picked_up': null,
    'delivered': null,
    'cancelled': null,
    'refunded': null
  };
  
  return statusFlow[this.status];
};

module.exports = mongoose.model('Order', orderSchema);
