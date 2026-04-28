import React, { useEffect, useState, useRef } from "react";
import api from "../../../api/axios";
import { normalizeBooks } from "../../../utils/normalizeBook";
import ProductCard from "../ProductCard/ProductCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

/* ── Small Carousel reused from BestDeals pattern ── */
const Carousel = ({ books }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

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

        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[#D98C00] hover:text-white text-gray-700 shadow-md rounded-full w-9 h-9 flex items-center justify-center transition duration-300"
        >
          <IoIosArrowBack size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-[#D98C00] hover:text-white text-gray-700 shadow-md rounded-full w-9 h-9 flex items-center justify-center transition duration-300"
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>

      {/* Dots */}
      {max > 0 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-[#D98C00] w-5" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Section Component ── */
const ExchangeableBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/v2/book/all?exchangeable=true&sort=latest");
        setBooks(normalizeBooks(res.data.books));
      } catch (err) {
        console.error("Failed to fetch exchangeable books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!loading && books.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 px-6"
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block mb-2 px-4 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full border border-green-200">
              🔄 Exchange Available
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Books Up for Exchange
            </h2>
            <p className="text-gray-500 mt-1 text-base">
              These books are listed by sellers who are open to swapping — for free!
            </p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-semibold text-[#D98C00] hover:underline whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        {/* Carousel / Loader */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Carousel books={books} />
        )}
      </div>
    </section>
  );
};

export default ExchangeableBooks;
