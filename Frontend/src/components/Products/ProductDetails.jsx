import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from "../../styles/styles.js";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { server } from "../../server";

const ProductDetails = ({ book }) => {
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  const { addToCart, cart = [] } = useCart();

  const isInCart = book && cart.some((item) => item.id === book.id || item.id === book._id);


  const handleOpenExchange = () => {
    navigate("/profile", { state: { activeTab: 4.1 } });
  };

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }
    addToCart(book);
    toast.success("Added to cart!");
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
    <div className="bg-white flex-1">
      {book ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] `}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={book?.image_Url?.[0]?.url}
                  alt="Image"
                  className="h-[400px] w-full object-contain"
                />
              </div>
              {/* Right side */}
              <div className="w-full 800px:w-[50%] pt-5 800px:pl-8">
                <div className="w-full">
                  <h1 className={`${styles.productTitle} mb-4`}>{book.name}</h1>

                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{book.description}</p>

                  {/* Price and Wishlist */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
                    <h4 className={`${styles.price} text-3xl font-bold text-[#D98C00]`}>Rs.{book.price}</h4>
                    <button
                      className="p-3 rounded-full border-2 border-[#D98C00] hover:bg-red-50 transition duration-300 transform hover:scale-110"
                      onClick={() => setClick(!click)}
                      title="Add to wishlist"
                    >
                      {click ? (
                        <AiFillHeart size={28} className="text-red-500" />
                      ) : (
                        <AiOutlineHeart size={28} className="text-gray-600 hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 items-center mb-8">
                    {book.exchangeable && (
                      <button
                        type="button"
                        onClick={handleOpenExchange}
                        className="px-4 py-3 font-semibold bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-300"
                      >
                        Exchangeable
                      </button>
                    )}


                    <button
                      className={`flex items-center justify-center gap-2 py-3 px-5 rounded-md text-sm font-semibold border-2 shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 active:scale-95 ${
                        isInCart
                          ? "bg-green-50 text-green-700 border-green-400"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#D98C00]"
                      }`}
                      onClick={handleAddToCart}
                    >
                      <AiOutlineShoppingCart size={20} />
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </button>

                    <button
                      className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#D98C00] to-[#f39c12] text-white py-3 px-6 rounded-md text-base font-bold shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 active:scale-95"
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo book={book} />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ book }) => {
  const [active, setActive] = useState(1);

  const seller = book?.shop;

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      {/* Tabs */}
      <div className="w-full flex gap-8 border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Book Details
          </h5>
          {active === 1 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Seller Information
          </h5>
          {active === 2 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
      </div>

      {/* Book Details Tab */}
      {active === 1 && (
        <p className="py-2 text-[18px] leading-8 pb-4 whitespace-pre-line">
          {book.description}
        </p>
      )}

      {/* Seller Information Tab */}
      {active === 2 && (
        <div className="w-full py-8 px-2">
          <div className="flex flex-col 800px:flex-row items-start 800px:items-center justify-between gap-6">
            {/* Avatar + Name + Email */}
            <div className="flex items-center gap-5">
              <img
                src={
                  seller?.shop_avatar?.url
                    ? seller.shop_avatar.url.startsWith("http")
                      ? seller.shop_avatar.url
                      : `${(server || "").replace(/\/$/, "")}${seller.shop_avatar.url}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(seller?.name || "Seller")}&background=D98C00&color=fff&size=80`
                }
                alt="Uploader Avatar"
                className="w-[80px] h-[80px] rounded-full object-cover border-[3px] border-[#D98C00] shadow-md"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller?.name || "Seller")}&background=D98C00&color=fff&size=80`;
                }}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {seller?.name || "Anonymous Seller"}
                </h3>
                {seller?.email && (
                  <p className="text-gray-500 text-sm mt-1">{seller.email}</p>
                )}
                <span className="inline-block mt-2 px-3 py-0.5 bg-[#D98C00]/10 text-[#D98C00] text-xs font-semibold rounded-full border border-[#D98C00]/30">
                  Book Seller
                </span>
              </div>
            </div>

            {/* Joined Date */}
            <div className="text-right">
              {seller?.createdAt && (
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Member since: </span>
                  {new Date(seller.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
