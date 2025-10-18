import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  getListingsBySeller,
  createOrder,
  updateOrderStatus,
  addReview,
  getNearbyListings,
  updateListing,
  deleteListing,
  getCategories,
  getFeaturedListings
} from "../controllers/marketplaceController.js";
import { authenticateToken, requireApproval, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes (optional authentication for better UX)
router.get("/", optionalAuth, getListings);
router.get("/featured", optionalAuth, getFeaturedListings);
router.get("/categories", getCategories);
router.get("/nearby", optionalAuth, getNearbyListings);
router.get("/:id", optionalAuth, getListingById);

// Protected routes
router.use(authenticateToken);
router.use(requireApproval);

// Listing management
router.post("/", createListing);
router.put("/:listingId", updateListing);
router.delete("/:listingId", deleteListing);

// Seller routes
router.get("/seller/:sellerId", getListingsBySeller);

// Order management
router.post("/:listingId/order", createOrder);
router.put("/:listingId/order/:orderId", updateOrderStatus);

// Reviews
router.post("/:listingId/review", addReview);

export default router;
