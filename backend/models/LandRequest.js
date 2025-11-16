import mongoose from "mongoose";

const landRequestSchema = new mongoose.Schema(
  {
    landId: {
      type: String, // land id as string
      required: true,
    },
    userId: {
      type: String, // who requested
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
