import { useEffect, useState } from "react";
import API from "../Api/axiosInstance";

export default function Notifications() {
  const [list, setList] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await API.get("notifications/");
      setList(res.data);
    } catch (err) {
      console.log("Notification fetch failed");
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`notifications/${id}/read/`, { is_read: true });
      loadNotifications();
    } catch (err) {
      console.log("Failed to mark as read");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4 font-bold">Notifications</h1>

      {list.length === 0 && <p>No notifications available.</p>}

      {list.map((n) => (
        <div
          key={n.id}
          className={`p-4 mb-3 rounded border ${
            n.is_read ? "bg-gray-100" : "bg-blue-100"
          }`}
        >
          <h2 className="font-semibold">{n.title}</h2>
          <p>{n.message}</p>
          <small className="text-gray-600">{new Date(n.created_at).toLocaleString()}</small>

          {!n.is_read && (
            <button
              className="ml-4 text-sm text-blue-600 underline"
              onClick={() => markAsRead(n.id)}
            >
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
