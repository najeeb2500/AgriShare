import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import landRoutes from "./routes/landRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import { errorHandler, notFound, requestLogger, securityHeaders } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

// Middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/agrishare")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/marketplace", marketplaceRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ 
    message: "AgriShare API running...",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      lands: "/api/lands", 
      tasks: "/api/tasks",
      progress: "/api/progress",
      community: "/api/community",
      marketplace: "/api/marketplace"
    }
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AgriShare server running on port ${PORT}`));
