import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Welcome from "./pages/Welcome";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import StudentView from "./pages/StudentView";
import StudentProfile from "./pages/StudentProfile";
import ManageSubjects from "./pages/ManageSubjects";
import SubjectsLanding from "./pages/SubjectsLanding";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/admin-login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/student-view" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Welcome Page - Landing Page */}
      <Route path="/welcome" element={<Welcome />} />

      {/* Public Routes */}
      <Route
        path="/admin-login"
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AdminLogin />
          )
        }
      />
      <Route
        path="/student-login"
        element={
          isAuthenticated() ? (
            <Navigate to="/student-view" replace />
          ) : (
            <StudentLogin />
          )
        }
      />
      <Route
        path="/student-register"
        element={
          isAuthenticated() ? (
            <Navigate to="/student-view" replace />
          ) : (
            <StudentRegister />
          )
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-student"
        element={
          <ProtectedRoute adminOnly={true}>
            <AddStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-student/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <EditStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute adminOnly={true}>
            <SubjectsLanding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-subjects/:id"
        element={
          <ProtectedRoute adminOnly={true}>
            <ManageSubjects />
          </ProtectedRoute>
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/student-view"
        element={
          <ProtectedRoute>
            <StudentView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-profile"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Default Route - Redirect to Welcome Page */}
      <Route path="/" element={<Welcome />} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
