
// import { useState, useEffect } from "react";
// import axiosInstance from "../Api/axiosInstance";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axiosInstance
//       .get("orders/")
//       .then((res) => setOrders(res.data))
//       .catch(() => setError("Unable to load orders"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return <p className="mt-10">Loading orders...</p>;
//   }

//   return (
//     <div className="mt-10 bg-white p-6 rounded-xl shadow">
//       <h2 className="text-xl font-semibold mb-4">My Orders</h2>

//       {error && <p className="text-red-500 mb-3">{error}</p>}

//       {orders.length === 0 ? (
//         <p>No orders yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {orders.map((order) => (
//             <li key={order.id} className="border p-4 rounded">
//               <p>
//                 <strong>Order ID:</strong> {order.id}
//               </p>
//               <p>
//                 <strong>Status:</strong> {order.status}
//               </p>
//               <p>
//                 <strong>Total:</strong> ₹
//                 {Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(order.created_at).toLocaleString()}
//               </p>
//               {order.items?.length > 0 && (
//                 <div className="mt-3">
//                   <strong>Items:</strong>
//                   <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
//                     {order.items.map((item) => (
//                       <li key={item.id}>
//                         {item.product?.name} × {item.quantity} — ₹
//                         {item.price}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }







import { useEffect, useState } from "react";
import axiosInstance from "../Api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadOrders = () => {
    setLoading(true);
    axiosInstance
      .get("orders/")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">No orders yet.</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                {/* ORDER HEADER */}
                <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm opacity-80">Order ID</p>
                      <p className="font-semibold text-lg">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-80">Total Amount</p>
                      <p className="font-semibold text-lg">₹{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-80">Status</p>
                      <p className="font-semibold capitalize text-lg">{order.status || "pending"}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm opacity-80">Payment</p>
                      <p className="font-semibold uppercase text-lg">{order.payment_method}</p>
                    </div>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {/* PRODUCT IMAGE */}
                        <img
                          src={item.product?.image || item.product?.image_url || "/placeholder.png"}
                          alt={item.product?.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-300 flex-shrink-0"
                        />

                        {/* PRODUCT DETAILS */}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 line-clamp-2">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: <span className="font-medium">₹{Number(item.price || 0).toFixed(2)}</span>
                          </p>
                        </div>

                        {/* ITEM TOTAL */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Item Total</p>
                          <p className="text-xl font-bold text-pink-600">
                            ₹{(Number(item.quantity) * Number(item.price || 0)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ORDER FOOTER */}
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Ordered on: <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/track/${order.tracking_id || order.id}`)}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}