import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

import ProductCard from "../../components/ProductCard";

export default function Garlands() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get("/products/")
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.category?.name === "Garlands"
        );
        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching Garlands:", err));
  }, []);

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 text-center mb-6">
        Garland Designs 🌼
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
