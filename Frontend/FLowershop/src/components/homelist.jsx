
// import { useCart } from '../Context/CartContext';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import API from '../Api/axiosInstance';

// function Homelist() {
//   const { addToCart } = useCart();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get('products/');
//       setProducts(response.data);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setError('Failed to load products');
//       setLoading(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-pink-50 to-orange-50">
//         <div className="max-w-7xl mx-auto text-center">
//           <p className="text-xl text-gray-600">Loading products...</p>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-pink-50 to-orange-50">
//         <div className="max-w-7xl mx-auto text-center">
//           <p className="text-xl text-red-600">{error}</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-pink-50 to-orange-50">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="heading1 text-4xl text-center text-pink-700 mb-14 drop-shadow-sm">
//           🌸 Popular Flower Garlands & Decorations
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
//             >
              
//               <div className="relative">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="h-48 w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
//                 />
//                 <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
//                   ₹{product.price?.toLocaleString() || '0'}
//                 </span>
//               </div>

//               <div className="mt-4 text-center">
//                 <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition">
//                   {product.name}
//                 </h3>

//                 <button
//                   onClick={() => {
//                     addToCart(product);
//                     navigate('/cart');
//                   }}
//                   className="mt-4 w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:scale-105 hover:shadow-md transition"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Homelist;



import { useCart } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../Api/axiosInstance';
import ProductCard from "../components/ProductCard"; // ✅ Added

function Homelist() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('products/');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl text-gray-600">Loading products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading1 text-4xl text-center text-pink-700 mb-14 drop-shadow-sm">
          🌸 Popular Flower Garlands & Decorations
        </h2>

        {/* ❗ Replaced old card UI with ProductCard Component */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Homelist;
