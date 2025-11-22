const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { imagekit } = require("../config/imageKit");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, phone, email, password, accountType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl;

    if (req.file) {
      // Image uploaded via multer
      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: `dp_${Date.now()}_${req.file.originalname}`,
        folder: "/doctors_pics",
      });

      // Optimize imagekit image
      imageUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "300", height: "300" },
          { crop: "maintain_ratio" },
        ],
      });
    } else {
      // Fallback to Dicebear initials (PNG)
      imageUrl = `https://api.dicebear.com/5.x/initials/png?seed=${encodeURIComponent(
        fullName
      )}&background=%23d1d5db&size=300`;
    }

    // Create new user
    const user = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      image: imageUrl,
      accountType,
    });
    // await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create token payload
    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };

    // Sign JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Hide password
    user.password = undefined;

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        accountType: user.accountType,
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById({ accountType: "User", _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get doctor profile
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ accountType: "Doctor" });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No doctors found",
      });
    }

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
