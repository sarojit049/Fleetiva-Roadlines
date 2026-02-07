import React, { useContext, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/appContextStore";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import DriverDashboard from "./pages/DriverDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SystemLogs from "./pages/SystemLogs";
import PostLoad from "./pages/PostLoad";
import PostTruck from "./pages/PostTruck";
import ForgotPassword from "./pages/ForgotPassword";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AppContext);
  const currentRole = user?.role || localStorage.getItem("role");

  if (!user) return <Navigate to="/login" />;
  if (role && currentRole && currentRole !== role) return <Navigate to="/" />;

  return children;
};

/* ================= ROOT REDIRECT ================= */
const RootRedirect = () => {
  const { user } = useContext(AppContext);
  const role = user?.role || localStorage.getItem("role");

  if (!user) return <Navigate to="/login" />;

  if (role === "superadmin") return <Navigate to="/superadmin" />;
  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "driver") return <Navigate to="/driver" />;
  return <Navigate to="/dashboard" />;
};

/* ================= APP ================= */
const App = () => {
  const { user } = useContext(AppContext);

  const showNavbar = useMemo(() => Boolean(user), [user]);

  return (
    <Router>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<RootRedirect />} />
        {/* Public */}
        <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
        <Route path="/register" element={user ? <RootRedirect /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Super Admin */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute role="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/logs"
          element={
            <ProtectedRoute role="superadmin">
              <SystemLogs />
            </ProtectedRoute>
          }
        />

        {/* Driver */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-load"
          element={
            <ProtectedRoute role="customer">
              <PostLoad />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-truck"
          element={
            <ProtectedRoute role="driver">
              <PostTruck />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
