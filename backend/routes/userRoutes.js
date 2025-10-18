import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  loginUser,
  getPendingUsers,
  approveUser,
  rejectUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/userController.js";
import { authenticateToken, requireAdmin, requireApproval } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/users", createUser);
router.post("/userlogin", loginUser);

// Protected routes
router.use(authenticateToken);

// User profile routes
router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);

// Admin only routes
router.get("/pending-users", requireAdmin, getPendingUsers);
router.put("/approve-user/:userId", requireAdmin, approveUser);
router.delete("/reject-user/:userId", requireAdmin, rejectUser);

// General user routes (require approval)
router.get("/users", requireApproval, getUsers);
router.get("/users/:id", requireApproval, getUserById);
router.put("/users/:id", requireApproval, updateUser);
router.delete("/users/:id", requireAdmin, deleteUser);
router.get("/users/role/:role", requireApproval, getUsersByRole);

export default router;