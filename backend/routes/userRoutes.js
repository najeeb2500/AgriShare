import express from "express";
import {
    approveUser,
    createUser,
    deleteUser,
    getPendingUsers,
    getUserById,
    getUserProfile,
    getUsers,
    getUsersByRole,
    loginUser,
    rejectUser,
    updateUser,
    updateUserProfile
} from "../controllers/userController.js";
import { requireAdmin, requireApproval } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/", createUser);
router.post("/userlogin", loginUser);

// Protected routes


// User profile routes
router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);

// Admin only routes
router.get("/getusers",  getPendingUsers);
router.put("/approve-user/:userId", requireAdmin, approveUser);
router.delete("/reject-user/:userId", requireAdmin, rejectUser);

// General user routes (require approval)
router.get("/",  getUsers);
router.get("/:id", requireApproval, getUserById);
router.put("/:id", requireApproval, updateUser);
router.delete("/:id", requireAdmin, deleteUser);
router.get("/role/:role", requireApproval, getUsersByRole);

export default router;