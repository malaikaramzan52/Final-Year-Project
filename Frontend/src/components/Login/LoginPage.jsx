import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import oldBooks from "../../Assets/Logo/old-books.jpg";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
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

   // ✅ FUNCTION CLOSED PROPERLY

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Image */}
        <div className="hidden md:block">
          <img src={oldBooks} alt="Books" className="w-full h-full object-cover" />
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Login to your account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-2.5 cursor-pointer"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-2.5 cursor-pointer"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600">
                Forgot your password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>

            {/* Signup */}
            <p className="text-sm text-center">
              Don’t have an account?
              <Link to="/sign-up" className="text-blue-600 ml-1">
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