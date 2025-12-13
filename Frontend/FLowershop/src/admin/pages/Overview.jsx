// function StatCard({ title, value, sub }) {
//     return (
//       <div className="bg-white border border-gray-200 rounded-xl p-4 w-full sm:w-52 shadow-sm">
//         <div className="text-xs text-gray-500">{title}</div>
//         <div className="text-2xl font-bold">{value}</div>
//         {sub && <div className="text-xs text-gray-400">{sub}</div>}
//       </div>
//     );
//   }
  
//   export default function AdminOverview() {
//     return (
//       <div className="flex flex-col gap-6">
//         <h3 className="text-xl font-semibold text-pink-600">Overview</h3>
//         <div className="flex flex-wrap gap-4">
//           <StatCard title="Today's Orders" value="48" sub="+12% vs yesterday" />
//           <StatCard title="Revenue" value="₹ 32,450" sub="+8% vs last week" />
//           <StatCard title="Active Users" value="1,204" sub="Visitors in last 24h" />
//           <StatCard title="Conversion Rate" value="3.6%" sub="+0.3% this week" />
//         </div>
  
//         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//           <h4 className="font-semibold mb-2 text-pink-600">Sales Trend</h4>
//           <div className="h-40 bg-gradient-to-r from-pink-50 to-gray-50 rounded-lg" />
//         </div>
  
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//             <h4 className="font-semibold mb-2 text-pink-600">Top Products</h4>
//             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//               <li>Rose Bouquet Premium</li>
//               <li>Lotus Fresh Petals</li>
//               <li>Chocolate Mala Combo</li>
//             </ul>
//           </div>
//           <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//             <h4 className="font-semibold mb-2 text-pink-600">Recent Orders</h4>
//             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//               <li>#10234 – ₹1,299 – Paid</li>
//               <li>#10233 – ₹799 – Pending</li>
//               <li>#10232 – ₹2,199 – Paid</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

function StatCard({ title, value, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 w-full sm:w-52 shadow-sm">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("dashboard/admin/")
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load dashboard stats"));

    axiosInstance
      .get("orders/")
      .then((res) => setRecentOrders(res.data.slice(0, 5)))
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h3 className="mt-10 text-xl font-semibold text-pink-600">Overview</h3>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <StatCard title="Total Orders" value={stats?.orders ?? 0} />
        <StatCard title="Products" value={stats?.products ?? 0} />
        <StatCard title="Registered Users" value={stats?.users ?? 0} />
        <StatCard
          title="Lifetime Revenue"
          value={`₹${Number(stats?.earnings ?? 0).toLocaleString()}`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold mb-2 text-pink-600">Recent Orders</h4>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none last:pb-0"
                >
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-gray-500">{order.user?.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{Number(order.total ?? order.total_amount ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs capitalize text-gray-500">
                      {order.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold mb-2 text-pink-600">Notes</h4>
          <p className="text-sm text-gray-600">
            Use the navigation on the left to manage products, categories,
            coupons, users, and more. Dashboard cards read live data directly
            from the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
