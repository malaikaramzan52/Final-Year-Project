import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Resolved: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/v2/complaint/admin-all-complaints");
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdating(true);
    try {
      const res = await api.put(`/v2/complaint/update-complaint-status/${id}`, {
        status,
        adminResponse: responseMsg,
      });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? res.data.complaint : c))
      );
      setSelectedComplaint(res.data.complaint);
      toast.success(`Complaint marked as ${status}`);
      setResponseMsg("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteComplaint = async (id, e) => {
    e.stopPropagation(); // prevent opening the modal
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    
    try {
      await api.delete(`/v2/complaint/delete-complaint/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint(null);
      }
      toast.success("Complaint deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      (c.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (c.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (c._id?.slice(-6) || "").includes(searchTerm);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Complaints</h1>
          <p className="text-gray-500 text-sm">Manage and respond to user issues and feedback.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-500" />
            <span className="text-sm font-semibold">
              {complaints.filter((c) => c.status === "Pending").length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, user, or ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-2 focus:ring-[#D98C00]/20 focus:border-[#D98C00] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#D98C00]/20 outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <th className="px-6 py-4">Complaint ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Title & Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No complaints found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => setSelectedComplaint(c)}>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{c._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                          {c.user?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{c.user?.name || "User (Deleted)"}</p>
                          <p className="text-xs text-gray-500">{c.user?.email || "email@unknown.com"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{c.title}</p>
                      <p className="text-xs text-[#D98C00] font-medium">{c.category}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        className="p-2 text-[#D98C00] hover:bg-[#D98C00]/10 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition ml-2"
                        title="Delete Complaint"
                        onClick={(e) => handleDeleteComplaint(c._id, e)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-[#D98C00]" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Complaint Details</h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <XCircle size={22} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusColors[selectedComplaint.status]}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</p>
                  <p className="text-sm font-semibold text-[#D98C00]">{selectedComplaint.category}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Complaint Title</p>
                <p className="text-base font-semibold text-gray-800">{selectedComplaint.title}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed italic">
                  "{selectedComplaint.description}"
                </div>
              </div>

              {selectedComplaint.evidence && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evidence</p>
                  <div className="relative group w-40 h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${selectedComplaint.evidence}`}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${selectedComplaint.evidence}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              )}

              {/* Admin Response Section */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-[#D98C00]" />
                  <p className="text-sm font-bold text-gray-900">Update Status & Respond</p>
                </div>
                
                <textarea
                  placeholder="Write a response to the user..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#D98C00]/20 focus:border-[#D98C00] outline-none text-sm transition h-24 resize-none"
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={updating || selectedComplaint.status === 'In Progress'}
                    onClick={() => handleUpdateStatus(selectedComplaint._id, "In Progress")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    <Clock size={16} /> Mark In Progress
                  </button>
                  <button
                    disabled={updating || selectedComplaint.status === 'Resolved'}
                    onClick={() => handleUpdateStatus(selectedComplaint._id, "Resolved")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} /> Resolve
                  </button>
                  <button
                    disabled={updating || selectedComplaint.status === 'Rejected'}
                    onClick={() => handleUpdateStatus(selectedComplaint._id, "Rejected")}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>

              {selectedComplaint.adminResponse && (
                <div className="bg-gray-100 p-4 rounded-xl border-l-4 border-[#D98C00]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Previous Admin Response</p>
                  <p className="text-sm text-gray-700">{selectedComplaint.adminResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
