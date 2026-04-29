import React, { useMemo, useState, useEffect } from "react";
import { Search, Eye, Trash2, Shield, Loader2, User, Mail, Phone, Calendar, MapPin, X } from "lucide-react";
import api from "../../api/axios";
import { server } from "../../server";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const apiBase = (server || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/v2/user/admin-all-users");
        setUsers(res.data.users || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/v2/user/admin-delete-user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      import("react-toastify").then(({ toast }) => toast.success("User deleted successfully"));
    } catch (err) {
      import("react-toastify").then(({ toast }) => toast.error(err.response?.data?.message || "Failed to delete user"));
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  const resolveAvatar = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-[#D98C00]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-5 scrollbar-hide">
      {/* Standard Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Access Control</p>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="pl-9 pr-3 py-2 w-64 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Standard Table Style */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                     <div className="flex items-center gap-3">
                        <AvatarDisplay user={user} size="w-8 h-8" resolveAvatar={resolveAvatar} />
                        <span className="font-semibold text-gray-900">{user.name}</span>
                     </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700">{user.phone || "N/A"}</td>

                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${(user.status || "Active") === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.status || "Active"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition font-bold text-xs shadow-sm"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition font-bold text-xs shadow-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col scrollbar-hide">
              {/* Profile Header */}
              <div className="relative h-32 bg-gray-900 shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#D98C00]/20 to-transparent"></div>
                 <button 
                   onClick={() => setSelectedUser(null)}
                   className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all"
                 >
                   <X size={18} />
                 </button>
              </div>

              {/* Avatar & Basic Info */}
              <div className="px-8 pb-8 -mt-12 relative z-10 scrollbar-hide">
                 <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                       <AvatarDisplay user={selectedUser} size="w-24 h-24" isLarge resolveAvatar={resolveAvatar} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-xs font-bold text-[#D98C00] uppercase tracking-widest mt-1">{selectedUser.role} Profile</p>
                 </div>

                 {/* Detailed Info Grid */}
                 <div className="mt-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <InfoBlock icon={Mail} label="Email Address" value={selectedUser.email} />
                       <InfoBlock icon={Phone} label="Contact Number" value={selectedUser.phone || "Not provided"} />
                       <InfoBlock icon={Calendar} label="Member Since" value={new Date(selectedUser.createdAt).toLocaleDateString()} />
                       <InfoBlock icon={Shield} label="Account Status" value={selectedUser.status || "Active"} />
                    </div>
                    {selectedUser.address && (
                       <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3">
                          <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Address</p>
                             <p className="text-sm text-gray-700 leading-tight">{selectedUser.address}</p>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Actions */}
                 <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="flex-1 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#D98C00] transition-all"
                    >
                      Close Profile
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const AvatarDisplay = ({ user, size, isLarge = false, resolveAvatar }) => {
  const avatarUrl = resolveAvatar(user.avatar);
  const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";
  
  if (avatarUrl) {
    return (
      <img 
        src={avatarUrl} 
        alt="" 
        className={`${size} ${isLarge ? 'rounded-2xl border-4 border-white shadow-xl' : 'rounded-full border border-gray-100'} object-cover bg-white`} 
      />
    );
  }

  return (
    <div className={`${size} ${isLarge ? 'rounded-2xl border-4 border-white shadow-xl text-4xl' : 'rounded-full border border-gray-100 text-sm'} flex items-center justify-center font-black bg-gradient-to-br from-[#D98C00] to-[#A86500] text-white`}>
      {initials}
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#D98C00]/30 transition-colors">
     <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[#D98C00]" />
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
     </div>
     <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
  </div>
);

export default AdminUsers;
