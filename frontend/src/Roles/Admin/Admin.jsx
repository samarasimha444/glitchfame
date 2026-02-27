import { Outlet } from "react-router-dom";
import Sidebar from "./ui/Sidebar";

const Admin = () => {
  const profile = JSON.parse(localStorage.getItem("profile"));

  return (
    <div className="flex  min-h-screen  w-full max-w-screen text-white">


      <div className="w-1/6 bg-[#171A1F] py-6 px-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        

        <hr className="my-1 border-gray-700" />
           
           <Sidebar/>

        
      </div>

        <section className="w-full p-6 bg-[#0F1114] overflow-y-auto">
        <Outlet />
      </section>

    </div>
  );
};

export default Admin;