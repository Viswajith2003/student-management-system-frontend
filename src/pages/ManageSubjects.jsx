import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FiEdit, FiTrash2, FiPlus, FiSave } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import api from "../services/api";

export default function ManageSubjects() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSubject, setNewSubject] = useState({ name: "", marks: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/students/${id}`);
      const studentData = response.data.data;
      setStudent(studentData);
      setSubjects(studentData.subjects || []);
    } catch (err) {
      console.error("Error fetching student:", err);
      setError(err.response?.data?.message || "Failed to fetch student");
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (marks) => {
    const mark = parseInt(marks);
    if (mark >= 90) return "S";
    if (mark >= 85) return "A+";
    if (mark >= 80) return "A";
    if (mark >= 70) return "B+";
    if (mark >= 60) return "B";
    if (mark >= 50) return "C";
    if (mark >= 40) return "D";
    return "F";
  };

  const getPassFail = (marks) => {
    return parseInt(marks) >= 40 ? "Pass" : "Fail";
  };

  const handleAddSubject = async () => {
    if (!newSubject.name.trim() || !newSubject.marks) {
      setError("Please fill all fields");
      return;
    }

    const marks = parseInt(newSubject.marks);
    if (marks < 0 || marks > 100) {
      setError("Marks must be between 0 and 100");
      return;
    }

    try {
      const updatedSubjects = [
        ...subjects,
        { subjectName: newSubject.name, mark: marks },
      ];

      await api.put(`/api/students/${id}`, { subjects: updatedSubjects });
      setSubjects(updatedSubjects);
      setNewSubject({ name: "", marks: "" });
      setShowAddForm(false);
      setSuccess("Subject added successfully");
      setTimeout(() => setSuccess(""), 3000);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    }
  };

  const handleUpdateSubject = async (index) => {
    try {
      await api.put(`/api/students/${id}`, { subjects });
      setEditingIndex(null);
      setSuccess("Subject updated successfully");
      setTimeout(() => setSuccess(""), 3000);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subject");
    }
  };

  const handleDeleteSubject = async (index) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const updatedSubjects = subjects.filter((_, i) => i !== index);
        await api.put(`/students/${id}`, { subjects: updatedSubjects });
        setSubjects(updatedSubjects);
        setSuccess("Subject deleted successfully");
        setTimeout(() => setSuccess(""), 3000);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete subject");
      }
    }
  };

  const handleEditChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    if (field === "mark") {
      const marks = parseInt(value);
      if (marks >= 0 && marks <= 100) {
        updatedSubjects[index][field] = marks;
        setSubjects(updatedSubjects);
      }
    } else {
      updatedSubjects[index][field] = value;
      setSubjects(updatedSubjects);
    }
  };

  const calculateAverage = () => {
    if (subjects.length === 0) return 0;
    const total = subjects.reduce((sum, sub) => sum + sub.mark, 0);
    return (total / subjects.length).toFixed(2);
  };

  const getTotalPassFail = () => {
    const failCount = subjects.filter((sub) => sub.mark < 40).length;
    return failCount === 0 && subjects.length > 0 ? "Pass" : "Fail";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#081328]">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#081328] min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">Manage Subjects</h1>
            <p className="text-gray-400 mt-2">
              Student: {student?.name} ({student?.regNo})
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Grading System Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Grading System
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">90-100</p>
                <p className="text-xl font-bold text-green-600">S</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">85-89</p>
                <p className="text-xl font-bold text-blue-600">A+</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">80-84</p>
                <p className="text-xl font-bold text-blue-600">A</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">70-79</p>
                <p className="text-xl font-bold text-indigo-600">B+</p>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-600">60-69</p>
                <p className="text-xl font-bold text-indigo-600">B</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">50-59</p>
                <p className="text-xl font-bold text-yellow-600">C</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">40-49</p>
                <p className="text-xl font-bold text-orange-600">D</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">&lt; 40</p>
                <p className="text-xl font-bold text-red-600">F</p>
              </div>
            </div>
          </div>

          {/* Add Subject Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
            >
              {showAddForm ? (
                <>
                  <MdClose className="w-5 h-5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-5 h-5" />
                  <span>Add New Subject</span>
                </>
              )}
            </button>
          </div>

          {/* Add Subject Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Add New Subject
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter subject name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Marks (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newSubject.marks}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, marks: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter marks"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddSubject}
                    className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>Save Subject</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subjects Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No subjects added yet. Click "Add New Subject" to get
                        started.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {subjects.map((subject, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={subject.subjectName}
                                onChange={(e) =>
                                  handleEditChange(
                                    index,
                                    "subjectName",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              subject.subjectName
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editingIndex === index ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={subject.mark}
                                onChange={(e) =>
                                  handleEditChange(
                                    index,
                                    "mark",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              subject.mark
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                getGrade(subject.mark) === "S"
                                  ? "bg-green-100 text-green-800"
                                  : getGrade(subject.mark) === "A+" ||
                                    getGrade(subject.mark) === "A"
                                  ? "bg-blue-100 text-blue-800"
                                  : getGrade(subject.mark) === "B+" ||
                                    getGrade(subject.mark) === "B"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : getGrade(subject.mark) === "C"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : getGrade(subject.mark) === "D"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {getGrade(subject.mark)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                getPassFail(subject.mark) === "Pass"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {getPassFail(subject.mark)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {editingIndex === index ? (
                              <>
                                <button
                                  onClick={() => handleUpdateSubject(index)}
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-900 transition"
                                >
                                  <FiSave className="w-4 h-4" />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingIndex(null);
                                    fetchStudent();
                                  }}
                                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
                                >
                                  <MdClose className="w-4 h-4" />
                                  <span>Cancel</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingIndex(index)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 transition"
                                >
                                  <FiEdit className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteSubject(index)}
                                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 transition"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                      {/* Summary Row */}
                      <tr className="bg-gray-100 font-semibold">
                        <td
                          colSpan="2"
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          Overall Result
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Average: {calculateAverage()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              getGrade(calculateAverage()) === "S"
                                ? "bg-green-100 text-green-800"
                                : getGrade(calculateAverage()) === "A+" ||
                                  getGrade(calculateAverage()) === "A"
                                ? "bg-blue-100 text-blue-800"
                                : getGrade(calculateAverage()) === "B+" ||
                                  getGrade(calculateAverage()) === "B"
                                ? "bg-indigo-100 text-indigo-800"
                                : getGrade(calculateAverage()) === "C"
                                ? "bg-yellow-100 text-yellow-800"
                                : getGrade(calculateAverage()) === "D"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getGrade(calculateAverage())}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              getTotalPassFail() === "Pass"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {getTotalPassFail()}
                          </span>
                        </td>
                        <td></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
