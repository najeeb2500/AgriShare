import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, enum: ["admin", "gardener", "volunteer","landowner"] },
  email: String,
  password: String
});

export default mongoose.model("User", userSchema);
