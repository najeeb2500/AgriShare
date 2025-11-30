import express from "express";
import {
  addTaskFeedback,
  addVolunteer,
  createTask,
  deleteTask,
  getOverdueTasks,
  getTaskById,
  getTasks,
  getTasksByUser,
  updateTask,
  updateTaskProgress,
  updateTaskStatus
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
// router.use(authenticateToken);

// General task routes (require approval)
router.get("/", getTasks);
router.get("/overdue", getOverdueTasks);
router.get("/:id", getTaskById);
router.get("/user/:userId", getTasksByUser);

// Task management routes (require approval)
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.put("/:taskId/status", updateTaskStatus);
router.put("/:taskId/progress", updateTaskProgress);
router.delete("/:taskId", deleteTask);

// Volunteer and feedback routes
router.post("/:taskId/volunteer", addVolunteer);
router.post("/:taskId/feedback", addTaskFeedback);

export default router;
