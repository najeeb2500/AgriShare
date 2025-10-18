import express from "express";
import {
  createLand,
  getAvailableLands,
  getLandById,
  getLandsByLandowner,
  allocateLand,
  updateLandStatus,
  updateLand,
  deleteLand,
  getLandsNearLocation
} from "../controllers/landController.js";
import { authenticateToken, requireApproval, requireAdmin, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public land routes (require approval)
router.get("/available", requireApproval, getAvailableLands);
router.get("/nearby", requireApproval, getLandsNearLocation);
router.get("/:id", requireApproval, getLandById);

// Landowner routes
router.post("/", requireRole('landowner', 'admin'), requireApproval, createLand);
router.get("/landowner/:landownerId", requireApproval, getLandsByLandowner);
router.put("/:landId", requireApproval, updateLand);
router.put("/:landId/status", requireApproval, updateLandStatus);
router.delete("/:landId", requireApproval, deleteLand);

// Admin only routes
router.put("/:landId/allocate", requireAdmin, allocateLand);

export default router;
