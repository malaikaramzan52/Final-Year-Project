import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../api/axios";
import RebookLogo from "../Assets/Logo/white.png";
import Footer from "../components/Layout/Footer";

const ResetPasswordPage = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${userId}/${token}`, {
        newPassword: password,
        confirmPassword,
      });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Header */}
      <header className="bg-[#D98C00] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={RebookLogo} alt="Book Bazaar Logo" className="h-10 w-auto mr-2" />
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="px-4 rounded-md text-white font-medium hover:bg-white hover:text-black transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="px-4 rounded-md text-white font-medium hover:bg-white hover:text-black transition-all duration-200"
            >
              Browse Books
            </Link>
            <Link 
              to="/about-us" 
              className="px-4 rounded-md text-white font-medium hover:bg-white hover:text-black transition-all duration-200"
            >
              About Us
            </Link>
          </nav>

          {/* Sign In Link */}
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-white hover:bg-orange-50 hover:text-black rounded-md font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Reset Password Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-[#D98C00] mb-8">Create a new password for your account</p>

          <form className="space-y-6" onSubmit={onSubmit}>
            
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={confirmVisible ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C00] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setConfirmVisible(!confirmVisible)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {confirmVisible ? (
                    <AiOutlineEye size={22} />
                  ) : (
                    <AiOutlineEyeInvisible size={22} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] disabled:opacity-60 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {submitting ? "Updating..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <p className="text-sm text-center">
              Remember your password?
              <Link to="/login" className="text-[#D98C00] ml-1 hover:text-orange-600 font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
