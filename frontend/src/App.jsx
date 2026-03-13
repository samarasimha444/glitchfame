import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Auth/Layout";


import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import RoleRedirect from "./Auth/RoleRedirect";




import AdminSettings from "./features/admin/settings/SettingPage";
import Testing from "./Testing/Testing"

import AdminLayout from "./features/admin/layout/AdminLayout";
import SeasonPage from "./features/admin/seasons/SeasonPage";
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import Home from "./features/user/home/Home";
import ArenaForm from "./features/user/entryForm/Arena";
import LeaderBoard from "./features/user/leaderboard/LeaderBoard";
import SeasonDetails from "./features/user/season/SeasonDetails";
import PlayerDetails from "./features/user/details/PlayerDetails";
import Arena from "./features/user/arena/Arena";
import ForgotPassword from "./Auth/ForgotPassword";
import Testupload from "./Testing/TestUpload";
import TestingDashboard from "./Testing/TestingDashboard/TestingDashboard";
import TestSeasonId from "./Testing/TestSeasonId";
import TestingParticipation from "./Testing/TestingParticipation";
import Leadboard  from "./Testing/LeadBoard";
import Winners from "./Testing/Winners";
import ChallengeDetail from "./features/user/details/ChallangeDetails";
import AuthLayout from "./Auth/AuthLayout";
import Vote from "./features/user/Voting/Vote";

export default function App() {
  return (
    <Routes>

      

     


      <Route path="/" element={<RoleRedirect />} />
         
     <Route path="/auth" element={<AuthLayout />}>
   
   </Route>

    { <Route path="/testing" element={<Testing />} /> }
      <Route path="/forgot" element={<ForgotPassword/>}  />
      <Route path="/testupload" element={<Testupload/>}/>
      <Route path="/testing-dashboard" element={<TestingDashboard/>}/>
      <Route path="/testing-season/:seasonId" element={<TestSeasonId/>}/>
      <Route path="/testing-participation/:seasonId" element={<TestingParticipation />}
       />

      <Route path="/leadboard" element={<Leadboard/>}/>
      <Route path="/winners"  element={<Winners/>}/>



      {/* USER Protected Routes */}
      {/* <Route element={<ProtectedRoute allowedRole="USER" />}> */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/enter/:id" element={<ArenaForm />} />
           <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/arena" element={<Arena />} />
           <Route path="/vote/:id" element={<Vote />} />
         
          <Route path="/season" element={<SeasonDetails />} />
         


            <Route path="/aboutus" element={<ChallengeDetail />} />

          <Route path="/details/:id" element={<PlayerDetails />} />



        </Route>
        {/* </Route> */}
     







      {/* <Route element={<ProtectedRoute allowedRole="ADMIN" />}> */}

        <Route path="/admin" element={<AdminLayout />}>  
        
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="season" element={<SeasonPage/>} />
        <Route path="settings" element={<AdminSettings/>} />
        
      </Route>
       {/* </Route> */}
   
    </Routes>
  );
}