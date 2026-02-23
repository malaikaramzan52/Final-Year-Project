import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineEye
} from "react-icons/ai";
import { Link } from "react-router-dom";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext.jsx";

const ProductCard = ({ book }) => {
  const [open, setOpen] = useState(false);

  // Wishlist context
  const { addToWishlist, removeFromWishlist, wishlist = [] } = useWishlist();
  const { addToCart, cart = [] } = useCart();

  // Check if book already wishlisted
  const isWishlisted = wishlist.some((item) => item.id === book.id);

  // Check if book already in cart
  const isInCart = cart.some((item) => item.id === book.id);

  const addToWishlistHandler = () => addToWishlist(book);
  const removeFromWishlistHandler = () => removeFromWishlist(book.id);
  const addToCartHandler = () => addToCart(book);

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col">

      {/* Image Section */}
      <div className="relative w-full h-56"> 
        <Link to={`/product/${book.id}`} className="block w-full h-full">
          <img
            src={book?.image_Url?.[0]?.url || "https://via.placeholder.com/150"}
            alt={book?.name || "Book"}
            className="w-full h-full object-contain"
          />
        </Link>

        {/* Overlay Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {/* Wishlist */}
          {isWishlisted ? (
            <div className="bg-black/50 rounded-full p-1">
              <AiFillHeart
                size={22}
                className="cursor-pointer text-red-500"
                onClick={removeFromWishlistHandler}
              />
            </div>
          ) : (
            <div className="bg-black/50 rounded-full p-1">
              <AiOutlineHeart
                size={22}
                className="cursor-pointer text-white hover:text-red-500"
                onClick={addToWishlistHandler}
                title="Add to Wishlist"
              />
            </div>
          )}

          {/* Quick View */}
          <div className="bg-black/50 rounded-full p-1">
            <AiOutlineEye
              size={22}
              className="cursor-pointer text-white hover:text-gray-300"
              onClick={() => setOpen(!open)}
              title="Quick View"
            />
          </div>

          {/* Add to Cart */}
          <div className="bg-black/50 rounded-full p-1">
            <AiOutlineShoppingCart
              size={25}
              className={`cursor-pointer ${isInCart ? "text-green-400" : "text-white"} hover:text-green-600`}
              onClick={addToCartHandler}
              title="Add to cart"
            />
          </div>
        </div>

        {open && <ProductDetailsCard setOpen={setOpen} book={book} />}
      </div>

      {/* Book Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg">{book.name}</h3>
        <p className="text-gray-500 text-sm mt-1">By {book.author}</p>

        <div className="flex items-center mt-1 text-yellow-500">
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1 text-gray-300" />
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-green-600 font-bold text-lg">Rs. {book.price}</p>

          {book.exchangeable && (
            <button
              type="button"
              className="px-3 py-1 font-semibold bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition duration-300"
            >
              Exchangeable
            </button>
          )}
        </div>

        <button
          className="flex items-center justify-center w-full mt-4 py-2 rounded-md 
            bg-[#D98C00] text-white font-semibold
            transition duration-300 ease-in-out"
          onClick={addToCartHandler}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;