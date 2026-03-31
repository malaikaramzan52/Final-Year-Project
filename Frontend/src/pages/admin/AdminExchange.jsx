import React, { useMemo, useState } from "react";
import { exchangeRequests } from "./data";
import { Search, Check, X, Eye, ArrowLeftRight } from "lucide-react";

const AdminExchange = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rows, setRows] = useState(exchangeRequests);

  const filtered = useMemo(() => {
    return rows.filter((req) => {
      const text = `${req.requester} ${req.owner} ${req.offeredBook.title} ${req.requestedBook.title}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const updateStatus = (id, nextStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Swaps</p>
          <h1 className="text-2xl font-bold text-gray-900">Exchange Requests</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests"
              className="pl-9 pr-3 py-2 w-64 rounded-lg border border-gray-200 focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30 text-sm outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#D98C00] focus:ring-2 focus:ring-[#D98C00]/30"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Requester</th>
                <th className="px-4 py-3 text-left font-semibold">Offered Book</th>
                <th className="px-4 py-3 text-left font-semibold">Requested Book</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{req.requester}</div>
                    <div className="text-xs text-gray-500">Owner: {req.owner}</div>
                  </td>
                  <td className="px-4 py-3">
                    <BookCell book={req.offeredBook} tone="text-[#D98C00]" />
                  </td>
                  <td className="px-4 py-3">
                    <BookCell book={req.requestedBook} tone="text-green-700" />
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(req.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusTone(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      disabled={req.status !== "Pending"}
                      onClick={() => updateStatus(req.id, "Accepted")}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold transition ${
                        req.status === "Pending"
                          ? "border-green-200 text-green-700 hover:bg-green-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      disabled={req.status !== "Pending"}
                      onClick={() => updateStatus(req.id, "Rejected")}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold transition ${
                        req.status === "Pending"
                          ? "border-red-200 text-red-600 hover:bg-red-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <X size={16} /> Reject
                    </button>
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition">
                      <Eye size={16} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 p-4 bg-gray-50 text-sm text-gray-600 flex items-center gap-2">
        <ArrowLeftRight size={16} className="text-[#D98C00]" />
        Status badges: Pending = yellow, Accepted = green, Rejected = red. Actions are UI-only for now.
      </div>
    </div>
  );
};

const BookCell = ({ book, tone }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        src={book.image}
        alt={book.title}
        className="w-12 h-14 object-cover rounded-md border border-gray-200"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/80x100?text=Book";
        }}
      />
      <div>
        <p className={`font-semibold text-gray-900 ${tone}`}>{book.title}</p>
        <p className="text-xs text-gray-500">Exchange item</p>
      </div>
    </div>
  );
};

const statusTone = (status) => {
  if (status === "Accepted") return "bg-green-100 text-green-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default AdminExchange;
