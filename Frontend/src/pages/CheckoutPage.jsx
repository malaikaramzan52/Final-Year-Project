import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });

  const totals = useMemo(() => {
    const items = cart || [];
    const subtotal = items.reduce((sum, item) => {
      const qty = item.quantity || 1;
      const price = Number(item.price) || 0;
      return sum + qty * price;
    }, 0);
    const delivery = subtotal > 0 ? 150 : 0;
    return { subtotal, delivery, total: subtotal + delivery };
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Placeholder: later hook to backend order API
    navigate("/cart", { replace: true });
  };

  const isCartEmpty = !cart || cart.length === 0;

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">Home / Cart / Checkout</p>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
          <Link
            to="/cart"
            className="text-sm font-semibold text-[#D98C00] hover:underline"
          >
            Back to Cart
          </Link>
        </div>

        {isCartEmpty ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
            <p className="text-lg text-gray-700 mb-3">Your cart is empty.</p>
            <Link
              to="/browse"
              className="inline-block px-5 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shipping Form */}
            <form
              onSubmit={handlePlaceOrder}
              className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={shipping.email}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Phone"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="City"
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
                  label="Address"
                  name="address"
                  value={shipping.address}
                  onChange={handleChange}
                  required
                  className="md:col-span-2"
                />
                <TextArea
                  label="Order Notes (optional)"
                  name="notes"
                  value={shipping.notes}
                  onChange={handleChange}
                  className="md:col-span-2"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-[#D98C00] text-white font-semibold rounded-lg hover:bg-[#A86500] transition shadow-sm"
              >
                Place Order (COD)
              </button>
            </form>

            {/* Order Summary */}
            <aside className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const qty = item.quantity || 1;
                  const price = Number(item.price) || 0;
                  const line = qty * price;
                  return (
                    <div
                      key={item.id || item._id}
                      className="flex items-center gap-3 border-b border-gray-100 pb-3"
                    >
                      <img
                        src={item?.image_Url?.[0]?.url || item?.image || "https://via.placeholder.com/80x100?text=Book"}
                        alt={item.name}
                        className="w-16 h-20 object-contain bg-gray-50 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.title || item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {qty}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Rs. {line}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <SummaryRow label="Subtotal" value={totals.subtotal} />
                <SummaryRow label="Delivery" value={totals.delivery} />
                <div className="flex items-center justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>Rs. {totals.total}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Cash on delivery only for now. You can review items on the next step.
              </div>
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

const TextArea = ({ label, className = "", ...rest }) => (
  <label className={`flex flex-col gap-1 text-sm text-gray-700 ${className}`}>
    <span className="font-semibold">{label}</span>
    <textarea
      rows="3"
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#D98C00] focus:border-[#D98C00] outline-none"
      {...rest}
    />
  </label>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span>{label}</span>
    <span className="font-semibold">Rs. {value}</span>
  </div>
);

export default CheckoutPage;
