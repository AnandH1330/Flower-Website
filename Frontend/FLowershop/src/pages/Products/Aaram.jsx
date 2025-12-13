
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
//           (item) => item.category?.name === "Aaram"
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
// import Woman from "../../assets/Banner/woman1.jpeg";
export default function Aaram() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/products/")
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.category?.name === "Aaram"
        );
        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching Aaram products:", err));
  }, []);

  return (
    <div className="bg-pink-50 min-h-screen">

      {/* ---------------- TOP BANNER SECTION ---------------- */}
      <div className="w-full p-10 md:p-16 bg-white shadow-sm border-b border-pink-100">
        <div className="grid md:grid-cols-2 items-center gap-10">

          {/* IMAGE LEFT */}
          <div className="flex justify-center">
            <img
              src="/Banner/woman1.jpeg"
              alt="Aaram Flower Collection"
              className="rounded-2xl shadow-xl w-full max-w-xl"
            />
          </div>

          {/* TEXT RIGHT */}
          <div>
            <h1 className="text-5xl font-extrabold text-pink-700 mb-5">
              Aaram Collection
            </h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Aaram flowers symbolize purity, peace, and devotion — a perfect
              choice for pooja, celebrations, and spiritual moments.
            </p>

            <p className="text-gray-600 text-base">
              Discover our handcrafted Aaram arrangements created with fresh,
              natural flowers to bring divine beauty into your home.
            </p>
          </div>

        </div>
      </div>

      {/* ---------------- PRODUCTS SECTION ---------------- */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
          Aaram Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No Aaram products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
