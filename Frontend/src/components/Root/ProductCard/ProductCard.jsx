import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const ProductCard = ({ book }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
  };

  const addToCart = () => {
    setAddedToCart(true);
  };

  // Generate star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) =>
          i < rating ? (
            <AiFillStar key={i} className="text-yellow-500 text-lg" />
          ) : (
            <AiOutlineStar key={i} className="text-yellow-500 text-lg" />
          )
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition">
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

      {/* Book Info */}
      <h3 className="font-semibold text-lg mt-2">{book.name}</h3>
      <p className="text-gray-500 text-sm">By {book.author}</p>

      {/* Ratings */}
      <div className="mt-2">{renderStars(Math.round(book.rating))}</div>

      {/* Price */}
      <div className="flex items-center gap-2 mt-2">
        <p className="text-green-600 font-bold text-lg">
          ${book.discount_price}
        </p>
        <p className="line-through text-gray-500">${book.price}</p>
      </div>

      {/* Exchangeable Badge */}
      {book.exchangeable && (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded mt-2 inline-block">
          Exchangeable
        </span>
      )}

      {/* Add to Cart */}
      <button
        onClick={addToCart}
        className="flex items-center gap-2 w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        <AiOutlineShoppingCart className="text-xl" />
        {addedToCart ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;