import VolunteerRequest from "../models/VolunteerRequest.js";

// Volunteer sends request
export const createRequest = async (req, res) => {
  try {
    const { volunteerId, type, quantity, specificType } = req.body;

    // Validate required fields
    if (!volunteerId || !type || !quantity) {
      return res.status(400).json({ error: "Missing required fields: volunteerId, type, quantity" });
    }

    const newReq = await VolunteerRequest.create({
      volunteer: volunteerId,
      type,
      quantity,
      specificType: specificType || null
    });

    res.status(201).json(newReq);
  } catch (error) {
    console.error("Error creating volunteer request:", error);
    res.status(500).json({ error: error.message || "Error creating request" });
  }
};

// Volunteer gets their own requests
export const getMyRequests = async (req, res) => {
  try {
    const { volunteerId } = req.params;

    const requests = await VolunteerRequest.find({ volunteer: volunteerId })
      .populate("volunteer", "name email role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching volunteer requests:", error);
    res.status(500).json({ error: "Error fetching requests" });
  }
};

// Admin gets all pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await VolunteerRequest.find({ status: "pending" })
      .populate("volunteer", "name email role");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching requests" });
  }
};

// Admin gets all requests (pending, approved, and rejected)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await VolunteerRequest.find()
      .populate("volunteer", "name email role")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching requests" });
  }
};

// Admin approves request
export const approveRequest = async (req, res) => {
  try {
    const updatedRequest = await VolunteerRequest.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("volunteer", "name email role");
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: "Error approving request" });
  }
};

// Admin rejects request
export const rejectRequest = async (req, res) => {
  try {
    const updatedRequest = await VolunteerRequest.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate("volunteer", "name email role");
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: "Error rejecting request" });
  }
};
