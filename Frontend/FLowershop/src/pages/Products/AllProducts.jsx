// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../Api/axiosInstance";
// import ProductCard from "../../components/ProductCard";

// const AllProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axiosInstance.get("products/");
//         const data = response.data; 
//         setProducts(data);
//         setFiltered(data);

//         // Extract unique category objects from products
//         const uniqueCategories = [
//           { id: 0, name: "All" },
//           ...data
//             .map((p) => p.category) // category is object
//             .filter(
//               (v, i, a) => a.findIndex((c) => c.id === v.id) === i // unique by id
//             ),
//         ];

//         setCategories(uniqueCategories);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load products.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Filter products by category name
//   const handleCategoryChange = (categoryName) => {
//     setActiveCategory(categoryName);

//     if (categoryName === "All") {
//       setFiltered(products);
//     } else {
//       setFiltered(
//         products.filter((product) => product.category.name === categoryName)
//       );
//     }
//   };

//   if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
//   if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

//   return (
//     <div className="container mx-auto px-4 py-10">
//       <h1 className="heading1 text-4xl text-center text-pink-600 mb-10">
//         All Products
//       </h1>

//       {/* CATEGORY FILTER BUTTONS */}
//       <div className="flex flex-wrap justify-center gap-3 mb-10">
//         {categories.map((cat) => (
//           <button
//             key={cat.id} // unique key
//             onClick={() => handleCategoryChange(cat.name)}
//             className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md
//               ${
//                 activeCategory === cat.name
//                   ? "bg-pink-600 text-white"
//                   : "bg-white text-gray-700 border border-pink-300"
//               }`}
//           >
//             {cat.name} {/* render the string name */}
//           </button>
//         ))}
//       </div>

//       {/* PRODUCT GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {filtered.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllProducts;





import React, { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import ProductCard from "../../components/ProductCard";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("products/");
        const data = response.data;

        setProducts(data);
        setFiltered(data);

        // SAFE CATEGORY EXTRACTION
        const uniqueCategories = [
          { id: 0, name: "All" },
          ...data
            .filter((p) => p.category !== null) // skip null categories
            .map((p) => p.category)
            .filter(
              (v, i, a) =>
                v && a.findIndex((c) => c && c.id === v.id) === i
            ),
        ];

        setCategories(uniqueCategories);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // CATEGORY FILTER
  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);

    if (categoryName === "All") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter(
          (product) =>
            product.category &&
            product.category.name === categoryName
        )
      );
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="heading1 text-4xl text-center text-pink-600 mb-10">
        All Products
      </h1>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md
              ${
                activeCategory === cat.name
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 border border-pink-300"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filtered.map((product) =>
          product ? (
            <ProductCard key={product.id} product={product} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default AllProducts;
