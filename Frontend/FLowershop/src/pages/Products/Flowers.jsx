import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";



export default function Flowers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get("products/")
      .then((res) => {
        const filtered = res.data.filter((item) => item.category === "Flowers");
        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="px-6 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Flowers
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            {/* Image Container */}
            <div className="w-full h-56 bg-white flex items-center justify-center border-b border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg text-gray-800 truncate">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{product.category}</p>
              <p className="text-green-600 font-bold mt-3 text-lg">
                ₹{product.price}
              </p>
              <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg font-medium hover:bg-pink-600 transition">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
