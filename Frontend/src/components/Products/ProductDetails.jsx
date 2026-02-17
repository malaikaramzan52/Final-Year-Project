import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/styles.js";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage
} from "react-icons/ai";
import { productData } from "../../static/data"

const ProductDetails = ({ book }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  
  const handleMessageSubmit = () => {
    navigate("/messages"); 
  }

  return (
    <div className="bg-white flex-1">
      {
        book ? (
          <div className={`${styles.section} w-[90%] 800px:w-[80%] `}>
            <div className="w-full py-5">
              <div className="block w-full  800px:flex">
                <div className="w-full 800px:w-[50%]">
                  <img
                    src={book?.image_Url?.[0]?.url}
                    alt="Image"
                    className="h-[400px] w-full object-contain" />
                </div>
                {/* Right side  */}
                <div className="w-full 800px:w-[50%] pt-5">
                  <div className="w-full">
                    <h1 className={`${styles.productTitle}`}>{book.name}</h1>
                    <p>{book.description}</p>
                    <div className="flex pt-3">
                      <h4 className={`${styles.price}`}>Rs.{book.price}</h4>
                    </div>
                    <div className="flex items-center justify-between pt-5">

                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => count > 1 && setCount(count - 1)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
                        >
                          −
                        </button>

                        <span className="px-5 py-2 text-base font-medium">
                          {count}
                        </span>

                        <button
                          onClick={() => setCount(count + 1)}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
                        >
                          +
                        </button>
                      </div>

                      {/* Heart Icon */}
                      <div
                        className="cursor-pointer"
                        onClick={() => setClick(!click)}
                        title="Add to wishlist"
                      >
                        {click ? (
                          <AiFillHeart size={30} className="text-red-500" />
                        ) : (
                          <AiOutlineHeart size={30} className="text-gray-600 hover:text-red-500" />
                        )}
                      </div>

                    </div>
                    {/* Add to Cart Button */}
                    <div className="pt-6 flex items-center justify-between  gap-6">
                      {/* Add to Cart */}
                      <button
                        className="w-[140px] flex items-center justify-center gap-2
               bg-black text-white py-3 rounded-lg
               text-base font-semibold
               hover:bg-gray-900 transition duration-300"
                      >
                        <AiOutlineShoppingCart size={20} />
                        Add to Cart
                      </button>

                      {/* Exchangeable Button (Only if true) */}
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
                    {/* Handle Message */}
                    <div className="flex items-center justify-between">

                      {/* Left: Avatar + Shop Name */}
                      <div className="flex items-center">
                        <img
                          src={book?.shop?.shop_avatar?.url}
                          alt="Shop Avatar"
                          className="w-[80px] h-[80px] rounded-full object-cover"
                        />
                        <h3 className={styles.shop_name}>
                          {book?.shop?.name}
                        </h3>
                      </div>

                      {/* Right: Send Message Button */}
                      <div
                        className={`${styles.button} bg-blue-800 rounded-[4px] h-11`}
                        onClick={handleMessageSubmit}
                      >
                        <span className="text-white flex items-center justify-center h-full px-2 text-sm">
                          Send Message <AiOutlineMessage className="ml-2" size={16} />
                        </span>
                      </div>

                    </div>




                  </div>
                </div>
              </div>
            </div>
          </div>
    
        ) : null
      }
    </div >

  )
}


export default ProductDetails