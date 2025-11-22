import React from "react";
import {
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function home() {
  const navigate = useNavigate();

  const onGetStarted = () => {
    navigate('/signup')
  };

  const onSignIn = ()=>{
    navigate('/login')
  }

  return (
    <div>
      <section className="pt-10 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Your Health, Our Priority
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Book Doctor Appointments with Ease
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with top healthcare professionals in your area. Schedule
                appointments instantly and manage your healthcare journey
                seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={onSignIn}
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition">
                  Sign in
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Doctors</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-gray-600">Patients</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9</div>
                  <div className="text-gray-600 flex items-center gap-1">
                    Rating{" "}
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-teal-400 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                  alt="Doctor consultation"
                  className="rounded-2xl w-full h-96 object-cover object-center"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Appointment Confirmed
                      </div>
                      <div className="text-sm text-gray-600">
                        Dr. Sarah Johnson - 2:00 PM
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default home;
