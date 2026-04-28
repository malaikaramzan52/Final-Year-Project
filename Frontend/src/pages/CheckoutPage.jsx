import React, { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { user } = useSelector((state) => state.user);

  // Buy Now flow passes a single item via location state
  const buyNowItem = location.state?.buyNowItem || null;
  const items = buyNowItem ? [buyNowItem] : cart;

  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
    city: "",
    zip: "",
  });

  const [placing, setPlacing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placedOrders, setPlacedOrders] = useState([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (Number(item.price) || 0) * (item.quantity || 1);
    }, 0);
    const delivery = 0; // Removed delivery charges
    return { subtotal, delivery, total: subtotal };
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city) {
      toast.error("Please fill all required shipping fields");
      return;
    }

    if (items.length === 0) {
      toast.error("No items to checkout");
      return;
    }

    setPlacing(true);

    try {
      const orderPromises = items.map((item) =>
        api.post("/v2/order/create", {
          bookId: item.id || item._id,
          shippingAddress: {
            fullName: shipping.fullName,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            zip: shipping.zip,
          },
        })
      );

      const results = await Promise.allSettled(orderPromises);

      const successOrders = [];
      const failedItems = [];

      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          successOrders.push(result.value.data.order);
        } else {
          const msg =
            result.reason?.response?.data?.message || "Failed to place order";
          failedItems.push({ item: items[idx], error: msg });
        }
      });

      if (successOrders.length > 0) {
        setPlacedOrders(successOrders);
        setShowConfirmation(true);

        // Clear cart items that were successfully ordered (only for cart flow)
        if (!buyNowItem) {
          clearCart();
        }
      }

      if (failedItems.length > 0) {
        failedItems.forEach(({ item, error }) => {
          toast.error(`${item.name || item.title}: ${error}`);
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const isCartEmpty = items.length === 0;

  // Confirmation Modal
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 mb-6">
              {placedOrders.length === 1
                ? "Your order has been placed. The seller will be notified."
                : `${placedOrders.length} orders have been placed. Sellers will be notified.`}
            </p>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
              {placedOrders.map((order) => (
                <div key={order._id} className="flex items-center gap-3">
                  <img
                    src={order.book?.image || "https://via.placeholder.com/60x80?text=Book"}
                    alt={order.book?.title}
                    className="w-12 h-16 object-contain bg-white rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {order.book?.title}
                    </p>
                    <p className="text-xs text-gray-500">by {order.book?.author}</p>
                  </div>
                  <p className="text-sm font-bold text-[#D98C00]">
                    Rs. {order.price}
                  </p>
                </div>
              ))}

              <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-semibold text-gray-700">
                <span>Payment Method</span>
                <span>Cash on Delivery</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>
                  Rs.{" "}
                  {placedOrders.reduce((sum, o) => sum + o.price, 0)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/profile", { state: { activeTab: 3.1 } })}
                className="flex-1 px-4 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate("/browse")}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">
              Home / {buyNowItem ? "Buy Now" : "Cart"} / Checkout
            </p>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          {!buyNowItem && (
            <Link
              to="/cart"
              className="text-sm font-semibold text-[#D98C00] hover:underline"
            >
              Back to Cart
            </Link>
          )}
        </div>

        {isCartEmpty ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
            <p className="text-lg text-gray-700 mb-3">No items to checkout.</p>
            <Link
              to="/browse"
              className="inline-block px-5 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items + Shipping */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Items ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => {
                    const qty = item.quantity || 1;
                    const price = Number(item.price) || 0;
                    return (
                      <div
                        key={item.id || item._id}
                        className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >
                        <img
                          src={
                            item?.image_Url?.[0]?.url ||
                            item?.image ||
                            "https://via.placeholder.com/80x100?text=Book"
                          }
                          alt={item.name || item.title}
                          className="w-20 h-24 object-contain bg-gray-50 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 line-clamp-2">
                            {item.title || item.name}
                          </p>
                          {item.author && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              by {item.author}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">Qty: {qty}</p>
                        </div>
                        <p className="text-lg font-bold text-[#D98C00]">
                          Rs. {qty * price}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Form */}
              <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name *"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Phone *"
                    name="phone"
                    type="tel"
                    value={shipping.phone}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="City *"
                    name="city"
                    value={shipping.city}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="ZIP / Postal Code"
                    name="zip"
                    value={shipping.zip}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Full Address *"
                    name="address"
                    value={shipping.address}
                    onChange={handleChange}
                    required
                    className="md:col-span-2"
                  />
                </div>
              </form>
            </div>

            {/* Right Column: Summary */}
            <aside className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">Rs. {totals.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>Rs. {totals.total}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-800">
                  Payment: Cash on Delivery
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Pay when your order arrives at your doorstep.
                </p>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={placing}
                className="w-full mt-5 px-6 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const InputField = ({ label, className = "", ...rest }) => (
  <label className={`flex flex-col gap-1 text-sm text-gray-700 ${className}`}>
    <span className="font-semibold">{label}</span>
    <input
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
      {...rest}
    />
  </label>
);

export default CheckoutPage;
