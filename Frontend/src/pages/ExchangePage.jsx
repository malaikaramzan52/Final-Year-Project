import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import api from "../api/axios";
import { server } from "../server";
import styles from "../styles/styles";
import { AiOutlineArrowLeft, AiOutlineSwap } from "react-icons/ai";

const ExchangePage = () => {
  const { id } = useParams(); // Target Book ID
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [targetBook, setTargetBook] = useState(null);
  const [myBooks, setMyBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch target book
        const bookRes = await api.get(`/v2/book/${id}`);
        setTargetBook(bookRes.data.book);

        // Fetch user's exchangeable books
        const myBooksRes = await api.get("/v2/book/user/my-books");
        const exchangeable = myBooksRes.data.books.filter(b => b.exchangeable && b.status === "Available");
        setMyBooks(exchangeable);
      } catch (err) {
        toast.error("Failed to load exchange details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (selectedBookId) {
      const book = myBooks.find((b) => b._id === selectedBookId || b.id === selectedBookId);
      setSelectedBook(book);
    } else {
      setSelectedBook(null);
    }
  }, [selectedBookId, myBooks]);

  const handleExchangeRequest = async () => {
    if (!selectedBookId) {
      toast.error("Please select a book to offer");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/v2/exchange/create-request", {
        requestedBookId: targetBook._id || targetBook.id,
        offeredBookId: selectedBookId,
      });
      toast.success("Exchange request sent successfully!");
      navigate("/profile", { state: { activeTab: 4.1 } }); // Navigate to exchange requests tab
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition"
          >
            <AiOutlineArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Exchange Books</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Target Book Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-full">
            <div className="bg-[#D98C00]/5 p-6 border-b border-gray-100">
              <span className="px-3 py-1 bg-[#D98C00]/10 text-[#D98C00] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#D98C00]/20">
                Target Book
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">Requested from Seller</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={targetBook?.image?.startsWith("http") ? targetBook.image : `${(server || "").replace(/\/$/, "")}${targetBook?.image}`}
                    alt={targetBook?.title}
                    className="w-full h-48 object-contain bg-gray-50 rounded-lg"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{targetBook?.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">by {targetBook?.author}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-gray-400">Condition:</span> {targetBook?.condition}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-gray-400">Market Price:</span> Rs. {targetBook?.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                <img
                  src={targetBook?.user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetBook?.user?.name)}&background=D98C00&color=fff`}
                  alt="Seller"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <p className="text-[10px] font-bold text-[#D98C00] uppercase tracking-widest">Book Owner</p>
                  <p className="font-bold text-gray-800">{targetBook?.user?.name}</p>
                  <p className="text-xs text-gray-500">{targetBook?.user?.email}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                 <h4 className="text-sm font-bold text-gray-700 mb-2">Book Description</h4>
                 <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-4">
                   "{targetBook?.description}"
                 </p>
              </div>
            </div>
          </div>

          {/* Swap Icon Container */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="w-16 h-16 bg-white rounded-full shadow-lg border-2 border-[#D98C00] flex items-center justify-center animate-pulse">
              <AiOutlineSwap size={32} className="text-[#D98C00] rotate-90 lg:rotate-0" />
            </div>
          </div>

          {/* My Book Offer */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-full">
            <div className="bg-green-50 p-6 border-b border-gray-100">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-200">
                Your Offer
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-2">Select Book to Offer</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Choose from your exchangeable books:</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D98C00] outline-none transition cursor-pointer"
                >
                  <option value="">-- Select Your Book --</option>
                  {myBooks.map((book) => (
                    <option key={book._id || book.id} value={book._id || book.id}>
                      {book.title} (Rs. {book.price})
                    </option>
                  ))}
                </select>
                {myBooks.length === 0 && (
                  <p className="text-xs text-red-500 italic mt-1">
                    You don't have any books marked as "Available" and "Exchangeable". Upload one first!
                  </p>
                )}
              </div>

              {selectedBook ? (
                <div className="mt-8 transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <img
                        src={selectedBook?.image?.startsWith("http") ? selectedBook.image : `${(server || "").replace(/\/$/, "")}${selectedBook?.image}`}
                        alt={selectedBook?.title}
                        className="w-full h-48 object-contain bg-gray-50 rounded-lg"
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <h3 className="text-lg font-bold text-green-800 line-clamp-2">{selectedBook?.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">by {selectedBook?.author}</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          <span className="text-gray-400">Condition:</span> {selectedBook?.condition}
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          <span className="text-gray-400">Your Valuation:</span> Rs. {selectedBook?.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                    <img
                      src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=10b981&color=fff`}
                      alt="You"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">You (Requester)</p>
                      <p className="font-bold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleExchangeRequest}
                    disabled={submitting}
                    className="w-full mt-8 py-4 bg-[#D98C00] text-white font-bold rounded-xl shadow-lg hover:bg-[#A86500] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <AiOutlineSwap size={24} />
                        Confirm Exchange Request
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-12 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <AiOutlineSwap size={32} className="text-gray-300" />
                   </div>
                   <p className="text-gray-400 text-sm font-medium">Select a book to see comparison and send request</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExchangePage;
