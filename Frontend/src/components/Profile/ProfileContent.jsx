import React, { useState, useRef } from "react";
import { AiOutlineCamera, AiOutlineDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { updateUser } from "../../redux/reducers/user";

const ProfileContent = ({ active, user }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Keep form in sync when user prop updates
  React.useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ──────────────────────────────────────────────
     AVATAR HANDLERS
  ────────────────────────────────────────────── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setAvatarLoading(true);
    const data = new FormData();
    data.append("avatar", avatarFile);

    try {
      const res = await axios.put(
        `${server}/api/v2/user/update-avatar`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      dispatch(updateUser(res.data.user));
      setAvatarPreview(null);
      setAvatarFile(null);
      fileInputRef.current.value = "";
      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update photo");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Remove your profile photo?")) return;

    setAvatarLoading(true);
    try {
      const res = await axios.delete(
        `${server}/api/v2/user/delete-avatar`,
        { withCredentials: true }
      );
      dispatch(updateUser(res.data.user));
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Profile photo removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove photo");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleCancelPreview = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    fileInputRef.current.value = "";
  };

  /* ──────────────────────────────────────────────
     PROFILE FORM HANDLER
  ────────────────────────────────────────────── */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${server}/api/v2/user/update-profile`,
        {
          name: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        },
        { withCredentials: true }
      );
      dispatch(updateUser(res.data.user));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return `http://localhost:8000${user.avatar}`;
    return null;
  };

  return (
    <div className="w-full">
      {active === 1 && (
        <div className="max-w-2xl mx-auto">

          {/* ── Profile Picture Section ── */}
          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="relative">
              <img
                src={getAvatarSrc()}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt="profile"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=3ad132&color=fff&size=150`;
                }}
              />

              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={avatarLoading}
                title="Change photo"
                className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center cursor-pointer absolute -bottom-1 -right-1 shadow-md border hover:bg-gray-100 transition disabled:opacity-50"
              >
                <AiOutlineCamera size={16} />
              </button>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Action buttons shown after a file is picked */}
            {avatarFile ? (
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={avatarLoading}
                  className="px-4 py-1.5 bg-[#3ad132] text-white text-sm font-semibold rounded-lg hover:bg-[#2ebd28] transition disabled:opacity-50"
                >
                  {avatarLoading ? "Uploading…" : "Save Photo"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPreview}
                  disabled={avatarLoading}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            ) : user?.avatar ? (
              <button
                type="button"
                onClick={handleAvatarDelete}
                disabled={avatarLoading}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition disabled:opacity-50"
              >
                <AiOutlineDelete size={16} />
                {avatarLoading ? "Removing…" : "Remove Photo"}
              </button>
            ) : null}
          </div>

          {/* ── Profile Form ── */}
          <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-md p-6">

            {/* Row 1: Full Name | Email */}
            <div className="grid grid-cols-2 gap-6 mb-6">
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

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  placeholder="Email cannot be changed"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
                />
              </div>
            </div>

            {/* Row 2: Phone */}
            <div className="grid grid-cols-2 gap-6 mb-6">
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
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3ad132] transition"
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-[#3ad132] text-white font-semibold rounded-lg hover:bg-[#2ebd28] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Updating…" : "Update Profile"}
              </button>
            </div>
          </form>

        </div>
      )}
    </div>
  );
};

export default ProfileContent;
