import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
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
      const response = await api.get(`/students/${id}`);
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

      await api.put(`/students/${id}`, updateData);

      // Update subjects separately if changed
      if (formData.subjects.length > 0) {
        await api.put(`/students/${id}/subjects`, {
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
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Student
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>

            {/* Subjects Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Subjects & Marks
                </h2>
                <button
                  type="button"
                  onClick={addSubject}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  + Add Subject
                </button>
              </div>

              {formData.subjects.map((subject, index) => (
                <div key={index} className="flex gap-4 mb-3">
                  <input
                    type="text"
                    value={subject.subjectName}
                    onChange={(e) =>
                      handleSubjectChange(index, "subjectName", e.target.value)
                    }
                    placeholder="Subject Name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={subject.mark}
                    onChange={(e) =>
                      handleSubjectChange(index, "mark", e.target.value)
                    }
                    placeholder="Mark"
                    min="0"
                    max="100"
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Update Student"}
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
