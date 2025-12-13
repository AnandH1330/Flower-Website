import { useState, useEffect } from "react";
import axiosInstance from "../Api/axiosInstance";


export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("wishlist/")
      .then((res) => setItems(res.data))
      .catch(() => console.log("Wishlist fetch failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Wishlist</h2>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : items.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              <img
                src={item.product?.image}
                alt={item.product?.name}
                className="h-32 object-contain mb-3"
              />
              <h3 className="font-semibold">{item.product?.name}</h3>
              <p>₹{item.product?.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
