import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StudentSidebar from "../components/StudentSidebar";
import { FiEdit, FiSave, FiX } from "react-icons/fi";

function StudentProfile() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/students/${user.id}`);
      setStudent(response.data.data);
      setEditedStudent(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student data");
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedStudent({ ...student });
    setSuccessMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedStudent({ ...student });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const updateData = {
        name: editedStudent.name,
        email: editedStudent.email,
        phone: editedStudent.phone,
        gender: editedStudent.gender,
      };

      await api.put(`/students/${user.id}`, updateData);

      setStudent(editedStudent);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Error updating student data:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#081328]">
        <StudentSidebar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#081328]">
        <StudentSidebar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#081328]">
      <StudentSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Student Profile
                </h1>
                <p className="text-gray-400">
                  View and manage your personal information
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg"
                >
                  <FiEdit className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-700 hover:text-green-900"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Profile Card with Avatar */}
          <div className="bg-white shadow-lg rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h3>
              {isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <FiX className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave className="w-5 h-5" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div
                  className={`${
                    isEditing ? "bg-white" : "bg-gray-50"
                  } p-4 rounded-lg ${
                    isEditing ? "border-2 border-gray-200" : ""
                  }`}
                >
                  <p className="text-gray-600 font-semibold text-sm mb-2">
                    Full Name
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedStudent?.name || ""}
                      onChange={handleInputChange}
                      className="w-full text-gray-900 text-lg font-medium border-b-2 border-blue-500 focus:outline-none pb-1"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg font-medium">
                      {student?.name}
                    </p>
                  )}
                </div>

                {/* Registration Number (Read-only) */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 font-semibold text-sm mb-2">
                    Registration Number
                  </p>
                  <p className="text-gray-900 text-lg font-medium">
                    {student?.regNo}
                  </p>
                </div>

                {/* Email Address */}
                <div
                  className={`${
                    isEditing ? "bg-white" : "bg-gray-50"
                  } p-4 rounded-lg ${
                    isEditing ? "border-2 border-gray-200" : ""
                  }`}
                >
                  <p className="text-gray-600 font-semibold text-sm mb-2">
                    Email Address
                  </p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedStudent?.email || ""}
                      onChange={handleInputChange}
                      className="w-full text-gray-900 text-lg font-medium border-b-2 border-blue-500 focus:outline-none pb-1"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg font-medium">
                      {student?.email}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div
                  className={`${
                    isEditing ? "bg-white" : "bg-gray-50"
                  } p-4 rounded-lg ${
                    isEditing ? "border-2 border-gray-200" : ""
                  }`}
                >
                  <p className="text-gray-600 font-semibold text-sm mb-2">
                    Gender
                  </p>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editedStudent?.gender || ""}
                      onChange={handleInputChange}
                      className="w-full text-gray-900 text-lg font-medium border-b-2 border-blue-500 focus:outline-none pb-1 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 text-lg font-medium">
                      {student?.gender}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div
                  className={`${
                    isEditing ? "bg-white" : "bg-gray-50"
                  } p-4 rounded-lg ${
                    isEditing ? "border-2 border-gray-200" : ""
                  }`}
                >
                  <p className="text-gray-600 font-semibold text-sm mb-2">
                    Phone Number
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={editedStudent?.phone || ""}
                      onChange={handleInputChange}
                      className="w-full text-gray-900 text-lg font-medium border-b-2 border-blue-500 focus:outline-none pb-1"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg font-medium">
                      {student?.phone}
                    </p>
                  )}
                </div>

                {/* Department (Read-only) */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 font-semibold text-sm mb-2">
                    Department
                  </p>
                  <p className="text-gray-900 text-lg font-medium">
                    {student?.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Summary Card */}
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Academic Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-600 font-semibold text-sm mb-2">
                  Total Subjects
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {student?.subjects?.length || 0}
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-green-600 font-semibold text-sm mb-2">
                  Subjects Passed
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {student?.subjects?.filter((s) => s.mark >= 40).length || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <p className="text-purple-600 font-semibold text-sm mb-2">
                  Subjects Failed
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {student?.subjects?.filter((s) => s.mark < 40).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
