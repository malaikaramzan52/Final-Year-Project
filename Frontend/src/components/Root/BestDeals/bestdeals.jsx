import React from "react";
import ProductCard from '../ProductCard/ProductCard';
import { productData } from '../../../static/data';

const BooksSection = () => {
 return (
  <div className="max-w-7xl mx-auto px-6 py-14">

    {/* Section Heading */}
    <div className="mb-16 text-center">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-wide drop-shadow-sm">
        Browse Books
      </h2>
      <p className="text-gray-600 mt-3 text-lg">
        Explore a wide collection of old, rare, and exchangeable books
      </p>
    </div>

    {/* Books Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {productData.slice(0, 5).map((book) => (
        <ProductCard key={book.id} book={book} />
      ))}
    </div>

  </div>
);


};

export default BooksSection;