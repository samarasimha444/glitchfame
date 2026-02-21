import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";

import Dashboard from "./Roles/Users/Dashboard";
import Admin from "./Roles/Admin/Admin";
import Login from "./Roles/Users/Login";
import Signup from "./Roles/Users/Signup";
import Participate from "./Roles/Users/Participate";

export default function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* USER Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="USER" />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:seasonId/participate" element={<Participate />} />
        </Route>
      </Route>

      {/* ADMIN Protected Routes */}
      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
        <Route element={<Layout />}>
          <Route path="/admin-dashboard" element={<Admin />} />
        </Route>
      </Route>

    </Routes>
  );
}