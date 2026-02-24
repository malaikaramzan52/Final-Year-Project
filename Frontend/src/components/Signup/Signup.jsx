import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import RebookLogo from "../../Assets/Logo/white.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  // Handle file input
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      alert("Please upload an avatar");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar); // MUST MATCH multer
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await axios.post(
        `${server}/api/v2/user/create-user`,
        formData
      );

   if(res.data.success === true){
    toast.success(res.data.message);
    setName("");
    setEmail("");
    setPassword("");
    setAvatar();

   }
    } catch (error) {
      toast.error(error.response.data.message);
    
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Header */}
      <header className="bg-[#D98C00] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <img src={RebookLogo} alt="Book Bazaar Logo" className="h-10 w-auto mr-2" />
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="px-4 rounded-full text-white font-medium hover:bg-white hover:text-black transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className="px-4 rounded-full text-white font-medium hover:bg-white hover:text-black transition-all duration-200"
            >
              Browse Books
            </Link>
            <Link 
              to="/about-us" 
              className="px-4 rounded-full text-white font-medium hover:bg-white hover:text-black transition-all duration-200"
            >
              About Us
            </Link>
          </nav>

          {/* Sign In Link */}
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-white hover:bg-orange-50 hover:text-black rounded-full font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Signup Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-[#D98C00] mb-8">Join our community</p>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D98C00] focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#D98C00] flex items-center justify-center bg-gray-100">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                <label className="cursor-pointer px-4 py-2 border border-[#D98C00] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Choose File
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link
              to="/login"
              className="w-full py-2.5 border-2 border-[#D98C00] text-[#D98C00] font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 text-center block"
            >
              Sign In
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
