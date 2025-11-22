import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function StudentView() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError(err.response?.data?.message || "Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = () => {
    if (!student?.subjects || student.subjects.length === 0) return 0;
    const total = student.subjects.reduce(
      (sum, sub) => sum + (sub.mark || 0),
      0
    );
    return (total / student.subjects.length).toFixed(2);
  };

  const calculateGrade = () => {
    const avg = parseFloat(calculateAverage());
    if (avg >= 90) return "A+";
    if (avg >= 80) return "A";
    if (avg >= 70) return "B+";
    if (avg >= 60) return "B";
    if (avg >= 50) return "C";
    if (avg >= 40) return "D";
    return "F";
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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Student Profile
        </h1>

        {/* Personal Information Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 font-semibold">Name</p>
              <p className="text-gray-900 text-lg">{student?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Registration Number</p>
              <p className="text-gray-900 text-lg">{student?.regNo}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Email</p>
              <p className="text-gray-900 text-lg">{student?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Gender</p>
              <p className="text-gray-900 text-lg">{student?.gender}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Phone</p>
              <p className="text-gray-900 text-lg">{student?.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Department</p>
              <p className="text-gray-900 text-lg">{student?.department}</p>
            </div>
          </div>
        </div>

        {/* Academic Performance Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Academic Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 font-semibold">Total Subjects</p>
              <p className="text-3xl font-bold text-blue-600">
                {student?.subjects?.length || 0}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 font-semibold">Average Marks</p>
              <p className="text-3xl font-bold text-green-600">
                {calculateAverage()}%
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <p className="text-gray-600 font-semibold">Overall Grade</p>
              <p className="text-3xl font-bold text-purple-600">
                {calculateGrade()}
              </p>
            </div>
          </div>

          {/* Subjects Table */}
          {student?.subjects && student.subjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {student.subjects.map((subject, index) => {
                    const mark = subject.mark || 0;
                    let grade = "F";
                    if (mark >= 90) grade = "A+";
                    else if (mark >= 80) grade = "A";
                    else if (mark >= 70) grade = "B+";
                    else if (mark >= 60) grade = "B";
                    else if (mark >= 50) grade = "C";
                    else if (mark >= 40) grade = "D";

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {subject.subjectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {mark}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={`px-3 py-1 rounded-full text-white ${
                              mark >= 70
                                ? "bg-green-500"
                                : mark >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No subjects assigned yet
            </p>
          )}
        </div>
      </div>
    </>
  );
}
