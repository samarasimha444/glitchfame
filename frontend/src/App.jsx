import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Vote from "./features/user/Voting/Vote"

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Layout = lazy(() => import("./Auth/Layout"));
const AuthLayout = lazy(() => import("./Auth/AuthLayout"));
const RoleRedirect = lazy(() => import("./Auth/RoleRedirect"));


const Home = lazy(() => import("./features/user/home/Home"));
const ArenaForm = lazy(() => import("./features/user/entryForm/Arena"));
const SeasonDetails = lazy(() => import("./features/user/season/SeasonDetails"));
const PlayerDetails = lazy(() => import("./features/user/details/PlayerDetails"));
const Arena = lazy(() => import("./features/user/arena/Arena"));

const LeaderboardPage = lazy(() => import("./features/user/leaderboard/LeaderBoard"));
const ChallengeDetail = lazy(() => import("./features/user/details/ChallangeDetails"));


const AdminLayout = lazy(() => import("./features/admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./features/admin/dashboard/AdminDashboard"));
const SeasonPage = lazy(() => import("./features/admin/seasons/SeasonPage"));
const AdminSettings = lazy(() => import("./features/admin/settings/SettingPage"));

//  remove in production)
const ParticipationForm = lazy(() => import("./Testing/PartcipationForm"));
const AdminSeasonForm = lazy(() => import("./Testing/AdminForm"));
const Dashboard = lazy(() => import("./Testing/Dashboard"));
const Login = lazy(() => import("./Testing/Login"));
const TestingSignup = lazy(() => import("./Testing/TestingSignup"));
const TLeaderBoard = lazy(() => import("./Testing/TLeaderboard"));

export default function App() {
  return (
    <Suspense
      fallback={
        null
      }
    >
      <Routes>
       
        <Route path="/" element={<RoleRedirect />} />

    
        <Route path="/auth" element={<AuthLayout />} />

       
        <Route path="/participationForm" element={<ParticipationForm />} />
        <Route path="/adminform" element={<AdminSeasonForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<TestingSignup />} />
        <Route path="/leadboardnew" element={<TLeaderBoard />} />

      
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/enter/:id" element={<ArenaForm />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/vote/:id" element={<Vote />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/season" element={<SeasonDetails />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/aboutus" element={<ChallengeDetail />} />
          <Route path="/details/:id" element={<PlayerDetails />} />
        </Route>
        {/* </Route> */}


        {/* <Route element={<ProtectedRoute allowedRole="ADMIN" />}> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="season" element={<SeasonPage />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </Suspense>
  );
}