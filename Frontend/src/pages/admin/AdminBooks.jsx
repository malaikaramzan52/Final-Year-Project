import React, { useMemo, useState, useEffect } from "react";
import { Search, Eye, Trash2, Tag, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { server } from "../../server";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  const apiBase = (server || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/v2/book/admin-all-books");
        setBooks(res.data.books || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch books", err);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/v2/book/admin-delete-book/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      import("react-toastify").then(({ toast }) => toast.success("Book deleted successfully"));
    } catch (err) {
      import("react-toastify").then(({ toast }) => toast.error(err.response?.data?.message || "Failed to delete book"));
    }
  };

  const categories = useMemo(() => ["all", ...new Set(books.map((b) => b.category?.name || b.category))], [books]);

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = `${book.title} ${book.user?.name}`.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" ? true : (book.category?.name || book.category) === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, books]);

  const resolveImage = (path) => {
    if (!path) return "https://via.placeholder.com/80x100?text=Book";
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Inventory</p>
          <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books"
              className="pl-9 pr-3 py-2 w-64 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Book</th>
                <th className="px-4 py-3 text-left font-semibold">Owner</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Condition</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImage(book.image)}
                        alt={book.title}
                        className="w-12 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/80x100?text=Book";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{book.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {book._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{book.user?.name}</td>
                  <td className="px-4 py-3 text-gray-700">{book.category?.name || book.category}</td>
                  <td className="px-4 py-3 text-gray-700">{book.condition}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusTone(book.status)}`}>
                      {book.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/product/${book._id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition font-bold text-xs"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      onClick={() => handleDeleteBook(book._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition font-bold text-xs"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
               <Tag size={32} className="mx-auto text-gray-200 mb-2" />
               <p className="text-gray-400 text-sm font-medium">No books found in inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const statusTone = (status) => {
  if (status === "Approved" || status === "Available") return "bg-green-100 text-green-700";
  if (status === "Under Review" || status === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

export default AdminBooks;
