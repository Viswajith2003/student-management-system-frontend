import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    regNo: "",
    gender: "",
    phone: "",
    department: "",
    password: "",
  });

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
      await api.post("/students", formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error creating student:", err);
      setError(err.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Add New Student
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                name="regNo"
                value={formData.regNo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Electronics and Communication">
                  Electronics and Communication
                </option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password (Optional)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Set password to allow student login
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Add Student"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
