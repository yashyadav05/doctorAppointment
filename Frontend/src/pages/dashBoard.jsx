import { useState, useEffect, useContext } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Video,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../context/authContext";

function Dashboard() {
  const {
    logout,
    loadDoctors,
    fetchUserAppointments,
    appointment,
    user,
    deleteAppointment,
  } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("book");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // Load doctors + appointments
  useEffect(() => {
    const loadData = async () => {
      const doctorResponse = await loadDoctors();
      const appointmentResponse = await fetchUserAppointments();

      if (doctorResponse?.doctors) setDoctors(doctorResponse.doctors);
      if (appointmentResponse?.appointments)
        setAppointments(appointmentResponse.appointments);
    };

    loadData();
  }, []);

  // FILTER doctors only by search (no specialties)
  const filteredDoctors = doctors.filter((doc) =>
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteAppointment = async (appointmentId) => {
    await deleteAppointment(appointmentId);
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );
    setAppointments(updatedAppointments);
  };

  // Book appointment API
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    await appointment({
      doctorId: selectedDoctor._id,
      name: name,
      phone: phone,
      date: selectedDate,
      time: selectedTime,
    });

    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MediCare</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-gray-700 hover:text-blue-600 transition">
                {/* <MessageSquare className="w-6 h-6" /> */}
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your appointments and book new consultations
        </p>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("book")}
            className={`pb-4 px-2 font-semibold ${
              activeTab === "book"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Book Appointment
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`pb-4 px-2 font-semibold ${
              activeTab === "appointments"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Appointments
          </button>
        </div>

        {/* BOOK APPOINTMENT */}
        {activeTab === "book" && (
          <>
            {/* SEARCH */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                />
              </div>
            </div>

            {/* DOCTOR LIST */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={doctor.image}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{doctor.fullName}</h3>
                      <p className="text-gray-600">
                        {" "}
                        {doctor.experience || "Experience not provided"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>

            {/* BOOKING POPUP */}
            {selectedDoctor && (
              <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
                <div className="bg-white rounded-xl p-8 max-w-md w-full">
                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() => {
                      setSelectedDoctor(null);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="absolute top-40 right-145 text-red-700"
                  >
                    ✖
                  </button>
                  <h2 className="text-xl font-bold mb-4">
                    Book with {selectedDoctor.fullName}
                  </h2>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border p-3 rounded-lg mb-4"
                  />
                  <input
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-3 rounded-lg mb-4"
                    placeholder="Enter your name"
                  />
                  <input
                    type="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border p-3 rounded-lg mb-4"
                    placeholder="Enter your phone number"
                  />

                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border p-3 rounded-lg mb-6"
                  >
                    <option value="">Select Time</option>
                    <option>09:00 AM</option>
                    <option>11:00 AM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                  </select>

                  <button
                    onClick={handleBookAppointment}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length === 0 && (
              <p className="text-gray-600">No appointments found</p>
            )}

            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-xl shadow-sm p-6 flex justify-between"
              >
                <div>
                  <h3 className="font-bold text-xl">{appt.doctorName}</h3>
                  <p className="text-gray-600">
                    {appt.date} at {appt.time}
                  </p>
                </div>

                <button className="text-red-600 border px-4 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
