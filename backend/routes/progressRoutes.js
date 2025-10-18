import express from "express";
import {
  createProgress,
  getProgressRecords,
  getProgressById,
  getProgressByLand,
  getProgressByGardener,
  addActivity,
  updateGrowthStage,
  updateYield,
  addPestDisease,
  addExpense,
  addRevenue,
  addExpertAdvice,
  updateSoilCondition,
  updateProgress,
  deleteProgress
} from "../controllers/progressController.js";
import { authenticateToken, requireApproval, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// General progress routes (require approval)
router.get("/", requireApproval, getProgressRecords);
router.get("/:id", requireApproval, getProgressById);
router.get("/land/:landId", requireApproval, getProgressByLand);
router.get("/gardener/:gardenerId", requireApproval, getProgressByGardener);

// Progress management routes
router.post("/", requireRole('gardener'), requireApproval, createProgress);
router.put("/:progressId", requireApproval, updateProgress);
router.put("/:progressId/growth-stage", requireApproval, updateGrowthStage);
router.put("/:progressId/yield", requireApproval, updateYield);
router.put("/:progressId/soil", requireApproval, updateSoilCondition);
router.delete("/:progressId", requireApproval, deleteProgress);

// Activity and data entry routes
router.post("/:progressId/activity", requireApproval, addActivity);
router.post("/:progressId/pest-disease", requireApproval, addPestDisease);
router.post("/:progressId/expense", requireApproval, addExpense);
router.post("/:progressId/revenue", requireApproval, addRevenue);
router.post("/:progressId/expert-advice", requireRole('expert'), requireApproval, addExpertAdvice);

export default router;
