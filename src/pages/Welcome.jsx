import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "iconsax-react";
import { wakeUpServer } from "../utils/keepAlive";

export default function Welcome() {
  const navigate = useNavigate();

  // Wake up the backend server on component mount
  useEffect(() => {
    wakeUpServer();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#081328] via-[#0a1836] to-[#0c1c3a] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Book
              size="48"
              color="#ffffff"
              variant="Bold"
              className="sm:hidden"
            />
            <Book
              size="56"
              color="#ffffff"
              variant="Bold"
              className="hidden sm:block"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
          Welcome to
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
          Student Management System
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 leading-relaxed px-4">
          Manage student records, track academic performance, and streamline
          administrative tasks.
        </p>

        {/* Login Button */}
        <div className="flex flex-col gap-4 items-center px-4">
          <button
            onClick={() => navigate("/admin-login")}
            className="w-full max-w-md px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base sm:text-lg rounded-xl font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 sm:mt-12 text-gray-400 text-xs sm:text-sm">
          © 2025 Student Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
