import React, { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";

const ProfileContent = ({ active, user, backend_url }) => {
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    password: "",
    address: user?.address || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add your API call here to update user profile
      console.log("Updating profile with:", formData);
      // Example: await axios.put(`${backend_url}/api/user/update`, formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {active === 1 && (
        <div className="max-w-2xl mx-auto">
          {/* Profile Picture Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src={`${backend_url}${user?.avatar}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt="profile img"
              />
              <div className="w-[32px] h-[32px] bg-white rounded-full 
              flex items-center justify-center cursor-pointer 
              absolute -bottom-1 -right-1 shadow-md border hover:bg-gray-100 transition">
                <AiOutlineCamera size={16} />
              </div>
            </div>
          </div>

          {/* Profile Form Section */}
          <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-md p-6">
            {/* Row 1: Full Name | Email Address */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition"
                />
              </div>
            </div>

            {/* Row 2: Phone Number | Password */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Password (to confirm changes)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition"
                />
              </div>
            </div>

            {/* Row 3: Address | Update Button */}
            <div className="">
              {/* Address */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition"
                />
              </div>

              {/* Update Button */}
              <div className="mt-4 items-start">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-[#3ad132] text-white font-semibold rounded-lg hover:bg-[#2ebd28] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default ProfileContent