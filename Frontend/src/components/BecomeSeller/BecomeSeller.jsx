import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Layout/Footer";
import RebookLogo from "../../Assets/Logo/white.png";
import { navItems } from "../../static/data";

const BecomeSeller = () => {
  const [bookName, setBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [exchangeable, setExchangeable] = useState(false);

  const conditionOptions = ["Newly", "Fair", "Acceptable", "Old"];
  const categoryOptions = [
    "Fiction",
    "Non-Fiction",
    "Academic & Textbooks",
    "Novels",
    "Science & Technology",
    "History & Politics",
    "Arts & Photography",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bookName || !authorName || !price || !condition || !category) {
      alert("Please fill all required fields!");
      return;
    }

    alert("Book uploaded successfully!");

    setBookName("");
    setAuthorName("");
    setBookImage(null);
    setPrice("");
    setCondition("");
    setCategory("");
    setExchangeable(false);
  };

  return (
    <div className="bg-[#f5f7fa] min-h-screen flex flex-col">
      {/* Header styled like Wishlist page */}
      <header className="bg-[#D98C00] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
              <img src={RebookLogo} alt="Rebook Logo" className="h-12 w-auto" />
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.id || item.title}
                  to={item.url}
                  className="text-white font-medium px-4 rounded-md transition-all duration-300 ease-in-out hover:bg-white hover:text-black hover:shadow-md"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex-shrink-0">
              <Link
                to="/become-seller"
                className="bg-white text-black px-6 py-1 rounded-md border-2 border-[#D98C00] shadow-md font-bold text-lg tracking-wide flex items-center justify-center transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Upload Book
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto mt-10 p-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md border border-orange-100 w-full">

        <h2 className="text-center mb-8 text-3xl font-bold text-[#D98C00] tracking-wide drop-shadow-sm">
          Upload Book Details
        </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-700">Book Name</label>
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="w-full mt-2 p-3 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D98C00] outline-none"
              placeholder="Enter book name"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Author Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full mt-2 p-3 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D98C00] outline-none"
              placeholder="Enter author name"
              required
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold text-gray-700">Upload Book Image</label>

            <div className="mt-2 border-2 border-dashed border-[#D98C00] bg-orange-50/50 hover:bg-orange-100 cursor-pointer rounded-xl p-5 flex flex-col items-center justify-center transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBookImage(e.target.files[0])}
                className="hidden"
                id="imgUpload"
              />

              <label htmlFor="imgUpload" className="text-center cursor-pointer">
                {!bookImage ? (
                  <div>
                    <p className="font-semibold text-[#D98C00] mb-1">Click to upload</p>
                    <p className="text-gray-600 text-sm">PNG, JPG (Max 5MB)</p>
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(bookImage)}
                    className="w-32 rounded-xl shadow-md"
                    alt="preview"
                  />
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-2 p-3 border border-orange-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D98C00] outline-none"
              placeholder="Enter price (PKR)"
              required
            />
          </div>

        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Category */}
          <div>
            <label className="font-semibold text-gray-700">Select Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={`w-full mt-2 p-3 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#D98C00] transition-colors duration-200 ${
                category
                  ? "border-[#D98C00] bg-orange-50 text-[#A86500]"
                  : "border-orange-200 hover:border-[#D98C00] hover:bg-orange-50 hover:text-[#A86500]"
              }`}
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat} className="text-gray-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="font-semibold text-gray-700">Book Condition</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {conditionOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCondition(opt)}
                  className={`px-4 py-2 rounded-full shadow-md transition ${
                    condition === opt
                      ? "bg-[#D98C00] text-white"
                      : "bg-orange-50 hover:bg-orange-100 text-gray-800 border border-orange-100"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Exchangeable */}
        <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl border border-orange-200">
          <input
            type="checkbox"
            checked={exchangeable}
            onChange={(e) => setExchangeable(e.target.checked)}
            className="w-5 h-5 accent-[#D98C00]"
          />
          <label className="font-medium text-gray-700">
            This book is exchangeable
          </label>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-[#D98C00] text-white font-semibold rounded-xl shadow-lg hover:bg-[#A86500] transition-all tracking-wide"
          >
            Upload Book
          </button>
        </div>

        </form>
      </div>

      <Footer />
    </div>
  );
};

export default BecomeSeller;