const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: [true, "Full name is required"],
    minlength: [2, "Full name must be at least 2 characters"],
    maxlength: [50, "Full name cannot exceed 50 characters"],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  accountType: {
    type: String,
    enum: ["User", "Doctor"],
    required: true,
  },
  image: {
  type: String,
  default: "",
},

});

module.exports = mongoose.model("User", userSchema);
