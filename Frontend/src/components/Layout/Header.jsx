import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles.js";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import RebookLogo from "../../Assets/Logo/Rebok_logo.png";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext.jsx";
import { useSelector } from "react-redux";
import api from "../../api/axios";

import {
  AiOutlineSearch,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [categories, setCategories] = useState([]);
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/v2/category/all");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Search books via API with debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchData([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/v2/book/search?q=${encodeURIComponent(searchTerm)}`);
        setSearchData(res.data.books || []);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle scroll to toggle active class
  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header Top */}
      <div className={`${styles.section} px-4 md:px-8`}>
        <div className="hidden md:flex md:h-[50px] md:my-[20px] items-center justify-between">
          {/* Logo */}
          <div className="mr-6">
            <Link to="/">
              <img
                src={RebookLogo}
                alt="Rebook Logo"
                className="w-[240px] h-auto"
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="flex-1 mx-4 relative">
            <input
              type="text"
              placeholder="Search for book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[40px] w-full px-3 border-[#D98C00] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {/* Search Results Dropdown */}
            {searchData && searchData.length !== 0 && (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm z-[9] p-4 w-full">
                {searchData.map((item, index) => (
                  <Link key={item._id || index} to={`/product/${item._id}`}>
                    <div className="w-full flex items-start py-3">
                      <img
                        src={item.image || ""}
                        alt={item.title}
                        className="w-[40px] h-[40px] mr-[10px] object-contain"
                      />
                      <h1>{item.title}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sell Books Button */}
          <div className={`${styles.button} rounded-md bg-[#D98C00] ml-4`}>
            <Link to={isAuthenticated ? "/profile" : "/login"} state={{ activeTab: 2 }}>
              <h1 className="text-[#fff] flex items-center">
                Sell Books
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-[#D98C00] h-[70px] px-4 md:px-8`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* Category Menu */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="mr-4">
              <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md">
                  All Categories
                </button>
                <IoIosArrowDown
                  size={20}
                  className="absolute right-2 top-4 cursor-pointer"
                  onClick={() => setDropDown(!dropDown)}
                />
                {dropDown && (
                  <DropDown
                    categoriesData={categories}
                    setDropDown={setDropDown}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Navbar */}
          <div className="flex-1">
            <Navbar active={activeHeading} />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Icon */}
            <Link to="/wishlist">
              <div className="relative cursor-pointer">
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute -top-1 -right-1 rounded-full bg-black w-4 h-4 flex items-center justify-center text-white text-[10px] font-mono">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </Link>

            {/* Cart */}
            <div className="relative">
              <Link to="/cart">
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute -top-1 -right-1 rounded-full bg-black w-4 h-4 flex items-center justify-center text-white text-[10px] font-mono">
                  {cart?.length || 0}
                </span>
              </Link>
            </div>

            {/* Profile */}
            <div className="relative">
              <Link to={isAuthenticated ? "/profile" : "/login"}>
                {isAuthenticated && user?.avatar ? (
                  <img
                    src={`${(server || "http://localhost:5000").replace(
                      /\/$/,
                      ""
                    )}${
                      user.avatar.startsWith("/")
                        ? user.avatar
                        : `/${user.avatar}`
                    }`}
                    alt="Profile"
                    className="w-[45px] h-[45px] rounded-full border-[3px] border-[#0eae88] object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                      )}&background=0eae88&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
