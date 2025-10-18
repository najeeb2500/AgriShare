import mongoose from "mongoose";

const marketplaceSchema = new mongoose.Schema({
  product: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'herbs', 'seeds', 'tools', 'fertilizers', 'other'],
      required: true
    },
    subcategory: String,
    variety: String,
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'grams', 'tons', 'quintals', 'pieces', 'liters', 'packets', 'bunches'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    pricePerUnit: Number, // Calculated field
    minimumOrder: {
      type: Number,
      default: 1
    },
    maximumOrder: Number
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contact: {
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'both'],
      default: 'both'
    }
  },
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryRadius: Number, // in km
    pickupAvailable: {
      type: Boolean,
      default: true
    },
    deliveryAvailable: {
      type: Boolean,
      default: false
    },
    deliveryCharges: {
      type: Number,
      default: 0
    }
  },
  quality: {
    grade: {
      type: String,
      enum: ['premium', 'grade_a', 'grade_b', 'organic', 'conventional'],
      default: 'grade_a'
    },
    certification: [String], // organic, fair trade, etc.
    harvestDate: Date,
    expiryDate: Date,
    storageConditions: String
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  availability: {
    status: {
      type: String,
      enum: ['available', 'sold_out', 'reserved', 'discontinued'],
      default: 'available'
    },
    availableQuantity: {
      type: Number,
      required: true
    },
    reservedQuantity: {
      type: Number,
      default: 0
    }
  },
  orders: [{
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    quantity: Number,
    totalPrice: Number,
    orderDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    deliveryDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    notes: String
  }],
  reviews: [{
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    totalSold: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  featured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date
}, {
  timestamps: true
});

// Index for efficient queries
marketplaceSchema.index({ 'product.category': 1, 'availability.status': 1 });
marketplaceSchema.index({ seller: 1, createdAt: -1 });
marketplaceSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
marketplaceSchema.index({ tags: 1 });
marketplaceSchema.index({ 'product.name': 'text', 'product.description': 'text' });

// Virtual for average rating calculation
marketplaceSchema.virtual('calculatedAverageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

// Pre-save middleware to calculate price per unit
marketplaceSchema.pre('save', function(next) {
  if (this.product.price && this.product.quantity) {
    this.product.pricePerUnit = this.product.price / this.product.quantity;
  }
  next();
});

export default mongoose.model("Marketplace", marketplaceSchema);
