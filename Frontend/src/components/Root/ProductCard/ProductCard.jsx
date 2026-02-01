import React, { useState } from "react";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineEye
} from "react-icons/ai";
import styles from "../../../styles/styles.js"
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx"

const ProductCard = ({ book }) => {
  const [open, setOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToWishlistHandler = () => setWishlisted(true);
  const removeFromWishlistHandler = () => setWishlisted(false);
  const addToCart = () => setAddedToCart(true);

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 relative hover:shadow-lg transition flex flex-col">

      {/* Right Sidebar Icons */}
      <div className="absolute top-3 right-3 flex flex-col gap-3">

        {/* Wishlist */}
        {wishlisted ? (
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
          className="cursor-pointer text-gray-700 hover:text-black"
          onClick={addToCart}
          title="Add to cart"
        />
        {
          open ? (
            <ProductDetailsCard setOpen={setOpen} book={book}/>
          ):null
        }
      </div>

      {/* Book Image */}
      <img
        src={book?.image_Url?.[0]?.url || "https://via.placeholder.com/150"}
        alt={book?.name || "Book"}
        className="w-full h-48 object-contain"
      />

      {/* Book Info */}
      <div>
        <h3 className="font-semibold text-lg mt-2">{book.name}</h3>
        <p className="text-gray-500 text-sm">By {book.author}</p>

        {/* Rating */}
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
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              Exchangeable
            </span>
          )}
        </div>
      </div>

      {/* Bottom Add to Cart Button */}
      <button
        onClick={addToCart}
        className="flex items-center justify-center w-full mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        <AiOutlineShoppingCart className="text-xl" />
        <span className="ml-2">
          {addedToCart ? "Added!" : "Add to Cart"}
        </span>
      </button>
    </div>
  );
};

export default ProductCard;
