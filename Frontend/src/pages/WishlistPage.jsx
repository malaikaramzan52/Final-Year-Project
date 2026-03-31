import { useWishlist } from "../context/WishlistContext";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, cart = [] } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    const isInCart = cart.some((c) => c.id === item.id);
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }
    addToCart(item);
    toast.success("Added to cart!");
  };

  const handleOpenExchange = (e) => {
    e.stopPropagation();
    navigate("/profile", { state: { activeTab: 4.1 } });
  };

  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          id: item.id || item._id,
          name: item.name || item.title,
          title: item.title || item.name,
          author: item.author,
          price: item.price,
          image: item?.image_Url?.[0]?.url || item?.image,
          image_Url: item.image_Url,
          quantity: 1,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-gray-500">Home / Wishlist</p>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
              <div className="text-6xl mb-4">&#128148;</div>
              <p className="text-lg text-gray-700 font-medium mb-2">
                Your wishlist is empty
              </p>
              <p className="text-gray-400 mb-6">Start adding products you love</p>
              <Link
                to="/browse"
                className="inline-block px-6 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="w-full bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col group border border-gray-100 will-change-auto"
                >
                  {/* Image Section */}
                  <div className="relative bg-[#D98C00]/15 rounded-t-2xl p-4 pb-2 overflow-hidden">
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item?.image_Url?.[0]?.url || item?.image || ""}
                        alt={item.name || item.title}
                        className="w-full h-52 object-contain transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      />
                    </Link>

                    {item.exchangeable && (
                      <button
                        type="button"
                        onClick={handleOpenExchange}
                        className="absolute bottom-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-full shadow-sm hover:bg-green-600 transition"
                      >
                        Exchangeable
                      </button>
                    )}
                  </div>

                  {/* Action Icons Strip */}
                  <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
                    <button
                      className="p-2 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Remove from Wishlist"
                    >
                      <AiFillHeart size={18} className="text-red-500" />
                    </button>

                    <div className="flex items-center gap-2">
                      <Link to={`/product/${item.id}`}>
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          title="Quick View"
                        >
                          <AiOutlineEye
                            size={18}
                            className="text-gray-400 hover:text-gray-700"
                          />
                        </button>
                      </Link>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Add to cart"
                        onClick={() => handleAddToCart(item)}
                      >
                        <AiOutlineShoppingCart
                          size={18}
                          className="text-gray-400 hover:text-gray-700"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Book Info Section */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                      {item.author}
                    </p>

                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-bold text-base text-gray-800 leading-snug hover:text-[#D98C00] transition-colors duration-200 line-clamp-2 mb-2">
                        {item.name || item.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-0.5 mb-3">
                      <AiFillStar className="text-amber-400" size={14} />
                      <AiFillStar className="text-amber-400" size={14} />
                      <AiFillStar className="text-amber-400" size={14} />
                      <AiFillStar className="text-amber-400" size={14} />
                      <AiFillStar className="text-gray-200" size={14} />
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                      <p className="text-[#D98C00] font-extrabold text-xl">
                        Rs. {item.price}
                      </p>
                      <button
                        onClick={() => handleBuyNow(item)}
                        className="px-5 py-2 text-sm font-bold text-white bg-[#D98C00] rounded-md hover:bg-[#A86500] transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
