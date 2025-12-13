import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import ProductCard from "../../components/ProductCard";

export default function Decor() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("products/")
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.category?.slug === "rosepetal"
        );
        setProducts(filtered);
      })
      .catch((err) =>
        console.error("Error fetching rosepetal-garland:", err)
      );
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-20 text-lg">
        Loading Rosepetals products...
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-20 text-lg">
        No Rosepetals products found.
      </p>
    );
  }

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 text-center mb-6">
        Rose Petals
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
