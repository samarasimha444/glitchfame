import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Auth/Layout";


import RoleRedirect from "./Auth/RoleRedirect";




import AdminSettings from "./features/admin/settings/SettingPage";


import AdminLayout from "./features/admin/layout/AdminLayout";
import SeasonPage from "./features/admin/seasons/SeasonPage";
import AdminDashboard from "./features/admin/dashboard/AdminDashboard";
import Home from "./features/user/home/Home";
import ArenaForm from "./features/user/entryForm/Arena";
import LeaderBoard from "./features/user/leaderboard/LeaderBoard";
import SeasonDetails from "./features/user/season/SeasonDetails";
import PlayerDetails from "./features/user/details/PlayerDetails";
import Arena from "./features/user/arena/Arena";

import ChallengeDetail from "./features/user/details/ChallangeDetails";
import AuthLayout from "./Auth/AuthLayout";
import Vote from "./features/user/Voting/Vote";
import ParticipationForm from "./Testing/PartcipationForm";
import AdminSeasonForm from "./Testing/AdminForm";
import Dashboard from "./Testing/Dashboard";
import Login from "./Testing/Login";
import TestingSignup from "./Testing/TestingSignup";
import TLeaderBoard from "./Testing/TLeaderboard";
import Season from "./Testing/Season";

export default function App() {
  return (
    <Routes>

      
 <Route path="/participationForm" element={<ParticipationForm/>}/>
     


      <Route path="/" element={<RoleRedirect />} />
         
     <Route path="/auth" element={<AuthLayout />}>
   
   </Route>


       <Route path="/participationForm" element={<ParticipationForm/>}/>
       <Route path="/adminform" element={<AdminSeasonForm/>}/>
       <Route path="/dashboard" element={<Dashboard/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path="/signup" element={<TestingSignup/>}/>
       <Route path="/leadboard" element={<TLeaderBoard/>}/>
       <Route path="/season/:seasonId" element={<Season/>}/>
      

     


      {/* USER Protected Routes */}
      {/* <Route element={<ProtectedRoute allowedRole="USER" />}> */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/enter/:id" element={<ArenaForm />} />
           
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