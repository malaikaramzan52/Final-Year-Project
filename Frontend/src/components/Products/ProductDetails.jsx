import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../styles/styles.js";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage
} from "react-icons/ai";
import { productData } from "../../static/data";
import { Link } from "react-router-dom";

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
               bg-[#D98C00] text-white py-3 rounded-full px-2
               text-base font-semibold
               hover:bg-[#A86500] transition duration-300"
                      >
                        <AiOutlineShoppingCart size={20} />
                        Add to Cart
                      </button>

                      {/* Exchangeable Button (Only if true) */}
                      {book.exchangeable && (
                        <button
                          type="button"
                          className="px-4 py-2 font-semibold
               bg-blue-100 text-blue-700 rounded-full
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


                      {/* Right: Send Message Button */}
                      <div
                        className={`${styles.button} bg-[#D98C00] hover:bg-[#A86500] rounded-[4px] h-11`}
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
            <ProductDetailsInfo book={book} />
          </div>

        ) : null
      }
    </div >


  )
}
const ProductDetailsInfo = ({ book }) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        {/* Book Details */}
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Book Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        {/* Book Reviews */}
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Book Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        {/* Seller Information */}
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line  ">
            {book.description}
          </p>
        </>
      ) : null}
      {active === 2 ? (
        <>
          <div className="w-full justify-center min-h-[40vh]  items-center py-3 ">
            <p>No Review Yet!</p>
          </div>
        </>
      ) : null}

      {active === 3 && (
        <div className="w-full flex items-center justify-between p-5">
          {/* Left side: Avatar + Shop Name */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <img
              src={book?.shop?.shop_avatar?.url}
              alt="Shop Avatar"
              className="w-[80px] h-[80px] rounded-full object-cover mt-1 mb-1"
            />

            {/* Shop name + description */}
            <div>
              <h3 className={styles.shop_name} >
                {book?.shop?.name}
              </h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br />
                In quis mollitia architecto accusamus optio beatae minima. <br />
                Odit dolore inventore delectus?</p>
            </div>
          </div>


          {/* Right side: Joined Date */}
          <div className="text-right">
            <h5 className="font-[600]">
              Joined on: <span className="font-[500]">24 March, 2023</span>
            </h5>
            <h5 className="font-[600] pt-3">
              Total Books: <span className="font-[500]">1,223</span>
            </h5>
            <h5 className="font-[600] pt-3">
              Total Reviews: <span className="font-[500]">324</span>
            </h5>
            <Link to="/">
              <div className={`${styles.button} rounded-[4px] h-[39.5px] mt-3 ml-14`}>
                <h4 className="text-white">Visit Profile</h4>
              </div>
            </Link>
          </div>
        </div>


      )}

    </div>

  )
}


export default ProductDetails;