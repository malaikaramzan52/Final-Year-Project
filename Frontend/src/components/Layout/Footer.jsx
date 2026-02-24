import React from "react";
import { FaBook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#D98C00] text-white mt-20 py-6">

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center mb-4 md:mb-0">
          <FaBook className="text-2xl mr-2" />
          <h2 className="text-2xl font-bold">Rebook</h2>
        </div>

        {/* Center: Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="/" className="hover:text-gray-300 transition">Home</a>
          <a href="/browse-books" className="hover:text-gray-300 transition">Browse Books</a>
          <a href="/contact" className="hover:text-gray-300 transition">Contact</a>
        </div>

        {/* Right: Copyright */}
        <div className="text-gray-300 text-sm text-center md:text-right">
          &copy; {new Date().getFullYear()} Rebook Marketplace. All rights reserved.
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
