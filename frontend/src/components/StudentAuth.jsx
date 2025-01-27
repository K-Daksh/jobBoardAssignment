import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const showToastSuccess = (message) => {
  toast.success(message);
};

const showToastError = (message) => {
  toast.error(message);
};

const StudentAuth = ({ onClose }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginData = { email, password };
      const registerData = { email, password, fullname: fullName };
      const endpoint = isLogin
        ? `${process.env.VITE_BACKEND_URL}/student/login`
        : `${process.env.VITE_BACKEND_URL}/student/register`;
      const response = await axios.post(
        endpoint,
        isLogin ? loginData : registerData
      );

      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        showToastSuccess("Authentication successful!");
        navigate("/student/dashboard");
        onClose();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Authentication failed!";
      showToastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <ToastContainer />
      <div className="bg-slate-800/90 p-8 rounded-2xl shadow-2xl w-[28rem] relative backdrop-blur-xl border border-slate-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
          Student Portal
        </h2>

        <div className="flex mb-6 bg-slate-900/50 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              isLogin
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all ${
              !isLogin
                ? "bg-indigo-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentAuth;
