import LandRequest from "../models/LandRequest.js";
import Land from "../models/Land.js";


// -----------------------------
// Create a land request
// -----------------------------
export const createRequest = async (req, res) => {
  try {
    const { landId, userId, crop, cultivationDuration, message } = req.body;

    const landExists = await Land.findById(landId);
    if (!landExists) {
      return res.status(404).json({ message: "Land not found" });
    }

    const newRequest = new LandRequest({
      landId,
      userId,
      crop,
      cultivationDuration,
      message,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Land cultivation request submitted",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -----------------------------
// Get all requests (Admin only)
// -----------------------------
export const getAllRequests = async (req, res) => {
  try {
    const requests = await LandRequest.find().sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -----------------------------
// Approve request (Admin)
// -----------------------------
export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.body.adminId;

    const request = await LandRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request already processed earlier" });
    }

    // Update land status
    await Land.findByIdAndUpdate(request.landId, {
      status: "allocated",
      allocatedTo: {
        user: request.userId,
        gardener: null,
        allocatedBy: adminId,
        allocatedAt: new Date(),
      },
    });

    request.status = "approved";
    request.approvedBy = adminId;
    request.approvedAt = new Date();
    await request.save();

    res.status(200).json({
      message: "Request approved successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// -----------------------------
// Reject request (Admin)
// -----------------------------
export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.body.adminId;

    const request = await LandRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    request.approvedBy = adminId;
    request.approvedAt = new Date();

    await request.save();

    res.status(200).json({
      message: "Request rejected",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
