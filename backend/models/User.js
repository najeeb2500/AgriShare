import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ["admin", "gardener", "volunteer", "landowner", "expert"],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  profileImage: String,
  bio: String,
  experience: String,
  skills: [String],
  // Role-specific fields
  landowner: {
    totalLandArea: Number,
    availableLandArea: Number,
    landDocuments: [String]
  },
  gardener: {
    experience: String,
    preferredCrops: [String],
    availability: String
  },
  volunteer: {
    organization: String,
    volunteerHours: Number,
    specializations: [String]
  },
  expert: {
    qualifications: [String],
    certifications: [String],
    specialization: [String],
    yearsOfExperience: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
