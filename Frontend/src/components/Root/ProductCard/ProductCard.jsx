import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineEye
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../../styles/styles.js";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext.jsx";

const ProductCard = ({ book }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { addToWishlist, removeFromWishlist, wishlist = [] } = useWishlist();
  const { addToCart, cart = [] } = useCart();

  const isWishlisted = wishlist.some((item) => item.id === book.id);
  const isInCart = cart.some((item) => item.id === book.id);

  const addToWishlistHandler = () => {
    addToWishlist(book);
  };

  const removeFromWishlistHandler = () => {
    removeFromWishlist(book.id);
  };

  const addToCartHandler = () => {
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }
    addToCart(book);
    toast.success("Added to cart!");
  };

  const handleExchangeNav = (e) => {
    e.stopPropagation();
    navigate(`/exchange/${book.id || book._id}`);
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          id: book.id || book._id,
          name: book.name || book.title,
          title: book.title || book.name,
          author: book.author,
          price: book.price,
          image: book?.image_Url?.[0]?.url || book?.image,
          image_Url: book.image_Url,
          quantity: 1,
        },
      },
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col group border border-gray-100 will-change-auto">

      {/* Image Section */}
      <div className="relative bg-[#D98C00]/15 rounded-t-2xl p-4 pb-2 overflow-hidden">
        <Link to={`/product/${book.id}`}>
          <img
            src={book?.image_Url?.[0]?.url || "https://via.placeholder.com/150"}
            alt={book?.name || "Book"}
            className="w-full h-52 object-contain transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </Link>

        {/* Status Badge - top right */}
        {book.status && (
          <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm
            ${book.status === "Available"    ? "bg-green-100 text-green-700 border border-green-300" :
              book.status === "Sold"         ? "bg-blue-100 text-blue-700 border border-blue-300" :
              book.status === "Reserved"     ? "bg-purple-100 text-purple-700 border border-purple-300" :
              book.status === "Exchanged"    ? "bg-indigo-100 text-indigo-700 border border-indigo-300" :
              book.status === "Under_Review" ? "bg-yellow-100 text-yellow-700 border border-yellow-300" :
              "bg-gray-100 text-gray-600 border border-gray-300"
            }`}
          >
            {book.status.replace("_", " ")}
          </span>
        )}

        {book.exchangeable && (
          <button
            type="button"
            onClick={handleExchangeNav}
            className="absolute bottom-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-full shadow-sm hover:bg-green-600 transition"
          >
            Exchangeable
          </button>
        )}
      </div>

      {/* Action Icons Strip */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div>
          {isWishlisted ? (
            <button
              className="p-2 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
              onClick={removeFromWishlistHandler}
              title="Remove from Wishlist"
            >
              <AiFillHeart size={18} className="text-red-500" />
            </button>
          ) : (
            <button
              className="p-2 rounded-md hover:bg-red-50 transition-colors duration-200"
              onClick={addToWishlistHandler}
              title="Add to Wishlist"
            >
              <AiOutlineHeart size={18} className="text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>

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
            title={isInCart ? "Already in cart" : "Add to cart"}
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
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
          {book.author}
        </p>

        <Link to={`/product/${book.id}`}>
          <h3 className="font-bold text-base text-gray-800 leading-snug hover:text-[#D98C00] transition-colors duration-200 line-clamp-2 mb-1">
            {book.name}
          </h3>
        </Link>

        {book.condition && (
          <div className="mb-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
              Condition: {book.condition}
            </span>
          </div>
        )}

        <div className="flex-1"></div>

        {/* Price & Buy Button Row */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
          <p className="text-[#D98C00] font-extrabold text-xl">
            Rs. {book.price}
          </p>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2 text-sm font-bold text-white bg-[#D98C00] rounded-md hover:bg-[#A86500] transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
