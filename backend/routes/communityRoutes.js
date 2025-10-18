import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  toggleLike,
  addComment,
  replyToComment,
  registerForEvent,
  buyMarketplaceItem,
  getPostsByType,
  getMarketplaceItems,
  updatePost,
  deletePost,
  togglePin
} from "../controllers/communityController.js";
import { authenticateToken, requireApproval, requireAdmin, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes (optional authentication for better UX)
router.get("/", optionalAuth, getPosts);
router.get("/marketplace", optionalAuth, getMarketplaceItems);
router.get("/type/:type", optionalAuth, getPostsByType);
router.get("/:id", optionalAuth, getPostById);

// Protected routes
router.use(authenticateToken);
router.use(requireApproval);

// Post management routes
router.post("/", createPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

// Interaction routes
router.post("/:postId/like", toggleLike);
router.post("/:postId/comment", addComment);
router.post("/:postId/comment/:commentId/reply", replyToComment);

// Event and marketplace routes
router.post("/:postId/register", registerForEvent);
router.post("/:postId/buy", buyMarketplaceItem);

// Admin only routes
router.put("/:postId/pin", requireAdmin, togglePin);

export default router;
