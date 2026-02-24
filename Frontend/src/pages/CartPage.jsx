
import { useCart } from "../context/CartContext";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";

const CartPage = () => {
    const {
        cart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    return (
        <div className="min-h-screen bg-[#f5f7fa] py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Page Heading */}
                <div className="flex flex-col items-center justify-center gap-2 mb-8 p-4 bg-gray-50 rounded-lg shadow-md">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                            My Cart
                        </h1>
                        <AiOutlineShoppingCart className="text-green-600 text-3xl" />
                    </div>
                    <p className="text-gray-700 text-center text-sm max-w-md">
                        Review your selected items, adjust quantities, and proceed to checkout.
                    </p>
                </div>

                {/* Empty Cart */}
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-24 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-gray-600 text-lg font-medium">
                            Your cart is empty
                        </p>
                        <p className="text-gray-400 mt-1">
                            Add some products to get started
                        </p>
                    </div>
                ) : (
                    /* Cart Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 flex flex-col"
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
                                            <span className="relative -top-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                Exchangeable
                                            </span>
                                        )}
                                    </div>

                                    {/* Spacer */}
                                    <div className="flex-1"></div>

                                    {/* Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                        <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#D98C00] rounded-lg hover:bg-[#A86500] transition shadow-sm">
                                            Buy Now
                                        </button>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="px-3 py-2 text-xs font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition shadow-sm"
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

export default CartPage;
