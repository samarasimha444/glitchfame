import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Auth/Layout";
import Dashboard from "./Roles/Users/Dashboard";
import Admin from "./Roles/Admin/Admin";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import RoleRedirect from "./Auth/RoleRedirect";
import EntryForm from "./Roles/Users/EntryForm";
import Arena from "./Roles/Users/Arena";
import PlayerDetail from "./Roles/Users/PlayerDetails";
import AdminDashboard from "./Roles/Admin/AdminDashboard";
// import Testing from "./Testing";

export default function App() {
  return (
    <Routes>

      {/* Root role-based redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/testing" element={<Testing />} /> */}

      {/* USER Protected Routes */}
      {/* <Route element={<ProtectedRoute allowedRole="USER" />}> */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enter" element={<EntryForm />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/details" element={<PlayerDetail />} />
        </Route>
      {/* </Route> */}

      <Route path="/super-admin" element={<Admin/>}>
        <Route path="" element={<AdminDashboard/>}/>
        

      </Route>
      

    </Routes>
  );
}