import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    department: "",
    password: "",
    subjects: [],
  });

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/students/${id}`);
      const student = response.data.data;
      setFormData({
        name: student.name || "",
        email: student.email || "",
        gender: student.gender || "",
        phone: student.phone || "",
        department: student.department || "",
        password: "",
        subjects: student.subjects || [],
      });
    } catch (err) {
      console.error("Error fetching student:", err);
      setError(err.response?.data?.message || "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubjectChange = (index, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = field === "mark" ? Number(value) : value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subjectName: "", mark: 0 }],
    });
  };

  const removeSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        phone: formData.phone,
        department: formData.department,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put(`/api/students/${id}`, updateData);

      // Update subjects separately if changed
      if (formData.subjects.length > 0) {
        await api.put(`/api/students/${id}/subjects`, {
          subjects: formData.subjects,
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating student:", err);
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#081328]">
        <Sidebar />
        <div className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#081328]">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Student</h1>
            <p className="text-gray-400">
              Update student information and details
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-[#0c1c3a] rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#081328] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#081328] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#081328] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-2 bg-[#081328] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-[#081328] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
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
                  <label className="block text-gray-300 font-medium mb-2">
                    New Password (Optional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    className="w-full px-4 py-2 bg-[#081328] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? "Saving..." : "Update Student"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-600 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
