import express from "express";
import {
  allocateLand,
  createLand,
  deleteLand,
  getAvailableLands,
  getLandById,
  getLandsByLandowner,
  getLandsNearLocation,
  updateLand,
  updateLandStatus
} from "../controllers/landController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
// router.use(authenticateToken);

// Public land routes (require approval)
router.get("/available", getAvailableLands);
router.get("/nearby", getLandsNearLocation);
router.get("/:id", getLandById);

// Landowner routes
router.post("/", createLand);
router.get("/landowner/:landownerId",  getLandsByLandowner);
router.put("/:landId", updateLand);
router.put("/:landId/status", updateLandStatus);
router.delete("/:landId", deleteLand);

// Admin only routes
router.put("/:landId/allocate", requireAdmin, allocateLand);

export default router;
