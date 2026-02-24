// Allah
import { useWishlist } from "../context/WishlistContext";
import { AiFillHeart, AiFillStar } from "react-icons/ai";

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-[#f5f7fa] py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Page Heading */}
                <div className="flex flex-col items-center justify-center gap-2 mb-8 p-4 bg-gray-50 rounded-lg shadow-md">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                            My Wishlist
                        </h1>
                    </div>
                    <p className="text-gray-700 text-center text-sm max-w-md">
                        Here you can keep all your favorite products in one place. Add items to your wishlist and come back later to purchase them easily.
                    </p>
                </div>

                {/* Empty Wishlist */}
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-24 text-center">
                        <div className="text-6xl mb-4">💔</div>
                        <p className="text-gray-600 text-lg font-medium">
                            Your wishlist is empty
                        </p>
                        <p className="text-gray-400 mt-1">
                            Start adding products you love
                        </p>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="
                                    bg-white 
                                    rounded-xl 
                                    shadow-sm 
                                    hover:shadow-lg 
                                    transition 
                                    p-4 
                                    flex 
                                    flex-col
                                "
                            >
                                {/* Product Image */}
                                <img
                                    src={item?.image_Url?.[0]?.url}
                                    alt={item.name}
                                    className="h-44 w-full object-contain mb-3"
                                />

                                {/* Product Info */}
                                <div className="flex flex-col flex-1">
                                    <h3 className="font-semibold text-lg mt-2">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">By {item.author}</p>

                                    <div className="flex items-center mt-1 text-yellow-500">
                                        <AiFillStar className="mr-1" />
                                        <AiFillStar className="mr-1" />
                                        <AiFillStar className="mr-1" />
                                        <AiFillStar className="mr-1" />
                                        <AiFillStar className="mr-1 text-gray-300" />
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-green-600 font-bold text-lg">
                                            Rs. {item.price}
                                        </p>

                                        {item.exchangeable && (
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                                Exchangeable
                                            </span>
                                        )}
                                    </div>

                                    {/* Spacer to push buttons to bottom */}
                                    <div className="flex-1"></div>

                                    {/* Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                        {/* Buy Now Button */}
                                        <button
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#D98C00] rounded-lg hover:bg-[#A86500] transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                                        >
                                            Buy Now
                                        </button>

                                        {/* Remove Button (small) */}
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="px-3 py-2 text-xs font-medium text-white  rounded-lg bg-gray-800 hover:bg-gray-900 transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
