import { useState, useContext } from "react";
import { Mail, Lock, User, Phone, ArrowRight, Image as ImageIcon } from "lucide-react";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    accountType: "",
    image: null, // 👈 added
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSwitchToLogin = () => navigate("/login");

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Convert to FormData for backend
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });

      await signup(fd);

      toast.success("Signup successful!");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed.");
      setError(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-teal-50 to-blue-50 px-3 py-3">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-600 rounded-full mb-3">
            <User className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
          <p className="text-gray-600 text-sm mt-1">
            Join us to book your appointments easily
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              name="accountType"
              required
              value={formData.accountType}
              onChange={handleChange}
              className="w-full py-2 border rounded-md text-sm"
            >
              <option value="">Select Account Type</option>
              <option value="User">User</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>

          {/* Image Upload ONLY for Doctors */}
          {formData.accountType === "Doctor" && (
            <div>
              <label className="block text-sm font-medium mb-1">Profile Image</label>
              <div className="relative border rounded-md p-2 flex items-center gap-2">
                <ImageIcon className="text-gray-500 w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-md flex justify-center items-center gap-2 text-sm"
          >
            {loading ? "Creating..." : "Create Account"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="text-teal-600 font-semibold">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
