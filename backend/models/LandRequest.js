import mongoose from "mongoose";

const landRequestSchema = new mongoose.Schema(
  {
    landId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Land",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    crop: {
      type: String,
      required: true,
    },
    cultivationDuration: {
      type: Number, // in months
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LandRequest", landRequestSchema);
