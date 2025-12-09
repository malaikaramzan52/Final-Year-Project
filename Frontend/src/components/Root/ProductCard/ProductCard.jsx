import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";

const ProductCard = ({ book }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
  };

  const addToCart = () => {
    setAddedToCart(true);
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition flex flex-col">

      {/* Wishlist Icon */}
      <div
        className="absolute right-4 top-4 cursor-pointer"
        onClick={toggleWishlist}
      >
        {wishlisted ? (
          <AiFillHeart className="text-red-500 text-2xl" />
        ) : (
          <AiOutlineHeart className="text-gray-700 text-2xl" />
        )}
      </div>

      {/* Book Image */}
      <img
        src={book?.image_Url?.[0]?.url || "https://via.placeholder.com/150"}
        alt={book?.name || "Book"}
        className="w-full h-48 object-contain"
      />

      {/* Book Info Section */}
      <div>
        <h3 className="font-semibold text-lg mt-2">{book.name}</h3>
        <p className="text-gray-500 text-sm">By {book.author}</p>

        {/* Price + Exchangeable (side by side) */}
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <p className="text-green-600 font-bold text-lg">
            Rs. {book.price}
          </p>

          {/* Exchangeable Badge */}
          {book.exchangeable && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              Exchangeable
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart (fixed at bottom) */}
      <button
        onClick={addToCart}
        className="flex items-center justify-center w-full mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        <AiOutlineShoppingCart className="text-xl" />
        <span className="ml-2">{addedToCart ? "Added!" : "Add to Cart"}</span>
      </button>

    </div>
  );
};

export default ProductCard;
