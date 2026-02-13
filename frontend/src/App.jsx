import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import PostLoad from './pages/PostLoad';
import PostTruck from './pages/PostTruck';
import SystemLogs from './pages/SystemLogs';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboards */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'superadmin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/system-logs" element={<SystemLogs />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Route>

        {/* Features */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="/post-load" element={<PostLoad />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['driver']} />}>
          <Route path="/post-truck" element={<PostTruck />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;