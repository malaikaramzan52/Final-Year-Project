import React, { useMemo, useState } from "react";
import { categories as seedCategories } from "./data";
import { Tag, Search, Plus, Edit2, Trash2 } from "lucide-react";

const AdminCategories = () => {
  const [rows, setRows] = useState(seedCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({ name: "", description: "", status: "Active" });

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newCategory = {
      id: `C-${Math.floor(Math.random() * 9000) + 5000}`,
      name: form.name.trim(),
      description: form.description.trim() || "No description",
      status: form.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRows((prev) => [newCategory, ...prev]);
    setForm({ name: "", description: "", status: "Active" });
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#D98C00]/10 text-[#D98C00] flex items-center justify-center">
          <Tag size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Taxonomy</p>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-4" onSubmit={handleSubmit}>
          <div className="lg:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Category Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Science Fiction"
              className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
              required
            />
          </div>
          <div className="lg:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short summary of the category"
              rows={2}
              className="mt-2 w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
            />
          </div>
          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
            className="pl-9 pr-3 py-2 w-72 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{cat.name}</div>
                    <div className="text-xs text-gray-500">ID: {cat.id}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-md">{cat.description}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cat.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(cat.createdAt)}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default AdminCategories;
