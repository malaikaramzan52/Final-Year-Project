import React from "react";
import { useSelector } from "react-redux";
import ProfileContent from "../../components/Profile/ProfileContent";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Admin Profile</h1>
        <p className="text-gray-500 text-sm">Manage your administrator account details.</p>
      </div>
      <ProfileContent active={1} user={user} />
    </div>
  );
};

export default AdminProfile;
