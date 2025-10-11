import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


  // Routes
app.use("/api", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Land Management API running...");
});


const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
