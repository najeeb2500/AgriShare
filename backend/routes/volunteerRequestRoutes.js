import express from "express";
import { approveRequest, createRequest, getAllRequests, getMyRequests, getPendingRequests, rejectRequest } from "../controllers/volunteerRequestController.js";

const router = express.Router();

// Volunteer
router.post("/create", createRequest);
router.get("/my-requests/:volunteerId", getMyRequests);

// Admin
router.get("/all", getAllRequests);
router.get("/pending", getPendingRequests);
router.put("/approve/:id", approveRequest);
router.put("/reject/:id", rejectRequest);

export default router;
