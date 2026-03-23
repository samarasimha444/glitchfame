import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavBar";

const AdminLayout = () => {

  const profile = JSON.parse(localStorage.getItem("profile"));
  console.log(profile)

  return (
    <div className="flex  min-h-screen  w-full max-w-screen text-white">


   <div className="fixed hidden md:block top-0 left-0 h-screen w-1/6 bg-[#171A1F] py-6 px-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        

        <hr className="my-1 border-gray-700" />
           
           <Sidebar/>

        
      </div>

    <section className="md:ml-[16.6667%] w-full max-w-screen py-6  px-3 min-h-screen overflow-y-auto">
       <AdminNavbar/>
        <Outlet />
      </section>

    </div>
  );
};

export default AdminLayout;