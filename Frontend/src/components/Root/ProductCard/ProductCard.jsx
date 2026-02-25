import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineEye
} from "react-icons/ai";
import { Link } from "react-router-dom"
import styles from "../../../styles/styles.js";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext.jsx";


const ProductCard = ({ book }) => {
  const [open, setOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Wishlist context
  const { addToWishlist, removeFromWishlist, wishlist = [] } = useWishlist();
  const { addToCart, cart = [] } = useCart();

  // Check if book already wishlisted
  const isWishlisted = wishlist.some((item) => item.id === book.id);

  // Check if book already in cart
  const isInCart = cart.some((item) => item.id === book.id);

  const addToWishlistHandler = () => {
    addToWishlist(book);
  };

  const removeFromWishlistHandler = () => {
    removeFromWishlist(book.id);
  };

  const addToCartHandler = () => {
    addToCart(book); // Context function increases quantity automatically
    setAddedToCart(true); // For UI feedback
  };

  return (
    <div className="w-full bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col group border border-gray-100 will-change-auto">

      {/* Image Section */}
      <div className="relative bg-[#D98C00]/15 rounded-t-2xl p-4 pb-2 overflow-hidden">

        {/* Book Image */}
        <Link to={`/product/${book.id}`}>
          <img
            src={book?.image_Url?.[0]?.url || "https://via.placeholder.com/150"}
            alt={book?.name || "Book"}
            className="w-full h-52 object-contain transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </Link>

        {/* Exchangeable Tag */}
        {book.exchangeable && (
          <span className="absolute bottom-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-full shadow-sm">
            Exchangeable
          </span>
        )}
      </div>

      {/* Action Icons Strip - sits between image and info, no absolute positioning */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        {/* Wishlist */}
        <div>
          {isWishlisted ? (
            <button
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors duration-200"
              onClick={removeFromWishlistHandler}
              title="Remove from Wishlist"
            >
              <AiFillHeart size={18} className="text-red-500" />
            </button>
          ) : (
            <button
              className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
              onClick={addToWishlistHandler}
              title="Add to Wishlist"
            >
              <AiOutlineHeart size={18} className="text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>

        {/* Quick View & Cart */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setOpen(!open)}
            title="Quick View"
          >
            <AiOutlineEye size={18} className="text-gray-400 hover:text-gray-700" />
          </button>
          <button
            className={`p-2 rounded-full transition-colors duration-200 ${isInCart ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-100"}`}
            onClick={addToCartHandler}
            title="Add to cart"
          >
            <AiOutlineShoppingCart size={18} className={isInCart ? "text-green-600" : "text-gray-400 hover:text-gray-700"} />
          </button>
        </div>
      </div>

      {open && (
        <ProductDetailsCard setOpen={setOpen} book={book} />
      )}

      {/* Book Info Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Author */}
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
          {book.author}
        </p>

        {/* Title */}
        <Link to={`/product/${book.id}`}>
          <h3 className="font-bold text-base text-gray-800 leading-snug hover:text-[#D98C00] transition-colors duration-200 line-clamp-2 mb-2">
            {book.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mb-3">
          <AiFillStar className="text-amber-400" size={14} />
          <AiFillStar className="text-amber-400" size={14} />
          <AiFillStar className="text-amber-400" size={14} />
          <AiFillStar className="text-amber-400" size={14} />
          <AiFillStar className="text-gray-200" size={14} />
          <span className="text-xs text-gray-400 ml-1">(4.0)</span>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Price & Buy Button Row */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
          <p className="text-[#D98C00] font-extrabold text-xl">
            Rs. {book.price}
          </p>
          <Link to={`/product/${book.id}`}>
            <button className="px-5 py-2 text-sm font-bold text-white bg-[#D98C00] rounded-full hover:bg-[#A86500] transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
              Buy Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;