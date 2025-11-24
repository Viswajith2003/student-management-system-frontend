import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { User, Sms, Lock, Call, Book, ArrowLeft } from "iconsax-react";

export default function StudentRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNo: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    department: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/register-student", {
        name: formData.name,
        email: formData.email,
        regNo: formData.regNo,
        password: formData.password,
        gender: formData.gender,
        phone: formData.phone,
        department: formData.department,
      });

      // Auto-login after successful registration
      const { token, user } = response.data;
      login(user, token);
      navigate("/student-view");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#081328] via-[#0a1836] to-[#0c1c3a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-2xl w-full">
        {/* Back to Home */}
        <button
          onClick={() => navigate("/welcome")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 sm:mb-6 transition-colors duration-200 text-sm sm:text-base"
        >
          <ArrowLeft size="20" color="currentColor" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <User
                size="28"
                color="#ffffff"
                variant="Bold"
                className="sm:hidden"
              />
              <User
                size="32"
                color="#ffffff"
                variant="Bold"
                className="hidden sm:block"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Student Registration
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Create your student account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <User size="20" color="#9ca3af" variant="Bold" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Email *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Sms size="20" color="#9ca3af" variant="Bold" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Registration Number *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Book size="20" color="#9ca3af" variant="Bold" />
                  </div>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="REG001"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                >
                  <option value="" className="bg-[#0a1836]">
                    Select Gender
                  </option>
                  <option value="Male" className="bg-[#0a1836]">
                    Male
                  </option>
                  <option value="Female" className="bg-[#0a1836]">
                    Female
                  </option>
                  <option value="Other" className="bg-[#0a1836]">
                    Other
                  </option>
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Call size="20" color="#9ca3af" variant="Bold" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all duration-200"
                >
                  <option value="" className="bg-[#0a1836]">
                    Select Department
                  </option>
                  <option
                    value="Computer Science Engineering"
                    className="bg-[#0a1836]"
                  >
                    Computer Science Engineering
                  </option>
                  <option
                    value="Electrical Engineering"
                    className="bg-[#0a1836]"
                  >
                    Electrical Engineering
                  </option>
                  <option
                    value="Mechanical Engineering"
                    className="bg-[#0a1836]"
                  >
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering" className="bg-[#0a1836]">
                    Civil Engineering
                  </option>
                  <option
                    value="Electronics Engineering"
                    className="bg-[#0a1836]"
                  >
                    Electronics Engineering
                  </option>
                  <option
                    value="Information Technology"
                    className="bg-[#0a1836]"
                  >
                    Information Technology
                  </option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Lock size="20" color="#9ca3af" variant="Bold" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-200 font-semibold mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <Lock size="20" color="#9ca3af" variant="Bold" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Footer Links */}
            <div className="text-center mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400">
                    Already registered?
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mt-4">
                <Link
                  to="/student-login"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
                >
                  Login to your account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
