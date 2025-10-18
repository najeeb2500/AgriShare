import mongoose from "mongoose";

const landSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  landowner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  area: {
    total: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'square_meters'],
      default: 'acres'
    },
    available: {
      type: Number,
      required: true
    }
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'unknown'],
    default: 'unknown'
  },
  waterSource: {
    type: String,
    enum: ['well', 'borewell', 'canal', 'rainwater', 'municipal', 'other'],
    default: 'other'
  },
  irrigation: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'manual', 'none'],
    default: 'none'
  },
  accessibility: {
    roadAccess: {
      type: Boolean,
      default: false
    },
    vehicleAccess: {
      type: Boolean,
      default: false
    },
    publicTransport: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['available', 'allocated', 'cultivated', 'maintenance', 'unavailable'],
    default: 'available'
  },
  allocatedTo: {
    gardener: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    allocatedAt: Date,
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  images: [String],
  documents: [String],
  terms: {
    duration: Number, // in months
    cost: {
      type: Number,
      default: 0
    },
    costType: {
      type: String,
      enum: ['free', 'rent', 'share'],
      default: 'free'
    },
    conditions: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for location-based queries
landSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

export default mongoose.model("Land", landSchema);
