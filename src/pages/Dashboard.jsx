import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StudentTable from "../components/StudentTable";
import api from "../services/api";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit, setLimit] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allStats, setAllStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    departments: {},
  });

  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const isFirstLoad = useRef(true);

  // Debounced search handler
  const handleSearch = useCallback((e) => {
    const value = e.target.value;

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500);
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      if (isFirstLoad.current) {
        setInitialLoading(true);
      } else {
        setFetchingStudents(true);
      }
      setError("");
      const response = await api.get(
        `/students?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`
      );
      const studentData = response.data.data || [];
      setStudents(studentData);
      setTotalPages(response.data.totalPages || 1);
      setTotalStudents(response.data.total || 0);

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setInitialLoading(false);
      setFetchingStudents(false);
    }
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Fetch all students stats separately
  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const response = await api.get("/students?limit=1000");
      const allStudents = response.data.data || [];

      const departments = {};
      let male = 0;
      let female = 0;

      allStudents.forEach((student) => {
        if (student.gender === "Male") male++;
        if (student.gender === "Female") female++;
        departments[student.department] =
          (departments[student.department] || 0) + 1;
      });

      setAllStats({
        total: response.data.total || allStudents.length,
        male,
        female,
        departments,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setError("");
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
      throw err;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (initialLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor student information
              </p>
            </div>
            <Link
              to="/add-student"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add New Student</span>
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1 opacity-90">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {allStats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1 opacity-90">
                    Male Students
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {allStats.male}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1 opacity-90">
                    Female Students
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {allStats.female}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1 opacity-90">
                    Departments
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {Object.keys(allStats.departments).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, email, regNo, or department..."
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">All Students</h2>
              {fetchingStudents && (
                <div className="text-blue-600 text-sm flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4"
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
                  <span>Updating...</span>
                </div>
              )}
            </div>
            <StudentTable
              students={students}
              onDelete={handleDelete}
              onRefresh={fetchStudents}
            />

            {/* Pagination Controls */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                Showing{" "}
                {students.length > 0 ? (currentPage - 1) * limit + 1 : 0} to{" "}
                {Math.min(currentPage * limit, totalStudents)} of{" "}
                {totalStudents} students
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
