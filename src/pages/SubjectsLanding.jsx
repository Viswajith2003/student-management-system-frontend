import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { FiSearch } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function SubjectsLanding() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const isFirstLoad = useRef(true);
  const limit = 10;

  const fetchStudents = useCallback(async () => {
    try {
      if (isFirstLoad.current) {
        setInitialLoading(true);
        isFirstLoad.current = false;
      } else {
        setFetchingStudents(true);
      }

      const response = await api.get(
        `/students?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`
      );
      setStudents(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalStudents(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setInitialLoading(false);
      setFetchingStudents(false);
    }
  }, [currentPage, debouncedSearch, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500);
  };

  const handleManageSubjects = (id) => {
    navigate(`/manage-subjects/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen bg-[#081328]">
        <Sidebar />
        <div className="ml-64 flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">Loading students...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#081328]">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Manage Subjects & Marks
            </h1>
            <p className="text-gray-400">
              Select a student to manage their subjects and marks
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                onChange={handleSearchChange}
                placeholder="Search by name, email, or registration number..."
                className="w-full pl-10 pr-4 py-2 bg-[#0c1c3a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reg No
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fetchingStudents ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-8 py-8 text-center text-gray-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <span>Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-8 py-8 text-center text-gray-500"
                      >
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {student.regNo}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                          {student.email}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                          {student.department}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                          {student.phone}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleManageSubjects(student._id)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            title="Manage Subjects"
                          >
                            <HiOutlineBookOpen className="w-4 h-4" />
                            Manage Subjects
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {!fetchingStudents && students.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing page {currentPage} of {totalPages} ({totalStudents}{" "}
                total students)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {renderPageNumbers()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
