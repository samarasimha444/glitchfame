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
          <Route path="/enter" element={<EntryForm/>} />
           <Route path="/arena" element={<Arena/>} />
            <Route path="/details" element={<PlayerDetail/>} />
          
        </Route>
        
      {/* </Route> */}

       <Route path="/super-admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
  
           </Route>



<Route element={<ProtectedRoute allowedRole="ADMIN" />}>

    {/* ADMIN Protected Routes */}



 


  {/* <Route element={<Layout />}>
   

      <Route path="seasons" element={<Seasons />} />

      <Route path="seasons/create" element={<SeasonForm />} />
      <Route path="seasons/:id" element={<SeasonDetails />} />

     
    </Route>
  </Route> */}
</Route>


 

    </Routes>
  );
}