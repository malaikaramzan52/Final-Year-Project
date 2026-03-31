import React, { useMemo, useState } from "react";
import { orders } from "./data";
import { Search, Eye, XCircle } from "lucide-react";

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rows, setRows] = useState(orders);

  const filtered = useMemo(() => {
    return rows.filter((order) => {
      const text = `${order.buyer} ${order.bookTitle}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const cancelOrder = (id) => {
    setRows((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o)));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Transactions</p>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders"
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
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Buyer</th>
                <th className="px-4 py-3 text-left font-semibold">Book</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{order.buyer}</td>
                  <td className="px-4 py-3 text-gray-700">{order.bookTitle}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">Rs. {order.price}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(order.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition">
                      <Eye size={16} /> View
                    </button>
                    <button
                      disabled={order.status === "Cancelled"}
                      onClick={() => cancelOrder(order.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm font-semibold transition ${
                        order.status === "Cancelled"
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-red-200 text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <XCircle size={16} /> Cancel
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

const statusTone = (status) => {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Pending") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default AdminOrders;
