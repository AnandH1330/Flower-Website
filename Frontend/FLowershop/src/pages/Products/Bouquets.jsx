// import { useEffect, useState } from "react";
// import axiosInstance from "../../Api/axiosInstance";

// import ProductCard from "../../components/ProductCard";

// export default function Bouquets() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axiosInstance.get("/products/")
//       .then((res) => {
//         // Filter only bouquets
//         const filtered = res.data.filter(
//           (item) => item.category?.name === "Bouquets"
//         );
//         setProducts(filtered);
//       })
//       .catch((err) => console.error("Error fetching bouquets:", err));
//   }, []);

//   return (
//     <div className="p-6 bg-pink-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-pink-700 text-center mb-6">
//         Beautiful Bouquets 💐
//       </h1>

//       <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// }











import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";

import ProductCard from "../../components/ProductCard";

export default function Bouquets() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get("/products/")
      .then((res) => {
        // Match using slug (BEST)
        const filtered = res.data.filter(
          (item) =>
            item.category?.slug?.toLowerCase() === "bouquets"
        );

        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching bouquets:", err));
  }, []);

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 text-center mb-6">
        Beautiful Bouquets 💐
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No bouquets found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
