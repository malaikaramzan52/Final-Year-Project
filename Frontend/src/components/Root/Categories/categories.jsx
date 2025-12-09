import React, { useRef } from "react";
import { categoriesData } from "../../../static/data";
import { MdMenuBook } from "react-icons/md";
import {
  FaBookOpen,
  FaHistory,
  FaBrain,
  FaChild,
  FaCogs,
  FaCameraRetro,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Icon map
const iconMap = {
  Fiction: <FaBookOpen size={34} className="text-blue-600" />,
  "Non-Fiction": <MdMenuBook size={34} className="text-green-600" />,
  "Academic & Textbooks": <FaBrain size={34} className="text-purple-600" />,
  "Comics & Graphic Novels": <FaChild size={34} className="text-red-600" />,
  "Science & Technology": <FaCogs size={34} className="text-yellow-600" />,
  "History & Politics": <FaHistory size={34} className="text-orange-600" />,
  "Arts & Photography": <FaCameraRetro size={34} className="text-pink-600" />,
  // Others: <MdMenuBook size={34} className="text-gray-600" />,
};

const Categories = () => {
  const scrollRef = useRef(null);

  // Handle click scroll
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
  };

  return (
    <div className="w-[90%] mx-auto mt-12 relative">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse Categories</h2>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-[55%] transform -translate-y-1/2 bg-white shadow-lg border rounded-full p-3 z-10 hover:bg-gray-100 transition"
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-[55%] transform -translate-y-1/2 bg-white shadow-lg border rounded-full p-3 z-10 hover:bg-gray-100 transition"
      >
        ❯
      </button>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-scroll scrollbar-hide px-10"
        style={{ scrollBehavior: "smooth" }}
      >
        {categoriesData.map((cat) => (
          <Link
            to={`/category/${cat.title}`}
            key={cat.id}
            className="min-w-[260px] h-[120px] bg-white border shadow-sm hover:shadow-md rounded-xl p-4 flex flex-col justify-center transition-all duration-300 cursor-pointer"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-2">
              {iconMap[cat.title] || <MdMenuBook size={34} />}
              <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-gray-500 pl-12">{cat.subTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
