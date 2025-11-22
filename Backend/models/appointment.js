const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: String,      // You can change this to Date if needed
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"], // ✅ Matches controller
    default: "pending"
  }
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
