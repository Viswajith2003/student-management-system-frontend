import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Sms, Lock, ShieldSecurity, ArrowLeft } from "iconsax-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowWarning, setSlowWarning] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSlowWarning(false);

    // Show warning if request takes more than 3 seconds
    const warningTimer = setTimeout(() => {
      setSlowWarning(true);
    }, 3000);

    try {
      const res = await api.post("/api/auth/admin-login", {
        email,
        password,
      });

      clearTimeout(warningTimer);
      const { token, user } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      clearTimeout(warningTimer);
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
      setSlowWarning(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#081328] via-[#0a1836] to-[#0c1c3a] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <button
          onClick={() => navigate("/welcome")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 sm:mb-6 transition-colors duration-200 text-sm sm:text-base"
        >
          <ArrowLeft size="20" color="currentColor" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <ShieldSecurity
                size="28"
                color="#ffffff"
                variant="Bold"
                className="sm:hidden"
              />
              <ShieldSecurity
                size="32"
                color="#ffffff"
                variant="Bold"
                className="hidden sm:block"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Admin Login
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Slow Connection Warning */}
          {slowWarning && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm text-sm">
              ⏳ Server is starting up (free hosting). This may take 30-60
              seconds on first login...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                  <Sms size="20" color="#9ca3af" variant="Bold" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                  <Lock size="20" color="#9ca3af" variant="Bold" />
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  Logging in...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">Or</span>
              </div>
            </div>
            <p className="text-gray-300 mt-4">
              Are you a student?{" "}
              <button
                type="button"
                onClick={() => navigate("/student-login")}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
