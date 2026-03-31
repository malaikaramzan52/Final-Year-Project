import React, { useMemo, useState } from "react";
import { ArrowLeftRight, CalendarClock, Check, Eye, UserRound, X } from "lucide-react";
import { toast } from "react-toastify";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-600",
  Exchanged: "bg-indigo-100 text-indigo-800",
};

const demoRequests = [
  {
    id: "REQ-1045",
    type: "received",
    requesterName: "Ayesha Khan",
    ownerName: "You",
    requestedBook: {
      title: "Atomic Habits",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=320&q=80",
    },
    offeredBook: {
      title: "Deep Work",
      image:
        "https://images.unsplash.com/photo-1544939571-1bb1317d2dc8?auto=format&fit=crop&w=320&q=80",
    },
    status: "Pending",
    date: "2024-09-12T10:00:00Z",
    note: "Happy to swap within Islamabad. Books are in great shape!",
  },
  {
    id: "REQ-1039",
    type: "received",
    requesterName: "Bilal Ahmed",
    ownerName: "You",
    requestedBook: {
      title: "The Psychology of Money",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=320&q=80",
    },
    offeredBook: {
      title: "Rich Dad Poor Dad",
      image:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=320&q=80",
    },
    status: "Accepted",
    date: "2024-09-05T15:30:00Z",
    note: "Can meet near G-11 Markaz over the weekend.",
  },
  {
    id: "REQ-1022",
    type: "sent",
    requesterName: "You",
    ownerName: "Hassan Raza",
    requestedBook: {
      title: "The Alchemist",
      image:
        "https://images.unsplash.com/photo-1455884981818-54cb785db6fc?auto=format&fit=crop&w=320&q=80",
    },
    offeredBook: {
      title: "Ikigai",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=320&q=80",
    },
    status: "Pending",
    date: "2024-09-02T08:10:00Z",
    note: "Would love to exchange this week if you are free.",
  },
  {
    id: "REQ-1016",
    type: "sent",
    requesterName: "You",
    ownerName: "Laiba Zafar",
    requestedBook: {
      title: "Sapiens",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=320&q=80",
    },
    offeredBook: {
      title: "The Power of Habit",
      image:
        "https://images.unsplash.com/photo-1447958272669-9c562446304f?auto=format&fit=crop&w=320&q=80",
    },
    status: "Rejected",
    date: "2024-08-28T11:45:00Z",
    note: "Already swapped this title. Maybe next time!",
  },
];

const formatDate = (value) => {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ExchangeRequests = ({ viewType = "sent" }) => {
  const [requests, setRequests] = useState(demoRequests);
  const [expandedId, setExpandedId] = useState(null);

  const filteredRequests = useMemo(
    () => requests.filter((req) => req.type === viewType),
    [requests, viewType]
  );

  const summary = useMemo(() => {
    return filteredRequests.reduce(
      (acc, req) => {
        acc.total += 1;
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      },
      { total: 0, Pending: 0, Accepted: 0, Rejected: 0 }
    );
  }, [filteredRequests]);

  const updateStatus = (requestId, nextStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: nextStatus } : req))
    );
    toast.success(`Request ${nextStatus}`);
  };

  const handleToggleDetails = (requestId) => {
    setExpandedId((prev) => (prev === requestId ? null : requestId));
  };

  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#D98C00] to-[#f5b74d] text-white shadow-lg p-6">
        <div className="flex flex-col gap-3 800px:flex-row 800px:items-center 800px:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <p className="text-sm opacity-80">Exchange Requests</p>
              <h2 className="text-2xl font-bold">
                {viewType === "sent" ? "Requests You Sent" : "Requests You Received"}
              </h2>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 text-sm font-semibold bg-white/15 rounded-full">
              {summary.total} total
            </span>
            <span className="px-3 py-1 text-sm font-semibold bg-white/15 rounded-full">
              {summary.Pending} pending
            </span>
            <span className="px-3 py-1 text-sm font-semibold bg-white/15 rounded-full">
              {summary.Accepted} accepted
            </span>
            <span className="px-3 py-1 text-sm font-semibold bg-white/15 rounded-full">
              {summary.Rejected} rejected
            </span>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-800 mb-2">No exchange requests yet</p>
          <p className="text-sm text-gray-500">
            Start an exchange by tapping the Exchangeable badge on any book card.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRequests.map((req) => {
            const isPending = req.status === "Pending";
            const canAct = viewType === "received" && isPending;

            return (
              <div key={req.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D98C00]/10 flex items-center justify-center text-[#D98C00]">
                      <UserRound size={18} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">{req.id}</p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {viewType === "sent" ? req.ownerName : req.requesterName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {viewType === "sent" ? "Book owner" : "Requester"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      statusStyles[req.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <BookTile label="Requested Book" book={req.requestedBook} accent="text-[#D98C00]" />
                  <BookTile label="Offered Book" book={req.offeredBook} accent="text-green-700" />
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Request Date:</span>
                    <span>{formatDate(req.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Status:</span>
                    <span>{req.status}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => canAct && updateStatus(req.id, "Accepted")}
                    disabled={!canAct}
                    className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition border ${
                      canAct
                        ? "bg-[#D98C00] text-white border-transparent hover:bg-[#A86500]"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => canAct && updateStatus(req.id, "Rejected")}
                    disabled={!canAct}
                    className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition border ${
                      canAct
                        ? "bg-white text-red-600 border-red-200 hover:bg-red-50"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <X size={16} /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleDetails(req.id)}
                    className="min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-700 hover:border-[#D98C00] hover:text-[#D98C00] transition"
                  >
                    <Eye size={16} /> View Details
                  </button>
                </div>

                {expandedId === req.id && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {req.note || "No additional notes provided."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="px-2 py-1 rounded-full bg-white border border-gray-200 inline-flex items-center gap-2">
                        <CircleDot />
                        {viewType === "sent" ? "Awaiting owner response" : "Action required"}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-white border border-gray-200">
                        Ref: {req.id}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BookTile = ({ label, book, accent }) => {
  return (
    <div className="flex gap-3 items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
      <img
        src={book?.image}
        alt={book?.title}
        className="w-16 h-20 object-cover rounded-md border border-gray-200 bg-white"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/80x100?text=Book";
        }}
      />
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold text-gray-900 ${accent}`}>{book?.title}</p>
      </div>
    </div>
  );
};

const CircleDot = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#D98C00" aria-hidden>
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default ExchangeRequests;
