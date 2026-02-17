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
    <div className="w-full bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition flex flex-col">

      {/* Right Sidebar Icons */}
      <div className="absolute top-3 right-3 flex flex-col gap-3">

        {/* Wishlist */}
        {isWishlisted ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer text-red-500"
            onClick={removeFromWishlistHandler}
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer"
            onClick={addToWishlistHandler}
            title="Add to Wishlist"
          />
        )}

        {/* View */}
        <AiOutlineEye
          size={22}
          className="cursor-pointer text-gray-700 hover:text-black"
          onClick={() => setOpen(!open)}
          title="Quick View"
        />

        {/* Add to Cart Icon */}
        <AiOutlineShoppingCart
          size={25}
          className={`cursor-pointer hover:text-black ${isInCart ? "text-green-600" : "text-gray-700"}`}
          onClick={addToCartHandler}
          title="Add to cart"
        />

        {open && (
          <ProductDetailsCard setOpen={setOpen} book={book} />
        )}
      </div>

      {/* Book Image */}
      <Link to={`/product/${book.id}`}>
        <img
          src={book?.image_Url?.[0]?.url || "https://via.placeholder.com/150"}
          alt={book?.name || "Book"}
          className="w-full h-48 object-contain"
        />
      </Link>

      {/* Book Info */}
      <div>
        <h3 className="font-semibold text-lg mt-2">{book.name}</h3>
        <p className="text-gray-500 text-sm">By {book.author}</p>

        <div className="flex items-center mt-1 text-yellow-500">
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1" />
          <AiFillStar className="mr-1 text-gray-300" />
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-green-600 font-bold text-lg">
            Rs. {book.price}
          </p>

          {book.exchangeable && (
                        <button
                          type="button"
                          className="px-4 py-2 font-semibold
               bg-blue-100 text-blue-700 rounded
               hover:bg-blue-200 transition duration-300"
                          onClick={() => {
                            // your action here (optional)
                            console.log("Exchange policy clicked");
                          }}
                        >
                          Exchangeable
                        </button>
                      )}
        </div>
      </div>

      {/* Bottom Add to Cart Button */}
      <button
        onClick={addToCartHandler}
        className={`flex items-center justify-center w-full mt-auto py-2 rounded transition
          ${isInCart ? "bg-green-600 hover:bg-green-700 text-white" : "bg-black hover:bg-gray-800 text-white"}`}
      >
        <AiOutlineShoppingCart className="text-xl" />
        <span className="ml-2">
          {isInCart ? "Added to Cart" : "Add to Cart"}
        </span>
      </button>
    </div>
  );
};

export default ProductCard;
