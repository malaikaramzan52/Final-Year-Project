import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RebookLogo from "../../Assets/Logo/white.png";
import { loadUser } from "../../redux/reducers/user.js";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Attempting login to:', `${server}/api/v2/user/login-user`);

      const res = await axios.post(
        `${server}/api/v2/user/login-user`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log('Login response:', res.data);
      toast.success(res.data.message || "Login successful");
      await dispatch(loadUser());
      navigate("/");
    } catch (err) {
      console.error('Login error:', err);

      if (err.code === 'ERR_NETWORK') {
        toast.error("Network error: Unable to connect to server. Please check if the backend is running.");
      } else if (err.response) {
        // Server responded with error status
        const message = err.response.data?.message || `Server error: ${err.response.status}`;
        toast.error(message);
      } else if (err.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something else went wrong
        toast.error("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-[#D98C00] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <img src={RebookLogo} alt="Book Bazaar Logo" className="h-10 w-auto mr-2 b-white" />
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="px-4 rounded-full text-white font-medium
               hover:bg-white hover:text-black
               transition-all duration-200"
            >
              Home
            </Link>

            <Link
              to="/browse"
              className="px-4  rounded-full text-white font-medium
               hover:bg-white hover:text-black
               transition-all duration-200"
            >
              Browse Books
            </Link>

            <Link
              to="/about-us"
              className="px-4  rounded-full text-white font-medium
               hover:bg-white hover:text-black
               transition-all duration-200"
            >
              About Us
            </Link>
          </nav>
          {/* Sign Up Link */}
          <div className="flex items-center gap-4">
            <Link
              to="/sign-up"
              className="px-4 py-2 text-white hover:bg-orange-50 hover:text-black rounded-full font-medium transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-[#D98C00] mb-8">Sign in to your account</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C00] focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C00] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {visible ? (
                    <AiOutlineEye size={22} />
                  ) : (
                    <AiOutlineEyeInvisible size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2 w-4 h-4 rounded" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#D98C00] hover:text-orange-600 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#D98C00] text-white rounded-md hover:bg-[#A86500]"
            >
              Submit
            </button>

            {/* Signup */}
            <p className="text-sm text-center">
              Don’t have an account?
              <Link to="/sign-up" className="text-[#D98C00] ml-1 hover:text-orange-600">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;