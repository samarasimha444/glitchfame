import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Vote from "./features/user/Voting/Vote"

import  { ReactLenis } from "lenis/react"

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Layout = lazy(() => import("./Auth/Layout"));
const AuthLayout = lazy(() => import("./Auth/AuthLayout"));
const RoleRedirect = lazy(() => import("./Auth/RoleRedirect"));



const Home = lazy(() => import("./features/user/home/Home"));
const ArenaForm = lazy(() => import("./features/user/entryForm/Arena"));
const SeasonDetails = lazy(() => import("./features/user/season/SeasonDetails"));
const PlayerDetails = lazy(() => import("./features/user/details/PlayerDetails"));
const Arena = lazy(() => import("./features/user/arena/Arena"));
const Status = lazy(()=>import("./features/user/status/Status"))
const LeaderboardPage = lazy(() => import("./features/user/leaderboard/LeaderBoard"));
const ChallengeDetail = lazy(() => import("./features/user/details/ChallangeDetails"));


const AdminLayout = lazy(() => import("./features/admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./features/admin/dashboard/AdminDashboard"));
const SeasonPage = lazy(() => import("./features/admin/seasons/SeasonPage"));
const AdminSettings = lazy(() => import("./features/admin/settings/SettingPage"));



export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
      

        {/* Lenis smooth scroll only wraps the Layout for user routes */}
        <Route
          element={
          <ReactLenis
           root
           options={{
             lerp: 0.25,           
             duration: 0.8,        
             orientation: "vertical",
             smoothWheel: true,
             wheelMultiplier: 1,
             smoothTouch: false,  
             touchMultiplier: 2,
           }}
>
              <Layout />
            </ReactLenis>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/enter/:id" element={<ArenaForm />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/vote/:id" element={<Vote />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/season" element={<SeasonDetails />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/aboutus" element={<ChallengeDetail />} />
          <Route path="/status" element={<Status />} />
          <Route path="/details/:id" element={<PlayerDetails />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="season" element={<SeasonPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}