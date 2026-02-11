import React, { useContext, useMemo } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppContext } from "./context/AppContext";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./context/appContextStore";
import { safeStorage } from "./utils/storage";


import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboardPage from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SystemLogs from "./pages/SystemLogs";
import PostLoad from "./pages/PostLoad";
import PostTruck from "./pages/PostTruck";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
import MyLoads from "./pages/MyLoads";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AppContext);
  const currentRole = user?.role || safeStorage.get("role");

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && currentRole && currentRole !== role) return <Navigate to="/" />;

  return children;
};

const RootRedirect = () => {
  const { user, loading } = useContext(AppContext);
  const role = user?.role || safeStorage.get("role");

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  if (role === "superadmin") return <Navigate to="/superadmin" />;
  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "driver") return <Navigate to="/driver" />;
  return <Navigate to="/dashboard" />;
};

const App = () => {
  const { user } = useContext(AppContext);

  const showNavbar = useMemo(() => Boolean(user), [user]);

  return (
    <Router>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={user ? <RootRedirect /> : <LandingPage />} />
        <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
        <Route
          path="/register"
          element={user ? <RootRedirect /> : <Register />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/driver"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-loads"
          element={
            <ProtectedRoute>
              <MyLoads />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
