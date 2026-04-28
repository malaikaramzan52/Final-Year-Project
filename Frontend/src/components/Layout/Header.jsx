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

  const [open, setOpen] = useState(false);

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
      {/* ── DESKTOP HEADER ── */}
      <div className={`${styles.section} px-4 md:px-8`}>
        <div className="hidden 800px:flex h-[90px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center pt-8">
            <Link to="/">
              <img
                src={RebookLogo}
                alt="Rebook Logo"
                className="w-[180px] h-auto object-contain"
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

      {/* ── DESKTOP STICKY NAVBAR ── */}
      <div
        className={`${active ? "shadow-sm fixed top-0 left-0 z-10" : ""
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
                    )}${user.avatar.startsWith("/")
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

      {/* ── MOBILE HEADER ── */}
      <div
        className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : ""
          } w-full h-[80px] bg-[#fff] z-50 top-0 left-0 800px:hidden flex items-center justify-between px-4`}
      >
        <div className="flex-1">
          <BiMenuAltLeft
            size={40}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="flex-1 flex justify-center items-center pt-6">
          <Link to="/">
            <img
              src={RebookLogo}
              alt="Logo"
              className="cursor-pointer w-[120px] h-auto object-contain"
            />
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <div className="relative mr-4">
            <Link to="/cart">
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-[-10px] top-[-5px] rounded-full bg-[#D98C00] w-4 h-4 flex items-center justify-center text-white text-[10px] font-mono">
                {cart?.length || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
          <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
            <div className="w-full flex justify-between pr-3 pt-3">
              <div>
                <div className="relative mr-[15px]">
                  <Link to="/wishlist">
                    <AiOutlineHeart size={30} className="ml-4" />
                    <span className="absolute right-[-10px] top-[-5px] rounded-full bg-[#D98C00] w-4 h-4 flex items-center justify-center text-white text-[10px] font-mono">
                      {wishlist && wishlist.length}
                    </span>
                  </Link>
                </div>
              </div>
              <AiOutlineSearch
                size={30}
                className="ml-4 mt-5 cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="my-8 w-[92%] m-auto h-[40px] relative">
              <input
                type="search"
                placeholder="Search Product..."
                className="h-[40px] w-full px-2 border-[#D98C00] border-[2px] rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchData && searchData.length !== 0 && (
                <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                  {searchData.map((i) => (
                    <Link to={`/product/${i._id}`}>
                      <div className="flex items-center py-2">
                        <img
                          src={i.image}
                          alt=""
                          className="w-[40px] mr-2"
                        />
                        <h5>{i.title}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Navbar active={activeHeading} />
            <div className={`${styles.button} ml-4 !rounded-[4px] bg-[#D98C00]`}>
              <Link to="/become-seller">
                <h1 className="text-[#fff] flex items-center">
                  Sell Books <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>
            <br />
            <br />
            <br />

            <div className="flex w-full justify-center">
              {isAuthenticated ? (
                <div>
                  <Link to="/profile">
                    <img
                      src={`${(server || "http://localhost:5000").replace(
                        /\/$/,
                        ""
                      )}${user.avatar.startsWith("/")
                          ? user.avatar
                          : `/${user.avatar}`
                        }`}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                    />
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[18px] pr-[10px] text-[#000000b7]"
                  >
                    Login /
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-[18px] text-[#000000b7]"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
