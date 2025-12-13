import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axiosInstance.get("notifications/")
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  // Count by type
  const userCount = notifications.filter(n => n.type === "User").length;
  const msgCount = notifications.filter(n => n.type === "Message").length;
  const stockCount = notifications.filter(n => n.type === "Stock").length;
  const systemCount = notifications.filter(n => n.type === "System").length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
        🔔 Admin Notifications
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 text-center rounded-xl">
          <h2 className="text-3xl font-bold text-blue-600">{userCount}</h2>
          <p>New Users</p>
        </div>
        <div className="bg-green-100 p-4 text-center rounded-xl">
          <h2 className="text-3xl font-bold text-green-600">{msgCount}</h2>
          <p>Messages</p>
        </div>
        <div className="bg-red-100 p-4 text-center rounded-xl">
          <h2 className="text-3xl font-bold text-red-600">{stockCount}</h2>
          <p>Low Stock</p>
        </div>
        <div className="bg-gray-100 p-4 text-center rounded-xl">
          <h2 className="text-3xl font-bold text-gray-600">{systemCount}</h2>
          <p>System</p>
        </div>
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No new notifications.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              <div className="flex justify-between">
                <p className="font-semibold">
                  {note.type} — {note.message}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(note.time).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
