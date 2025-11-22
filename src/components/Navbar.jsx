import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link
              to={isAdmin() ? "/dashboard" : "/student-view"}
              className="text-xl font-bold"
            >
              Student Management System
            </Link>

            {isAdmin() && (
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/add-student"
                  className="hover:bg-blue-700 px-3 py-2 rounded transition"
                >
                  Add Student
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-blue-200 text-xs">
                {user?.email || user?.regNo}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
