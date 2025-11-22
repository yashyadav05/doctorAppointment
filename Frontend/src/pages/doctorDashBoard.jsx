import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Phone,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { AuthContext } from "../context/authContext";

function DoctorDashboard() {
  const { user, logout, fetchDoctorAppointments } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const API = import.meta.env.VITE_BASE_URL;

  // ---------------------------------------------------------
  // LOAD APPOINTMENTS
  // ---------------------------------------------------------
  useEffect(() => {
    const loadApts = async () => {
      const res = await fetchDoctorAppointments();
      setAppointments(res?.appointments || []);
    };

    loadApts();
  }, []);

  // ---------------------------------------------------------
  // UPDATE STATUS (Confirm / Cancel)
  // ---------------------------------------------------------
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/appointments/updateStatus`,
        { appointmentId: id, status },
        { withCredentials: true }
      );

      // Update UI instantly
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status } : appt
        )
      );
    } catch (err) {
      console.log("Status update error:", err);
    }
  };

  // ---------------------------------------------------------
  // STATUS COLORS
  // ---------------------------------------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "";
    }
  };

  const badge = (status) =>
    `px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`;

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <User className="text-white w-6 h-6" />
            </div>

            <div>
              <div className="text-sm text-gray-600">Welcome</div>
              <div className="text-lg font-bold text-gray-900">
                {user?.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <MessageSquare className="w-6 h-6 text-gray-700" /> */}

            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage your appointments</p>

        {/* APPOINTMENTS LIST */}
        <div className="mt-8 space-y-4">

          {appointments.length === 0 && (
            <p className="text-gray-500">No appointments yet.</p>
          )}

          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white shadow p-6 rounded-xl hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <h3 className="text-xl font-bold">{apt.name}</h3>
                <span className={badge(apt.status)}>{apt.status}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {apt.date}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  {apt.time}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {apt.phone}
                </div>
              </div>

              {/* Buttons */}
              {apt.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateStatus(apt._id, "confirmed")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(apt._id, "cancelled")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
