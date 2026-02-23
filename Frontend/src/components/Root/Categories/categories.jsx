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

const iconMap = {
  Fiction: <FaBookOpen size={34} className="text-blue-600" />,
  "Non-Fiction": <MdMenuBook size={34} className="text-green-600" />,
  "Academic & Textbooks": <FaBrain size={34} className="text-purple-600" />,
  "Comics & Graphic Novels": <FaChild size={34} className="text-red-600" />,
  "Science & Technology": <FaCogs size={34} className="text-yellow-600" />,
  "History & Politics": <FaHistory size={34} className="text-orange-600" />,
  "Arts & Photography": <FaCameraRetro size={34} className="text-pink-600" />,
};

const Categories = () => {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };

  return (
    <div className="w-[90%] mx-auto mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse Categories</h2>

      {/* Scrollable Container */}
      <div className="flex items-center gap-2">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="bg-[#D98C00] hover:bg-[#A86500] rounded-full p-2"
        >
          ❮
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {categoriesData.map((cat) => (
            <Link
              to={`/category/${cat.title}`}
              key={cat.id}
              className="min-w-[260px] h-[120px] bg-white border shadow-sm hover:shadow-md rounded-xl p-4 flex flex-col justify-center cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-2">
                {iconMap[cat.title] || <MdMenuBook size={34} />}
                <h3 className="text-lg font-semibold text-gray-800">{cat.title}</h3>
              </div>
              <p className="text-sm text-gray-500 pl-12">{cat.subTitle}</p>
            </Link>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="bg-[#D98C00] hover:bg-[#A86500] rounded-full p-2"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Categories;
