import express from "express";
import {
  createRequest,
  getAllRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/landRequestController.js";

const router = express.Router();

// User routes
router.post("/request", createRequest);

// Admin routes
router.get("/all", getAllRequests);
router.put("/approve/:requestId", approveRequest);
router.put("/reject/:requestId", rejectRequest);

export default router;
