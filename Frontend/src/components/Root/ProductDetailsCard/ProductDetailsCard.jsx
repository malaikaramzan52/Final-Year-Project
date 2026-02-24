import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles.js"
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineMessage,
    AiOutlineShoppingCart,
} from "react-icons/ai";


const ProductDetailsCard = ({ setOpen, book }) => {
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const addToWishlistHandler = () => setWishlisted(true);
    const removeFromWishlistHandler = () => setWishlisted(false);
    const addToCart = () => setAddedToCart(true);


    if (!book) return null;
    const handleMessageSubmit = () => {

    }


    return (
        <div className="fixed inset-0 bg-[#00000030] z-40 flex items-center justify-center">

            {/* Modal */}
            <div className="w-[90%] 800px:w-[60%] max-h-[80vh] bg-white rounded-lg shadow-lg relative overflow-hidden">

                {/* Close Button */}
                <RxCross1
                    size={30}
                    className="absolute right-4 top-4 z-50 cursor-pointer hover:rotate-90 transition-transform"
                    onClick={() => setOpen(false)}
                />

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[80vh]">

                    <div className="block w-full 800px:flex">

                        {/* Left-side - Image */}
                        <div className="w-full 800px:w-[45%] bg-gray-50 p-6">

                            {/* Book Image */}
                            <div className="h-[350px] flex items-center justify-center">
                                <img
                                    src={book?.image_Url?.[0]?.url}
                                    className="max-h-full max-w-full object-contain"
                                    alt={book?.name}
                                />
                            </div>
                        </div>

                        {/* Right-side - Product Details */}
                        <div className="w-full 800px:w-[55%] p-6 flex flex-col">
                            
                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                                {book?.name}
                            </h1>

                            {/* Author */}
                            <p className="text-gray-600 text-sm mb-4">
                                By {book?.author || "Unknown Author"}
                            </p>

                            {/* Description */}
                            <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                                {book?.description}
                            </p>

                            {/* Price */}
                            <div className="mb-4 pb-4 border-b">
                                <p className={`text-3xl font-bold text-[#D98C00]`}>
                                    Rs. {Number(book?.price).toLocaleString("en-PK")}
                                </p>
                            </div>

                            {/* Exchangeable Badge */}
                            {book?.exchangeable && (
                                <div className="mb-6">
                                    <span className="px-4 py-2 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full inline-block">
                                         Exchangeable
                                    </span>
                                </div>
                            )}

                            {/* Buttons Section */}
                            <div className="flex gap-3 mt-auto">
                                
                                {/* Add to Cart Button */}
                                <button className="flex-1 bg-[#D98C00] text-white font-semibold py-2.5 rounded-lg hover:bg-[#A86500] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                    <AiOutlineShoppingCart size={22} />
                                    Add to Cart
                                </button>

                                {/* Send Message Button */}
                                <button
                                    className="flex-1 bg-gray-800 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-900 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    onClick={handleMessageSubmit}
                                >
                                    <AiOutlineMessage size={22} />
                                    Message
                                </button>

                                {/* Wishlist Button */}
                                <button
                                    onClick={wishlisted ? removeFromWishlistHandler : addToWishlistHandler}
                                    className="px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-[#D98C00] transition-all flex items-center justify-center"
                                >
                                    {wishlisted ? (
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
    )
}
export default ProductDetailsCard;
