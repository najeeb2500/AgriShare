import Land from "../models/Land.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
// Create a new land listing
export const createLand = async (req, res) => {
  try {
    const landData = req.body;

    // Ensure createdBy is string (userId passed from frontend)
    if (!landData.createdBy) {
      return res.status(400).json({ message: "User ID (createdBy) is required" });
    }

    const newLand = new Land(landData);
    const savedLand = await newLand.save();

    res.status(201).json({
      message: "Land created successfully",
      land: savedLand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating land",
      error: error.message,
    });
  }
};

// Get all available lands
export const getAvailableLands = async (req, res) => {
  try {
    const { page = 1, limit = 10, city, state, minArea, maxArea, soilType } = req.query;
    
    let query = { 
      // status: 'available', 
      isActive: true 
    };

    // Add filters
    if (city) query['location.address.city'] = new RegExp(city, 'i');
    if (state) query['location.address.state'] = new RegExp(state, 'i');
    if (soilType) query.soilType = soilType;
    if (minArea || maxArea) {
      query['area.total'] = {};
      if (minArea) query['area.total'].$gte = parseFloat(minArea);
      if (maxArea) query['area.total'].$lte = parseFloat(maxArea);
    }

    const lands = await Land.find(query)
      .populate('landowner', 'name email phone')
      .populate('allocatedTo.gardener', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Land.countDocuments(query);

    res.status(200).json({
      lands,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lands", error: error.message });
  }
};

// Get land by ID
export const getLandById = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id)
      .populate('landowner', 'name email phone address')
      .populate('allocatedTo.gardener', 'name email phone')
      .populate('allocatedTo.allocatedBy', 'name email');

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    res.status(200).json(land);
  } catch (error) {
    res.status(500).json({ message: "Error fetching land", error: error.message });
  }
};

// Get lands by landowner
export const getLandsByLandowner = async (req, res) => {
  try {
    const { landownerId } = req.params;
    const lands = await Land.find({  })
      .populate('allocatedTo.gardener', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(lands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching landowner's lands", error: error.message });
  }
};

// Allocate land to gardener (Admin only)
export const allocateLand = async (req, res) => {
  try {
    const { landId } = req.params;
    const { gardenerId, adminId } = req.body;

    // Check if land exists and is available
    const land = await Land.findById(landId);
    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    if (land.status !== 'available') {
      return res.status(400).json({ message: "Land is not available for allocation" });
    }

    // Check if gardener exists and is approved
    const gardener = await User.findById(gardenerId);
    if (!gardener || gardener.role !== 'gardener' || !gardener.isApproved) {
      return res.status(400).json({ message: "Invalid gardener" });
    }

    // Update land allocation
    land.status = 'allocated';
    land.allocatedTo = {
      gardener: gardenerId,
      allocatedAt: new Date(),
      allocatedBy: adminId
    };

    const updatedLand = await land.save();

    res.status(200).json({
      message: "Land allocated successfully",
      land: updatedLand
    });
  } catch (error) {
    res.status(500).json({ message: "Error allocating land", error: error.message });
  }
};

// Update land status
export const updateLandStatus = async (req, res) => {
  try {
    const { landId } = req.params;
    const { status } = req.body;

    const land = await Land.findByIdAndUpdate(
      landId,
      { status },
      { new: true, runValidators: true }
    );

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // you can use others like Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"AgriShare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial; line-height:1.5;">
          <h2 style="color:#2e7d32;">${subject}</h2>
          <p>${message}</p>
          <p style="font-size:0.9em; color:#555;">
            — AgriShare Team 🌱
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Land status updated successfully",
      land
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating land status", error: error.message });
  }
};

// Update land details
export const updateLand = async (req, res) => {
  try {
    const { landId } = req.params;
    const updateData = req.body;
    // Remove fields that shouldn't be updated directly
    delete updateData.landowner;
    delete updateData.createdBy;
    delete updateData.allocatedTo;

    const land = await Land.findByIdAndUpdate(
      landId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    res.status(200).json({
      message: "Land updated successfully",
      land
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating land", error: error.message });
  }
};

// Delete land
export const deleteLand = async (req, res) => {
  try {
    const land = await Land.findByIdAndUpdate(
      req.params.landId,
      { isActive: false , status:"cancelled"},
      { new: true }
    );

    if (!land) {
      return res.status(404).json({ message: "Land not found" });
    }

    res.status(200).json({
      message: "Land deactivated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting land", error: error.message });
  }
};

// Get lands near location
export const getLandsNearLocation = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const lands = await Land.find({
      status: 'available',
      isActive: true,
      'location.coordinates.latitude': {
        $gte: parseFloat(latitude) - (radius / 111), // Rough conversion: 1 degree ≈ 111 km
        $lte: parseFloat(latitude) + (radius / 111)
      },
      'location.coordinates.longitude': {
        $gte: parseFloat(longitude) - (radius / 111),
        $lte: parseFloat(longitude) + (radius / 111)
      }
    })
    .populate('landowner', 'name email phone')
    .sort({ createdAt: -1 });

    res.status(200).json(lands);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby lands", error: error.message });
  }
};
