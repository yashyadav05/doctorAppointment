import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;
export const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (formdata) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, formdata, {withCredentials: true});
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success("Login successful!");
      return data;
      // toast.success(data.message || "Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
      console.error("Auth Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const signup = async (formdata) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/auth/signup`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    setUser(data.user);
    setIsAuthenticated(true);
    toast.success("Signup successful!");
    return data;

  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed.");
    console.error("Signup Error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};


  const appointment = async (formdata) => {
    try {
      await axios.post(`${BASE_URL}/api/appointments/book`, formdata, {
        withCredentials: true,
      });
      toast.success("Appointment booked successfully!");
    } catch (error) {
      toast.error("Appointment booking failed. Please try again.");
      console.error("Appointment Error:", error);
      throw error;
    }
  };

  const fetchUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/appointments/getUserAppointments`, {
        withCredentials: true,
      });
      console.log("User appointments fetched:", data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch appointments. Please try again.");
      console.error("Fetch Appointments Error:", error);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/appointments/deleteAppointment`, {id: appointmentId}, {
        withCredentials: true,
      });
      toast.success("Appointment deleted successfully!");
      return data;
    } catch (error) {
      toast.error("Failed to fetch appointments. Please try again.");
      console.error("Fetch Appointments Error:", error); 
      throw error;  
    }
  }

  const fetchDoctorAppointments = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/appointments/getDoctorAppointments`, {
        withCredentials: true,
      });
      console.log("Doctor appointments fetched:", data);
      return data;
    } catch (error) {
      toast.error("Failed to fetch doctor appointments. Please try again.");
      console.error("Fetch Doctor Appointments Error:", error);
    }
  };

  const loadDoctors = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/auth/getdoctors`,{ withCredentials: true });
      console.log("Doctors fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("Fetch Doctors Error:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/auth/logout`);
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully!");
      console.log("Logout successful");
      navigate('/login');
    } catch (error) {
      console.error("Fetch Doctors Error:", error);
      toast.error("Logout failed. Please try again.");
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        appointment,
        fetchUserAppointments,
        fetchDoctorAppointments,
        deleteAppointment,
        loadDoctors,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
