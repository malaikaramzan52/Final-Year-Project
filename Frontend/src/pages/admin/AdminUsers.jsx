import React, { useMemo, useState } from "react";
import { users } from "./data";
import { Search, Eye, Trash2, Shield } from "lucide-react";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Users</p>
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}>
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition">
                      <Eye size={16} /> View
                    </button>
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="rounded-2xl border border-dashed border-gray-200 p-4 bg-gray-50 text-sm text-gray-600 flex items-center gap-2">
        <Shield size={16} className="text-[#D98C00]" />
        Role-based guard is enforced in AdminRoute; this table uses dummy seeded data for UI only.
      </div> */}
    </div>
  );
};

export default AdminUsers;
