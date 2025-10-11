import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  loginUser
} from "../controllers/userController.js";

const router = express.Router();

// Create a new user
router.post("/users", createUser);

// Get all users
router.get("/users", getUsers);

// Get user by ID
router.get("/users/:id", getUserById);

// Update user
router.put("/users/:id", updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

// Get users by role
router.get("/users/role/:role", getUsersByRole);

router.post("/userlogin",loginUser)

export default router;