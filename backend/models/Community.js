import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['update', 'tip', 'question', 'event', 'success_story', 'announcement', 'marketplace'],
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'farming', 'gardening', 'marketplace', 'events', 'education', 'community'],
    default: 'general'
  },
  tags: [String],
  images: [String],
  attachments: [String],
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  event: {
    startDate: Date,
    endDate: Date,
    venue: String,
    maxParticipants: Number,
    registeredParticipants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      registeredAt: Date
    }]
  },
  marketplace: {
    product: {
      name: String,
      description: String,
      category: {
        type: String,
        enum: ['vegetables', 'fruits', 'grains', 'herbs', 'seeds', 'tools', 'other']
      },
      quantity: Number,
      unit: String,
      price: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contact: {
      phone: String,
      email: String,
      address: String
    },
    availability: {
      type: String,
      enum: ['available', 'sold', 'reserved'],
      default: 'available'
    },
    soldTo: {
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      soldAt: Date,
      amount: Number
    }
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
communitySchema.index({ type: 1, category: 1 });
communitySchema.index({ author: 1, createdAt: -1 });
communitySchema.index({ tags: 1 });
communitySchema.index({ isPinned: -1, createdAt: -1 });

export default mongoose.model("Community", communitySchema);
