import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/admin-login", {
        email,
        password,
      });

      const { token, user } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Are you a student?{" "}
            <button
              type="button"
              onClick={() => navigate("/student-login")}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
