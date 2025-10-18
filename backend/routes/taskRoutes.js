import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  getTasksByUser,
  updateTaskStatus,
  updateTaskProgress,
  addVolunteer,
  addTaskFeedback,
  updateTask,
  deleteTask,
  getOverdueTasks
} from "../controllers/taskController.js";
import { authenticateToken, requireApproval, requireAdmin, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// General task routes (require approval)
router.get("/", requireApproval, getTasks);
router.get("/overdue", requireApproval, getOverdueTasks);
router.get("/:id", requireApproval, getTaskById);
router.get("/user/:userId", requireApproval, getTasksByUser);

// Task management routes (require approval)
router.post("/", requireRole('admin', 'volunteer'), requireApproval, createTask);
router.put("/:taskId", requireApproval, updateTask);
router.put("/:taskId/status", requireApproval, updateTaskStatus);
router.put("/:taskId/progress", requireApproval, updateTaskProgress);
router.delete("/:taskId", requireApproval, deleteTask);

// Volunteer and feedback routes
router.post("/:taskId/volunteer", requireRole('volunteer'), requireApproval, addVolunteer);
router.post("/:taskId/feedback", requireApproval, addTaskFeedback);

export default router;
