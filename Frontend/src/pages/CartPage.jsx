import { useMemo } from "react";
import { useCart } from "../context/CartContext";
import { AiOutlineDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + (Number(item.price) || 0);
    }, 0);
    const delivery = subtotal > 0 ? 150 : 0;
    return { subtotal, delivery, total: subtotal + delivery };
  }, [cart]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">Home / Cart</p>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-lg text-gray-700 font-medium mb-2">
              Your cart is empty
            </p>
            <p className="text-gray-400 mb-6">Add some books to get started</p>
            <Link
              to="/browse"
              className="inline-block px-6 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const statusColors = {
                  Available:    "bg-green-100 text-green-700 border-green-300",
                  Sold:         "bg-blue-100 text-blue-700 border-blue-300",
                  Reserved:     "bg-purple-100 text-purple-700 border-purple-300",
                  Exchanged:    "bg-indigo-100 text-indigo-700 border-indigo-300",
                  Under_Review: "bg-yellow-100 text-yellow-700 border-yellow-300",
                };

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4"
                  >
                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={
                          item?.image_Url?.[0]?.url ||
                          item?.image ||
                          "https://via.placeholder.com/100x130?text=Book"
                        }
                        alt={item.name || item.title}
                        className="w-24 h-32 object-contain bg-gray-50 rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Author */}
                        {item.author && (
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                            {item.author}
                          </p>
                        )}

                        {/* Title */}
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-bold text-gray-800 hover:text-[#D98C00] transition line-clamp-2 mb-2">
                            {item.title || item.name}
                          </h3>
                        </Link>

                        {/* Badges Row: Status + Exchangeable */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.status && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusColors[item.status] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
                              {item.status.replace("_", " ")}
                            </span>
                          )}
                          {item.exchangeable && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider bg-green-50 text-green-700 border-green-300">
                              Exchangeable
                            </span>
                          )}
                        </div>

                        {/* Extra Info Row: Condition + Category + Edition */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          {item.condition && (
                            <span>
                              <span className="font-semibold text-gray-600">Condition:</span> {item.condition}
                            </span>
                          )}
                          {item.category && (
                            <span>
                              <span className="font-semibold text-gray-600">Category:</span> {item.category}
                            </span>
                          )}
                          {item.edition && (
                            <span>
                              <span className="font-semibold text-gray-600">Edition:</span> {item.edition}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-end mt-3">
                        <p className="text-lg font-bold text-[#D98C00]">
                          Rs. {Number(item.price) || 0}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                      title="Remove from cart"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">Rs. {totals.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">Rs. {totals.delivery}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>Rs. {totals.total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 px-6 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition shadow-sm"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/browse"
                className="block text-center mt-3 text-sm text-[#D98C00] hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
