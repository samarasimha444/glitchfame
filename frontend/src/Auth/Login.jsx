import { lazy, Suspense, useState } from "react";
import { useLogin } from "../features/user/arena/hooks";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
const ForgotPasswordModal = lazy(() => import("./Forgot"));

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLogin();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onError: (err) => {
        toast.error("User not found");
      },
      onSuccess: () => {
        toast.success("Logged in successfully!");
      },
    });
  };

  return (
    <div className="w-full max-w-110 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="vote@glitchfame.com"
            onChange={handleChange}
            required
            className="w-full bg-[#111418] border border-[#1E232B] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9DE2E2] transition-all"
          />
        </div>

        {/* Password Field */}
       <div className="space-y-1">
  <div className="flex justify-between items-center px-1">
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
      Password
    </label>
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="text-[10px] cursor-pointer font-bold text-[#9DE2E2] uppercase tracking-widest hover:opacity-80 transition"
    >
      Forgot?
    </button>
  </div>

  <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="••••••••"
    onChange={handleChange}
    required
    className="w-full bg-[#111418] border border-[#1E232B] rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#9DE2E2] transition-all"
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 mt-0.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 ease-in-out"
  >
    <span
      className={`inline-block cursor-pointer transform transition-all duration-200 ease-in-out ${
        showPassword ? "rotate-180 scale-110" : "rotate-0 scale-100"
      }`}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </button>
</div>
</div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3.5 mt-2 rounded-lg bg-[#9DE2E2] text-[#062424] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {loginMutation.isPending ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#062424] border-t-transparent rounded-full animate-spin"></span>
              <span>Authenticating...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <Suspense fallback={<div className="text-white text-center p-4 text-[10px] uppercase tracking-widest">Loading...</div>}>
        {open && (
          <ForgotPasswordModal
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default Login;