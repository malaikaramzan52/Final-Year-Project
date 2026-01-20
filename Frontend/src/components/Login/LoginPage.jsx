import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import oldBooks from "../../Assets/Logo/old-books.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Image Section */}
        <div className="hidden md:block relative">
          {/* Replace src with your own image */}
          <img
            src={oldBooks}
            alt="Books"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Login to your account
          </h2>

          <form className="space-y-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              Submit
            </button>

            {/* Signup */}
            <p className="text-sm text-center text-gray-700">
              Not have any account?
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
