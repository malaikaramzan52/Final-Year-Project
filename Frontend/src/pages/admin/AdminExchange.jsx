import React, { useMemo, useState, useEffect } from "react";
import { Search, Eye, Info, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { server } from "../../server";

const AdminExchange = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedExchange, setSelectedExchange] = useState(null);

  const apiBase = (server || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const res = await api.get("/v2/exchange/admin-all-exchanges");
        setExchanges(res.data.exchanges || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch exchanges", err);
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  const filtered = useMemo(() => {
    return exchanges.filter((req) => {
      const text = `${req.requester?.name} ${req.owner?.name} ${req.offeredBook?.title} ${req.requestedBook?.title} ${req._id}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [exchanges, search, statusFilter]);

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
           <p className="text-sm text-gray-500">Inventory</p>
           <h1 className="text-2xl font-bold text-gray-900">Exchange Requests</h1>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search swaps"
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
                <th className="px-4 py-3 text-left font-semibold">Participants</th>
                <th className="px-4 py-3 text-left font-semibold">Offered Book (Price)</th>
                <th className="px-4 py-3 text-left font-semibold">Requested Book (Price)</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                       <span className="font-semibold text-gray-900">{req.requester?.name}</span>
                       <span className="text-xs text-gray-500">With {req.owner?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                       <img src={resolveImage(req.offeredBook?.image)} alt="" className="w-10 h-12 object-cover rounded-md border border-gray-200 bg-white shrink-0" />
                       <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{req.offeredBook?.title}</p>
                          <p className="text-xs text-emerald-600 font-bold">Rs. {req.offeredBook?.price || "0"}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                       <img src={resolveImage(req.requestedBook?.image)} alt="" className="w-10 h-12 object-cover rounded-md border border-gray-200 bg-white shrink-0" />
                       <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{req.requestedBook?.title}</p>
                          <p className="text-xs text-[#D98C00] font-bold">Rs. {req.requestedBook?.price || "0"}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(req.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusTone(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button 
                      onClick={() => setSelectedExchange(req)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition"
                    >
                      <Eye size={16} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
               <Info size={32} className="mx-auto text-gray-200 mb-2" />
               <p className="text-gray-400 text-sm font-medium">No swap records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Popup - Matching Admin Style */}
      {selectedExchange && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedExchange(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col max-h-[90vh] scrollbar-hide">
             <div className="bg-gray-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
                <h2 className="text-sm font-bold uppercase tracking-wider">Exchange Details</h2>
                <button onClick={() => setSelectedExchange(null)} className="w-8 h-8 hover:bg-white/10 rounded-full flex items-center justify-center transition-all">
                   <Info size={18} />
                </button>
             </div>

             <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Requester</p>
                      <p className="text-sm font-bold text-gray-900">{selectedExchange.requester?.name}</p>
                      <p className="text-xs text-gray-500">{selectedExchange.requester?.email}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Book Owner</p>
                      <p className="text-sm font-bold text-gray-900">{selectedExchange.owner?.name}</p>
                      <p className="text-xs text-gray-500">{selectedExchange.owner?.email}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <DetailCard label="Offered Book" book={selectedExchange.offeredBook} resolveImage={resolveImage} />
                   <DetailCard label="Requested Book" book={selectedExchange.requestedBook} resolveImage={resolveImage} />
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 border-dashed">
                   <h5 className="text-[10px] font-bold text-[#D98C00] uppercase mb-2">Message</h5>
                   <p className="text-xs text-gray-700 italic">"{selectedExchange.note || "No message provided."}"</p>
                </div>
             </div>

             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID: {selectedExchange._id}</p>
                <button onClick={() => setSelectedExchange(null)} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase hover:bg-[#D98C00] transition-all">
                  Close
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailCard = ({ label, book, resolveImage }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
      <img src={resolveImage(book?.image)} alt="" className="w-10 h-14 rounded object-cover border border-gray-100" />
      <div className="min-w-0">
        <h5 className="text-xs font-bold text-gray-900 truncate">{book?.title}</h5>
        <div className="mt-1 flex items-center gap-2">
           <span className="text-[10px] font-bold text-[#D98C00]">Rs. {book?.price || "0"}</span>
           <span className="text-[10px] text-gray-400">|</span>
           <span className="text-[10px] text-gray-500">{book?.condition || "Good"}</span>
        </div>
      </div>
    </div>
  </div>
);

const statusTone = (status) => {
  if (status === "Accepted") return "bg-green-100 text-green-700";
  if (status === "Rejected") return "bg-red-100 text-red-700";
  if (status === "Cancelled") return "bg-gray-100 text-gray-600";
  return "bg-amber-100 text-amber-700";
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

export default AdminExchange;
