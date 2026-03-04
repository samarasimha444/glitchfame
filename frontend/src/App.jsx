import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Auth/Layout";


import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import RoleRedirect from "./Auth/RoleRedirect";




import AdminSettings from "./features/admin/settings/SettingPage";
import Testing from "./Testing";

import AdminLayout from "./features/admin/layout/AdminLayout";
import SeasonPage from "./features/admin/seasons/SeasonPage";
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import Home from "./features/user/home/Home";
import ArenaForm from "./features/user/entryForm/Arena";
import LeaderBoard from "./features/user/leaderboard/LeaderBoard";
import SeasonDetails from "./features/user/season/SeasonDetails";
import PlayerDetails from "./features/user/details/PlayerDetails";
import Arena from "./features/user/arena/Arena";


export default function App() {
  return (
    <Routes>

      

      {/* Root role-based redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    { <Route path="/testing" element={<Testing />} /> }



      {/* USER Protected Routes */}
      {/* <Route element={<ProtectedRoute allowedRole="USER" />}> */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/enter" element={<ArenaForm />} />
           <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/arena" element={<Arena />} />

          <Route path="/season" element={<SeasonDetails />} />

          <Route path="/details" element={<PlayerDetails />} />
        </Route>
      {/* </Route> */}

      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>

        <Route path="/admin" element={<AdminLayout />}>  
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="season" element={<SeasonPage/>} />
        <Route path="settings" element={<AdminSettings/>} />
        
      </Route>
       </Route>
   
    </Routes>
  );
}