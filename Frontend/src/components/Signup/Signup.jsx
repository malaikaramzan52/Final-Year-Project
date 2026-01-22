import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import oldBooks from "../../Assets/Logo/old.jpg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

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

      console.log("SUCCESS:", res.data);
      alert("User registered successfully!");
    } catch (error) {
      console.log(
        "ERROR:",
        error.response?.data || error.message
      );
      alert("Signup failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Image */}
        <div className="hidden md:block">
          <img
            src={oldBooks}
            alt="Old Books"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Register as a new user
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full overflow-hidden border">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <RxAvatar className="h-full w-full text-gray-400" />
                  )}
                </div>

                <label className="cursor-pointer px-4 py-2 border rounded-md text-sm">
                  Upload file
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
              className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
            >
              Submit
            </button>

            {/* Login */}
            <p className="text-sm text-center text-gray-700">
              Already have an account?
              <Link to="/login" className="text-blue-600 ml-1">
                Sign In
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
