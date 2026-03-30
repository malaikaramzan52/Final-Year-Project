import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "../Root/ProductCard/ProductCard";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { AiOutlineDown } from "react-icons/ai";
import BgImage from "../../Assets/Logo/Background.jpg";
import api from "../../api/axios";
import { normalizeBooks } from "../../utils/normalizeBook";

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/v2/book/all");
        setBooks(normalizeBooks(res.data.books));
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const sortedBooks = useMemo(() => {
    const booksCopy = [...books];

    switch (sortBy) {
      case "latest":
        return booksCopy.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return booksCopy.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return booksCopy;
    }
  }, [sortBy, books]);

  const sortOptions = [
    { value: "latest", label: "New to Old" },
    { value: "oldest", label: "Old to New" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <Header activeHeading={2} />

      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${BgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Browse Books
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed drop-shadow-md">
            Buy books at affordable prices or exchange your old books with others on the platform.
            Our marketplace connects book lovers, promotes reuse, and makes quality books accessible
            to everyone.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            All Books <span className="text-[#D98C00]">({sortedBooks.length})</span>
          </h2>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-[#D98C00] text-[#D98C00] rounded-lg font-semibold hover:bg-[#D98C00] hover:text-white transition duration-300 shadow-md hover:shadow-lg"
            >
              <span>Sort by: {sortOptions.find((opt) => opt.value === sortBy)?.label}</span>
              <AiOutlineDown
                size={18}
                className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border-2 border-[#D98C00] rounded-lg shadow-xl z-50">
                {sortOptions.map((option, idx) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 font-medium transition duration-300 ${
                      sortBy === option.value
                        ? "bg-[#D98C00] text-white"
                        : "text-gray-700 hover:bg-[#D98C00]/10"
                    } ${idx === 0 ? "rounded-t-lg" : ""} ${
                      idx === sortOptions.length - 1 ? "rounded-b-lg" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <ProductCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BrowseBooks;
