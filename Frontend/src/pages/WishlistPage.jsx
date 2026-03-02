// Allah
import { useWishlist } from "../context/WishlistContext";
import { AiFillHeart, AiOutlineHeart, AiFillStar, AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import RebookLogo from "../Assets/Logo/white.png";
import { navItems } from "../static/data";
import Footer from "../components/Layout/Footer";

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            {/* Header with Logo and Navigation */}
            <header className="bg-[#D98C00] shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        {/* Logo on Left */}
                        <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity duration-200">
                            <img
                                src={RebookLogo}
                                alt="Rebook Logo"
                                className="h-12 w-auto"
                            />
                        </Link>

                        {/* Nav Items at Center */}
                        <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.url}
                                    className="
        text-white font-medium
        px-4
        rounded-md
        transition-all duration-300 ease-in-out
        hover:bg-white
        hover:text-black
        hover:shadow-md
      "
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        {/* Placeholder for right side actions (optional) */}
                        <div className="flex-shrink-0">
                            <button
                                className="
      bg-white text-black
      px-6 py-1
      rounded-md
      border-2 border-[#D98C00]
      shadow-md
      font-bold text-lg tracking-wide
      flex items-center justify-center
      transition-transform transition-shadow duration-300
      hover:scale-105
      hover:shadow-xl
      active:scale-95
    "
                            >
                                My Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="min-h-screen bg-[#f5f7fa] py-10">
                <div className="max-w-7xl mx-auto px-4">

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
                                    className="w-full bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300 flex flex-col group border border-gray-100 will-change-auto"
                                >
                                    {/* Image Section */}
                                    <div className="relative bg-[#D98C00]/15 rounded-t-2xl p-4 pb-2 overflow-hidden">
                                        {/* Book Image */}
                                        <Link to={`/product/${item.id}`}>
                                            <img
                                                src={item?.image_Url?.[0]?.url}
                                                alt={item.name}
                                                className="w-full h-52 object-contain transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                            />
                                        </Link>

                                        {/* Exchangeable Tag */}
                                        {item.exchangeable && (
                                            <span className="absolute bottom-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-full shadow-sm">
                                                Exchangeable
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Icons Strip */}
                                    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
                                        {/* Wishlist */}
                                        <button
                                            className="p-2 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200"
                                            onClick={() => removeFromWishlist(item.id)}
                                            title="Remove from Wishlist"
                                        >
                                            <AiFillHeart size={18} className="text-red-500" />
                                        </button>

                                        {/* Quick View & Cart */}
                                        <div className="flex items-center gap-2">
                                            <Link to={`/product/${item.id}`}>
                                                <button
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                    title="Quick View"
                                                >
                                                    <AiOutlineEye size={18} className="text-gray-400 hover:text-gray-700" />
                                                </button>
                                            </Link>
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                title="Add to cart"
                                            >
                                                <AiOutlineShoppingCart size={18} className="text-gray-400 hover:text-gray-700" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Book Info Section */}
                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Author */}
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                                            {item.author}
                                        </p>

                                        {/* Title */}
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="font-bold text-base text-gray-800 leading-snug hover:text-[#D98C00] transition-colors duration-200 line-clamp-2 mb-2">
                                                {item.name}
                                            </h3>
                                        </Link>

                                        {/* Rating */}
                                        <div className="flex items-center gap-0.5 mb-3">
                                            <AiFillStar className="text-amber-400" size={14} />
                                            <AiFillStar className="text-amber-400" size={14} />
                                            <AiFillStar className="text-amber-400" size={14} />
                                            <AiFillStar className="text-amber-400" size={14} />
                                            <AiFillStar className="text-gray-200" size={14} />
                                        </div>

                                        {/* Spacer */}
                                        <div className="flex-1"></div>

                                        {/* Price & Buy Button Row */}
                                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                                            <p className="text-[#D98C00] font-extrabold text-xl">
                                                Rs. {item.price}
                                            </p>
                                            <Link to={`/product/${item.id}`}>
                                                <button className="px-5 py-2 text-sm font-bold text-white bg-[#D98C00] rounded-md hover:bg-[#A86500] transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                                                    Buy Now
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default WishlistPage;
