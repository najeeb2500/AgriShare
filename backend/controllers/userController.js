import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { 
      name, 
      role, 
      email, 
      password, 
      phone, 
      address, 
      bio, 
      experience, 
      skills,
      landowner,
      gardener,
      volunteer,
      expert
    } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create new user with hashed password
    const user = new User({
      name,
      role,
      email,
      password: hashedPassword,
      phone,
      address,
      bio,
      experience,
      skills,
      // Role-specific data
      ...(role === 'landowner' && landowner && { landowner }),
      ...(role === 'gardener' && gardener && { gardener }),
      ...(role === 'volunteer' && volunteer && { volunteer }),
      ...(role === 'expert' && expert && { expert }),
      // Admin users are auto-approved
      isApproved: role === 'admin'
    });

    // 4️⃣ Save user to DB
    const savedUser = await user.save();

    // 5️⃣ Send response without password
    res.status(201).json({
      message: role === 'admin' 
        ? "Admin user created successfully" 
        : "User registration submitted for approval",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        role: savedUser.role,
        email: savedUser.email,
        isApproved: savedUser.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from response
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    if (!["admin", "farmer", "volunteer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.find({ role }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users by role", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Check if user is approved (except for admin)
    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Your account is pending approval. Please wait for admin approval." 
      });
    }

    // 4️⃣ Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: "Your account has been deactivated. Please contact admin." 
      });
    }

    // 5️⃣ Update last login
    user.lastLogin = new Date();
    await user.save();

    // 6️⃣ Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // 7️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        isApproved: user.isApproved,
        phone: user.phone,
        address: user.address,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get pending users for admin approval
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      isApproved: false, 
      role: { $ne: 'admin' } 
    }).select("-password");
    
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending users", error: error.message });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isApproved: true, 
        approvedBy: adminId, 
        approvedAt: new Date() 
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User approved successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Error approving user", error: error.message });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User rejected and removed",
      reason: reason || "No reason provided"
    });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting user", error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.isApproved;
    delete updateData.approvedBy;
    delete updateData.approvedAt;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};