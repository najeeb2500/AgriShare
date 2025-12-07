import mongoose from "mongoose";

const volunteerRequestSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["seeds", "tools", "fertilizer", "water"],
    required: true
  },
  specificType: {
    type: String,
    default: null
  },
  quantity: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("VolunteerRequest", volunteerRequestSchema);
