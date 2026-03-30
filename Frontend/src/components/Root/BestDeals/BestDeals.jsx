import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import api from "../../../api/axios";
import { normalizeBooks } from "../../../utils/normalizeBook";

const BestDeals = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/v2/book/all?sort=latest");
        setBooks(normalizeBooks(res.data.books));
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide drop-shadow-sm">
          Browse Books
        </h2>
        <p className="text-gray-600 mt-3 text-lg">
          Explore a wide collection of old, rare, and exchangeable books
        </p>
      </div>

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

export default BestDeals;
