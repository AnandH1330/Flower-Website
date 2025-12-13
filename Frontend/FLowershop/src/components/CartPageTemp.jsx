import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../Api/axiosInstance";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity);
    return sum + price * qty;
  }, 0);

  const total = subtotal - discount;
  const rewardThreshold = 1000;
  const progress = Math.min((subtotal / rewardThreshold) * 100, 100);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (appliedCoupon) {
      setCouponError("A coupon is already applied");
      return;
    }

    setLoading(true);
    setCouponError("");

    try {
      const response = await API.post("validate-coupon/", {
        code: couponCode.trim().toUpperCase(),
        subtotal: subtotal,
      });

      if (response.data.success) {
        setAppliedCoupon({
          code: response.data.code,
          description: response.data.description,
          discount_type: response.data.discount_type,
          discount_value: response.data.discount_value,
        });
        setDiscount(response.data.discount_amount);
        setCouponCode("");
        toast.success(response.data.message);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to apply coupon";
      setCouponError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleApplyCoupon();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Your Shopping Cart
          </h2>

          {/* Reward progress bar */}
          <div className="mb-6">
            <div className="text-sm text-center text-green-600 font-medium mb-2">
              {progress >= 100
                ? "🎉 Congrats! You unlocked all rewards."
                : `Spend ₹${Math.ceil(
                    rewardThreshold - subtotal
                  )} more to unlock rewards!`}
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemPrice = Number(item.product?.price) || 0;
                  const itemTotal = itemPrice * Number(item.quantity);

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.product?.image ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.product?.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {item.product?.name}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            ₹{item.product?.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => decreaseQty(item.id)}
                          className="px-3 py-1 text-lg bg-gray-100 rounded hover:bg-gray-200"
                        >
                          −
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => increaseQty(item.id)}
                          className="px-3 py-1 text-lg bg-gray-100 rounded hover:bg-gray-200"
                        >
                          +
                        </button>

                        <p className="font-semibold text-gray-700 ml-4">
                          ₹{itemTotal.toLocaleString()}
                        </p>

                        <button
                          aria-label="Remove item"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-3 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Summary Panel */}
        <div className="w-full md:w-96 bg-white rounded-xl shadow p-6 flex flex-col gap-4 h-fit sticky top-20">
          {/* Applied Coupon Info */}
          {appliedCoupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-green-800">
                    ✓ {appliedCoupon.code}
                  </p>
                  <p className="text-sm text-green-700">
                    {appliedCoupon.description}
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Coupon Input */}
          <div>
            <label
              htmlFor="coupon"
              className="block text-gray-700 font-medium mb-2"
            >
              Have a discount code?
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                type="text"
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={!!appliedCoupon || loading}
                className={`flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!!appliedCoupon || loading}
                className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 mt-2 text-sm font-medium"
              >
                ❌ {couponError}
              </motion.p>
            )}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 flex flex-col gap-2">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            {discount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between text-green-600 font-medium"
              >
                <span>Discount ({appliedCoupon?.code})</span>
                <span>− ₹{discount.toLocaleString()}</span>
              </motion.div>
            )}

            <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
              <span>Total</span>
              <span className="text-pink-600">
                ₹{total.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Shipping will be calculated at checkout.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/payment")}
              disabled={cartItems.length === 0}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout (₹{total.toLocaleString()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;