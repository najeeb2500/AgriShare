import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// Create a new user
export const createUser = async (req, res) => { 
  try { const { name, role, email, password } = req.body; // Check if user already exists
 const existingUser = await User.findOne({ email }); 
 if (existingUser) { return res.status(400).json({ message: "User already exists" }); } 
 const user = new User({ name, role, email, password  }); 
 const savedUser = await user.save(); res.status(201).json({ message: "User created successfully", user: { id: savedUser._id, name: savedUser.name, role: savedUser.role, email: savedUser.email } }); } catch (error) { res.status(500).json({ message: "Error creating user", error: error.message }); } };


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

   
    // 4️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      },
      
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};