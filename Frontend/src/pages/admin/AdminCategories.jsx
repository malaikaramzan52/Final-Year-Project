import React, { useMemo, useState, useEffect } from "react";
import { Tag, Search, Plus, Trash2, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/v2/category/all");
        setRows(res.data.categories || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      return c.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [rows, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post("/v2/category/admin-create-category", {
        name: form.name.trim(),
        description: form.description.trim() || "No description",
      });
      setRows((prev) => [res.data.category, ...prev]);
      setForm({ name: "", description: "" });
      toast.success("Category created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This may affect books assigned to this category.")) return;
    try {
      await api.delete(`/v2/category/admin-delete-category/${id}`);
      setRows((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-[#D98C00]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 scrollbar-hide">
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Science Fiction"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D98C00] focus:ring-4 focus:ring-[#D98C00]/10 text-sm outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short summary"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#D98C00] focus:ring-4 focus:ring-[#D98C00]/10 text-sm outline-none transition-all"
            />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-[#D98C00] transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} 
              Create Category
            </button>
          </div>
        </form>
      </div>

      {/* List Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
            className="pl-10 pr-4 py-2 w-72 rounded-xl border border-gray-100 focus:border-[#D98C00] focus:ring-4 focus:ring-[#D98C00]/10 text-sm outline-none bg-white transition-all"
          />
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total: {filtered.length} Clusters</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-widest text-[10px]">Category</th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-widest text-[10px]">Description</th>
                <th className="px-6 py-4 text-left font-bold uppercase tracking-widest text-[10px]">Created</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-widest text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{cat.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">ID: {cat._id.slice(-8)}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium max-w-md">{cat.description}</td>
                  <td className="px-6 py-4 text-gray-500 font-bold text-xs">{new Date(cat.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-all font-bold text-xs shadow-sm"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
               <Tag size={32} className="mx-auto text-gray-200 mb-2" />
               <p className="text-gray-400 text-sm font-medium">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
