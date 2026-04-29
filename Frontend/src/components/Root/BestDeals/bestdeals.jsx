import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../ProductCard/ProductCard";
import api from "../../../api/axios";
import { normalizeBooks } from "../../../utils/normalizeBook";
import { useSearchParams, Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

/* ──────────────────────────────────────────────
   Home Page Carousel — shows 4 cards at a time,
   auto-scrolls, pauses on hover.
────────────────────────────────────────────── */
const HomeCarousel = ({ books }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // responsive: how many cards visible
  const [visible, setVisible] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisible(w < 640 ? 1 : w < 768 ? 2 : w < 1024 ? 3 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const max = Math.max(0, books.length - visible);

  const next = () => setCurrent((c) => (c >= max ? 0 : c + 1));
  const prev = () => setCurrent((c) => (c <= 0 ? max : c - 1));

  // Auto-advance
  useEffect(() => {
    if (paused || books.length <= visible) return;
    timerRef.current = setInterval(next, 2800);
    return () => clearInterval(timerRef.current);
  }, [paused, books.length, visible, current]);

  const cardWidthPct = 100 / visible;

  return (
    <div className="w-full">
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * cardWidthPct}%)` }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${cardWidthPct}%` }}
            >
              <ProductCard book={book} />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[#D98C00] hover:text-white text-gray-700 shadow-md rounded-full w-9 h-9 flex items-center justify-center transition duration-300"
        >
          <IoIosArrowBack size={20} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[#D98C00] hover:text-white text-gray-700 shadow-md rounded-full w-9 h-9 flex items-center justify-center transition duration-300"
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {Array.from({ length: max + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-[#D98C00] w-5" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Main BooksSection component
────────────────────────────────────────────── */
const BooksSection = ({ isPage = false }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const categoryName = searchParams.get("categoryName") || "";

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ sort: "latest" });
        if (categoryId) {
          query.set("category", categoryId);
        }
        const res = await api.get(`/v2/book/all?${query.toString()}`);
        setBooks(normalizeBooks(res.data.books));
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [categoryId]); // categoryId change on filter, page navigates → fresh fetch

  // ── HOME PAGE view (carousel)
  if (!isPage) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Section Heading */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
              Browse Books
            </h2>
            <p className="text-gray-500 mt-1 text-base">
              Explore our collection of old, rare &amp; exchangeable books
            </p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-semibold text-[#D98C00] hover:underline whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No books available yet.</p>
        ) : (
          <HomeCarousel books={books} />
        )}
      </div>
    );
  }

  // ── PRODUCTS PAGE view (full grid)
  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksSection;
