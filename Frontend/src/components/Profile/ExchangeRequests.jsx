import { ArrowLeftRight, Check, Eye, X, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import React, { useEffect, useMemo, useState } from "react";
import { server } from "../../server";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-600 border-amber-100",
  Accepted: "bg-green-50 text-green-600 border-green-100",
  Rejected: "bg-red-50 text-red-600 border-red-100",
  Cancelled: "bg-gray-50 text-gray-500 border-gray-100",
  Exchanged: "bg-indigo-50 text-indigo-600 border-indigo-100",
};

const resolveImage = (img) => {
  if (!img) return "https://via.placeholder.com/80x100?text=Book";
  if (img.startsWith("http")) return img;
  const origin = (server || "http://localhost:5000").replace(/\/$/, "");
  return `${origin}${img.startsWith("/") ? img : `/${img}`}`;
};

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const ExchangeRequests = ({ viewType = "sent" }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const endpoint = viewType === "sent" ? "/v2/exchange/my-requests" : "/v2/exchange/received-requests";
        const res = await api.get(endpoint);
        setRequests(res.data.requests);
      } catch (err) {
        toast.error("Failed to load exchange requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [viewType]);

  const summary = useMemo(() => {
    return requests.reduce(
      (acc, req) => {
        acc.total += 1;
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      },
      { total: 0, Pending: 0, Accepted: 0, Rejected: 0 }
    );
  }, [requests]);

  const updateStatus = async (requestId, nextStatus) => {
    try {
      await api.put(`/v2/exchange/${requestId}/status`, { status: nextStatus });
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: nextStatus } : req))
      );
      if (selectedRequest?._id === requestId) {
        setSelectedRequest(prev => ({ ...prev, status: nextStatus }));
      }
      toast.success(`Request ${nextStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="animate-spin text-[#D98C00]" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 pl-4">
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">
               {viewType === "sent" ? "Sent Requests" : "Received Requests"}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Review and manage your book exchange history.</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Active</p>
               <p className="text-lg font-bold text-gray-900">{summary.total}</p>
            </div>
            <div className="w-[1px] h-8 bg-gray-100"></div>
            <div className="text-right">
               <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Pending</p>
               <p className="text-lg font-bold text-gray-900">{summary.Pending}</p>
            </div>
         </div>
      </div>

      {requests.length === 0 ? (
        <div className="py-20 text-center">
          <ArrowLeftRight size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No exchange requests found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Exchange Pair</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((req) => {
                   const partner = viewType === "sent" ? req.owner : req.requester;
                   return (
                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={resolveImage(partner?.avatar)} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover bg-gray-100"
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.name || "User")}&background=D98C00&color=fff`; }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{partner?.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">#{req._id?.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className="flex -space-x-2">
                              <img src={resolveImage(req.requestedBook?.image)} alt="" className="w-6 h-8 rounded shadow-sm object-cover border border-white" />
                              <img src={resolveImage(req.offeredBook?.image)} alt="" className="w-6 h-8 rounded shadow-sm object-cover border border-white" />
                           </div>
                           <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">{req.requestedBook?.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-500 font-medium">
                        {formatDate(req.createdAt)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyles[req.status] || "bg-gray-100 text-gray-600"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-[#D98C00] transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clean Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
               <h3 className="text-lg font-bold text-gray-900">Exchange Details</h3>
               <button onClick={() => setSelectedRequest(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                 <X size={20} />
               </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
               {/* Partner */}
               <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img 
                    src={resolveImage((viewType === "sent" ? selectedRequest.owner : selectedRequest.requester)?.avatar)} 
                    alt="" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                     <p className="text-[10px] font-bold text-[#D98C00] uppercase tracking-wider">{viewType === "sent" ? "Recipient" : "Sender"}</p>
                     <h4 className="text-lg font-bold text-gray-900">{(viewType === "sent" ? selectedRequest.owner : selectedRequest.requester)?.name}</h4>
                     <p className="text-sm text-gray-500">{(viewType === "sent" ? selectedRequest.owner : selectedRequest.requester)?.email}</p>
                  </div>
               </div>

               {/* Grid */}
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requested Item</p>
                     <BookMiniCard book={selectedRequest.requestedBook} />
                  </div>
                  <div className="space-y-3">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Offered Item</p>
                     <BookMiniCard book={selectedRequest.offeredBook} />
                  </div>
               </div>

               {/* Message */}
               <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Note from Sender</p>
                  <p className="text-sm text-gray-700 italic">"{selectedRequest.note || "No message provided."}"</p>
               </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
               <p className="text-[10px] font-bold text-gray-400">ID: {selectedRequest._id}</p>
               <div className="flex gap-2">
                  {viewType === "received" && selectedRequest.status === "Pending" && (
                    <>
                       <button onClick={() => { updateStatus(selectedRequest._id, "Accepted"); setSelectedRequest(null); }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition">Accept</button>
                       <button onClick={() => { updateStatus(selectedRequest._id, "Rejected"); setSelectedRequest(null); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition">Reject</button>
                    </>
                  )}
                  {viewType === "sent" && selectedRequest.status === "Pending" && (
                     <button onClick={() => { updateStatus(selectedRequest._id, "Cancelled"); setSelectedRequest(null); }} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-black transition">Cancel Request</button>
                  )}
                  <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition">Close</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BookMiniCard = ({ book }) => (
  <div className="flex gap-3">
    <img src={resolveImage(book?.image)} alt="" className="w-12 h-16 rounded object-cover shadow-sm bg-gray-100" />
    <div className="min-w-0">
      <p className="text-sm font-bold text-gray-900 truncate">{book?.title}</p>
      <p className="text-xs text-gray-500 truncate">{book?.author}</p>
      <p className="text-xs font-bold text-[#D98C00] mt-1">Rs. {book?.price || 0}</p>
    </div>
  </div>
);

export default ExchangeRequests;
