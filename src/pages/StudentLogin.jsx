import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    regNo: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/student-login", formData);
      const { token, user } = response.data;
      login(user, token);
      navigate("/student-view");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid registration number or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Login</h1>
          <p className="text-gray-600 mt-2">Access your academic portal</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your registration number"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/student-register"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Register here
            </Link>
          </p>
          <p className="text-gray-600">
            Are you an admin?{" "}
            <Link
              to="/admin-login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
