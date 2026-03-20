import { lazy, Suspense, useState } from "react";
import { useLogin } from "../features/user/arena/hooks";
import toast from "react-hot-toast";
const ForgotPasswordModal = lazy(() => import("./Forgot"));

const Login = () => {
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
        toast.error("user not found");
      },
      onSuccess: () => {
        toast.success("Logged in successfully!");
      },
    });
  };

  return (
    <div className="space-y-6 w-full max-w-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="vote@glitchfame.com"
            onChange={handleChange}
            required
            className="mt-1 w-full bg-[#111418] border border-[#1E232B]
            rounded-lg px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            className="mt-1 w-full bg-[#111418] border border-[#1E232B]
            rounded-lg px-4 py-3 text-white placeholder-gray-500
            focus:outline-none focus:border-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-xl bg-primary text-black  font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && (
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          )}
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-primary hover:text-purple-300"
      >
        Forgot Password?
      </button>

    <Suspense fallback={<div className="text-white">Loading...</div>}>
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
