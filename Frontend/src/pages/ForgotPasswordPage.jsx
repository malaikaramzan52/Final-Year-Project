import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MdOutlineArrowBack } from "react-icons/md";
import api from "../api/axios";
import RebookLogo from "../Assets/Logo/white.png";
import Footer from "../components/Layout/Footer";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
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

      {/* Forgot Password Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-600 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

          <form className="space-y-6" onSubmit={onSubmit}>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] disabled:opacity-60 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Login */}
            <div className="flex items-center justify-center">
              <Link 
                to="/login" 
                className="flex items-center text-[#D98C00] hover:text-orange-600 font-medium transition"
              >
                <MdOutlineArrowBack size={18} className="mr-1" />
                Back to Sign In
              </Link>
            </div>
          </form>

          
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default ForgotPasswordPage;
