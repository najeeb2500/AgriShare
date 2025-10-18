import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  land: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true
  },
  gardener: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crop: {
    name: {
      type: String,
      required: true
    },
    variety: String,
    plantingDate: Date,
    expectedHarvestDate: Date,
    actualHarvestDate: Date
  },
  growthStage: {
    type: String,
    enum: ['planting', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'completed'],
    default: 'planting'
  },
  activities: [{
    type: {
      type: String,
      enum: ['planting', 'watering', 'fertilizing', 'pest_control', 'pruning', 'harvesting', 'other']
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    duration: Number, // in hours
    notes: String,
    images: [String]
  }],
  yield: {
    expected: {
      quantity: Number,
      unit: {
        type: String,
        enum: ['kg', 'tons', 'quintals', 'pieces', 'liters']
      }
    },
    actual: {
      quantity: Number,
      unit: {
        type: String,
        enum: ['kg', 'tons', 'quintals', 'pieces', 'liters']
      },
      harvestDate: Date
    },
    quality: {
      type: String,
      enum: ['excellent', 'good', 'average', 'poor']
    }
  },
  soilCondition: {
    ph: Number,
    moisture: {
      type: String,
      enum: ['dry', 'moist', 'wet', 'waterlogged']
    },
    fertility: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    lastTested: Date,
    notes: String
  },
  waterUsage: {
    daily: Number, // in liters
    weekly: Number,
    monthly: Number,
    source: String
  },
  pestDisease: [{
    type: {
      type: String,
      enum: ['pest', 'disease', 'deficiency']
    },
    name: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    treatment: String,
    date: Date,
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  weatherImpact: [{
    date: Date,
    condition: String,
    impact: String,
    notes: String
  }],
  expenses: [{
    category: {
      type: String,
      enum: ['seeds', 'fertilizers', 'pesticides', 'tools', 'labor', 'water', 'other']
    },
    amount: Number,
    description: String,
    date: Date,
    receipt: String
  }],
  revenue: [{
    source: {
      type: String,
      enum: ['sale', 'donation', 'exchange', 'personal_use']
    },
    amount: Number,
    quantity: Number,
    unit: String,
    buyer: String,
    date: Date
  }],
  expertAdvice: [{
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    advice: String,
    date: Date,
    implemented: {
      type: Boolean,
      default: false
    },
    result: String
  }],
  photos: [{
    url: String,
    caption: String,
    date: Date,
    category: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
progressSchema.index({ land: 1, gardener: 1 });
progressSchema.index({ 'crop.plantingDate': 1 });
progressSchema.index({ growthStage: 1 });

export default mongoose.model("Progress", progressSchema);
