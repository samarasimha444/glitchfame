import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Auth/Layout";
import Dashboard from "./Roles/Users/Dashboard";
import Admin from "./Roles/Admin/Admin";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import RoleRedirect from "./Auth/RoleRedirect";


import SeasonDetails from "./Roles/Admin/Seasons/SeasonDetails"
export default function App() {
  return (
    <Routes>

      {/* Root role-based redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />




      {/* USER Protected Routes */}
      {/* <Route element={<ProtectedRoute allowedRole="USER" />}> */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
        </Route>
        
      {/* </Route> */}





    {/* ADMIN Protected Routes */}
<Route element={<ProtectedRoute allowedRole="ADMIN" />}>


  {/* <Route element={<Layout />}>
    <Route path="/admin-dashboard" element={<Admin />}>

      <Route path="seasons" element={<Seasons />} />

      <Route path="seasons/create" element={<SeasonForm />} />
      <Route path="seasons/:id" element={<SeasonDetails />} />

     
    </Route>
  </Route> */}
</Route>

    </Routes>
  );
}