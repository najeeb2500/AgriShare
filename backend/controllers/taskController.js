import Task from "../models/Task.js";
import Land from "../models/Land.js";
import User from "../models/User.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    taskData.assignedBy = req.user.userId; // Assuming middleware sets req.user

    const task = new Task(taskData);
    const savedTask = await task.save();

    // Populate the saved task with related data
    await savedTask.populate([
      { path: 'land', select: 'title location' },
      { path: 'assignedTo', select: 'name email role' },
      { path: 'assignedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      category, 
      assignedTo, 
      landId 
    } = req.query;

    let query = { isActive: true };

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (landId) query.land = landId;

    const tasks = await Task.find(query)
      .populate('land', 'title location')
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role')
      .populate('volunteers.user', 'name email')
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('land', 'title location area')
      .populate('assignedTo', 'name email phone role')
      .populate('assignedBy', 'name email role')
      .populate('volunteers.user', 'name email phone')
      .populate('feedback.from', 'name email role');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error: error.message });
  }
};

// Get tasks assigned to a user
export const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { assignedTo: userId, isActive: true };
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('land', 'title location')
      .populate('assignedBy', 'name email role')
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user tasks", error: error.message });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, notes, images } = req.body;
    const userId = req.user.userId;

    const updateData = { status };
    
    if (status === 'in_progress' && !req.body.startDate) {
      updateData.startDate = new Date();
    }
    
    if (status === 'completed') {
      updateData.completedDate = new Date();
    }

    if (notes || images) {
      updateData['progress.notes'] = notes;
      if (images) updateData['progress.images'] = images;
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating task status", error: error.message });
  }
};

// Update task progress
export const updateTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { percentage, notes, images } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        'progress.percentage': percentage,
        'progress.notes': notes,
        ...(images && { 'progress.images': images })
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task progress updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating task progress", error: error.message });
  }
};

// Add volunteer to task
export const addVolunteer = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId, hours } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if volunteer is already added
    const existingVolunteer = task.volunteers.find(v => v.user.toString() === userId);
    if (existingVolunteer) {
      return res.status(400).json({ message: "Volunteer already added to this task" });
    }

    task.volunteers.push({
      user: userId,
      joinedAt: new Date(),
      hours: hours || 0
    });

    await task.save();

    res.status(200).json({
      message: "Volunteer added successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding volunteer", error: error.message });
  }
};

// Add feedback to task
export const addTaskFeedback = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        feedback: {
          from: userId,
          rating,
          comment,
          date: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('feedback.from', 'name email role');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Feedback added successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding feedback", error: error.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.assignedBy;
    delete updateData.createdAt;

    const task = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { isActive: false },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

// Get overdue tasks
export const getOverdueTasks = async (req, res) => {
  try {
    const overdueTasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: { $in: ['pending', 'in_progress'] },
      isActive: true
    })
    .populate('land', 'title location')
    .populate('assignedTo', 'name email phone')
    .populate('assignedBy', 'name email')
    .sort({ dueDate: 1 });

    res.status(200).json(overdueTasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching overdue tasks", error: error.message });
  }
};
