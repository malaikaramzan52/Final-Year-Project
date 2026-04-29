import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { toast } from "react-toastify";
import api from "../../api/axios";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/v2/complaint/get-all-complaints");
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

  const handleFormDone = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Complaints Section</h2>
          <p className="text-gray-500 text-sm mt-1">Submit and track your complaints easily.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition shadow-md"
          >
            <AiOutlinePlus size={20} />
            Submit Complaint
          </button>
        )}
      </div>

      {showForm ? (
        <ComplaintForm onDone={handleFormDone} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Complaint ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No complaints found. Click "Submit Complaint" to start.
                    </td>
                  </tr>
                ) : (
                  complaints.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        #{item._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 line-clamp-1 max-w-[200px]">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            statusColors[item.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedComplaint(item)}
                          className="p-2 text-[#D98C00] hover:bg-[#D98C00]/10 rounded-full transition"
                          title="View Details"
                        >
                          <AiOutlineEye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedComplaint && (
        <ComplaintDetails
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
};

const ComplaintForm = ({ onDone, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    orderId: "",
    description: "",
  });
  const [evidence, setEvidence] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Book Not Received",
    "Wrong Book Delivered",
    "Payment Issue",
    "Seller Misbehavior",
    "Exchange Issue",
    "Other",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidence(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("orderId", formData.orderId);
    data.append("description", formData.description);
    if (evidence) {
      data.append("evidence", evidence);
    }

    try {
      const res = await api.post("/v2/complaint/create-complaint", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Complaint submitted successfully!");
      onDone(res.data.complaint);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Submit New Complaint</h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
          <AiOutlineClose size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Complaint Title *</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none transition"
              placeholder="Briefly describe the issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none transition bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID / Book ID (Optional)</label>
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none transition"
            placeholder="e.g. #654321"
            value={formData.orderId}
            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <textarea
            rows="5"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none transition resize-none"
            placeholder="Provide full details about your complaint..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Evidence (Optional)</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#D98C00] hover:bg-[#D98C00]/5 transition">
                <AiOutlineCloudUpload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Click to upload image or screenshot</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </label>
            {preview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setEvidence(null);
                  }}
                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow-sm hover:bg-white"
                >
                  <AiOutlineClose size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#D98C00] text-white font-bold py-3 rounded-lg hover:bg-[#A86500] transition shadow-md disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white text-gray-700 font-bold py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const ComplaintDetails = ({ complaint, onClose }) => {
  const backendOrigin = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Complaint Details</h3>
            <p className="text-xs font-mono text-gray-400 mt-1 uppercase">ID: {complaint._id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status]}`}>
                {complaint.status}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Category</p>
              <p className="text-sm font-semibold text-gray-800">{complaint.category}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Title</p>
            <p className="text-lg font-bold text-gray-900">{complaint.title}</p>
          </div>

          {complaint.orderId && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Related ID</p>
              <p className="text-sm font-mono text-gray-700">{complaint.orderId}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl italic">
              "{complaint.description}"
            </p>
          </div>

          {complaint.evidence && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Evidence Attachment</p>
              <img
                src={`${backendOrigin}${complaint.evidence}`}
                alt="evidence"
                className="w-full max-h-64 object-contain bg-gray-50 rounded-xl border border-gray-100"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {complaint.adminResponse && (
            <div className="bg-[#D98C00]/10 p-5 rounded-2xl border border-[#D98C00]/20">
              <p className="text-xs text-[#D98C00] uppercase font-black mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D98C00] rounded-full"></span>
                Admin Response
              </p>
              <p className="text-sm text-gray-800 font-medium">
                {complaint.adminResponse}
              </p>
              <p className="text-[10px] text-gray-400 mt-2">
                Updated at: {new Date(complaint.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
