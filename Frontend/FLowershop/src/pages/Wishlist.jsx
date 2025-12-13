// import React from "react";
// import { useWishlist } from "../Context/WishlistContext";
// import { useCart } from "../Context/CartContext";
// import { FaTrash, FaShoppingCart } from "react-icons/fa";

// export default function Wishlist() {
//   const { wishlist, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();
//   const handleAddToCart = () => {
//     addToCart(product);
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-pink-600 mb-6">
//         ❤️ My Wishlist
//       </h2>

//       {wishlist.length === 0 ? (
//         <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {wishlist.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition"
//             >
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-full h-48 object-contain p-4 bg-white"
//               />

//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {item.name}
//                 </h3>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {item.category?.name}
//                 </p>

//                 <p className="text-pink-700 font-bold mt-2">₹{item.price}</p>

//                 <div className="flex items-center justify-between mt-4">
//                   {/* <button
//                       className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
//                       onClick={handleAddToCart}
//                     >
//                       <FaShoppingCart /> Add to Cart
//                     </button> */}
//                   <button
//                     onClick={handleAddToCart}
//                     className="mt-4 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
//                   >
//                     Add to Cart
//                   </button>

//                   <button
//                     className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
//                     onClick={() => removeFromWishlist(item.id)}
//                   >
//                     <FaTrash /> Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import React from "react";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart(item);
    navigate("/cart"); // ✅ Redirect to cart page
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-pink-600 mb-6">
        ❤️ My Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-xl overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain p-4 bg-white"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {item.category?.name}
                </p>

                <p className="text-pink-700 font-bold mt-2">₹{item.price}</p>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>

                  <button
                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
