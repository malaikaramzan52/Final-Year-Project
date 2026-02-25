// src/pages/BrowseBooks.jsx
import React from "react";
import ProductCard from "../Root/ProductCard/ProductCard";
import { productData } from "../../static/data";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

const BrowseBooks = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Header */}
      <Header activeHeading={2} />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-10">

        {/* Grid: responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productData.map((book) => (
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BrowseBooks;
