// import { useEffect, useState } from "react";
// import axiosInstance from "../../Api/axiosInstance";

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadOrders = () => {
//     setLoading(true);
//     axiosInstance
//       .get("orders/")
//       .then((res) => setOrders(res.data))
//       .catch(() => setError("Failed to load orders"))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-pink-600">Orders</h2>
//         <button
//           onClick={loadOrders}
//           className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
//         >
//           Refresh
//         </button>
//       </div>

//       {error && <p className="text-red-500">{error}</p>}

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         {loading ? (
//           <p className="p-4">Loading orders...</p>
//         ) : orders.length === 0 ? (
//           <p className="p-4 text-gray-500">No orders available.</p>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="bg-gray-100 text-gray-600">
//               <tr>
//                 <th className="p-3">Order #</th>
//                 <th className="p-3">Customer</th>
//                 <th className="p-3">Total</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Payment</th>
//                 <th className="p-3">Placed On</th>
//                 <th className="p-3">Items</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id} className="border-t">
//                   <td className="p-3 font-medium">#{order.id}</td>
//                   <td className="p-3">{order.user?.username}</td>
//                   <td className="p-3">
//                     ₹{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
//                   </td>
//                   <td className="p-3 capitalize">{order.status}</td>
//                   <td className="p-3 uppercase">{order.payment_method}</td>
//                   <td className="p-3">
//                     {new Date(order.created_at).toLocaleString()}
//                   </td>
//                   <td className="p-3">
//                     <ul className="list-disc list-inside text-gray-600">
//                       {order.items?.map((item) => (
//                         <li key={item.id}>
//                           {item.product?.name} × {item.quantity}
//                         </li>
//                       ))}
//                     </ul>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-pink-600">Orders</h2>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="p-4 text-gray-500">No orders available.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Placed On</th>
                <th className="p-3">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">#{order.id}</td>
                  <td className="p-3">{order.user?.username}</td>
                  <td className="p-3 font-semibold">
                    ₹{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 capitalize">
                    <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                      order.status === "completed" ? "bg-green-500" :
                      order.status === "pending" ? "bg-yellow-500" :
                      order.status === "cancelled" ? "bg-red-500" :
                      "bg-gray-500"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 uppercase text-xs font-medium">{order.payment_method}</td>
                  <td className="p-3 text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          {/* PRODUCT IMAGE */}
                          <img
                            src={item.product?.image || item.product?.image_url || "/placeholder.png"}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />

                          {/* PRODUCT NAME & QUANTITY */}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 line-clamp-1">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × ₹{Number(item.price || 0).toFixed(2)}
                            </p>
                          </div>

                          {/* ITEM TOTAL */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹{(Number(item.quantity) * Number(item.price || 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
