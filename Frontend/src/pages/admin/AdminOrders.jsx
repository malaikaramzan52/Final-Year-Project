import React, { useMemo, useState, useEffect } from "react";
import { Search, Eye, Info, Loader2, ShoppingBag } from "lucide-react";
import api from "../../api/axios";
import { server } from "../../server";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const apiBase = (server || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/v2/order/admin-all-orders");
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const text = `${order.buyer?.name} ${order.seller?.name} ${order.book?.title} ${order._id}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
         <Loader2 className="animate-spin text-[#D98C00]" size={40} />
      </div>
    );
  }

  const resolveImage = (path) => {
    if (!path) return "https://via.placeholder.com/80x100?text=Book";
    if (path.startsWith("http")) return path;
    return `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <div className="space-y-5 scrollbar-hide">
      {/* Standard Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <p className="text-sm text-gray-500">Sales Dashboard</p>
           <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
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
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Standard Table Style */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Transaction (Buyer/Seller)</th>
                <th className="px-4 py-3 text-left font-semibold">Product Details</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Order Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                       <span className="font-semibold text-gray-900">{order.buyer?.name}</span>
                       <span className="text-[11px] text-gray-400 font-medium">To: {order.seller?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                       <img src={resolveImage(order.book?.image)} alt="" className="w-10 h-12 object-cover rounded border border-gray-100 bg-white" />
                       <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{order.book?.title}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">ID: {order._id.slice(-8)}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold">
                    Rs. {order.price || "0"}
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusTone(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition shadow-sm bg-white font-bold text-xs"
                    >
                      <Eye size={14} /> Full Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
               <ShoppingBag size={32} className="mx-auto text-gray-200 mb-2" />
               <p className="text-gray-400 text-sm font-medium">No order records in database</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Audit Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col max-h-[90vh] scrollbar-hide">
             <div className="bg-gray-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                   <ShoppingBag size={18} className="text-[#D98C00]" />
                   <h2 className="text-sm font-bold uppercase tracking-wider">Order Detail Record</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-all">
                   <Info size={18} />
                </button>
             </div>

             <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer (Buyer)</p>
                      <p className="text-sm font-bold text-gray-900">{selectedOrder.buyer?.name}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.buyer?.email}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Merchant (Seller)</p>
                      <p className="text-sm font-bold text-gray-900">{selectedOrder.seller?.name}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.seller?.email}</p>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                   <img src={resolveImage(selectedOrder.book?.image)} alt="" className="w-16 h-20 object-cover rounded-lg border border-gray-100 shadow-sm" />
                   <div>
                      <h4 className="font-bold text-gray-900 text-base">{selectedOrder.book?.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">Author: {selectedOrder.book?.author}</p>
                      <div className="flex items-center gap-4">
                         <span className="text-lg font-black text-[#D98C00]">Rs. {selectedOrder.price}</span>
                         <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold rounded uppercase">Status: {selectedOrder.status}</span>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                   <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Intelligence</h5>
                   <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-bold">{selectedOrder.shippingAddress?.fullName}</p>
                      <p className="text-xs">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                      <p className="text-xs">Phone: {selectedOrder.shippingAddress?.phone}</p>
                   </div>
                </div>
             </div>

             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Audit REF: {selectedOrder._id}</p>
                <button onClick={() => setSelectedOrder(null)} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-[#D98C00] transition-all">
                  Close Audit
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const statusTone = (status) => {
  if (status === "Completed" || status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Shipped") return "bg-blue-100 text-blue-700";
  if (status === "Pending" || status === "Confirmed") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default AdminOrders;
