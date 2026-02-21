import { Routes, Route } from "react-router-dom";
import Dashboard from "./Roles/Users/Dashboard.jsx";
import Admin from "./Roles/Admin/Admin.jsx";
import Login from "./Roles/Users/Login.jsx";
import Signup from "./Roles/Users/Signup";
import Participate from "./Roles/Users/Participate.jsx";

export default function App() {
  return (
    <Routes>
    <Route path="/" element={<Dashboard/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<Admin />} />
      <Route path="/dashboard/:seasonId/participate" element={<Participate />} />
    </Routes>
  );
}