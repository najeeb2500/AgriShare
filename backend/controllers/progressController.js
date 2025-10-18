import Progress from "../models/Progress.js";
import Land from "../models/Land.js";
import User from "../models/User.js";

// Create a new progress record
export const createProgress = async (req, res) => {
  try {
    const progressData = req.body;
    progressData.gardener = req.user.userId; // Assuming middleware sets req.user

    const progress = new Progress(progressData);
    const savedProgress = await progress.save();

    // Populate the saved progress with related data
    await savedProgress.populate([
      { path: 'land', select: 'title location area' },
      { path: 'gardener', select: 'name email role' }
    ]);

    res.status(201).json({
      message: "Progress record created successfully",
      progress: savedProgress
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating progress record", error: error.message });
  }
};

// Get all progress records
export const getProgressRecords = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      landId, 
      gardenerId, 
      growthStage,
      cropName 
    } = req.query;

    let query = { isActive: true };

    // Add filters
    if (landId) query.land = landId;
    if (gardenerId) query.gardener = gardenerId;
    if (growthStage) query.growthStage = growthStage;
    if (cropName) query['crop.name'] = new RegExp(cropName, 'i');

    const progressRecords = await Progress.find(query)
      .populate('land', 'title location area')
      .populate('gardener', 'name email role')
      .populate('activities.performedBy', 'name email role')
      .populate('expertAdvice.expert', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Progress.countDocuments(query);

    res.status(200).json({
      progressRecords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress records", error: error.message });
  }
};

// Get progress by ID
export const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('land', 'title location area soilType waterSource')
      .populate('gardener', 'name email phone role')
      .populate('activities.performedBy', 'name email role')
      .populate('expertAdvice.expert', 'name email role qualifications');

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress record", error: error.message });
  }
};

// Get progress by land
export const getProgressByLand = async (req, res) => {
  try {
    const { landId } = req.params;
    const progressRecords = await Progress.find({ 
      land: landId, 
      isActive: true 
    })
    .populate('gardener', 'name email role')
    .populate('activities.performedBy', 'name email role')
    .sort({ createdAt: -1 });

    res.status(200).json(progressRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching land progress", error: error.message });
  }
};

// Get progress by gardener
export const getProgressByGardener = async (req, res) => {
  try {
    const { gardenerId } = req.params;
    const progressRecords = await Progress.find({ 
      gardener: gardenerId, 
      isActive: true 
    })
    .populate('land', 'title location area')
    .populate('activities.performedBy', 'name email role')
    .sort({ createdAt: -1 });

    res.status(200).json(progressRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gardener progress", error: error.message });
  }
};

// Add activity to progress
export const addActivity = async (req, res) => {
  try {
    const { progressId } = req.params;
    const activityData = req.body;
    activityData.performedBy = req.user.userId;
    activityData.date = new Date();

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      { $push: { activities: activityData } },
      { new: true, runValidators: true }
    ).populate('activities.performedBy', 'name email role');

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Activity added successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding activity", error: error.message });
  }
};

// Update growth stage
export const updateGrowthStage = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { growthStage, notes } = req.body;

    const updateData = { growthStage };
    if (notes) {
      updateData['progress.notes'] = notes;
    }

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Growth stage updated successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating growth stage", error: error.message });
  }
};

// Update yield information
export const updateYield = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { actual, quality, harvestDate } = req.body;

    const updateData = {};
    if (actual) updateData['yield.actual'] = actual;
    if (quality) updateData['yield.quality'] = quality;
    if (harvestDate) updateData['yield.actual.harvestDate'] = harvestDate;

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Yield information updated successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating yield", error: error.message });
  }
};

// Add pest/disease record
export const addPestDisease = async (req, res) => {
  try {
    const { progressId } = req.params;
    const pestDiseaseData = req.body;
    pestDiseaseData.date = new Date();

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      { $push: { pestDisease: pestDiseaseData } },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Pest/disease record added successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding pest/disease record", error: error.message });
  }
};

// Add expense
export const addExpense = async (req, res) => {
  try {
    const { progressId } = req.params;
    const expenseData = req.body;
    expenseData.date = new Date();

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      { $push: { expenses: expenseData } },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Expense added successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error: error.message });
  }
};

// Add revenue
export const addRevenue = async (req, res) => {
  try {
    const { progressId } = req.params;
    const revenueData = req.body;
    revenueData.date = new Date();

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      { $push: { revenue: revenueData } },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Revenue added successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding revenue", error: error.message });
  }
};

// Add expert advice
export const addExpertAdvice = async (req, res) => {
  try {
    const { progressId } = req.params;
    const adviceData = req.body;
    adviceData.expert = req.user.userId;
    adviceData.date = new Date();

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      { $push: { expertAdvice: adviceData } },
      { new: true, runValidators: true }
    ).populate('expertAdvice.expert', 'name email role qualifications');

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Expert advice added successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding expert advice", error: error.message });
  }
};

// Update soil condition
export const updateSoilCondition = async (req, res) => {
  try {
    const { progressId } = req.params;
    const soilData = req.body;
    soilData.lastTested = new Date();

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      { soilCondition: soilData },
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Soil condition updated successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating soil condition", error: error.message });
  }
};

// Update progress
export const updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.gardener;
    delete updateData.land;
    delete updateData.createdAt;

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      updateData,
      { new: true, runValidators: true }
    ).populate('gardener', 'name email role');

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Progress updated successfully",
      progress
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error: error.message });
  }
};

// Delete progress
export const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndUpdate(
      req.params.progressId,
      { isActive: false },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.status(200).json({
      message: "Progress record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting progress record", error: error.message });
  }
};
