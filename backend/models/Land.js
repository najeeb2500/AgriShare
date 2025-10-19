import mongoose from "mongoose";

const landSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    landowner: {
      type: String, // changed from ObjectId to String
      required: true,
    },
    location: {
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
    },
    area: {
      total: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["acres", "cent"],
        default: "acres",
      },
      available: {
        type: Number,
        required: true,
      },
    },
    soilType: {
      type: String,
      enum: ["clay", "sandy", "loamy", "silty", "peaty", "chalky", "unknown"],
      default: "unknown",
    },
    waterSource: {
      type: String,
      enum: ["well", "borewell", "canal", "rainwater", "municipal", "other"],
      default: "other",
    },
    irrigation: {
      type: String,
      enum: ["drip", "sprinkler", "flood", "manual", "none"],
      default: "none",
    },
    accessibility: {
      roadAccess: { type: Boolean, default: false },
      vehicleAccess: { type: Boolean, default: false },
      publicTransport: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["available", "allocated", "cultivated", "maintenance", "unavailable"],
      default: "available",
    },
    allocatedTo: {
      gardener: String, // changed to String
      allocatedAt: Date,
      allocatedBy: String, // changed to String
    },
    images: [String],
    documents: [String],
    terms: {
      duration: Number,
      cost: { type: Number, default: 0 },
      costType: { type: String, enum: ["free", "rent", "share"], default: "free" },
      conditions: String,
    },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: String, // changed to String
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Land", landSchema);
