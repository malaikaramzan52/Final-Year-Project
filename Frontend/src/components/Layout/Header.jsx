import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles.js";
import { productData, categoriesData } from "../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import RebookLogo from "../../Assets/Logo/Rebok_logo.png";
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      productData &&
      productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

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
                className="w-[240px] h-auto" // adjust width as needed
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="flex-1 mx-4 relative">
            <input
              type="text"
              placeholder="Search for product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-3 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {/* Search Results Dropdown */}
            {searchData && searchData.length !== 0 && (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm z-[9] p-4 w-full">
                {searchData.map((item, index) => {
                  const Product_name = item.name.replace(/\s+/g, "-");
                  return (
                    <Link key={index} to={`/product/${Product_name}`}>
                      <div className="w-full flex items-start py-3">
                        <img
                          src={item.image_Url[0].url}
                          alt={item.name}
                          className="w-[40px] h-[40px] mr-[10px]"
                        />
                        <h1>{item.name}</h1>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Become Seller Button */}
          <div className={`${styles.button} ml-4`}>
            <Link to="/login">
              <h1 className="text-[#fff] flex items-center">
                Become Seller
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
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px] px-4 md:px-8`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* Category Menu */}
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
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              )}
            </div>
          </div>

          {/* Navbar */}
          <div className="flex-1">
            <Navbar active={activeHeading} />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist Icon */}
            <div className="relative">
              <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute -top-1 -right-1 rounded-full bg-[#3bc177] w-4 h-4 flex items-center justify-center text-white text-[10px] font-mono">
                {/* {wishlist && wishlist.length} */}
              </span>
            </div>
            {/* Add to cart */}
            <div className="relative">
              <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute -top-1 -right-1 rounded-full bg-[#3bc177] w-4 h-4 flex items-center justify-center text-white text-[10px] font-mono">
                {/* {cart && cart.length} */}
              </span>
            </div>
            {/* Profile */}
            <div className="relative">
              <Link to="/login">
                <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
