import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import Admin from "./Components/Admin.jsx";
import Login from "./Components/Login";
import Signup from "./Components/Signup";

export default function App() {
  return (
    <Routes>
    <Route path="/" element={<Dashboard/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<Admin />} />
    </Routes>
  );
}