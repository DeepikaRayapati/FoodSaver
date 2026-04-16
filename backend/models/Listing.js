const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['produce', 'dairy', 'bakery', 'meat', 'seafood', 'prepared', 'canned', 'dry', 'frozen', 'other']
  },
  foodItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'lbs', 'pieces', 'liters', 'gallons', 'boxes'], required: true },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    storageConditions: {
      temperature: String, // e.g., "Refrigerated", "Frozen", "Room Temperature"
      humidity: String,
      specialInstructions: String
    },
    allergens: [String],
    ingredients: [String],
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number
    }
  }],
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'per_item', 'per_weight'],
      default: 'fixed'
    },
    totalOriginalPrice: { type: Number, required: true },
    totalDiscountedPrice: { type: Number, required: true },
    discountPercentage: { type: Number, min: 0, max: 100 }
  },
  availability: {
    totalQuantity: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
    minimumOrder: { type: Number, default: 1 },
    maximumOrder: { type: Number }
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    pickupInstructions: String,
    pickupTimeSlots: [{
      start: Date,
      end: Date,
      maxOrders: Number
    }]
  },
  logistics: {
    deliveryAvailable: { type: Boolean, default: false },
    deliveryRadius: Number, // in miles
    deliveryFee: Number,
    freeDeliveryMinOrder: Number
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  tags: [String],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired', 'sold_out', 'cancelled'],
    default: 'active'
  },
  foodSafety: {
    haccpCompliant: { type: Boolean, default: false },
    iso22000Compliant: { type: Boolean, default: false },
    safetyCertifications: [String],
    lastInspectionDate: Date,
    handlingInstructions: String
  },
  views: { type: Number, default: 0 },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  aiPredictions: {
    predictedExpiryDate: Date,
    spoilageRisk: { type: String, enum: ['low', 'medium', 'high'] },
    recommendedAction: String,
    confidenceScore: { type: Number, min: 0, max: 1 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
listingSchema.index({ vendor: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ 'location.coordinates': '2dsphere' });
listingSchema.index({ 'foodItems.expiryDate': 1 });
listingSchema.index({ urgency: 1 });
listingSchema.index({ createdAt: -1 });

// Virtual for total discount percentage
listingSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.totalOriginalPrice > 0) {
    return Math.round(((this.pricing.totalOriginalPrice - this.pricing.totalDiscountedPrice) / this.pricing.totalOriginalPrice) * 100);
  }
  return 0;
});

// Method to check if listing is still valid
listingSchema.methods.isValid = function() {
  const now = new Date();
  return this.status === 'active' && 
         this.availability.availableQuantity > 0 && 
         this.foodItems.some(item => item.expiryDate > now);
};

// Method to get nearest expiry date
listingSchema.methods.getNearestExpiryDate = function() {
  if (this.foodItems.length === 0) return null;
  return this.foodItems.reduce((nearest, item) => {
    return item.expiryDate < nearest ? item.expiryDate : nearest;
  }, this.foodItems[0].expiryDate);
};

// Pre-save middleware to update AI predictions
listingSchema.pre('save', function(next) {
  if (this.isModified('foodItems')) {
    // Mock AI prediction - in real implementation, this would call an AI service
    const nearestExpiry = this.getNearestExpiryDate();
    const now = new Date();
    const hoursToExpiry = (nearestExpiry - now) / (1000 * 60 * 60);
    
    if (hoursToExpiry < 24) {
      this.urgency = 'urgent';
      this.aiPredictions.spoilageRisk = 'high';
    } else if (hoursToExpiry < 72) {
      this.urgency = 'high';
      this.aiPredictions.spoilageRisk = 'medium';
    } else {
      this.urgency = 'medium';
      this.aiPredictions.spoilageRisk = 'low';
    }
    
    this.aiPredictions.predictedExpiryDate = nearestExpiry;
    this.aiPredictions.confidenceScore = 0.85;
  }
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
