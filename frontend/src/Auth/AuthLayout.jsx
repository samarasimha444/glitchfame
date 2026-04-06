import { Outlet } from "react-router-dom";
import { Zap } from "lucide-react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";


const AuthLayout = () => {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex bg-black text-white selection:bg-[#9DE2E2]/30">
      
     
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden 
        bg-[radial-gradient(circle_at_top_left,_#1e1b4b,_#040d0d_50%,_#062424)] border-r border-[#1E232B]">
        {/* Ambient Depth Glows */}
        <div className="absolute w-[600px] h-[600px] bg-purple-900/10 blur-[140px] rounded-full top-[-150px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-[#9DE2E2]/5 blur-[120px] rounded-full bottom-[-150px] right-[-100px]" />

        <div className="relative text-center space-y-8">
          <div className="mx-auto w-24 h-24 rounded-2xl bg-[#9DE2E2] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5),_0_0_20px_rgba(157,226,226,0.2)]">
            <Zap className="text-[#062424]" size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-5xl lg:text-4xl font-serif font-extrabold tracking-[0.2em] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            GLITCHFAME
          </h1>

          <div className="flex items-center justify-center gap-4">
            <span className="w-16 h-[1px] bg-[#9DE2E2]/20" />
            <p className="text-[#9DE2E2]/70 tracking-[0.4em] text-[10px] font-semibold uppercase">The Arena Awaits</p>
            <span className="w-16 h-[1px] bg-[#9DE2E2]/20" />
          </div>
        </div>
      </div>

      
      <header className="md:hidden absolute top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-full shadow-2xl">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#9DE2E2] shadow-[0_0_15px_rgba(157,226,226,0.3)]">
            <Zap className="text-[#062424]" size={18} strokeWidth={3} />
          </div>
          <span className=" font-black tracking-[0.15em] text-[#F9FAFB] text-lg uppercase">
            GlitchFame
          </span>
        </div>
      </header>

      {/* Right Section (Form) */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_right,_#062424_0%,_transparent_40%)]">
        
        <div className="w-full max-w-[420px] bg-[#0c0f14] border border-[#1E232B] rounded-[2rem] p-8 space-y-6 shadow-2xl relative z-10">
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              {mode === "login" ? "Welcome Back" : "Join The Fame"}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              {mode === "login" 
                ? "Enter your credentials to enter the arena" 
                : "Create your account to start competing"}
            </p>
          </div>
        
          <div className="flex bg-[#111418] p-1.5 rounded-xl border border-[#1E232B]/50">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === "login" ? "bg-[#9DE2E2] text-[#062424] shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === "register" ? "bg-[#9DE2E2] text-[#062424] shadow-lg" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Register
            </button>
          </div>

          <div className="pt-2">
            {mode === "login" ? <Login /> : <Signup setMode={setMode} />}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;