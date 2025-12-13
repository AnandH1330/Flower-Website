import { useEffect, useState } from "react";
import axiosInstance from "../Api/axiosInstance";


export default function Notifications() {
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("notifications/")
      .then((res) => setNotify(res.data))
      .catch(() => console.log("Notification fetch failed"));
  }, []);

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      {notify.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="space-y-3">
          {notify.map((n) => (
            <li key={n.id} className="border p-3 rounded bg-pink-50">
              <p>{n.message}</p>
              <small className="text-gray-500">{n.created_at}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
