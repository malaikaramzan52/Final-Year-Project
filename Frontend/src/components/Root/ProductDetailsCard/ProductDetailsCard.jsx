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
            <div className="w-[90%] 800px:w-[60%] max-h-[70vh] bg-white rounded-md shadow-sm relative">

                {/* Close Button */}
                <RxCross1
                    size={30}
                    className="absolute right-3 top-3 z-50 cursor-pointer"
                    onClick={() => setOpen(false)}
                />

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[70vh] p-4">

                    <div className="block w-full 800px:flex gap-4">

                        {/* Left-side */}
                        <div className="w-full 800px:w-[50%]">

                            {/* Book Image */}
                            <div className="h-[300px] flex items-center justify-center">
                                <img
                                    src={book?.image_Url?.[0]?.url}
                                    className="max-h-full object-contain"
                                    alt={book?.name}
                                />
                            </div>

                            {/* Shop Avatar */}
                            <div className="flex items-center mt-4">
                                <img
                                    src={book?.shop?.shop_avatar?.url}
                                    alt="Shop Avatar"
                                    className="w-[80px] h-[80px] rounded-full mr-3"
                                />
                                <h3 className={styles.shop_name}>
                                    {book?.shop?.name}
                                </h3>
                            </div>

                            {/* Send Message */}
                            <div
                                className={`${styles.button} bg-black rounded-[4px] h-11 mt-4`}
                                onClick={handleMessageSubmit}
                            >
                                <span className="text-white flex items-center justify-center h-full">
                                    Send Message <AiOutlineMessage className="ml-2" />
                                </span>
                            </div>
                        </div>

                        {/* Right-side */}
                        <div className="w-full 800px:w-[50%]">
                            <h1 className={`${styles.productTitle} text-[20px]`}>
                                {book?.name}
                            </h1>

                            <p className="mt-2 text-gray-600">
                                {book?.description}
                            </p>

                            {/* Price */}
                            <div className="pt-3">
                                <h4 className={`${styles.productprice} text-2xl font-bold text-green-600`}>
                                    Rs. {Number(book?.price).toLocaleString("en-PK")}
                                </h4>
                            </div>

                            {/* Exchangeable + Cart + Wishlist */}
                            <div className="flex items-center mt-6">
                                {book.exchangeable && (
                                    <span className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded">
                                        Exchangeable
                                    </span>
                                )}

                                <div className="ml-auto">
                                    {wishlisted ? (
                                        <AiFillHeart
                                            size={30}
                                            className="cursor-pointer text-red-500"
                                            onClick={removeFromWishlistHandler}
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            size={30}
                                            className="cursor-pointer"
                                            onClick={addToWishlistHandler}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Add to Cart */}
                            <div className={`${styles.button} bg-black rounded-[4px] h-11 px-4 w-full mt-6`}>
                                <span className="text-white flex items-center justify-center h-full">
                                    Add to Cart <AiOutlineShoppingCart size={22} className="ml-2" />
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductDetailsCard;
