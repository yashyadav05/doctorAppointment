// const Appointment = require("../models/appointment");

// exports.createAppointment = async (req, res) => {
//   try {
//     const { doctorId, date, time } = req.body;
//     //check all fields
//     if (!doctorId || !date || !time) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     if (isNaN(Date.parse(date))) {
//       return res.status(400).json({ success: false, message: "Invalid date" });
//     }

//     const existing = await Appointment.findOne({ doctorId, date, time });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Slot already booked, please choose another time",
//       });
//     }

//     //create appointment
//     const appoinment = await Appointment.create({
//       userId: req.user.id,
//       doctorId,
//       date,
//       time,
//     });

//     return res.status(201).json({
//       success: true,
//       appoinment,
//     });
//   } catch (error) {
//     console.error("Create appointment error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// //fetch all appointments for a doctor
// exports.getDoctorAppointments = async (req, res) => {
//     try {
//         const appointments = await Appointment.find({ doctorId: req.user._id }).sort({ createdAt: -1 });
//         return res.status(200).json({
//             success: true,
//             appointments
//         });
//     } catch (error) {
//      console.error("Get doctor appointments error:", error);
//      return res.status(500).json({
//       success: false,
//       message: error.message,
//     });       
//     }
// }

// //fetch all appointments for a user
// exports.getUserAppointments = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized - No user found in request",
//       });
//     }

//     const userId = req.user.id;

//     const appointments = await Appointment.find({ userId }).sort({
//       createdAt: -1,
//     });

//     return res.status(200).json({
//       success: true,
//       appointments,
//     });
//   } catch (error) {
//     console.error("Get user appointments error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.deleteAppointment = async (req, res) => {
//   try {
//     const {id} = req.body;
//     await Appointment.findByIdAndDelete(id);
//     return res.status(200).json({
//       success: true,
//       message: "Appointment deleted successfully",
//     });
    
//   } catch (error) {
//     console.error("Delete appointment error:", error);
//      return res.status(500).json({
//       success: false,
//       message: error.message,
//     });   
//   }
// }


// //update appointment status
// exports.updateAppointmentStatus = async (req, res) => {
//     try {
//         const { appointmentId, status } = req.body;
        
//     } catch (error) {
//         console.error("Update appointment status error:", error);
//        return res.status(500).json({
//       success: false,
//       message: error.message,
//     });        
//     }
// }

const Appointment = require("../models/appointment");

// ---------------------------------------------------------------------
// Create Appointment
// ---------------------------------------------------------------------
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, name, phone } = req.body;

    if (!doctorId || !date || !time || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // validate date
    if (isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    // Check if slot exists
    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorId,
      name,
      phone,
      date,
      time,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      appointment,
    });

  } catch (error) {
    console.error("Create appointment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------
// FIXED: Fetch Appointments for Doctor (Using doctorId from params)
// ---------------------------------------------------------------------
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const appointments = await Appointment
      .find({ doctorId })
      .populate("userId", "fullName phone email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {
    console.error("Get doctor appointments error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------
// Get Appointments for User
// ---------------------------------------------------------------------
exports.getUserAppointments = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const appointments = await Appointment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {
    console.error("Get user appointments error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------
// Delete Appointment
// ---------------------------------------------------------------------
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.body;

    await Appointment.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });

  } catch (error) {
    console.error("Delete appointment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------------------------------------------------------------
// FIXED: Update Appointment Status
// ---------------------------------------------------------------------
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return res.status(400).json({
        success: false,
        message: "AppointmentId and status are required",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      appointment,
    });

  } catch (error) {
    console.error("Update appointment status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
