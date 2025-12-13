import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Delivery() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("orders/");
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border-purple-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      processing: "📦",
      shipped: "🚚",
      delivered: "✅",
      cancelled: "❌",
    };
    return icons[status] || "📍";
  };

  const getStatusStep = (status) => {
    const steps = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
    };
    return steps[status] || 0;
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-4">🎁</div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">
            🚚 Track Your Delivery
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor your orders in real-time
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[
            { value: "all", label: "All Orders", count: orders.length },
            {
              value: "pending",
              label: "Pending",
              count: orders.filter((o) => o.status === "pending").length,
            },
            {
              value: "processing",
              label: "Processing",
              count: orders.filter((o) => o.status === "processing").length,
            },
            {
              value: "shipped",
              label: "Shipped",
              count: orders.filter((o) => o.status === "shipped").length,
            },
            {
              value: "delivered",
              label: "Delivered",
              count: orders.filter((o) => o.status === "delivered").length,
            },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === btn.value
                  ? "bg-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {btn.label} ({btn.count})
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl text-gray-600">
              {filter === "all"
                ? "No orders yet. Start shopping!"
                : `No ${filter} orders`}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {/* Order Header */}
                <div
                  className={`p-6 border-l-4 ${getStatusColor(order.status)}`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="text-2xl font-bold text-gray-800">
                        #{order.id}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl mb-1">
                        {getStatusIcon(order.status)}
                      </p>
                      <p className="text-lg font-semibold capitalize">
                        {order.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-pink-600">
                        ₹{Number(order.total_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6 border-b">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">📅 Ordered On</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">💳 Payment</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {order.payment_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">📦 Items</p>
                      <p className="font-semibold text-gray-800">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    {[
                      {
                        step: 1,
                        label: "Order Placed",
                        date: new Date(order.created_at),
                      },
                      {
                        step: 2,
                        label: "Processing",
                        date: order.status === "processing" ? new Date() : null,
                      },
                      {
                        step: 3,
                        label: "Shipped",
                        date: order.status === "shipped" ? new Date() : null,
                      },
                      {
                        step: 4,
                        label: "Delivered",
                        date: order.status === "delivered" ? new Date() : null,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              getStatusStep(order.status) >= item.step
                                ? "bg-gradient-to-r from-orange-400 to-pink-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {item.step}
                          </div>
                          {idx < 3 && (
                            <div
                              className={`flex-1 h-1 mx-2 ${
                                getStatusStep(order.status) > item.step
                                  ? "bg-gradient-to-r from-orange-400 to-pink-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          {item.label}
                        </p>
                        {item.date && (
                          <p className="text-xs font-semibold text-gray-800 text-center">
                            {item.date.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-t">
                  <h3 className="font-semibold text-gray-800 mb-4">Items</h3>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt={item.product?.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.product?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          ₹{Number(item.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div className="p-6 bg-blue-50 border-t">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      📍 Delivery Address
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">
                      {order.shipping_address}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-6 border-t bg-gray-50 flex gap-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    View Details
                  </button>
                  {order.status !== "delivered" && (
                    <button className="flex-1 px-4 py-2 bg-white border-2 border-pink-500 text-pink-600 rounded-lg font-medium hover:bg-pink-50 transition">
                      Contact Support
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Order #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize text-pink-600">
                    {selectedOrder.status}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {selectedOrder.payment_method}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-pink-600 text-lg">
                    ₹{Number(selectedOrder.total_amount).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
                  <p className="font-semibold text-gray-800 whitespace-pre-wrap">
                    {selectedOrder.shipping_address}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-3">Items in Order</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between p-2 bg-gray-100 rounded"
                    >
                      <span className="text-gray-800">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{Number(item.price).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}