import { Outlet } from "react-router-dom";
import { Zap } from "lucide-react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";


const AuthLayout = () => {

  const [mode, setMode] = useState("login")

  return (
    <div className="min-h-screen flex bg-black text-white">

    
  <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden
bg-[radial-gradient(circle_at_top_left,_#3b0764,_#000000_40%,_#022c22)]">

 
  <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full top-[-100px] left-[-150px]" />
  <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-[120px] rounded-full bottom-[-120px] right-[-100px]" />

  <div className="relative text-center space-y-8">

    
    <div className="mx-auto w-24 h-24 rounded-xl 
    bg-gradient-to-br from-purple-500 to-purple-700
    flex items-center justify-center
    shadow-[0_0_40px_rgba(168,85,247,0.5)]">

      <Zap className="text-white" size={50} />

    </div>

    
    <h1 className="text-5xl lg:text-4xl font-serif font-extrabold tracking-widest
    text-white drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]">

      GLITCHFAME

    </h1>

    
    <div className="flex items-center justify-center gap-4">

      <span className="w-16 h-px bg-purple-500/50" />

      <p className="text-purple-300 tracking-[0.35em] text-xs uppercase">
        The Arena Awaits
      </p>

      <span className="w-16 h-px bg-purple-500/50" />

    </div>

  </div>

 

</div>

 
      <div className="flex-1 relative flex-col  flex items-center justify-center p-6">

          

        <div className="w-full max-w-110 bg-[#0c0f14] border border-[#1E232B]
        rounded-3xl p-8 space-y-4 shadow-xl">


          <h3 className="text-3xl font-semibold font-sans">Join The Fame</h3>
          <p className="text-gray-400">Create your account to start competing in the arena</p>
        
         <div className="flex mb-6 bg-[#111418] p-1 rounded-lg">

            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm ${
                mode === "login"
                  ? "bg-[#BE5EED] text-white"
                  : "text-gray-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-md text-sm ${
                mode === "register"
                  ? "bg-[#BE5EED] text-white"
                  : "text-gray-400"
              }`}
            >
              Register
            </button>

          </div>


            {mode === "login" ? (
            <Login/>
          ) : (
            <Signup/>
          )}


        </div>
      </div>

    </div>
  );
};

export default AuthLayout;