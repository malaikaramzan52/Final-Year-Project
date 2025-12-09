// src/pages/BrowseBooks.jsx
import React from "react";
import ProductCard from "../Root/ProductCard/ProductCard";
  // adjust path
import { productData } from "../../static/data";
 // adjust path to your file

const BrowseBooks = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Browse Books</h1>

      {/* Grid: responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productData.map((book) => (
          <ProductCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BrowseBooks;
