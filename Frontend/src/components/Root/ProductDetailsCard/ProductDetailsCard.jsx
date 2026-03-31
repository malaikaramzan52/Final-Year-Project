import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useCart } from "../../../context/CartContext.jsx";
import { useWishlist } from "../../../context/WishlistContext";

const ProductDetailsCard = ({ setOpen, book }) => {
  const navigate = useNavigate();
  const { addToCart, cart = [] } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist = [] } = useWishlist();

  const isInCart = book && cart.some((item) => item.id === book.id || item.id === book._id);
  const isWishlisted = book && wishlist.some((item) => item.id === book.id || item.id === book._id);

  if (!book) return null;

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }
    addToCart(book);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    setOpen(false);
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

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(book.id || book._id);
    } else {
      addToWishlist(book);
    }
  };

  const handleExchangeNav = () => {
    setOpen(false);
    navigate("/profile", { state: { activeTab: 4.1 } });
  };

  return (
    <div className="fixed inset-0 bg-[#00000030] z-40 flex items-center justify-center">
      <div className="w-[90%] 800px:w-[60%] max-h-[80vh] bg-white rounded-lg shadow-lg relative overflow-hidden">
        <RxCross1
          size={30}
          className="absolute right-4 top-4 z-50 cursor-pointer hover:rotate-90 transition-transform"
          onClick={() => setOpen(false)}
        />

        <div className="overflow-y-auto max-h-[80vh]">
          <div className="block w-full 800px:flex">
            {/* Left - Image */}
            <div className="w-full 800px:w-[45%] bg-gray-50 p-6">
              <div className="h-[350px] flex items-center justify-center">
                <img
                  src={book?.image_Url?.[0]?.url}
                  className="max-h-full max-w-full object-contain"
                  alt={book?.name}
                />
              </div>
            </div>

            {/* Right - Details */}
            <div className="w-full 800px:w-[55%] p-6 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                {book?.name}
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                By {book?.author || "Unknown Author"}
              </p>
              <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                {book?.description}
              </p>

              <div className="mb-4 pb-4 border-b">
                <p className="text-3xl font-bold text-[#D98C00]">
                  Rs. {Number(book?.price).toLocaleString("en-PK")}
                </p>
              </div>

              {book?.exchangeable && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleExchangeNav}
                    className="px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full inline-flex items-center gap-2 hover:bg-blue-200 transition"
                  >
                    Exchangeable
                  </button>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 font-semibold py-2.5 rounded-lg active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                    isInCart
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#D98C00]"
                  }`}
                >
                  <AiOutlineShoppingCart size={22} />
                  {isInCart ? "In Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#D98C00] text-white font-semibold py-2.5 rounded-lg hover:bg-[#A86500] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-[#D98C00] transition-all flex items-center justify-center"
                >
                  {isWishlisted ? (
                    <AiFillHeart size={24} className="text-red-500" />
                  ) : (
                    <AiOutlineHeart size={24} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
