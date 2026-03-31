import React from "react";
import { Users, BookOpen, Shuffle, ShoppingBag, Clock3, ArrowRight } from "lucide-react";
import { users, books, exchangeRequests, orders } from "./data";

const statCards = [
  {
    title: "Total Users",
    value: users.length,
    icon: Users,
    color: "bg-blue-50 text-blue-700",
    accent: "bg-blue-100",
  },
  {
    title: "Total Books",
    value: books.length,
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-700",
    accent: "bg-emerald-100",
  },
  {
    title: "Exchange Requests",
    value: exchangeRequests.length,
    icon: Shuffle,
    color: "bg-indigo-50 text-indigo-700",
    accent: "bg-indigo-100",
  },
  {
    title: "Buy Orders",
    value: orders.length,
    icon: ShoppingBag,
    color: "bg-amber-50 text-amber-700",
    accent: "bg-amber-100",
  },
  {
    title: "Pending Requests",
    value: exchangeRequests.filter((r) => r.status === "Pending").length,
    icon: Clock3,
    color: "bg-red-50 text-red-700",
    accent: "bg-red-100",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Overview</p>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map(({ title, value, icon: Icon, color, accent }) => (
          <div key={title} className={`rounded-2xl p-4 shadow-sm border border-gray-100 ${accent}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Latest Exchange Requests</p>
              <h3 className="text-lg font-semibold text-gray-900">Recent activity</h3>
            </div>
            <button className="text-sm text-[#D98C00] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {exchangeRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#D98C00]/40 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D98C00]/10 text-[#D98C00] font-bold flex items-center justify-center text-xs">
                    {req.requester.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{req.requester}</p>
                    <p className="text-xs text-gray-500">Offered {req.offeredBook.title} for {req.requestedBook.title}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge(req.status)}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Orders Snapshot</p>
              <h3 className="text-lg font-semibold text-gray-900">Recent buy orders</h3>
            </div>
            <button className="text-sm text-[#D98C00] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.bookTitle}</p>
                  <p className="text-xs text-gray-500">Buyer: {order.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">Rs. {order.price}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const statusBadge = (status) => {
  if (status === "Accepted") return "bg-green-100 text-green-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

export default AdminDashboard;
